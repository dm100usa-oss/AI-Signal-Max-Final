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
      return NextResponse.json({ ok: false, error: "Invalid data" }, { status: 400 });
    }

    // Удаляем из pending
    const pending = await redis.lrange("reviews:pending", 0, -1);
    const filtered = pending.filter((item) => {
      try {
        const r = JSON.parse(item);
        return !(r.name === name && r.text === text);
      } catch {
        return true;
      }
    });
    await redis.del("reviews:pending");
    if (filtered.length) await redis.rpush("reviews:pending", ...filtered);

    // Добавляем в list
    const approvedReview = {
      name,
      text,
      date: new Date().toISOString(),
      approved: true,
    };
    await redis.lpush("reviews:list", JSON.stringify(approvedReview));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error approving review:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
