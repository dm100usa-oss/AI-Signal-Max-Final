import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { name, text } = await req.json();
    
    if (!name || !text) {
      return NextResponse.json({ ok: false, error: "Invalid data" }, { status: 400 });
    }

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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error deleting review:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
