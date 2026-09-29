import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

// Ключ реального счётчика заходов для AI Answers Rank (отдельный от других проектов).
const KEY = "aar:visits";

const URL =
  process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL;
const TOKEN =
  process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN;

// Увеличивает счётчик на 1 и возвращает новое значение через REST API Upstash.
async function incr(): Promise<number | null> {
  if (!URL || !TOKEN) return null;
  try {
    const res = await fetch(`${URL}/incr/${KEY}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: number };
    return typeof data.result === "number" ? data.result : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const real = await incr();
  // real === null означает, что Redis ещё не подключён — отдаём 0,
  // тогда клиент покажет только базовую часть счётчика.
  return NextResponse.json({ real: real ?? 0 }, { headers: { "Cache-Control": "no-store" } });
}
