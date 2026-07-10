"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/hooks/useTranslation";
import en from "@/locales/en";
import ru from "@/locales/ru";

function Dots({ colorClass }: { colorClass: string }) {
  return (
    <span className={`inline-flex w-[1.7ch] justify-start tabular-nums align-middle ${colorClass}`}>
      <span className="dot">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
    </span>
  );
}

function TopLights({ active }: { active: boolean }) {
  return (
    <div
      className={`flex justify-center mb-6 h-6 items-center space-x-3 transition-all duration-700 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-6px]"}`}
      style={{ pointerEvents: "none" }}
    >
      <span className={`top-light green-light ${active ? "light-active" : ""}`}></span>
      <span className={`top-light yellow-light ${active ? "light-active" : ""}`}></span>
      <span className={`top-light blue-light ${active ? "light-active" : ""}`}></span>
      <span className={`top-light red-light ${active ? "light-active" : ""}`}></span>
      <span className={`top-light cyan-light ${active ? "light-active" : ""}`}></span>
    </div>
  );
}

export default function FullPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "https://example.com";
  const lang = useLang();
  const t = lang === "ru" ? ru.proPreview : en.proPreview;
  const tf = lang === "ru" ? ru.footer : en.footer;

  const totalTime = 47;
  const auditTime = 30;
  const reportTime = 14;

  const [current, setCurrent] = useState(0);
  const [progressAudit, setProgressAudit] = useState(0);
  const [progressReport, setProgressReport] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [fadeHeader, setFadeHeader] = useState(false);
  const [auditDone, setAuditDone] = useState(false);
  const [reportsDone, setReportsDone] = useState(false);
  const [finished, setFinished] = useState(false);
  const [reportStage, setReportStage] = useState<"audit" | "owner" | "dev" | "final">("audit");
  const [checks, setChecks] = useState<number[]>([]);

  useEffect(() => {
    const cleanup: any[] = [];

    const auditProgressTimer = setInterval(() => {
      setProgressAudit((p) => {
        const next = p + 100 / auditTime;
        if (next >= 100) {
          clearInterval(auditProgressTimer);
          setAuditDone(true);
          setTimeout(() => setReportStage("owner"), 300);
        }
        return Math.min(next, 100);
      });
    }, 1000);
    cleanup.push(auditProgressTimer);

    const startFactorInterval = () => {
      const factorInterval = setInterval(() => {
        setCurrent((p) => {
          const next = p < t.factors.length - 1 ? p + 1 : p;
          if (next !== p) setChecks((c) => [...c, next]);
          return next;
        });
      }, (auditTime / t.factors.length) * 1000);
      cleanup.push(factorInterval);
    };

    setTimeout(() => {
      setChecks([0]);
      setCurrent(0);
      startFactorInterval();
    }, 1500);

    const reportStartDelay = auditTime * 1000;
    setTimeout(() => {
      const reportProgressTimer = setInterval(() => {
        setProgressReport((p) => {
          const next = p + 100 / reportTime;
          if (next >= 100) {
            clearInterval(reportProgressTimer);
            setReportsDone(true);
          }
          if (next >= 100 - 100 / reportTime) {
            setReportStage("final");
          }
          return Math.min(next, 100);
        });
      }, 1000);
      cleanup.push(reportProgressTimer);
      setTimeout(() => setReportStage("dev"), 6000);
    }, reportStartDelay);

    const overallTimer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    cleanup.push(overallTimer);

    setTimeout(() => {
      setFinished(true);
      setTimeout(async () => {
        try {
          const resp = await fetch("/api/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "pro", url }),
          });
          const json = await resp.json();
          if (json?.error === "analysis_failed") router.push("/scan-failed");
          else if (json?.url) router.push(json.url);
          else router.push("/pay");
        } catch {
          router.push("/pay");
        }
      }, 4000);
    }, totalTime * 1000);

    setTimeout(() => setFadeHeader(true), 1500);

    return () => cleanup.forEach(clearInterval);
  }, [router, url]);

  const reportStageLabel =
    reportStage === "final"
      ? t.finalReport
      : reportStage === "audit"
      ? t.auditLabel
      : reportStage === "owner"
      ? t.ownerReport
      : t.devReport;

  return (
    <main
      className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white"
      style={{ transform: "translateY(-10vh)" }}
    >
      <TopLights active={fadeHeader && !finished} />

      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Answers Score
      </h1>

      <p className="text-base text-neutral-400 mt-1 mb-2">
        {url} &nbsp; | &nbsp; {t.dateLabel}:{" "}
        {new Date().toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div
        className={`text-[22px] sm:text-[24px] font-bold my-6 flex items-center justify-center transition-all duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          fadeHeader ? "opacity-60 text-neutral-400 translate-y-[-6px]" : "opacity-100 text-neutral-800 translate-y-0"
        }`}
      >
        <span className="flex items-center justify-center">
          {t.started}
          <span className="inline-flex w-[1.7ch] justify-start ml-1">
            {fadeHeader && <Dots colorClass="text-green-400/70" />}
          </span>
        </span>
      </div>

      <div className="rounded-md p-0">
        <div className="h-[64px] flex items-center justify-center transition-opacity duration-700 ease-in-out">
          <p key={current} className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp">
            {t.factors[current]}
          </p>
        </div>

        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className={`h-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 transition-[width] duration-1000 ease-linear ${
              progressAudit < 100 ? "animate-softGreenWave" : ""
            }`}
            style={{ backgroundSize: "200% 100%", width: `${progressAudit}%` }}
          />
          {auditDone && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn">
                {t.auditDone}
              </p>
            </div>
          )}
        </div>

        <div className="h-[32px] flex items-center justify-center mb-2">
          <p key={reportStage} className="text-sm sm:text-base text-neutral-600 font-medium animate-fadeInUp">
            {reportStageLabel}
          </p>
        </div>

        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-6">
          <div
            className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-between px-3 ${
              auditDone ? "opacity-0" : "opacity-100"
            }`}
          >
            {Array.from({ length: 15 }).map((_, idx) => {
              const active = checks.includes(idx);
              return (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    active ? "border-green-500" : "border-gray-300"
                  } bg-gray-200 transition-all duration-500`}
                >
                  {active && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className={`h-full transition-[width] duration-1000 ease-linear ${
              auditDone ? "bg-gradient-to-r from-green-500 via-green-600 to-green-700" : ""
            }`}
            style={{ width: `${progressReport}%` }}
          />

          {reportsDone && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn">
                {t.reportsDone}
              </p>
            </div>
          )}
        </div>

        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
          {!finished && (
            <>
              <div
                className="absolute left-0 top-0 h-full bg-gray-300 transition-[width] duration-1000 ease-linear"
                style={{ width: `${(timeLeft / totalTime) * 100}%` }}
              />
              <div className="relative z-10 flex items-center justify-center h-full text-neutral-500 text-sm font-medium transition-opacity duration-500">
                {t.timerText(timeLeft)}
              </div>
            </>
          )}
          {finished && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-500 via-green-600 to-green-700 animate-fadeIn">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn flex items-center justify-center">
                {t.getResult} <Dots colorClass="text-white" />
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 1.2s ease forwards; }
        @keyframes aiv-dots { 0% { opacity: 0.2; } 30% { opacity: 1; } 60% { opacity: 0.2; } 100% { opacity: 0.2; } }
        .dot { opacity: 0.2; animation: aiv-dots 1200ms infinite; }
        .dot2 { animation-delay: 200ms; }
        .dot3 { animation-delay: 400ms; }
        @keyframes softGreenWave { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-softGreenWave { animation: softGreenWave 5s ease-in-out infinite; background-size: 200% 100%; }
        @keyframes minimalWave { 0% { opacity: 0; } 20% { opacity: 0; } 32% { opacity: 0.9; } 46% { opacity: 0; } 100% { opacity: 0; } }
        .top-light { width: 12px; height: 12px; border-radius: 9999px; border: 1px solid rgba(0,0,0,0.12); opacity: 0; animation: none; }
        .light-active { animation: minimalWave 3.3s infinite cubic-bezier(0.4,0,0.2,1); }
        .yellow-light { background: radial-gradient(circle at 30% 30%, #fbbf24, #b45309 65%); }
        .blue-light { background: radial-gradient(circle at 30% 30%, #60a5fa, #1d4ed8 65%); }
        .green-light { background: radial-gradient(circle at 30% 30%, #34d399, #047857 65%); }
        .red-light { background: radial-gradient(circle at 30% 30%, #f87171, #b91c1c 65%); }
        .cyan-light { background: radial-gradient(circle at 30% 30%, #38bdf8, #0e7490 65%); }
        .light-active.green-light { animation-delay: 0s; }
        .light-active.yellow-light { animation-delay: 0.35s; }
        .light-active.blue-light { animation-delay: 0.7s; }
        .light-active.red-light { animation-delay: 1.05s; }
        .light-active.cyan-light { animation-delay: 1.4s; }
      `}</style>

      <footer className="mt-20 text-center text-xs text-neutral-500">
        {tf.copyright}
        <br />
        <span className="opacity-60">{tf.disclaimer}</span>
      </footer>
    </main>
  );
}
