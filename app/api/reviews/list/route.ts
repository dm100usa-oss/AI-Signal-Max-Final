import { NextResponse } from "next/server";
import { redis } from "@/lib/reviews";

export const runtime = "nodejs";

export async function GET() {
  try {
    const raw = await redis.lrange("reviews:approved", 0, -1);

    if (!raw || raw.length === 0) {
      return NextResponse.json({ ok: true, reviews: [] });
    }

    const reviews = raw
      .map((item: any) => {
        if (typeof item === "string") {
          return JSON.parse(item);
        }

        if (item instanceof Uint8Array) {
          return JSON.parse(new TextDecoder().decode(item));
        }

        if (typeof item === "object" && item !== null) {
          return item;
        }

        return null;
      })
      .filter(Boolean);

    return NextResponse.json({ ok: true, reviews });
  } catch (err) {
    console.error("Error loading reviews list:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
