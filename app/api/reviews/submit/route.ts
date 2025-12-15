import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { name, text, rating } = await req.json();

    if (!name || !text || !rating) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const review = {
      name,
      text,
      rating: Number(rating),
      date: new Date().toISOString(),
      approved: false,
    };

    // Сохраняем в очередь "ожидающих"
    await redis.lpush("reviews:pending", JSON.stringify(review));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Ошибка при добавлении отзыва:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
