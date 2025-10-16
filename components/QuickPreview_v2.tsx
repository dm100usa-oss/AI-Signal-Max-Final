"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickPreview_v2() {
  const router = useRouter();
  const [siteUrl, setSiteUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(18);
  const [showFinal, setShowFinal] = useState(false);

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
    "Как оценивает ИИ ваш сайт",
  ];

  const durations = [1000, 1400, 1000, 800, 1000, 800, 1400, 1300, 1600, 1500];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const u = params.get("url") || "";
      setSiteUrl(u);
    }
  }, []);

  useEffect(() => {
    let start: number | null = null;
    let frame: number;
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;

    if (currentIndex < steps.length) {
      const duration = durations[currentIndex];
      setProgress(0);

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const fraction = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - fraction, 3);
        setProgress(eased * 100);

        if (elapsed < duration) {
          frame = requestAnimationFrame(animate);
        } else {
          setProgress(100);
          timeout1 = setTimeout(() => {
            timeout2 = setTimeout(() => {
              setCurrentIndex((prev) => prev + 1);
            }, 200);
          }, 200);
        }
      };

      frame = requestAnimationFrame(animate);
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    } else {
      const t = setTimeout(() => setShowFinal(true), 400);
      return () => clearTimeout(t);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (showFinal && siteUrl) {
      const timer = setTimeout(() => {
        router.push(`/pay?url=${encodeURIComponent(siteUrl)}`);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [showFinal, router, siteUrl]);

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full text-center">
      {/* Верхняя часть */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-neutral-800 tracking-tight">
          AI Signal Max
        </h1>
        <p className="text-neutral-600 mt-1 text-base font-semibold">
          Быстрая проверка сайта
        </p>
        {siteUrl && (
          <p className="text-sm text-neutral-500 mt-1">
            {siteUrl} • {date}
          </p>
        )}
      </div>

      {/* Основная часть */}
      {!showFinal ? (
        <div className="bg-white border border-neutral-200 rounded-xl px-8 py-14 shadow-sm transition-all duration-500">
          <div className="h-8 flex items-center justify-center text-lg font-medium text-neutral-800 mb-6">
            {steps[currentIndex]}
          </div>

          <div className="w-full h-[12px] bg-gray-200 rounded-[3px] overflow-hidden mb-6">
            <div
              className="h-[12px] bg-gradient-to-r from-gray-300 via-blue-400 to-blue-600 rounded-[3px] transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="text-sm text-neutral-500">
            Проверка завершится через{" "}
            <span className="font-medium text-neutral-600">{timeLeft}s</span>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl px-8 py-16 shadow-sm transition-all">
          <p className="text-2xl font-semibold text-neutral-800 mb-2">
            Проверка завершена
          </p>
          <div className="w-full h-[12px] bg-gray-200 rounded-[3px] overflow-hidden mt-4">
            <div className="h-[12px] w-full bg-blue-600"></div>
          </div>
        </div>
      )}

      {/* Нижний дисклеймер */}
      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data. Not legal advice.
        </span>
      </footer>
    </div>
  );
}
