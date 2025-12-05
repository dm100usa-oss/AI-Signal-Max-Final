"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Dots({ colorClass = "text-white" }: { colorClass?: string }) {
  return (
    <span className={`inline-flex w-[1.7ch] justify-start tabular-nums align-middle ${colorClass}`}>
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

  const [reportStage, setReportStage] =
    useState<"audit" | "owner" | "dev" | "final">("audit");

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

    const overallTimer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

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
  }, [router, url, factors.length]);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      <p className="text-base text-neutral-400 mt-1 mb-2">
        {url} | Date:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div
        className={`text-[22px] sm:text-[24px] font-bold my-6 flex items-center justify-center transition-all duration-[1600ms] ${
          fadeHeader
            ? "opacity-60 text-neutral-400 translate-y-[-6px]"
            : "opacity-100 text-neutral-800 translate-y-0"
        }`}
      >
        Мы начали полный аудит
        <span className="inline-flex w-[1.7ch] justify-start ml-1">
          {fadeHeader && <Dots colorClass="text-green-400/70" />}
        </span>
      </div>

      <div className="rounded-md p-0">
        <div className="h-[64px] flex items-center justify-center">
          <p key={current} className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp">
            {factors[current]}
          </p>
        </div>

        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className={`h-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 transition-[width] duration-1000`}
            style={{ width: `${progressAudit}%` }}
          />
        </div>

        <div className="h-[32px] flex items-center justify-center mb-2">
          <p key={reportStage} className="text-sm sm:text-base text-neutral-600 font-medium animate-fadeInUp">
            {reportStage === "final"
              ? "Отчёт для владельца • ТЗ для разработчика"
              : reportStage === "audit"
              ? "Аудит 15 ключевых факторов"
              : reportStage === "owner"
              ? "Формируем отчёт для владельца сайта"
              : "Создаём ТЗ для разработчика"}
          </p>
        </div>

        {/* Средняя полоса — обновлённая */}
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-6 flex items-center">
          {!auditDone && (
            <div className="absolute inset-0 flex items-center justify-between px-4">
              {Array.from({ length: factors.length }).map((_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full border-2 border-green-500 flex items-center justify-center transition-all duration-500 ${
                    i < current ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  {i < current && (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}

          {auditDone && (
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 transition-[width] duration-1000"
              style={{ width: `${progressReport}%` }}
            />
          )}

          {reportsDone && auditDone && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg sm:text-xl font-semibold text-white animate-fadeIn">
                Отчёты созданы
              </p>
            </div>
          )}
        </div>

        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
          {!finished && (
            <>
              <div
                className="absolute left-0 top-0 h-full bg-gray-300 transition-[width] duration-1000"
                style={{ width: `${(timeLeft / totalTime) * 100}%` }}
              />
              <div className="relative z-10 flex items-center justify-center h-full text-neutral-500 text-sm font-medium">
                Полный аудит завершится через {timeLeft} сек
              </div>
            </>
          )}

          {finished && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-500 via-green-600 to-green-700 animate-fadeIn">
              <p className="text-lg sm:text-xl font-semibold text-white flex items-center justify-center">
                Получить результат <Dots colorClass="text-white" />
              </p>
            </div>
          )}
        </div>
      </div>

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
