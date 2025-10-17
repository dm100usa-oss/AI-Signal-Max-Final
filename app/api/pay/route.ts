// app/api/pay/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { analyze } from "../../../lib/analyze";
import { saveData } from "../../../lib/storage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

function getBaseUrl(req: NextRequest) {
  const host =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  try {
    const { mode, url } = await req.json();

    if (mode !== "quick" && mode !== "pro") {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid URL" }, { status: 400 });
    }

    const priceId =
      mode === "quick"
        ? process.env.STRIPE_PRICE_QUICK
        : process.env.STRIPE_PRICE_FULL;

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price ID not configured" },
        { status: 500 }
      );
    }

    const base = getBaseUrl(req);

    // Run pre-analysis before payment
    const analysis = await analyze(url, mode);
    const { score, results, factors } = analysis;

    // Save analysis results before creating the session
    const tempKey = `pending:${url}`;
    await saveData(tempKey, { score, results, factors });

    // ✅ Create Stripe Checkout Session (email не передаём — Stripe сам добавит)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/success/${mode}?url=${encodeURIComponent(
        url
      )}&status=ok&paid=1`,
      cancel_url: `${base}/`,
      metadata: { url, mode },
    });

    // Save results tied to this session
    await saveData(`session:${session.id}`, { url, score, results, factors });
    await saveData(url, { score, results, factors });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("Error in /api/pay:", e);
    return NextResponse.json(
      { error: e?.message ?? "Stripe payment error" },
      { status: 500 }
    );
  }
}
