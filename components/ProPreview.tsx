"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 🔹 Анимация трёх точек (та же, что на главной и в быстрой проверке)
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

  // 🔹 15 факторов полной проверки
  const factorsTop = [
    "Открыт ли сайт для ИИ",
    "Понимает ли ИИ, о чём ваш сайт",
    "Понятна ли ИИ структура сайта",
    "Видит ли ИИ заголовки и описания",
    "Видит ли ИИ содержание страниц",
    "Видит ли ИИ изображения на сайте",
    "Может ли ИИ переходить по ссылкам сайта",
    "Воспринимает ли ИИ сайт как источник информации",
  ];

  const factorsBottom = [
    "Считает ли ИИ ваш сайт логичным",
    "Считает ли ИИ ваш сайт безопасным",
    "Понимает ли ИИ категорию вашего сайта",
    "Учитывает ли ИИ ваш сайт при поиске",
    "Выделяет ли ИИ ваш сайт среди других",
    "Считает ли ИИ ваш сайт полезным",
    "Как оценивает ИИ ваш сайт",
  ];

  // Тайминги
  const totalTime = 28; // общее время до перехода
  const topInterval = 3000; // 3 сек на фактор
  const bottomInterval = 3000; // 3 сек на фактор
  const bottomDelay = 2000; // нижняя полоса стартует через 2 секунды

  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(-1);
  const [progressTop, setProgressTop] = useState(0);
  const [progressBottom, setProgressBottom] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [finished, setFinished] = useState(false);
  const [fadeHeader, setFadeHeader] = useState(false);

  const [showAuditDone, setShowAuditDone] = useState(false);
  const [showReportsReady, setShowReportsReady] = useState(false);
  const [showGetResult, setShowGetResult] = useState(false);

  // 🔹 Основная логика
  useEffect(() => {
    // Верхняя полоса
    const topTimer = setInterval(() => {
      setTopIndex((p) => (p < factorsTop.length - 1 ? p + 1 : p));
    }, topInterval);

    const progressTopTimer = setInterval(() => {
      setProgressTop((p) => {
        if (p >= 100) return 0;
        return p + 100 / (topInterval / 100);
      });
    }, 30);

    // Нижняя полоса (запуск через задержку)
    const bottomStart = setTimeout(() => {
      setBottomIndex(0);
      const bottomTimer = setInterval(() => {
        setBottomIndex((p) =>
          p < factorsBottom.length - 1 ? p + 1 : p
        );
      }, bottomInterval);

      const progressBottomTimer = setInterval(() => {
        setProgressBottom((p) => {
          if (p >= 100) return 0;
          return p + 100 / (bottomInterval / 100);
        });
      }, 30);

      // Очистка нижних таймеров
      setTimeout(() => {
        clearInterval(bottomTimer);
        clearInterval(progressBottomTimer);
      }, 24000); // нижняя заканчивает к 24 сек
    }, bottomDelay);

    // Таймер обратного отсчёта
    const timeTimer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    // Плавное затемнение заголовка
    setTimeout(() => setFadeHeader(true), 1500);

    // Финальные зелёные полосы и переход
    setTimeout(() => setShowAuditDone(true), 24000); // "Аудит завершён"
    setTimeout(() => setShowReportsReady(true), 25000); // "Отчёты подготовлены"
    setTimeout(() => setShowGetResult(true), 26000); // "Получить результат"
    setTimeout(() => setFinished(true), 27000); // финализация
    setTimeout(async () => {
      try {
        const resp = await fetch("/api/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "pro", url }),
        });
        const json = await resp.json();
        if (json?.url) {
          router.push(json.url);
        } else {
          router.push("/pay");
        }
      } catch (err) {
        console.error("Payment redirect failed:", err);
        router.push("/pay");
      }
    }, 28000); // переход к оплате через 28 сек

    // Очистка
    return () => {
      clearInterval(topTimer);
      clearInterval(progressTopTimer);
      clearInterval(timeTimer);
      clearTimeout(bottomStart);
    };
  }, [router, url]);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      {/* Заголовок */}
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      <p className="text-base text-neutral-400 mt-1 mb-2">
        {url || "https://example.com"} &nbsp; | &nbsp; Date:{" "}
        {new Date().toLocaleDateString("en-US")}
      </p>

      {/* Надпись "Мы начали аудит..." */}
      <div
        className={`text-[22px] sm:text-[24px] font-bold my-6 flex items-center justify-center transition-all duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          fadeHeader
            ? "opacity-40 text-neutral-400 translate-y-[-6px]"
            : "opacity-100 text-neutral-800 translate-y-0"
        }`}
      >
        <span className="flex items-center justify-center">
          Мы начали аудит
          <span className="inline-flex w-[1.7ch] justify-start tabular-nums align-middle ml-1">
            {fadeHeader && <Dots />}
          </span>
        </span>
      </div>

      {/* Верхняя полоса (нечётные факторы) */}
      <div className="rounded-md p-0">
        <div className="h-[64px] flex items-center justify-center transition-opacity duration-700 ease-in-out">
          <p
            key={topIndex}
            className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp"
          >
            {factorsTop[topIndex]}
          </p>
        </div>

        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className="absolute left-0 top-0 h-full bg-gray-300 transition-all ease-linear"
            style={{ width: `${progressTop}%` }}
          />
          {showAuditDone && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn">
                Аудит завершён
              </p>
            </div>
          )}
        </div>

        {/* Нижняя полоса (чётные факторы) */}
        <div className="h-[64px] flex items-center justify-center transition-opacity duration-700 ease-in-out">
          <p
            key={bottomIndex}
            className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp"
          >
            {bottomIndex >= 0 ? factorsBottom[bottomIndex] : ""}
          </p>
        </div>

        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className="absolute left-0 top-0 h-full bg-gray-300 transition-all ease-linear"
            style={{ width: `${progressBottom}%` }}
          />
          {showReportsReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn">
                Отчёты подготовлены
              </p>
            </div>
          )}
        </div>

        {/* Надпись под полосами */}
        <p className="text-center text-sm text-neutral-600 mb-4">
          Аудит по 15 ключевым факторам
        </p>

        {/* Нижняя полоса тайминга */}
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
          {!finished && (
            <div
              className="absolute left-0 top-0 h-full bg-gray-300 transition-all ease-linear"
              style={{ width: `${(timeLeft / totalTime) * 100}%` }}
            />
          )}

          {(finished || showGetResult) && (
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 opacity-100" />
          )}

          <div className="absolute inset-0 flex items-center justify-center z-10">
            {timeLeft > 0 && !finished && (
              <p className="text-sm font-medium text-neutral-500">
                Полный аудит завершится через {timeLeft} сек
              </p>
            )}
            {showGetResult && (
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn">
                Получить результат
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Футер */}
      <footer className="mt-20 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data.
          Not legal advice.
        </span>
      </footer>

      {/* 🔹 Анимации */}
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
    </main>
  );
}
