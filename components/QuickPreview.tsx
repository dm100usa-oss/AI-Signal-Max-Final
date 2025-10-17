"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 🔹 Анимация трёх точек (точно как на главной странице)
function Dots() {
  return (
    <span className="inline-flex w-[1.7ch] justify-start tabular-nums align-middle text-neutral-400">
      <span className="dot">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
      <style jsx>{`
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
      `}</style>
    </span>
  );
}

export default function ProPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";

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

  const totalTime = 44;
  const auditTime = 30;
  const reportTime = 14;

  const [current, setCurrent] = useState(0);
  const [progressAudit, setProgressAudit] = useState(0);
  const [progressReport, setProgressReport] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [finished, setFinished] = useState(false);
  const [fadeHeader, setFadeHeader] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showResultText, setShowResultText] = useState(false);
  const [reportStage, setReportStage] = useState<"audit" | "owner" | "dev">("audit");

  useEffect(() => {
    // 🔹 Анимация факторов
    const factorTimer = setInterval(() => {
      setCurrent((p) => (p < factors.length - 1 ? p + 1 : p));
    }, (auditTime / factors.length) * 1000);

    // 🔹 Прогресс первой полосы (аудит)
    const auditProgressTimer = setInterval(() => {
      setProgressAudit((p) => (p >= 100 ? 100 : p + 100 / auditTime));
    }, 1000);

    // 🔹 Общий таймер (третья полоса)
    const overallTimer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    // 🔹 Переход ко второй полосе
    setTimeout(() => {
      setReportStage("owner");
      const reportProgressTimer = setInterval(() => {
        setProgressReport((p) => (p >= 100 ? 100 : p + 100 / reportTime));
      }, 1000);

      // смена надписей
      setTimeout(() => setReportStage("dev"), 6000);

      setTimeout(() => clearInterval(reportProgressTimer), reportTime * 1000);
    }, auditTime * 1000);

    // 🔹 Финал
    setTimeout(() => {
      setFinished(true);
      setTimeout(() => setShowFinal(true), 1200);
      setTimeout(() => setShowResultText(true), 2200);

      // 🔹 Переход к оплате
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
      clearInterval(auditProgressTimer);
      clearInterval(overallTimer);
    };
  }, [router, url]);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      <p className="text-base text-neutral-400 mt-1 mb-2">
        {url || "https://example.com"} &nbsp; | &nbsp; Date:{" "}
        {new Date().toLocaleDateString("en-US")}
      </p>

      {/* 🔹 Надпись с точками */}
      <div
        className={`text-[22px] sm:text-[24px] font-bold my-6 flex items-center justify-center transition-all duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          fadeHeader
            ? "opacity-40 text-neutral-400 translate-y-[-6px]"
            : "opacity-100 text-neutral-800 translate-y-0"
        }`}
      >
        <span className="flex items-center justify-center">
          Мы начали аудит
          <span className="inline-flex w-[1.7ch] justify-start ml-1">
            {fadeHeader && <Dots />}
          </span>
        </span>
      </div>

      <div className="rounded-md p-0">
        {/* 🔹 Факторы */}
        <div className="h-[64px] flex items-center justify-center transition-opacity duration-700 ease-in-out">
          <p
            key={current}
            className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp"
          >
            {factors[current]}
          </p>
          <style jsx>{`
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
          `}</style>
        </div>

        {/* 🔹 Первая зелёная полоса */}
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 transition-all duration-1000 ease-linear"
            style={{ width: `${progressAudit}%` }}
          />
        </div>

        {/* 🔹 Вторая зелёная полоса (отчёты) */}
        <p className="text-center text-sm text-neutral-600 mb-2">
          {reportStage === "audit"
            ? "Аудит 15 ключевых факторов"
            : reportStage === "owner"
            ? "Формируем отчёт для владельца сайта"
            : "Создаём ТЗ для разработчика"}
        </p>
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 transition-all duration-1000 ease-linear"
            style={{ width: `${progressReport}%` }}
          />
        </div>

        {/* 🔹 Третья зелёная полоса (общий таймер) */}
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
          {!finished && (
            <div
              className="absolute left-0 top-0 h-full bg-gray-300 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / totalTime) * 100}%` }}
            />
          )}
          {!finished && (
            <div className="relative z-10 flex items-center justify-center h-full text-neutral-500 text-sm font-medium transition-opacity duration-500">
              {`Полный аудит завершится через ${timeLeft} сек`}
            </div>
          )}
          {finished && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm transition-opacity duration-700">
                Аудит завершён
              </p>
            </div>
          )}
        </div>
      </div>

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
