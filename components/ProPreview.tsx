"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Animation dots
function Dots({ colorClass = "text-white" }: { colorClass?: string }) {
  return (
    <span
      className={`inline-flex w-[1.7ch] justify-start tabular-nums align-middle ${colorClass}`}
    >
      <span className="dot">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
    </span>
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
    "Как оценивает ИИ ваш сайт",
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
  const [reportStage, setReportStage] = useState<
    "audit" | "owner" | "dev" | "final"
  >("audit");

  useEffect(() => {
    const factorTimer = setInterval(() => {
      setCurrent((p) => (p < factors.length - 1 ? p + 1 : p));
    }, (auditTime / factors.length) * 1000);

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
      setTimeout(() => setReportStage("dev"), 6000);
    }, reportStartDelay);

    const overallTimer = setInterval(
      () => setTimeLeft((t) => (t > 0 ? t - 1 : 0)),
      1000
    );

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
          if (json?.url) router.push(json.url);
          else router.push("/pay");
        } catch {
          router.push("/pay");
        }
      }, 4000);
    }, totalTime * 1000);

    setTimeout(() => setFadeHeader(true), 1500);

    return () => {
      clearInterval(factorTimer);
      clearInterval(overallTimer);
    };
  }, [router, url]);

  // 15 circles positions
  const circleCount = 15;
  const circleSpacing = 100 / (circleCount - 1);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      <p className="text-base text-neutral-400 mt-1 mb-2">
        {url} &nbsp; | &nbsp; Date:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {/* HEADER */}
      <div
        className={`text-[22px] sm:text-[24px] font-bold my-6 flex items-center justify-center transition-all duration-[1800ms] ${
          fadeHeader
            ? "opacity-60 text-neutral-400 translate-y-[-6px]"
            : "opacity-100 text-neutral-800 translate-y-0"
        }`}
      >
        <span className="flex items-center">
          Мы начали полный аудит
          <span className="inline-flex w-[1.7ch] ml-1">
            {fadeHeader && <Dots colorClass="text-green-400/70" />}
          </span>
        </span>
      </div>

      {/* FACTORS */}
      <div className="h-[64px] flex items-center justify-center">
        <p
          key={current}
          className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp"
        >
          {factors[current]}
        </p>
      </div>

      {/* TOP BAR */}
      <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
        <div
          className={`h-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 transition-[width] duration-1000 ease-linear ${
            progressAudit < 100 ? "animate-softGreenWave" : ""
          }`}
          style={{ width: `${progressAudit}%`, backgroundSize: "200% 100%" }}
        />
        {auditDone && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn">
              Аудит завершён
            </p>
          </div>
        )}
      </div>

      {/* TEXT BETWEEN BARS */}
      <div className="h-[32px] flex items-center justify-center mb-2">
        <p
          key={reportStage}
          className="text-sm sm:text-base text-neutral-600 font-medium animate-fadeInUp"
        >
          {reportStage === "final"
            ? "Отчёт для владельца • ТЗ для разработчика"
            : reportStage === "audit"
            ? "Аудит 15 ключевых факторов"
            : reportStage === "owner"
            ? "Формируем отчёт для владельца сайта"
            : "Создаём ТЗ для разработчика"}
        </p>
      </div>

      {/* === MIDDLE BAR WITH SVG CIRCLES === */}
      <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-6 flex items-center justify-center">
        <svg width="95%" height="40" viewBox="0 0 1000 40">
          {/* Line */}
          <line
            x1="0"
            y1="20"
            x2="1000"
            y2="20"
            stroke="#d1d5db"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Green progress overlay line */}
          <line
            x1="0"
            y1="20"
            x2={(1000 * progressAudit) / 100}
            y2="20"
            stroke="url(#grad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="grad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>

          {/* CIRCLES */}
          {Array.from({ length: circleCount }).map((_, i) => {
            const cx = (i * 1000) / (circleCount - 1);
            const active = progressAudit >= (i / (circleCount - 1)) * 100;

            return (
              <g key={i}>
                {/* Circle outline */}
                <circle
                  cx={cx}
                  cy={20}
                  r={9}
                  fill="white"
                  stroke={active ? "#22c55e" : "#d1d5db"}
                  strokeWidth="2.4"
                />

                {/* Thin checkmark */}
                {active && (
                  <path
                    d={`M${cx - 4} 20 L${cx - 1} 23 L${cx + 5} 16`}
                    stroke="#22c55e"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
        {!finished && (
          <>
            <div
              className="absolute left-0 top-0 h-full bg-gray-300 transition-[width] duration-1000 ease-linear"
              style={{ width: `${(timeLeft / totalTime) * 100}%` }}
            />
            <div className="relative z-10 flex items-center justify-center h-full text-neutral-500 text-sm font-medium">
              {`Полный аудит завершится через ${timeLeft} сек`}
            </div>
          </>
        )}
        {finished && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-500 via-green-600 to-green-700 animate-fadeIn">
            <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm flex items-center">
              Получить результат <Dots colorClass="text-white" />
            </p>
          </div>
        )}
      </div>

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease forwards;
        }

        @keyframes aiv-dots {
          0% {
            opacity: 0.2;
          }
          30% {
            opacity: 1;
          }
          60% {
            opacity: 0.2;
          }
          100% {
            opacity: 0.2;
          }
        }

        .dot {
          opacity: 0.2;
          animation: aiv-dots 1200ms infinite;
        }
        .dot2 {
          animation-delay: 200ms;
        }
        .dot3 {
          animation-delay: 400ms;
        }

        @keyframes softGreenWave {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-softGreenWave {
          animation: softGreenWave 5s ease-in-out infinite;
          background-size: 200% 100%;
        }
      `}</style>

      <footer className="mt-20 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data.
          Not legal advice.
        </span>
      </footer>
    </main>
  );
}
