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
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      <p className="text-center text-neutral-600 mb-8 leading-relaxed">
        Проверяем видимость вашего сайта для ChatGPT, Copilot, Gemini и других ИИ-платформ
      </p>

      <div className="rounded-md border border-neutral-200 bg-white shadow-sm p-6">
        <div
          key={current}
          className="text-base font-medium text-neutral-900 transition-opacity duration-700 ease-in mb-6"
        >
          {factors[current]}
        </div>

        {/* Верхняя полоса — замена кнопки Quick Check */}
        <div className="w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-3">
          <div
            className="h-full bg-gradient-to-r from-gray-200 via-blue-500 to-blue-600 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Нижняя полоса — замена кнопки Full Check */}
        <div className="w-full h-12 rounded-md bg-gray-100 flex items-center justify-center text-neutral-500 text-sm font-medium">
          {finished
            ? "Проверка завершена"
            : `Проверка завершится через ${timeLeft} сек`}
        </div>
      </div>

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
