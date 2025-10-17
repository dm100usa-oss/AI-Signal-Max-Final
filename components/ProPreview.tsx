"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

export default function ProPreview() {
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

  const [currentTop, setCurrentTop] = useState(0);
  const [currentBottom, setCurrentBottom] = useState(1);
  const [progressTop, setProgressTop] = useState(0);
  const [progressBottom, setProgressBottom] = useState(0);
  const [finished, setFinished] = useState(false);
  const [stage, setStage] = useState(0); // 0 — факторы, 1 — формируем отчет, 2 — финальные кнопки
  const [fadeHeader, setFadeHeader] = useState(false);

  // Цвета реальных факторов по результатам проверки
  const factorColors: Record<string, string> = {
    Good: "from-green-500 via-green-600 to-green-700",
    Moderate: "from-yellow-400 via-yellow-500 to-yellow-600",
    Poor: "from-red-500 via-red-600 to-red-700",
  };

  // Здесь можно заменить на реальные статусы факторов (Good/Moderate/Poor)
  const factorStatuses = [
    "Good", "Moderate", "Good", "Poor", "Moderate",
    "Good", "Good", "Moderate", "Good", "Poor",
    "Good", "Moderate", "Good", "Good", "Moderate"
  ];

  useEffect(() => {
    setTimeout(() => setFadeHeader(true), 1500);
  }, []);

  useEffect(() => {
    if (finished) return;

    let indexTop = 0;
    let indexBottom = 1;

    const topTimer = setInterval(() => {
      setProgressTop(0);
      setCurrentTop(indexTop);
      indexTop += 2;
      if (indexTop >= factors.length) {
        clearInterval(topTimer);
      }
    }, 4000);

    const bottomTimer = setTimeout(() => {
      const btmInt = setInterval(() => {
        setProgressBottom(0);
        setCurrentBottom(indexBottom);
        indexBottom += 2;
        if (indexBottom >= factors.length) {
          clearInterval(btmInt);
        }
      }, 4000);
    }, 1000);

    const progressUpdater = setInterval(() => {
      setProgressTop((p) => (p < 100 ? p + 100 / 40 : 100));
      setProgressBottom((p) => (p < 100 ? p + 100 / 40 : 100));
    }, 100);

    setTimeout(() => {
      clearInterval(topTimer);
      clearInterval(bottomTimer);
      clearInterval(progressUpdater);
      setStage(1);
    }, 35000);

    return () => {
      clearInterval(topTimer);
      clearInterval(bottomTimer);
      clearInterval(progressUpdater);
    };
  }, [finished, factors.length]);

  const getBarColor = (index: number, progress: number) => {
    if (progress < 33) return "bg-gray-300";
    const status = factorStatuses[index];
    return `bg-gradient-to-r ${factorColors[status]}`;
  };
  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      <p className="text-base text-neutral-400 mt-1 mb-2">
        {url || "https://example.com"} &nbsp; | &nbsp; Date:{" "}
        {new Date().toLocaleDateString("en-US")}
      </p>

      {/* Заголовок с анимацией */}
      <div
        className={`text-[22px] sm:text-[24px] font-bold my-6 flex items-center justify-center transition-all duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          fadeHeader
            ? "opacity-40 text-neutral-400 translate-y-[-6px]"
            : "opacity-100 text-neutral-800 translate-y-0"
        }`}
      >
        <span className="flex items-center justify-center">
          Мы выполняем аудит
          <span className="inline-flex w-[1.7ch] justify-start tabular-nums align-middle ml-1">
            {fadeHeader && <Dots />}
          </span>
        </span>
      </div>

      {/* Основная зона — две полосы */}
      {stage === 0 && (
        <div className="space-y-4 mb-6">
          {/* Верхняя строка */}
          <div className="flex flex-col items-center">
            <p
              key={currentTop}
              className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp mb-1"
            >
              {factors[currentTop]}
            </p>
            <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
              <div
                className={`h-full transition-all duration-700 ease-linear ${getBarColor(
                  currentTop,
                  progressTop
                )}`}
                style={{ width: `${progressTop}%` }}
              />
            </div>
          </div>

          {/* Нижняя строка */}
          <div className="flex flex-col items-center">
            <p
              key={currentBottom}
              className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp mb-1"
            >
              {factors[currentBottom]}
            </p>
            <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
              <div
                className={`h-full transition-all duration-700 ease-linear ${getBarColor(
                  currentBottom,
                  progressBottom
                )}`}
                style={{ width: `${progressBottom}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Формирование отчета */}
      {stage === 1 && (
        <div className="mt-10 space-y-4">
          <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg sm:text-xl font-semibold text-neutral-600 animate-fadeIn">
                Формируем итоговый отчёт...
              </p>
            </div>
          </div>
          <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg sm:text-xl font-semibold text-blue-600 animate-fadeIn">
                Отчёт готов. Подготавливаем отправку...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Финальные три зелёные полосы */}
      {stage === 2 && (
        <div className="mt-10 space-y-3">
          {["Отчёты подготовлены", "Аудит завершён", "Получить результат"].map(
            (text, i) => (
              <div
                key={i}
                className={`relative w-full h-12 rounded-md overflow-hidden bg-green-600 transition-all duration-700 ease-in-out flex items-center justify-center`}
                style={{
                  animation: `fadeInRow 0.6s ease forwards`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm">
                  {text}
                </p>
              </div>
            )
          )}
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
            @keyframes fadeInRow {
              from {
                opacity: 0;
                transform: scale(0.98);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-fadeInUp {
              animation: fadeInUp 0.8s ease forwards;
            }
            .animate-fadeIn {
              animation: fadeInUp 1s ease forwards;
            }
          `}</style>
        </div>
      )}

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

  // После завершения этапа 1 — показываем зелёные кнопки и переходим к оплате
  useEffect(() => {
    if (stage === 1) {
      const timer = setTimeout(() => {
        setStage(2);
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
          } catch (err) {
            console.error("Payment redirect failed:", err);
            router.push("/pay");
          }
        }, 4000);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [stage, router, url]);
}
