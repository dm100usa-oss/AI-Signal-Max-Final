export const runtime = "nodejs";  // добавляем эту строку первой

import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    const raw = await redis.lrange("reviews:pending", 0, -1);

    if (!raw || raw.length === 0) {
      return NextResponse.json({ ok: true, reviews: [] });
    }

    const reviews = raw
      .map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return NextResponse.json({ ok: true, reviews });
  } catch (err) {
    console.error("Error loading pending reviews:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
