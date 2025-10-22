import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { name, text } = await req.json();

    if (!name || !text) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    // Отзыв получает статус "ожидает проверки"
    const review = {
      name,
      text,
      date: new Date().toISOString(),
      approved: false, // флаг модерации
    };

    // Сохраняем в список ожидающих модерации
    await redis.lpush("reviews:pending", JSON.stringify(review));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
