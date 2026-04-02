import { NextResponse } from "next/server";
import { redis } from "@/lib/reviews";
import { SEED_REVIEWS } from "@/lib/reviewsSeed";

export const runtime = "nodejs";

const ENABLE_SEED = true;

export async function GET() {
  let realReviews: any[] = [];

  try {
    const raw = await redis.lrange("reviews:list", 0, -1);

    realReviews = (raw || [])
      .map((item: any) => {
        try {
          if (typeof item === "string") return JSON.parse(item);
          if (item instanceof Uint8Array) {
            return JSON.parse(new TextDecoder().decode(item));
          }
          if (typeof item === "object" && item !== null) return item;
          return null;
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch (err) {
    console.warn("Redis error, fallback to seed:", err);
  }

  let reviews = realReviews;

  if (ENABLE_SEED) {
    reviews = [...realReviews, ...SEED_REVIEWS];
  }

  reviews.sort(
    (a: any, b: any) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return NextResponse.json({ ok: true, reviews });
}
