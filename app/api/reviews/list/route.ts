export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function GET() {
  try {
    // Читаем одобренные отзывы
    const raw = await redis.lrange("reviews:approved", 0, -1);

    if (!raw || raw.length === 0) {
      return NextResponse.json({ ok: true, reviews: [] });
    }

    const reviews = raw
      .map((item) => {
        try {
          return JSON.parse(item as string);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return NextResponse.json({ ok: true, reviews });
  } catch (err) {
    console.error("Error loading reviews list:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
