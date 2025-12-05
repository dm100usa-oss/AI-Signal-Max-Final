"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

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

const isValidUrl = (u: string): boolean => {
  try {
    const url = new URL(u.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const hostname = url.hostname;
    const parts = hostname.split(".");
    if (parts.length < 2) return false;
    const tld = parts[parts.length - 1];
    if (!/^[a-zA-Z]{2,6}$/.test(tld)) return false;
    const lastBeforeTld = parts[parts.length - 2];
    if (lastBeforeTld.length < 2) return false;
    return true;
  } catch {
    return false;
  }
};

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"quick" | "pro" | null>(null);
  const [wave, setWave] = useState(false);

  const [rating, setRating] = useState<number>(4.9);
  const [reviews, setReviews] = useState<number>(128);

  useEffect(() => {
    async function fetchStats() {
      try {
        const resp = await fetch("/api/reviews/stats");
        if (resp.ok) {
          const data = await resp.json();
          if (data?.rating && data?.reviews) {
            setRating(data.rating);
            setReviews(data.reviews);
          }
        }
      } catch {}
    }
    fetchStats();
  }, []);

  const go = useCallback(
    async (mode: "quick" | "pro") => {
      if (loading) return;
      let u = normalizeUrl(url);
      if (!u.startsWith("http://") && !u.startsWith("https://")) {
        u = "https://" + u;
      }
      if (!isValidUrl(u)) {
        setError("Введите корректный URL, включая https://");
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
    },
    [url, loading, router]
  );

  const clear = () => setUrl("");

  const handleStarsClick = async () => {
    setWave(true);
    await new Promise((r) => setTimeout(r, 450));
    document.body.style.transition = "opacity 0.6s ease";
    document.body.style.opacity = "0";
    setTimeout(() => router.push("/reviews"), 600);
  };

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 transition-opacity duration-700">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-2">
        AI Signal Max
      </h1>
      <p className="text-center text-base text-neutral-700 mb-8 lowercase font-medium tracking-tight">
        новое конкурентное преимущество
      </p>
      <p className="text-center text-neutral-600 mb-8 leading-relaxed">
        Проверьте как ИИ ассистенты видят и оценивают ваш сайт: ChatGPT · Copilot · Gemini · Perplexity · Grok и другие
      </p>

      <div className="mb-2 relative">
        <input
          type="url"
          inputMode="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(normalizeUrl(e.target.value))}
          onPaste={(e) => {
            const pasted =
              (e.clipboardData || (window as any).clipboardData).getData("text");
            const cleaned = normalizeUrl(pasted);
            if (cleaned !== pasted) {
              e.preventDefault();
              setUrl(cleaned);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") go("quick");
          }}
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

      <button
        onClick={() => go("quick")}
        className="w-full rounded-md bg-blue-600 px-4 py-3 text-white text-base font-medium hover:bg-blue-700 transition-colors cursor-pointer"
      >
        {loading === "quick" ? (
          <span className="inline-flex items-center">Проверяем<Dots /></span>
        ) : (
          "Быстрая проверка $5.99"
        )}
      </button>

      <p className="mt-2 mb-4 text-center text-sm text-neutral-600">
        Мгновенный результат, 10 ключевых факторов, краткие рекомендации
      </p>

      <button
        onClick={() => go("pro")}
        className="w-full rounded-md bg-green-600 px-4 py-3 text-white text-base font-medium hover:bg-green-700 transition-colors cursor-pointer"
      >
        {loading === "pro" ? (
          <span className="inline-flex items-center">Проверяем<Dots /></span>
        ) : (
          "Полная проверка $19.99"
        )}
      </button>

      <p className="mt-2 mb-6 text-center text-sm text-neutral-600">
        15 факторов, детальный PDF-отчёт, чек-лист для разработчика, результат на email
      </p>

      <div className="flex justify-center items-center mb-10">
        <style jsx>{`
          .stars {
            position: relative;
            display: flex;
            gap: 10px;
            padding: 4px 8px;
            overflow: hidden;
          }
          .stars::before {
            content: "";
            position: absolute;
            top: 0;
            left: -140%;
            width: 80%;
            height: 100%;
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.5) 50%,
              rgba(255,255,255,0) 100%
            );
            filter: blur(6px);
            animation: shine 3.2s linear infinite;
          }
          @keyframes shine {
            0% { left: -140%; }
            55% { left: 160%; }
            100% { left: 160%; }
          }
          .star {
            font-size: 30px;
            cursor: pointer;
            user-select: none;
            background: linear-gradient(180deg, #facc15 0%, #eab308 100%);
            background-size: 100% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            transition: transform 0.2s ease, filter 0.2s ease;
            text-shadow:
              0 0 1px #c49a06,
              0 0 1px #c49a06,
              0 0 1px #c49a06;
          }
          .flash .star {
            animation: clickFlash 0.45s ease;
          }
          @keyframes clickFlash {
            0% { filter: brightness(2.7); transform: scale(1.11); }
            100% { filter: brightness(1); transform: scale(1); }
          }
        `}</style>

        <div className={`stars ${wave ? "flash" : ""}`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} onClick={handleStarsClick} className="star">★</span>
          ))}
        </div>

        <div className="ml-3 text-lg text-neutral-700 font-medium tracking-tight">
          {rating.toFixed(1)} <span className="opacity-70">({reviews})</span>
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Показатели видимости рассчитаны приблизительно и основаны на общедоступных данных. Не являются юридической консультацией.
        </span>
      </footer>
    </main>
  );
}
