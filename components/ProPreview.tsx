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

  const totalTime = 50; // полное время цикла (верхняя + нижняя + финал)
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [progressTop, setProgressTop] = useState(0);
  const [progressBottom, setProgressBottom] = useState(0);
  const [showTopFinal, setShowTopFinal] = useState(false);
  const [showBottomFinal, setShowBottomFinal] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [fadeHeader, setFadeHeader] = useState(false);

  const topFactors = factors.filter((_, i) => i % 2 === 0);
  const bottomFactors = factors.filter((_, i) => i % 2 === 1);

  useEffect(() => {
    setTimeout(() => setFadeHeader(true), 1500);

    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    // Верхняя полоса
    topFactors.forEach((_, i) => {
      setTimeout(() => {
        setTopIndex(i);
        setProgressTop(0);
        const interval = setInterval(() => {
          setProgressTop((p) => {
            if (p >= 100) {
              clearInterval(interval);
              return 100;
            }
            return p + 4;
          });
        }, 120);
      }, i * 3000);
    });

    // Нижняя полоса (задержка 2 секунды)
    bottomFactors.forEach((_, i) => {
      setTimeout(() => {
        setBottomIndex(i);
        setProgressBottom(0);
        const interval = setInterval(() => {
          setProgressBottom((p) => {
            if (p >= 100) {
              clearInterval(interval);
              return 100;
            }
            return p + 4;
          });
        }, 120);
      }, 2000 + i * 3000);
    });

    // Финальные надписи
    setTimeout(() => setShowTopFinal(true), topFactors.length * 3000 + 1000);
    setTimeout(
      () => setShowBottomFinal(true),
      topFactors.length * 3000 + bottomFactors.length * 3000 + 2000
    );
    setTimeout(
      () => setShowFinalResult(true),
      topFactors.length * 3000 + bottomFactors.length * 3000 + 5000
    );

    // Переход на оплату
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
      } catch {
        router.push("/pay");
      }
    }, totalTime * 1000);

    return () => clearInterval(timer);
  }, [router, url]);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      <p className="text-base text-neutral-400 mt-1 mb-2">
        {url || "https://example.com"} &nbsp; | &nbsp; Date:{" "}
        {new Date().toLocaleDateString("en-US")}
      </p>

      <div
        className={`text-[22px] sm:text-[24px] font-bold my-6 flex items-center justify-center transition-all duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          fadeHeader
            ? "opacity-40 text-neutral-400 translate-y-[-6px]"
            : "opacity-100 text-neutral-800 translate-y-0"
        }`}
      >
        <span className="flex items-center justify-center">
          Мы начали аудит
          {fadeHeader && <Dots />}
        </span>
      </div>

      {/* Верхняя строка */}
      <div className="h-[60px] flex flex-col items-center justify-center transition-all duration-700 mb-4">
        <p key={topIndex} className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp">
          {topFactors[topIndex]}
        </p>
        <div className="relative w-full h-10 rounded-md overflow-hidden bg-gray-200 mt-2">
          <div
            className="h-full bg-gray-300 transition-all duration-500 ease-linear"
            style={{ width: `${progressTop}%` }}
          />
        </div>
      </div>

      {/* Нижняя строка */}
      <div className="h-[60px] flex flex-col items-center justify-center transition-all duration-700 mb-6">
        <p key={bottomIndex} className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp">
          {bottomFactors[bottomIndex]}
        </p>
        <div className="relative w-full h-10 rounded-md overflow-hidden bg-gray-200 mt-2">
          <div
            className="h-full bg-gray-300 transition-all duration-500 ease-linear"
            style={{ width: `${progressBottom}%` }}
          />
        </div>
      </div>

      {/* Финальные зеленые полосы */}
      <div className="relative w-full h-10 rounded-md overflow-hidden bg-gray-200 mb-2">
        {showTopFinal && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-semibold animate-fadeIn">
            Аудит завершён
          </div>
        )}
      </div>

      <div className="relative w-full h-10 rounded-md overflow-hidden bg-gray-200 mb-2">
        {showBottomFinal && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-semibold animate-fadeIn">
            Отчёты подготовлены
          </div>
        )}
      </div>

      <div className="relative w-full h-10 rounded-md overflow-hidden bg-gray-200 mb-2">
        {showFinalResult && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-semibold animate-fadeIn">
            Получить результат
          </div>
        )}
      </div>

      <p className="text-center text-sm text-neutral-600 mb-4">
        Аудит по 15 ключевым факторам
      </p>

      <div className="relative w-full h-10 rounded-md overflow-hidden bg-gray-200">
        <div
          className="absolute left-0 top-0 h-full bg-gray-300 transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / totalTime) * 100}%` }}
        />
        <div className="relative z-10 flex items-center justify-center h-full text-neutral-500 text-sm font-medium transition-opacity duration-500">
          {timeLeft > 0 ? `Полный аудит завершится через ${timeLeft} сек` : ""}
        </div>
      </div>

      <footer className="mt-20 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data. Not legal advice.
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease forwards;
        }
      `}</style>
    </main>
  );
}
