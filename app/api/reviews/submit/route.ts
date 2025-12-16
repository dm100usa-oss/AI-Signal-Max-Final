import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { name, text, rating } = await req.json();

    if (!name || !text || !rating) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const review = {
      name,
      text,
      rating: Number(rating),
      date: new Date().toISOString(),
      approved: false,
    };

    await redis.lpush("reviews:pending", JSON.stringify(review));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error submitting review:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
