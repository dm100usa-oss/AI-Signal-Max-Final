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

// строгая проверка URL на сервере
function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { mode, url, lang = "en" } = await req.json();

    // проверка режима
    if (mode !== "quick" && mode !== "pro") {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    // проверка URL
    if (!url || typeof url !== "string" || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // цены Stripe
    const priceId =
      mode === "quick"
        ? "price_1SaTZaFEP1IRb3Hwea5vrLgL"
        : process.env.STRIPE_PRICE_FULL;

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price ID not configured" },
        { status: 500 }
      );
    }

    const base = getBaseUrl(req);

    // анализ сайта
    const analysis = await analyze(url, mode);
    const { score, results, factors, items, allItems, aiScores } = analysis;

    // временное сохранение результата (до оплаты)
    const tempKey = `pending:${url}`;
    await saveData(tempKey, { score, results, factors });

    // создание Stripe сессии
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/success/${mode}?url=${encodeURIComponent(
        url
      )}&status=ok&paid=1`,
      cancel_url: `${base}/`,
      metadata: { url, mode, lang },
    });

    // сохранение данных
    await saveData(`session:${session.id}`, {
      url,
      mode,
      score,
      results,
      factors,
      items,
      allItems,
      aiScores,
    });

    await saveData(url, { url, mode, score, results, factors, items, allItems, aiScores });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("Error in /api/pay:", e);
    return NextResponse.json(
      { error: e?.message ?? "Stripe payment error" },
      { status: 500 }
    );
  }
}
