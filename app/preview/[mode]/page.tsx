"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/hooks/useTranslation";
import en from "@/locales/en";
import ru from "@/locales/ru";

type Mode = "quick" | "pro";

function Dots() {
  return (
    <span className="ml-2 inline-flex w-[1.7ch] justify-start tabular-nums align-middle">
      <span className="dot">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
      <style jsx>{`
        .dot { opacity: 0.2; animation: aiv-dots 1200ms infinite; }
        .dot2 { animation-delay: 200ms; }
        .dot3 { animation-delay: 400ms; }
        @keyframes aiv-dots { 0% { opacity: 0.2; } 30% { opacity: 1; } 60% { opacity: 0.2; } 100% { opacity: 0.2; } }
      `}</style>
    </span>
  );
}

export default function PreviewPage({
  params,
  searchParams,
}: {
  params: { mode: Mode };
  searchParams: Record<string, string | undefined>;
}) {
  const mode = (params.mode as Mode) || "quick";
  const url = (searchParams?.url || "").trim();
  const status = (searchParams?.status || "ok").toLowerCase();
  const paid = (searchParams?.paid || "") === "1";
  const router = useRouter();
  const lang = useLang();
  const t = lang === "ru" ? ru.preview : en.preview;
  const tf = lang === "ru" ? ru.footer : en.footer;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const emailValid =
    mode === "pro"
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      : true;

  const date = new Date().toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pay = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const minDuration = 2200;
    const started = Date.now();

    let json: any = null;
    try {
      const resp = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, url, email }),
      });
      json = await resp.json();
    } catch (e) {
      console.error("Payment error", e);
    }

    const left = Math.max(0, minDuration - (Date.now() - started));
    await new Promise((r) => setTimeout(r, left));

    if (json?.url) {
      window.location.href = json.url as string;
    } else {
      setLoading(false);
    }
  }, [mode, url, email, loading]);

  useEffect(() => {
    if (status === "error") {
      router.push("/scan-failed");
    }
  }, [status, router]);

  const payButton =
    mode === "quick"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-green-600 hover:bg-green-700 text-white";

  const factors = mode === "quick" ? t.factorsQuick : t.factorsPro;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-center text-2xl font-semibold">
            {t.resultReady}
          </h1>

          {url && status === "ok" && (
            <div className="mb-6 text-center text-sm text-neutral-600">
              {t.websiteLabel}: {url} &nbsp; | &nbsp; {t.dateLabel}: {date}
            </div>
          )}

          {status === "ok" && (
            <>
              <div className="mb-6 text-center text-base font-medium text-neutral-800">
                {mode === "quick" ? t.quickFactorsIntro : t.proFactorsIntro}
              </div>

              <ul className="mb-6 space-y-4">
                {factors.map((item, i) => (
                  <li key={i} className="flex items-center">
                    <span
                      className={`mr-3 inline-block size-3 flex-none rounded-full ${
                        mode === "quick" ? "bg-blue-600" : "bg-green-600"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-[15px] text-neutral-800">
                      <span className="font-semibold">{item.name}</span> —{" "}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>

              {mode === "pro" && !paid && (
                <div className="mb-4">
                  <label htmlFor="email" className="mb-1 block text-sm text-neutral-700">
                    {t.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={[
                      "w-full rounded-md border px-3 py-2 text-sm outline-none",
                      email || !emailValid
                        ? emailValid
                          ? "border-neutral-300 focus:ring-2 focus:ring-green-500"
                          : "border-rose-400 focus:ring-2 focus:ring-rose-300"
                        : "border-neutral-300 focus:ring-2 focus:ring-green-500",
                    ].join(" ")}
                  />
                  {!emailValid && (
                    <p className="mt-1 text-xs text-rose-600">{t.emailError}</p>
                  )}
                </div>
              )}

              {!paid ? (
                <button
                  onClick={pay}
                  disabled={!url || (mode === "pro" && !emailValid) || loading}
                  className={[
                    "w-full rounded-md px-4 py-3 text-base font-medium transition-colors disabled:opacity-60 flex items-center justify-center",
                    payButton,
                  ].join(" ")}
                >
                  {mode === "pro" ? t.getFullReportButton : t.getResultsButton}
                  {loading && <Dots />}
                </button>
              ) : (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-800">
                  {mode === "pro" ? t.paidPro : t.paidQuick}
                </div>
              )}

              <p className="mt-6 text-center text-xs text-neutral-500">
                <span className="opacity-60">{tf.disclaimer}</span>
              </p>
            </>
          )}
        </div>

        <footer className="mt-8 text-center text-xs text-neutral-500">
          {tf.copyright}
          <br />
          <span className="opacity-60">{tf.disclaimer}</span>
        </footer>
      </div>
    </main>
  );
}
