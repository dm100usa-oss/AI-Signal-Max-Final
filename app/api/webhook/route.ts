import Stripe from "stripe";
import { getData } from "@/lib/storage";

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

      console.log("=== Stripe SESSION DEBUG ===");
      console.log("customer_email:", session.customer_email);
      console.log("metadata:", session.metadata);
      console.log("customer_details:", session.customer_details);
      console.log("============================");

      return new Response("debug ok", { status: 200 });
    }

    return new Response("ok", { status: 200 });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(error?.message || "Webhook failed", { status: 500 });
  }
}
