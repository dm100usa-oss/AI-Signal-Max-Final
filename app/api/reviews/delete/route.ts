import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
// Удаление работает с тем же хранилищем, куда отзывы попадают при отправке
// и откуда их читает модерация (раньше здесь было другое хранилище).
import { redis } from "@/lib/reviews";

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const { name, text } = await req.json();
    
    if (!name || !text) {
      return NextResponse.json({ ok: false, error: "Invalid data" }, { status: 400 });
    }

    const pending = await redis.lrange("reviews:pending", 0, -1);

    // Хранилище может вернуть запись строкой или уже готовым объектом —
    // приводим к строке так же, как при одобрении.
    const normalizeToString = (item: any): string | null => {
      if (typeof item === "string") return item;
      if (item instanceof Uint8Array) return new TextDecoder().decode(item);
      if (typeof item === "object" && item !== null) return JSON.stringify(item);
      return null;
    };

    const filtered = (pending || [])
      .map((item: any) => normalizeToString(item))
      .filter((s): s is string => {
        if (!s) return false;
        try {
          const r = JSON.parse(s);
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
