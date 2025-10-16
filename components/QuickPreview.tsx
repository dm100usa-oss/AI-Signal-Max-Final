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
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const site = params.get("url") || "";
    setUrl(site);

    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setDate(formatted);

    // Основной таймер
    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 100 / totalTime));
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Смена факторов с плавным проявлением
    const factorTimer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev < factors.length - 1 ? prev + 1 : prev));
        setFade(true);
      }, 250);
    }, (totalTime / factors.length) * 1000);

    // Завершение
    const finishTimer = setTimeout(() => setFinished(true), totalTime * 1000 + 600);
    const redirectTimer = setTimeout(() => (window.location.href = "/pay"), totalTime * 1000 + 2500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(factorTimer);
      clearTimeout(finishTimer);
      clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      <h1 className="text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      <p className="text-neutral-600 mb-2 leading-relaxed">
        Проверяем видимость вашего сайта для ChatGPT, Copilot, Gemini и других ИИ-платформ
      </p>

      {(url || date) && (
        <p className="text-sm text-neutral-400 text-center mb-8">
          Website: {url || "—"} &nbsp; | &nbsp; Date: {date}
        </p>
      )}

      <div className="rounded-md border border-neutral-200 bg-white px-3 py-2">
        {/* Текущий фактор — фиксированная высота и плавное проявление */}
        <div
          key={current}
          className={`h-[64px] sm:h-[68px] flex items-center justify-center rounded-md bg-neutral-50/50 text-[20px] sm:text-[22px] font-bold text-neutral-900 mb-4 mt-4 transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {factors[current]}
        </div>

        {/* Верхняя полоса */}
        <div className="w-full h-[52px] rounded-md overflow-hidden bg-gray-200 mb-5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-[1200ms] ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-neutral-600 text-center mt-2 mb-6">
          Instant results, 5-point basic check, simple recommendations
        </p>

        {/* Нижняя полоса с плавным движением */}
        <div className="w-full h-[52px] rounded-md bg-gray-200 relative overflow-hidden flex items-center justify-center text-sm font-medium">
          {!finished && (
            <div
              className="absolute left-0 top-0 h-full bg-gray-300 transition-all duration-[1800ms] ease-linear"
              style={{ width: `${(timeLeft / totalTime) * 100}%` }}
            />
          )}

          {finished ? (
            <span className="text-[17px] text-neutral-700 font-semibold transition-opacity duration-700 opacity-100 relative z-10">
              Проверка завершена
            </span>
          ) : (
            <span className="text-neutral-500 relative z-10">
              Проверка завершится через {timeLeft} сек
            </span>
          )}
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data. Not legal advice.
        </span>
      </footer>
    </main>
  );
}
