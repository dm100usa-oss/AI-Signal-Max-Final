import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getData } from "@/lib/storage";
import { generatePDF } from "@/lib/generatePDF";
import { sendReportEmail } from "@/lib/email";
import { createReviewToken } from "@/lib/reviews"; // 🔹 добавлено

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      console.error("Missing Stripe signature");
      return new Response("Missing signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const url = session.metadata?.url;
      const mode = session.metadata?.mode || "pro";

      const email =
        session.metadata?.email ||
        session.customer_email ||
        session.customer_details?.email ||
        null;

      console.log("=== Stripe SESSION DEBUG ===");
      console.log("customer_email:", session.customer_email);
      console.log("metadata:", session.metadata);
      console.log("customer_details:", session.customer_details);
      console.log("============================");

      if (!url) {
        console.error("Missing URL in metadata");
        return new Response("Missing URL", { status: 400 });
      }

      let data = await getData(`session:${session.id}`);
      if (!data) data = await getData(`${mode}:${url}`);
      if (!data) data = await getData(url);

      if (!data) {
        console.error("No analysis data found for:", url);
        return new Response("No data found", { status: 404 });
      }

      const { score, results } = data;
      console.log(`Webhook started for ${url} | Score: ${score}`);

      const baseData = {
        website: url,
        score: String(score),
        date: new Date().toLocaleDateString("en-US"),
        results,
      };

      const ownerBuffer = await generatePDF({
        type: "owner",
        data: baseData,
      });

      const developerBuffer = await generatePDF({
        type: "developer",
        data: baseData,
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
        console.log(`Email sent to ${email}`);
      } else {
        console.warn(`No email found for ${url}`);
      }

      // 🔹 создаём токен для раздела отзывов
      const tokenKey = await createReviewToken(session.id);
      console.log("Review token created:", tokenKey);

      console.log(`Webhook processed successfully for ${url}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(error?.message || "Webhook failed", { status: 500 });
  }
}
