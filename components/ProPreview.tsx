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

  // 🔹 Все 15 факторов
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

  // 🔹 Нечётные и чётные факторы
  const topFactors = factors.filter((_, i) => i % 2 === 0);
  const bottomFactors = factors.filter((_, i) => i % 2 === 1);

  const totalTime = 35;
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [finished, setFinished] = useState(false);
  const [fadeHeader, setFadeHeader] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 100 / totalTime));
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    const factorTimer = setInterval(() => {
      setCurrent((p) => (p < topFactors.length - 1 ? p + 1 : p));
    }, 2500);

    setTimeout(() => setFadeHeader(true), 1500);

    setTimeout(() => {
      setFinished(true);
      setTimeout(() => setShowFinal(true), 1200);

      // 🔹 Переход на оплату (mode: "pro")
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
    }, totalTime * 1000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(factorTimer);
    };
  }, [router, url, totalTime, topFactors.length]);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      {/* 🔹 Заголовок */}
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      {/* 🔹 Адрес и дата */}
      <p className="text-base text-neutral-400 mt-1 mb-2">
        {url || "https://example.com"} &nbsp; | &nbsp; Date:{" "}
        {new Date().toLocaleDateString("en-US")}
      </p>

      {/* 🔹 Основная надпись */}
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

      {/* 🔹 Основные полосы проверки */}
      <div className="rounded-md p-0">
        {/* Верхний ряд факторов (нечётные) */}
        <div className="h-[64px] flex items-center justify-center transition-opacity duration-700 ease-in-out">
          <p
            key={`top-${current}`}
            className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp"
          >
            {topFactors[current]}
          </p>
        </div>

        {/* Верхняя полоса */}
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className="h-full bg-gray-300 transition-all duration-[2500ms] ease-linear"
            style={{ width: finished ? "100%" : `${(progress / 100) * 100}%` }}
          />
        </div>

        {/* Нижний ряд факторов (чётные) */}
        <div className="h-[64px] flex items-center justify-center transition-opacity duration-700 ease-in-out">
          <p
            key={`bottom-${current}`}
            className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp"
          >
            {bottomFactors[current] || ""}
          </p>
        </div>

        {/* Нижняя полоса */}
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className="h-full bg-gray-300 transition-all duration-[2500ms] ease-linear"
            style={{ width: finished ? "100%" : `${(progress / 100) * 100}%` }}
          />
        </div>

        {/* Строка под полосами */}
        <p className="text-center text-sm text-neutral-600 mb-4">
          Аудит по 15 ключевым факторам
        </p>

        {/* Нижняя полоса тайминга */}
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
          {!finished && (
            <div
              className="absolute left-0 top-0 h-full bg-gray-300 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / totalTime) * 100}%` }}
            />
          )}

          {!finished && (
            <div className="relative z-10 flex items-center justify-center h-full text-neutral-500 text-sm font-medium transition-opacity duration-500">
              {timeLeft > 0 ? `Полный аудит завершится через ${timeLeft} сек` : ""}
            </div>
          )}

          {finished && showFinal && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm transition-opacity duration-700 bg-gradient-to-r from-green-500 via-green-600 to-green-700 w-full h-full flex items-center justify-center rounded-md">
                Аудит завершён
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Футер */}
      <footer className="mt-20 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data.
          Not legal advice.
        </span>
      </footer>

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
    </main>
  );
}
