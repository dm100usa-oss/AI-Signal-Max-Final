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
    "Как оценивает ИИ ваш сайт",
  ];

  const totalTime = 20;
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [finished, setFinished] = useState(false);
  const [fadeHeader, setFadeHeader] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [grayFill, setGrayFill] = useState(0);

  useEffect(() => {
    // Верхняя полоса — движение
    const progressTimer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 100 / totalTime));
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    // Последовательность факторов
    const factorTimer = setInterval(() => {
      setCurrent((p) => (p < factors.length - 1 ? p + 1 : p));
    }, (totalTime / factors.length) * 1000);

    // Исчезновение заголовка
    setTimeout(() => setFadeHeader(true), 1500);

    // Завершение проверки
    setTimeout(() => {
      setFinished(true);
      setTimeout(() => setGrayFill(100), 500); // плавное заполнение нижней серой полосы
      setTimeout(() => setShowFinal(true), 1400); // финальная надпись
      setTimeout(() => (window.location.href = "/pay"), 4000); // переход к оплате
    }, totalTime * 1000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(factorTimer);
    };
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      {/* Верхняя строка — описание проверки */}
      <div
        className={`text-[20px] sm:text-[22px] font-bold text-neutral-800 transition-opacity duration-1000 ${
          fadeHeader ? "opacity-40" : "opacity-100"
        }`}
      >
        Мы начали проверку
      </div>

      <p className="text-sm text-neutral-400 mt-1 mb-8">
        https://www.magicofdiscoveries.com/english &nbsp; | &nbsp; Date: October 16, 2025
      </p>

      <div className="rounded-md border border-neutral-200 p-0">
        {/* Текущий фактор */}
        <div
          className="h-[64px] flex items-center justify-center mb-4 transition-opacity duration-700 ease-in-out"
        >
          <p className="text-lg sm:text-xl font-medium text-neutral-900">
            {factors[current]}
          </p>
        </div>

        {/* Верхняя полоса — синяя */}
        <div className="w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Текст под синей полосой */}
        <p className="text-center text-sm text-neutral-600 mb-4">
          Быстрый результат, 5 факторов проверки, простые рекомендации
        </p>

        {/* Нижняя лента — динамическая */}
        <div className="relative w-full h-12 rounded-md overflow-hidden">
          {/* Серое движение */}
          {!finished && (
            <div
              className="absolute left-0 top-0 h-full bg-gray-300 transition-all duration-1000 ease-linear"
              style={{ width: `${grayFill}%` }}
            />
          )}

          {/* Синее заполнение и финальная надпись */}
          {finished && (
            <div
              className={`absolute left-0 top-0 h-full w-full transition-all duration-700 ease-in-out ${
                showFinal
                  ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 opacity-100"
                  : "bg-gray-200 opacity-0"
              }`}
            />
          )}

          {/* Надпись во время проверки */}
          {!finished && (
            <div className="relative z-10 flex items-center justify-center h-full text-neutral-500 text-sm font-medium transition-opacity duration-500">
              {timeLeft > 0
                ? `Проверка завершится через ${timeLeft} сек`
                : ""}
            </div>
          )}

          {/* Финальная надпись */}
          {finished && showFinal && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm transition-opacity duration-700">
                Проверка завершена
              </p>
            </div>
          )}
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
