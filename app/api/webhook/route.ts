// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import { getData } from "@/lib/storage";
import { generatePDF } from "@/lib/generatePDF";
import { sendReportEmail } from "@/lib/email";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // Only handle completed sessions
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const url = session.metadata?.url;
      const mode = session.metadata?.mode || "pro";
      const email = session.metadata?.email || session.customer_email;

      if (!url) {
        console.error("Webhook: Missing URL in metadata");
        return NextResponse.json({ error: "Missing URL in metadata" }, { status: 400 });
      }

      // Retrieve analysis results from Redis (Upstash)
      const data = await getData(url);
      if (!data || !data.score || !data.results) {
        console.error("Webhook: No cached analysis found for:", url);
        return NextResponse.json(
          { error: "No cached analysis found", url },
          { status: 404 }
        );
      }

      const { score, results } = data;

      // Generate both PDF reports
      const ownerBuffer = await generatePDF({
        type: "owner",
        data: {
          website: url,
          score: `${score}%`,
          date: new Date().toLocaleDateString("en-US"),
          ...results,
        },
      });

      const developerBuffer = await generatePDF({
        type: "developer",
        data: {
          website: url,
          score: `${score}%`,
          date: new Date().toLocaleDateString("en-US"),
          ...results,
        },
      });

      // Send email with both reports attached
      await sendReportEmail({
        to: email || "reports@aivcheck.com",
        url,
        mode,
        ownerBuffer,
        developerBuffer,
        score,
        results,
      });

      console.log(`✅ Webhook processed successfully for ${url}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
