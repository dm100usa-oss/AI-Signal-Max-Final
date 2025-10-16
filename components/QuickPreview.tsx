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
  const [url, setUrl] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // Извлекаем URL из строки запроса
    const params = new URLSearchParams(window.location.search);
    const site = params.get("url") || "";
    setUrl(site);

    // Форматируем текущую дату
    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setDate(formatted);

    // Таймеры
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 100 / totalTime));
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const factorTimer = setInterval(() => {
      setCurrent((prev) => (prev < factors.length - 1 ? prev + 1 : prev));
    }, (totalTime / factors.length) * 1000);

    const finishTimer = setTimeout(() => setFinished(true), totalTime * 1000);
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

      {/* Основное описание */}
      <p className="text-center text-neutral-600 mb-2 leading-relaxed">
        Проверяем видимость вашего сайта для ChatGPT, Copilot, Gemini и других ИИ-платформ
      </p>

      {/* URL и дата */}
      {(url || date) && (
        <p className="text-sm text-neutral-400 text-center mb-8">
          Website: {url || "—"} &nbsp; | &nbsp; Date: {date}
        </p>
      )}

      <div className="rounded-md border border-neutral-200 bg-white p-0 px-4">
        {/* Текущий фактор */}
        <div
          key={current}
          className="text-base font-medium text-neutral-900 transition-opacity duration-700 ease-in mb-4 mt-6"
        >
          {factors[current]}
        </div>

        {/* Верхняя полоса — замена кнопки Quick Check */}
        <div className="w-full h-[52px] rounded-md overflow-hidden bg-gray-200 mb-5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Подпись под синей полосой */}
        <p className="text-sm text-neutral-600 text-center mt-2 mb-4">
          Instant results, 5-point basic check, simple recommendations
        </p>

        {/* Нижняя полоса — замена кнопки Full Check */}
        <div className="w-full h-[52px] rounded-md bg-gray-200 flex items-center justify-center text-neutral-500 text-sm font-medium">
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
