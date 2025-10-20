"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

/** Only dots animate; text stays stable */
function Dots() {
  return (
    <span className="inline-flex w-[1.7ch] justify-start tabular-nums align-middle">
      <span className="dot">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
      <style jsx>{`
        .dot { opacity: .2; animation: aiv-dots 1200ms infinite; }
        .dot2 { animation-delay: 200ms; }
        .dot3 { animation-delay: 400ms; }
        @keyframes aiv-dots {
          0% { opacity: .2; }
          30% { opacity: 1; }
          60% { opacity: .2; }
          100% { opacity: .2; }
        }
      `}</style>
    </span>
  );
}

const normalizeUrl = (v: string) =>
  v.replace(/^\s*checked\s+website:\s*/i, "").trim();

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"quick" | "pro" | null>(null);

  const isValid = (u: string) =>
    /^https?:\/\/[\w.-]+\.[a-z]{2,}.*$/i.test(u.trim());

  const go = useCallback(async (mode: "quick" | "pro") => {
    if (loading) return;
    const u = normalizeUrl(url);
    if (!isValid(u)) {
      setError("Please enter a valid URL (including http/https).");
      return;
    }
    setError(null);
    setLoading(mode);

    const minDuration = 2200;
    const started = Date.now();

    let status: "ok" | "error" = "ok";
    try {
      const resp = await fetch("/api/precheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: u }),
      });
      const json = await resp.json();
      status = json?.ok ? "ok" : "error";
    } catch {
      status = "error";
    }

    const left = Math.max(0, minDuration - (Date.now() - started));
    await new Promise((r) => setTimeout(r, left));

    const q = new URLSearchParams({ url: u, status }).toString();
    router.push(`/preview/${mode}?${q}`);
  }, [url, loading, router]);

  const clear = () => setUrl("");

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4">
        AI Signal Max
      </h1>
      <p className="text-center text-neutral-600 mb-8 leading-relaxed">
        Проверьте, виден ли ваш сайт для ИИ-ассистентов, таких как ChatGPT, Copilot, Gemini, Perplexity, Grok и других
      </p>

      {/* URL input */}
      <div className="mb-2 relative">
        <input
          type="url"
          inputMode="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(normalizeUrl(e.target.value))}
          onPaste={(e) => {
            const pasted = (e.clipboardData || (window as any).clipboardData).getData("text");
            const cleaned = normalizeUrl(pasted);
            if (cleaned !== pasted) {
              e.preventDefault();
              setUrl(cleaned);
            }
          }}
          onKeyDown={(e) => { if (e.key === "Enter") go("quick"); }}
          className={[
            "w-full rounded-md border px-4 py-3 pr-12 text-base outline-none",
            error
              ? "border-rose-400 focus:ring-2 focus:ring-rose-300"
              : "border-neutral-300 focus:ring-2 focus:ring-blue-500",
          ].join(" ")}
        />
        {url && (
          <button
            type="button"
            aria-label="Clear"
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-6 h-6 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 cursor-pointer"
          >
            ×
          </button>
        )}
      </div>
      {error && <div className="mb-3 text-sm text-rose-600">{error}</div>}

      {/* Quick */}
      <button
        onClick={() => go("quick")}
        disabled={!!loading}
        className="w-full rounded-md bg-blue-600 px-4 py-3 text-white text-base font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer"
      >
        {loading === "quick" ? (
          <span className="inline-flex items-center">Checking<Dots /></span>
        ) : (
          "Быстрая проверка $9.99"
        )}
      </button>
      <p className="mt-2 mb-4 text-center text-sm text-neutral-600">
        Мгновенный результат, 10 ключевых факторов, краткие рекомендации
      </p>

      {/* Pro */}
      <button
        onClick={() => go("pro")}
        disabled={!!loading}
        className="w-full rounded-md bg-green-600 px-4 py-3 text-white text-base font-medium hover:bg-green-700 disabled:opacity-60 transition-colors cursor-pointer"
      >
        {loading === "pro" ? (
          <span className="inline-flex items-center">Checking<Dots /></span>
        ) : (
          "Полная проверка $19.99"
        )}
      </button>
      <p className="mt-2 mb-4 text-center text-sm text-neutral-600">
        15 факторов, детальный PDF-отчёт, чек-лист для разработчика, результат на email
      </p>

      {/* Premium stars */}
      <div className="flex justify-center mt-2 mb-8 space-x-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            onClick={() => router.push("/reviews")}
            className="w-7 h-7 text-yellow-400 drop-shadow-sm hover:text-yellow-500 hover:scale-105 transition-transform cursor-pointer"
            fill="currentColor"
          />
        ))}
      </div>

      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data. Not legal advice.
        </span>
      </footer>
    </main>
  );
}
