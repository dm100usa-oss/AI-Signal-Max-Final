"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Анимация трёх точек
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

export default function FullPreview() {
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

  const auditTime = 30; // Первая полоса
  const reportTime = 14; // Вторая полоса
  const finalDelay = (auditTime + reportTime) * 1000; // Финал после второй
  const totalTime = auditTime + reportTime + 4; // Общий тайминг

  const [current, setCurrent] = useState(0);
  const [progressAudit, setProgressAudit] = useState(0);
  const [progressReport, setProgressReport] = useState(0);
  const [fadeHeader, setFadeHeader] = useState(false);
  const [auditDone, setAuditDone] = useState(false);
  const [reportsDone, setReportsDone] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finalGreen, setFinalGreen] = useState(false);
  const [stageText, setStageText] = useState<"audit" | "owner" | "dev" | "done">("audit");

  useEffect(() => {
    // 🔹 Факторы появляются постепенно
    const factorTimer = setInterval(() => {
      setCurrent((p) => (p < factors.length - 1 ? p + 1 : p));
    }, (auditTime / factors.length) * 1000);

    // 🔹 Первая полоса — аудит
    const auditProgressTimer = setInterval(() => {
      setProgressAudit((p) => {
        const next = p + 100 / auditTime;
        if (next >= 100) {
          clearInterval(auditProgressTimer);
          setAuditDone(true);
          setStageText("owner");
        }
        return Math.min(next, 100);
      });
    }, 1000);

    // 🔹 Вторая полоса — отчёты
    setTimeout(() => {
      const reportProgressTimer = setInterval(() => {
        setProgressReport((p) => {
          const next = p + 100 / reportTime;
          if (next >= 100) {
            clearInterval(reportProgressTimer);
            setReportsDone(true);
            setStageText("done");
          } else if (next >= 50 && stageText !== "dev") {
            setStageText("dev");
          }
          return Math.min(next, 100);
        });
      }, 1000);
    }, auditTime * 1000);

    // 🔹 Третья полоса — плавное появление зелёного цвета в конце
    setTimeout(() => {
      setFinalGreen(true);
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
    }, finalDelay);

    // 🔹 Плавное затухание заголовка
    setTimeout(() => setFadeHeader(true), 1500);

    return () => {
      clearInterval(factorTimer);
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

      {/* Заголовок */}
      <div
        className={`text-[22px] sm:text-[24px] font-bold my-6 flex items-center justify-center transition-all duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          fadeHeader
            ? "opacity-40 text-neutral-400 translate-y-[-6px]"
            : "opacity-100 text-neutral-800 translate-y-0"
        }`}
      >
        <span className="flex items-center justify-center">
          Мы начали полный аудит
          <span className="inline-flex w-[1.7ch] justify-start ml-1">
            {fadeHeader && <Dots />}
          </span>
        </span>
      </div>

      {/* Факторы */}
      <div className="h-[64px] flex items-center justify-center mb-4 transition-opacity duration-700 ease-in-out">
        <p
          key={current}
          className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp"
        >
          {factors[current]}
        </p>
      </div>

      {/* 1️⃣ Первая полоса */}
      <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
        <div
          className="h-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 transition-[width] duration-1000 ease-linear"
          style={{ width: `${progressAudit}%` }}
        />
        {auditDone && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn">
              Аудит завершён
            </p>
          </div>
        )}
      </div>

      {/* Надписи между 1 и 2 полосой */}
      {stageText !== "done" && (
        <p
          key={stageText}
          className="text-base sm:text-lg font-medium text-neutral-800 mb-4 animate-fadeInUp"
        >
          {stageText === "audit"
            ? "Аудит 15 ключевых факторов"
            : stageText === "owner"
            ? "Формируем отчёт для владельца сайта"
            : "Создаём ТЗ для разработчика"}
        </p>
      )}

      {/* 2️⃣ Вторая полоса */}
      <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
        <div
          className="h-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 transition-[width] duration-1000 ease-linear"
          style={{ width: `${progressReport}%` }}
        />
        {reportsDone && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn">
              Отчёты подготовлены
            </p>
          </div>
        )}
      </div>

      {/* Разделитель между 2 и 3 полосой */}
      <div className="mb-4 h-[28px]" />

      {/* 3️⃣ Третья полоса */}
      <div
        className={`relative w-full h-12 rounded-md overflow-hidden transition-colors duration-1000 ease-in-out ${
          finalGreen ? "bg-gradient-to-r from-green-500 via-green-600 to-green-700" : "bg-gray-200"
        }`}
      >
        {finished && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn">
              Получить результат
            </p>
          </div>
        )}
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
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
