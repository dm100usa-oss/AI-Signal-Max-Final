"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Анимация точек
function Dots({ className = "text-neutral-400" }: { className?: string }) {
  return (
    <span className={`inline-flex justify-start tabular-nums align-middle ${className}`}>
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

export default function QuickPreview() {
  const router = useRouter();
  const params = useSearchParams();

  const siteUrl = params.get("url") || "";

  // Основные шаги
  const steps = [
    "Открыт ли сайт для ИИ",
    "Понимает ли ИИ, о чём ваш сайт",
    "Может ли ИИ читать содержание страниц",
    "Видит ли ИИ заголовки и описания",
    "Понимает ли ИИ структуру сайта",
    "Видит ли ИИ изображения на сайте",
    "Считает ли ИИ ваш сайт безопасным и заслуживающим доверия",
    "Учитывает ли ИИ ваш сайт при поиске",
    "Видит ли ИИ ваш сайт среди конкурентов",
    "Как оценивает ИИ ваш сайт"
  ];

  // Длительности шагов (как в v3)
  const durations = [1000, 1400, 1000, 800, 1000, 800, 1400, 1300, 1600, 1500];
  const totalTime = durations.reduce((a, b) => a + b, 0) / 1000 + 3;

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [showFinal, setShowFinal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Math.ceil(totalTime));

  // Обратный отсчёт
  useEffect(() => {
    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timeLeft]);

  // Анимация прогресса по шагам
  useEffect(() => {
    if (index >= steps.length) {
      setTimeout(() => setShowFinal(true), 350);
      return;
    }

    setVisible(true);
    setProgress(0);
    const duration = durations[index];
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct * 100);

      if (pct < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => setIndex((i) => i + 1), 250);
        }, 180);
      }
    };

    requestAnimationFrame(animate);
  }, [index]);

  // Переход после завершения
  useEffect(() => {
    if (showFinal && siteUrl) {
      const t = setTimeout(() => {
        router.push(`/pay?url=${encodeURIComponent(siteUrl)}&mode=quick`);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [showFinal, router, siteUrl]);

  // Текущая дата
  const date = new Date().toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 bg-white min-h-screen flex flex-col items-center text-center">
      <h1 className="text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      {siteUrl && (
        <p className="text-sm text-neutral-500 mb-6">
          {siteUrl} • {date}
        </p>
      )}

      {!showFinal ? (
        <div className="w-full bg-white border border-neutral-200 shadow-sm rounded-2xl px-8 py-12">
          <p className="text-xl font-semibold text-neutral-700 mb-10">
            Мы начали проверку сайта
            <Dots className="text-neutral-400 ml-1" />
          </p>

          <div
            className={`h-8 flex items-center justify-center text-lg font-semibold text-neutral-800 mb-5 transition-opacity duration-700 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            {steps[index]}
          </div>

          <div className="w-full h-[12px] bg-[#E5E7EB] overflow-hidden rounded-md">
            <div
              className="h-full transition-all duration-100 ease-linear"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(to right, #D1D5DB 0%, #60A5FA 50%, #3B82F6 100%)"
              }}
            ></div>
          </div>

          <p className="mt-6 text-sm text-neutral-500">
            Проверка завершится через <span className="font-semibold">{timeLeft}s</span>
          </p>
        </div>
      ) : (
        <div className="w-full bg-white border border-neutral-200 shadow-sm rounded-2xl px-8 py-14">
          <p className="text-2xl font-semibold text-neutral-800 mb-6">
            Проверка завершена
          </p>

          <div className="w-full h-[12px] bg-[#E5E7EB] overflow-hidden rounded-md">
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(to right, #D1D5DB 0%, #60A5FA 50%, #3B82F6 100%)",
                transition: "width 1.4s linear"
              }}
            ></div>
          </div>
        </div>
      )}

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
