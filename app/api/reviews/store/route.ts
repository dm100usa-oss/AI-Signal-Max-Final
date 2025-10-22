import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ключ для хранения всех отзывов
const REVIEWS_KEY = "reviews:list";

// получить все отзывы
export async function GET() {
  try {
    const reviews = (await redis.get(REVIEWS_KEY)) || [];
    return NextResponse.json({ ok: true, reviews });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// добавить новый отзыв
export async function POST(req: Request) {
  try {
    const { name, text } = await req.json();
    if (!name || !text) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const newReview = {
      name,
      text,
      date: new Date().toISOString(),
      rating: 5,
      approved: false,
    };

    const existing = (await redis.get(REVIEWS_KEY)) || [];
    const updated = [newReview, ...existing];
    await redis.set(REVIEWS_KEY, updated);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
