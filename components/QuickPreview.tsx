"use client";

import { useEffect, useState } from "react";

export default function QuickPreview() {
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
    "Формируем финальные результаты",
  ];

  const totalTime = 20;
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [finished, setFinished] = useState(false);

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 100 / totalTime));
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const factorTimer = setInterval(() => {
      setCurrent((prev) => (prev < factors.length - 1 ? prev + 1 : prev));
    }, (totalTime / factors.length) * 1000);

    const finishTimer = setTimeout(() => {
      setFinished(true);
    }, totalTime * 1000);

    const redirectTimer = setTimeout(() => {
      window.location.href = "/pay";
    }, totalTime * 1000 + 2500);

    return () => {
      clearInterval(timer);
      clearInterval(factorTimer);
      clearTimeout(finishTimer);
      clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-24 pb-20 text-center bg-gray-50 font-sans text-neutral-800">
      {/* Заголовок */}
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-1 text-neutral-900">
        AI Signal Max
      </h1>

      {/* URL и дата */}
      <p className="text-center text-sm text-neutral-600 mb-8">
        https://example.com &nbsp;|&nbsp; {date}
      </p>

      {/* Блок анализа */}
      <div className="rounded-md border border-neutral-200 bg-white shadow-sm p-10 sm:p-12 min-h-[480px] flex flex-col justify-center">
        <div
          key={current}
          className="text-2xl sm:text-3xl font-medium text-neutral-800 transition-opacity duration-700 ease-in mb-8"
        >
          {factors[current]}
        </div>

        {/* Прогресс-бар */}
        <div className="w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className="h-full bg-gradient-to-r from-gray-200 via-blue-400 to-blue-600 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Таймер / Завершение */}
        <div className="w-full h-16 rounded-md bg-gray-100 flex items-center justify-center text-neutral-500 text-base font-medium">
          {finished
            ? "Проверка завершена"
            : `Проверка завершится через ${timeLeft} сек`}
        </div>
      </div>

      {/* Дисклеймер */}
      <footer className="mt-12 text-center text-xs text-neutral-500">
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
