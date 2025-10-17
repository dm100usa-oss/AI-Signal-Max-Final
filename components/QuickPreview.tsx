"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function QuickPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";

  const factors = [
    "Открыт ли сайт для ИИ",
    "Понимает ли ИИ, о чём ваш сайт",
    "Может ли ИИ читать содержание страниц",
    "Видит ли ИИ заголовки и описания",
    "Понимает ли ИИ структуру сайта",
    "Видит ли ИИ изображения на сайте",
    "Считает ли ИИ ваш сайт безопасным",
    "Учитывает ли ИИ ваш сайт при поиске",
    "Видит ли ИИ ваш сайт среди конкурентов",
    "Как оценивает ИИ ваш сайт",
  ];

  const totalTime = 20;
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [finished, setFinished] = useState(false);
  const [fadeHeader, setFadeHeader] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showResultText, setShowResultText] = useState(false); // 🔹 Новое состояние для надписи "Получить результат"

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 100 / totalTime));
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    const factorTimer = setInterval(() => {
      setCurrent((p) => (p < factors.length - 1 ? p + 1 : p));
    }, (totalTime / factors.length) * 1000);

    setTimeout(() => setFadeHeader(true), 1500);

    // Когда основное время закончилось
    setTimeout(() => {
      setFinished(true);

      // Показ надписи "Проверка завершена"
      setTimeout(() => setShowFinal(true), 1400);

      // Через короткую паузу (~800 мс) появляется надпись "Получить результат"
      setTimeout(() => setShowResultText(true), 2200);

      // 🔹 Автоматический переход на оплату через Stripe (через 4 сек после завершения)
      setTimeout(async () => {
        try {
          const resp = await fetch("/api/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "quick", url }),
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
      }, 4000);
    }, totalTime * 1000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(factorTimer);
    };
  }, [router, url]);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      <p className="text-base text-neutral-400 mt-1 mb-2">
        https://www.magicofdiscoveries.com/english &nbsp; | &nbsp; Date: October 16, 2025
      </p>

      <div
        className={`text-[22px] sm:text-[24px] font-bold text-neutral-800 transition-opacity duration-1000 my-6 ${
          fadeHeader ? "opacity-40" : "opacity-100"
        }`}
      >
        Мы начали проверку
      </div>

      <div className="rounded-md p-0">
        {/* Текущий фактор */}
        <div className="h-[64px] flex items-center justify-center transition-opacity duration-700 ease-in-out">
          <p className="text-lg sm:text-xl font-medium text-neutral-900">
            {factors[current]}
          </p>
        </div>

        {/* Верхняя синяя полоса */}
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
          {/* 🔹 Надпись "Получить результат" появляется после финала */}
          {showResultText && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm transition-opacity duration-700">
                Получить результат
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-neutral-600 mb-4">
          Анализ 10 ключевых факторов
        </p>

        {/* Нижняя полоса (тайминг) */}
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
          {!finished && (
            <div
              className="absolute left-0 top-0 h-full bg-gray-300 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / totalTime) * 100}%` }}
            />
          )}

          {finished && (
            <div
              className={`absolute left-0 top-0 h-full w-full transition-all duration-700 ease-in-out ${
                showFinal
                  ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 opacity-100"
                  : "bg-gray-200 opacity-0"
              }`}
            />
          )}

          {/* Надпись с обратным отсчётом */}
          {!finished && (
            <div className="relative z-10 flex items-center justify-center h-full text-neutral-500 text-sm font-medium transition-opacity duration-500">
              {timeLeft > 0 ? `Проверка завершится через ${timeLeft} сек` : ""}
            </div>
          )}

          {/* Надпись "Проверка завершена" */}
          {finished && showFinal && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm transition-opacity duration-700">
                Проверка завершена
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
