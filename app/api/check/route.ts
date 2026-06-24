import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { analyze } from "@/lib/analyze";
import { saveData } from "@/lib/storage";

export const runtime = "nodejs";

const redis = new Redis({
  url: process.env.KV_new_KV_REST_API_URL!,
  token: process.env.KV_new_KV_REST_API_TOKEN!,
});

const FREE_QUICK_LIMIT = 3;

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function secondsUntilMidnightUTC(): number {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(24, 0, 0, 0);
  return Math.max(60, Math.ceil((next.getTime() - now.getTime()) / 1000));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const raw = (body?.url as string | undefined)?.trim();
    const mode = (body?.mode as "quick" | "pro" | undefined) ?? "quick";

    if (!raw) return NextResponse.json({ error: "URL is required" }, { status: 400 });
    if (!/^https?:\/\/[\w.-]+\.[a-z]{2,}/i.test(raw))
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    if (mode !== "quick" && mode !== "pro")
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });

    // Дневной лимит бесплатных быстрых проверок по IP
    if (mode === "quick") {
      const ip = getClientIp(req);
      const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
      const limitKey = `freeq:${ip}:${day}`;
      let count = 0;
      try {
        count = await redis.incr(limitKey);
        if (count === 1) {
          await redis.expire(limitKey, secondsUntilMidnightUTC());
        }
      } catch (e) {
        // если счётчик недоступен — не блокируем пользователя
        console.error("rate-limit error:", e);
        count = 0;
      }
      if (count > FREE_QUICK_LIMIT) {
        return NextResponse.json(
          { error: "limit_reached", limit: FREE_QUICK_LIMIT },
          { status: 429 }
        );
      }
    }

    const data = await analyze(raw, mode);

    // Сохраняем результат туда же, откуда его читает /api/result (ключ = url)
    const { score, results, factors, items, allItems } = data;
    await saveData(raw, { url: raw, mode, score, results, factors, items, allItems });

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Analysis failed", detail: String(e?.message ?? e ?? "unknown error") },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ ok: true });
}
