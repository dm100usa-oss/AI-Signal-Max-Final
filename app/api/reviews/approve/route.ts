import { NextResponse } from "next/server";
import { redis } from "@/lib/reviews";

export async function POST(req: Request) {
  try {
    const { name, text, rating } = await req.json();

    if (!name || !text) {
      return NextResponse.json(
        { ok: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    const pending = await redis.lrange("reviews:pending", 0, -1);

    const normalizeToString = (item: any): string | null => {
      if (typeof item === "string") return item;
      if (item instanceof Uint8Array) return new TextDecoder().decode(item);
      if (typeof item === "object" && item !== null) return JSON.stringify(item);
      return null;
    };

    const filtered = (pending || []).filter((item: any) => {
      const s = normalizeToString(item);
      if (!s) return true;

      try {
        const r = JSON.parse(s);
        return !(r.name === name && r.text === text);
      } catch {
        return true;
      }
    });

    await redis.del("reviews:pending");
    if (filtered.length > 0) {
      const toPush = filtered
        .map((item: any) => normalizeToString(item))
        .filter(Boolean) as string[];
      if (toPush.length > 0) {
        await redis.rpush("reviews:pending", ...toPush);
      }
    }

    const approvedReview = {
      name,
      text,
      rating: rating || 5,
      date: new Date().toISOString(),
      approved: true,
    };

    // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ
    await redis.lpush("reviews:list", JSON.stringify(approvedReview));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error approving review:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
