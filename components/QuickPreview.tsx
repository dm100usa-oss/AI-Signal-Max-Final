"use client";

import { useEffect, useState } from "react";

export default function QuickPreview() {
  // 10 утверждённых факторов
  const factors = [
    "Открыт ли сайт для ИИ",
    "Понимает ли ИИ, о чём ваш сайт",
    "Может ли ИИ читать содержание страниц",
    "Видит ли ИИ заголовки и описания",
    "Понимает ли ИИ структуру сайта",
    "Видит ли ИИ изображения на сайте",
    "Считает ли ИИ ваш сайт безопасным и заслуживающим доверия",
    "Учитывает ли ИИ ваш сайт при поиске",
    "Видит ли ИИ ваш сайт среди конкурентов",
    "Формируем финальные результаты",
  ];

  const totalTime = 20; // общее время в секундах
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 100 / totalTime;
      });
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const factorTimer = setInterval(() => {
      setCurrent((prev) => (prev < factors.length - 1 ? prev + 1 : prev));
    }, (totalTime / factors.length) * 1000);

    const redirectTimer = setTimeout(() => {
      window.location.href = "/pay";
    }, totalTime * 1000 + 500);

    return () => {
      clearInterval(timer);
      clearInterval(factorTimer);
      clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center">
      {/* Пара 1: AI Signal Max */}
      <h1 className="text-4xl font-semibold tracking-tight mb-2">
        AI Signal Max
      </h1>

      {/* Пара 2: Быстрая проверка сайта */}
      <p className="text-neutral-600 font-semibold mb-8">
        Быстрая проверка сайта
      </p>

      {/* Пара 3: Факторы (на месте поля ввода) */}
      <div className="border rounded-md px-4 py-3 mb-4 bg-white text-neutral-800 text-base font-medium shadow-sm">
        {factors[current]}
      </div>

      {/* Пара 4: Синяя полоса на месте кнопки */}
      <div className="w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-3">
        <div
          className="h-full bg-gradient-to-r from-gray-300 via-blue-400 to-blue-600 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Пара 5: Светло-серая полоса на месте зелёной кнопки */}
      <div className="w-full h-12 rounded-md bg-gray-100 flex items-center justify-center text-neutral-500 text-sm font-medium">
        Проверка завершится через {timeLeft} сек
      </div>

      {/* Пара 6: Дисклеймер */}
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
