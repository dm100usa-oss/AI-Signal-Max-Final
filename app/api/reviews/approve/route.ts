import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { name, text, rating } = await req.json();
    
    if (!name || !text) {
      return NextResponse.json({ ok: false, error: "Invalid data" }, { status: 400 });
    }

    // 1. Удаляем из pending
    const pending = await redis.lrange("reviews:pending", 0, -1);
    const filtered = pending.filter((item) => {
      try {
        const r = JSON.parse(item as string);
        return !(r.name === name && r.text === text);
      } catch {
        return true;
      }
    });
    
    await redis.del("reviews:pending");
    if (filtered.length > 0) {
      await redis.rpush("reviews:pending", ...filtered);
    }

    // 2. Добавляем в approved
    const approvedReview = {
      name,
      text,
      rating: rating || 5,
      date: new Date().toISOString(),
      approved: true,
    };
    
    await redis.lpush("reviews:approved", JSON.stringify(approvedReview));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error approving review:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
