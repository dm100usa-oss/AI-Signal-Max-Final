import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { analyze } from "../../../lib/analyze";
import { saveData, getUsedChecks, incrChecks, FREE_LIMIT } from "../../../lib/storage";

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
    const { mode, url, lang = "en", peek = false } = await req.json();

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

    // ===== Лимит бесплатных проверок (только быстрая) =====
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (mode === "quick") {
      const used = await getUsedChecks(ip);
      const remaining = Math.max(0, FREE_LIMIT - used);
      // лимит исчерпан — фронт покажет плашку
      if (used >= FREE_LIMIT) {
        return NextResponse.json(
          { error: "limit_reached", used, limit: FREE_LIMIT, remaining: 0 },
          { status: 429 }
        );
      }
      // peek — только предпросмотр лимита, без запуска анализа и без списания
      if (peek) {
        return NextResponse.json({ ok: true, used, limit: FREE_LIMIT, remaining });
      }
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
    const { score, results, factors, items, allItems, aiScores, pageLang, factorScores, notApplicable } = analysis;

    // проверка результата ДО оплаты: если расчёт не собрался или дал 0 —
    // не пускаем к оплате, деньги не берём, отправляем пройти заново
    if (!aiScores || typeof aiScores.overall !== "number" || aiScores.overall <= 0) {
      return NextResponse.json({ error: "analysis_failed" }, { status: 422 });
    }

    // списываем одну бесплатную проверку: только быстрая, только при успехе
    if (mode === "quick") {
      await incrChecks(ip);
    }

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
      pageLang,
      factorScores,
      notApplicable,
    });

    await saveData(url, { url, mode, score, results, factors, items, allItems, aiScores, pageLang, factorScores, notApplicable });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("Error in /api/pay:", e);
    return NextResponse.json(
      { error: e?.message ?? "Stripe payment error" },
      { status: 500 }
    );
  }
}
