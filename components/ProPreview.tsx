"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
      className={`
        flex justify-center mb-6 h-6 items-center space-x-3 
        transition-all duration-700 
        ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-6px]"}
      `}
      style={{ pointerEvents: "none" }}
    >
      <span className="top-light yellow-light"></span>
      <span className="top-light blue-light"></span>
      <span className="top-light green-light"></span>
    </div>
  );
}

export default function FullPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "https://example.com";

  const factors = [
    "Открыт ли сайт для ИИ",
    "Понимает ли ИИ, о чём ваш сайт",
    "Понятна ли ИИ структура сайта",
    "Видит ли ИИ заголовки и описания",
    "Видит ли ИИ содержание страниц",
    "Видит ли ИИ изображения на сайте",
    "Может ли ИИ переходить по ссылкам сайта",
    "Воспринимает ли ИИ сайт как источник информации",
    "Считает ли ИИ ваш сайт логичным",
    "Считает ли ИИ ваш сайт безопасным",
    "Понимает ли ИИ категорию вашего сайта",
    "Учитывает ли ИИ ваш сайт при поиске",
    "Выделяет ли ИИ ваш сайт среди других",
    "Считает ли ИИ ваш сайт полезным",
    "Как оценивает ИИ ваш сайт"
  ];

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
          const next = p < factors.length - 1 ? p + 1 : p;
          if (next !== p) setChecks((c) => [...c, next]);
          return next;
        });
      }, (auditTime / factors.length) * 1000);
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
            body: JSON.stringify({ mode: "pro", url })
          });
          const json = await resp.json();
          if (json?.url) router.push(json.url);
          else router.push("/pay");
        } catch {
          router.push("/pay");
        }
      }, 4000);
    }, totalTime * 1000);

    setTimeout(() => setFadeHeader(true), 1500);

    return () => cleanup.forEach(clearInterval);
  }, [router, url]);

  return (
    <main
      className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white"
      style={{ transform: "translateY(-10vh)" }}
    >
      <TopLights active={fadeHeader && !finished} />

      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      <p className="text-base text-neutral-400 mt-1 mb-2">
        {url} &nbsp; | &nbsp; Date:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
      </p>

      <div
        className={`text-[22px] sm:text-[24px] font-bold my-6 flex items-center justify-center transition-all duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          fadeHeader ? "opacity-60 text-neutral-400 translate-y-[-6px]" : "opacity-100 text-neutral-800 translate-y-0"
        }`}
      >
        <span className="flex items-center justify-center">
          Мы начали полный аудит
          <span className="inline-flex w-[1.7ch] justify-start ml-1">
            {fadeHeader && <Dots colorClass="text-green-400/70" />}
          </span>
        </span>
      </div>

      <style jsx global>{`
        @keyframes aiv-dots {
          0% { opacity: 0.2; }
          30% { opacity: 1; }
          60% { opacity: 0.2; }
          100% { opacity: 0.2; }
        }

        .dot {
          opacity: 0.2;
          animation: aiv-dots 600ms infinite;
        }

        .dot2 {
          animation-delay: 100ms;
        }

        .dot3 {
          animation-delay: 200ms;
        }

        @keyframes minimalWave {
          0% { opacity: 0.15; }
          20% { opacity: 0.15; }
          32% { opacity: 0.9; }
          46% { opacity: 0.15; }
          100% { opacity: 0.15; }
        }

        .top-light {
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          border: 1px solid rgba(0,0,0,0.12);
        }

        .yellow-light {
          background: #fbbf24;
          animation: minimalWave 3.3s infinite cubic-bezier(0.4,0,0.2,1);
        }

        .blue-light {
          background: #3b82f6;
          animation: minimalWave 3.3s infinite cubic-bezier(0.4,0,0.2,1);
          animation-delay: 0.35s;
        }

        .green-light {
          background: #10b981;
          animation: minimalWave 3.3s infinite cubic-bezier(0.4,0,0.2,1);
          animation-delay: 0.7s;
        }
      `}</style>

      <footer className="mt-20 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">Visibility scores are estimated. Not legal advice.</span>
      </footer>
    </main>
  );
}
