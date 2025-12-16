import { NextResponse } from "next/server";
import { redis } from "@/lib/reviews";
import { SEED_REVIEWS } from "@/lib/reviewsSeed";

export const runtime = "nodejs";

// выключатель seed — одна строка
const ENABLE_SEED = true;

export async function GET() {
  try {
    const raw = await redis.lrange("reviews:list", 0, -1);

    const realReviews = (raw || [])
      .map((item: any) => {
        if (typeof item === "string") return JSON.parse(item);
        if (item instanceof Uint8Array)
          return JSON.parse(new TextDecoder().decode(item));
        if (typeof item === "object" && item !== null) return item;
        return null;
      })
      .filter(Boolean);

    let reviews = realReviews;

    if (ENABLE_SEED) {
      reviews = [...realReviews, ...SEED_REVIEWS];
    }

    // сортировка по дате (как и было по смыслу)
    reviews.sort(
      (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ ok: true, reviews });
  } catch (err) {
    console.error("Error loading reviews list:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
