export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET() {
  try {
    const raw = await kv.lrange("reviews:pending", 0, -1);

    const reviews = (raw || [])
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
    console.error("Error loading pending reviews:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
