// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { generatePDF } from "@/lib/generatePDF";
import { sendReportEmail } from "@/lib/email";
import { getData } from "@/lib/store";
import { analyze } from "@/lib/analyze";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const url = session.metadata?.url || "";
      const mode = (session.metadata?.mode as "quick" | "pro") || "quick";
      const email = session.metadata?.email || session.customer_email || "";

      let data = await getData(`session:${session.id}`);
      if (!data) data = await getData(url);
      if (!data) data = await analyze(url, mode);

      const { score, results } = data;

      const ownerBuffer = await generatePDF({
        type: "owner",
        data: { website: url, date: new Date().toLocaleDateString("en-US"), score: String(score) },
      });

      const developerBuffer = await generatePDF({
        type: "developer",
        data: { website: url, date: new Date().toLocaleDateString("en-US"), score: String(score) },
      });

      if (email) {
        await sendReportEmail({
          to: email,
          url,
          mode,
          ownerBuffer,
          developerBuffer,
          score,
          results,
        });
      }

      console.log(`Reports sent for ${url}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
