import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    // Загружаем все отзывы из основного списка
    const raw = await redis.lrange("reviews:list", 0, -1);

    if (!raw || raw.length === 0) {
      return NextResponse.json({ ok: true, reviews: [] });
    }

    // Преобразуем строки JSON в объекты и фильтруем только одобренные
    const reviews = raw
      .map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      })
      .filter((r) => r && r.approved === true);

    return NextResponse.json({ ok: true, reviews });
  } catch (err) {
    console.error("Error loading reviews:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
