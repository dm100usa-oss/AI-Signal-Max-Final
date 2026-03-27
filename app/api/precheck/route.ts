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

    if (!res || !res.ok) {
      return NextResponse.json({ ok: false });
    }

    // читаем HTML (без падения)
    let html = "";
    try {
      html = await res.text();
    } catch {
      html = "";
    }

    const lower = html.toLowerCase();

    // 1. нет HTML или это не HTML
    if (!html || !lower.includes("<html")) {
      return NextResponse.json({ ok: false });
    }

    // 2. слишком маленький контент
    if (html.length < 500) {
      return NextResponse.json({ ok: false });
    }

    // 3. признаки парковки (расширили список)
    if (
      lower.includes("domain for sale") ||
      lower.includes("buy this domain") ||
      lower.includes("this domain is for sale") ||
      lower.includes("parking") ||
      lower.includes("parked domain") ||
      lower.includes("sedo") ||
      lower.includes("godaddy")
    ) {
      return NextResponse.json({ ok: false });
    }

    return NextResponse.json({ ok: true });

  } catch {
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }
}
