import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function fetchWithTimeout(url: string, ms = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "AIVPrecheck/1.0 (+https://aivcheck.com)" },
      cache: "no-store",
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !/^https?:\/\/[\w.-]+\.[a-z]{2,}/i.test(url)) {
      return NextResponse.json({ ok: false, reason: "invalid_url" }, { status: 400 });
    }

    const res = await fetchWithTimeout(url, 8000).catch(() => null);

    // таймаут или сеть недоступна
    if (!res) {
      return NextResponse.json({ ok: false, reason: "unreachable" });
    }

    // сайт не существует или сервер сломан
    if (res.status === 404 || res.status === 410 || res.status >= 500) {
      return NextResponse.json({ ok: false, reason: "not_available" });
    }

    // всё остальное (200, 301, 302, 403, 429 и т.д.) — сайт живой, читаем HTML
    let html = "";
    try {
      html = await res.text();
    } catch {
      // не смогли прочитать тело — но сайт ответил
      return NextResponse.json({ ok: true });
    }

    // нет HTML вообще
    if (!html || html.length < 200) {
      return NextResponse.json({ ok: false, reason: "no_content" });
    }

    const lower = html.toLowerCase();

    // только очевидные припаркованные домены
    const parkingPhrases = [
      "domain for sale",
      "buy this domain",
      "this domain is for sale",
      "parked domain",
    ];

    if (parkingPhrases.some((p) => lower.includes(p))) {
      return NextResponse.json({ ok: false, reason: "parked" });
    }

    return NextResponse.json({ ok: true });

  } catch {
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }
}
