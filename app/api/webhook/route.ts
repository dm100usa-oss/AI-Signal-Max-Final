// app/api/webhook/route.ts
export const runtime = "nodejs";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { generatePDF } from "@/lib/generatePDF";
import { sendReportEmail } from "@/lib/email";
import { getCache } from "@/lib/cache";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_email || session.metadata?.email || "";
    const mode = (session.metadata?.mode as "quick" | "pro") || "quick";
    const url = session.metadata?.url || "";
    const sessionId = session.metadata?.sessionId || "";

    const cached =
      getCache(`session:${sessionId}`, mode) || getCache(url, mode);

    if (!cached) {
      console.error("No cached analysis found for session:", sessionId);
      return new NextResponse("No cached data found", { status: 200 });
    }

    const { score, results } = cached;

    try {
      const pdfOwner = await generatePDF({
        website: url,
        score,
        results,
        mode,
      });

      const pdfDeveloper = await generatePDF({
        website: url,
        score,
        results,
        mode,
      });

      await sendReportEmail({
        to: email,
        website: url,
        score,
        attachments: [
          { filename: "AI-Signal-Owner-Report.pdf", content: pdfOwner },
          { filename: "AI-Signal-Developer-Checklist.pdf", content: pdfDeveloper },
        ],
      });

      console.log("PDF reports successfully sent to:", email);
    } catch (err) {
      console.error("Error generating or sending PDF:", err);
    }
  }

  return new NextResponse("Success", { status: 200 });
}
