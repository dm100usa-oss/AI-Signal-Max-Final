"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 🔹 Анимация трёх точек
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
  const url = searchParams.get("url") || "https://example.com";

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

  const totalTime = 35;
  const [currentTop, setCurrentTop] = useState(0);
  const [currentBottom, setCurrentBottom] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [finished, setFinished] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [stage, setStage] = useState(0); // 0 – идёт аудит, 1–3 финальные зелёные полосы

  useEffect(() => {
    // верхний ряд (1,3,5,7,9,11,13,15)
    const topInterval = setInterval(() => {
      setCurrentTop((p) => (p < 7 ? p + 1 : 7));
    }, 3000);

    // нижний ряд (2,4,6,8,10,12,14)
    const bottomTimeout = setTimeout(() => {
      setCurrentBottom(0);
      const bottomInterval = setInterval(() => {
        setCurrentBottom((p) => (p < 6 ? p + 1 : 6));
      }, 3000);
      return () => clearInterval(bottomInterval);
    }, 1000);

    // общий прогресс
    const timer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 100 / totalTime));
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    // завершение
    setTimeout(() => {
      setFinished(true);
      // последовательно показываем три зелёные полосы
      setTimeout(() => setStage(1), 800);
      setTimeout(() => setStage(2), 1800);
      setTimeout(() => setStage(3), 2800);

      // переход к оплате
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
      }, 6000);
    }, totalTime * 1000);

    return () => {
      clearInterval(timer);
      clearInterval(topInterval);
      clearTimeout(bottomTimeout);
    };
  }, [router, url, totalTime]);

  // функция появления с анимацией
  const fadeIn = (visible: boolean) =>
    visible
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-2";

  return (
    <main className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center bg-white">
      {/* Заголовок */}
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>
      <p className="text-base text-neutral-400 mt-1 mb-6">
        {url} &nbsp; | &nbsp; Date: {new Date().toLocaleDateString("en-US")}
      </p>

      {/* Надпись с точками */}
      {!finished && (
        <div className="text-[22px] sm:text-[24px] font-bold mb-10 text-neutral-700 flex items-center justify-center">
          Мы начали аудит
          <span className="ml-1">
            <Dots />
          </span>
        </div>
      )}

      {/* Два ряда факторов */}
      <div className="space-y-4 mb-8">
        {/* Верхний ряд */}
        <div className="flex flex-wrap justify-center gap-3 text-[15px] sm:text-base text-neutral-900">
          {factors
            .filter((_, i) => i % 2 === 0)
            .map((f, i) => (
              <span
                key={i}
                className={`${fadeIn(i <= currentTop)} bg-neutral-100 rounded-full px-3 py-1`}
              >
                {f}
              </span>
            ))}
        </div>

        {/* Верхняя полоса */}
        <div className="relative w-full h-3 rounded-md overflow-hidden bg-gray-200">
          <div
            className="absolute left-0 top-0 h-full bg-gray-400 transition-all duration-1000 ease-linear"
            style={{ width: finished ? "100%" : `${progress}%` }}
          ></div>
        </div>

        {/* Нижний ряд */}
        <div className="flex flex-wrap justify-center gap-3 text-[15px] sm:text-base text-neutral-900">
          {factors
            .filter((_, i) => i % 2 !== 0)
            .map((f, i) => (
              <span
                key={i}
                className={`${fadeIn(i <= currentBottom)} bg-neutral-100 rounded-full px-3 py-1`}
              >
                {f}
              </span>
            ))}
        </div>

        {/* Нижняя полоса */}
        <div className="relative w-full h-3 rounded-md overflow-hidden bg-gray-200">
          <div
            className="absolute left-0 top-0 h-full bg-gray-400 transition-all duration-1000 ease-linear"
            style={{ width: finished ? "100%" : `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Общая подпись и таймер */}
      {!finished && (
        <div className="mb-10">
          <p className="text-sm text-neutral-600 mb-2">
            Аудит по 15 ключевым факторам
          </p>
          <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
            <div
              className="absolute left-0 top-0 h-full bg-gray-300 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / totalTime) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-sm font-medium">
              {`Полный аудит завершится через ${timeLeft} сек`}
            </div>
          </div>
        </div>
      )}

      {/* Финальные зелёные полосы */}
      {finished && (
        <div className="space-y-3 mt-12">
          <div
            className={`h-12 rounded-md flex items-center justify-center font-semibold text-white transition-all duration-700 ${
              stage >= 1
                ? "bg-gradient-to-r from-green-500 via-green-600 to-green-700 opacity-100"
                : "bg-gray-200 opacity-0"
            }`}
          >
            {stage >= 1 && "Аудит завершён"}
          </div>
          <div
            className={`h-12 rounded-md flex items-center justify-center font-semibold text-white transition-all duration-700 ${
              stage >= 2
                ? "bg-gradient-to-r from-green-500 via-green-600 to-green-700 opacity-100"
                : "bg-gray-200 opacity-0"
            }`}
          >
            {stage >= 2 && "Отчёты подготовлены"}
          </div>
          <div
            className={`h-12 rounded-md flex items-center justify-center font-semibold text-white transition-all duration-700 ${
              stage >= 3
                ? "bg-gradient-to-r from-green-500 via-green-600 to-green-700 opacity-100"
                : "bg-gray-200 opacity-0"
            }`}
          >
            {stage >= 3 && "Получить результат"}
          </div>
        </div>
      )}

      {/* Футер */}
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
