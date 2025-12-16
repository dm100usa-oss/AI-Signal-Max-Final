export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    const raw = await redis.lrange("reviews:pending", 0, -1);

    const reviews = (raw || []).map((item: any) => {
      if (typeof item === "string") return JSON.parse(item);
      if (item instanceof Uint8Array)
        return JSON.parse(new TextDecoder().decode(item));
      return null;
    }).filter(Boolean);

    return NextResponse.json({ ok: true, reviews });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
