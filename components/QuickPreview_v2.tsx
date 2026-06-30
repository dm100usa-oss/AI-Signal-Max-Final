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
    "Is your site open to AI",
    "Does AI understand what your site is about",
    "Can AI read your page content",
    "Can AI see your titles and descriptions",
    "Does AI understand your site structure",
    "Can AI see images on your site",
    "Does AI consider your site safe and trustworthy",
    "Does AI include your site in search results",
    "Can AI find your site among competitors",
    "How does AI rate your site",
  ];

  const durations = [1000, 1400, 1000, 800, 1000, 800, 1400, 1300, 1600, 1500];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const u = params.get("url") || "";
      setSiteUrl(u);
    }
  }, []);

  // управление сменой факторов
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

  // таймер обратного отсчёта
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // автоматический переход
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
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16">
      {/* Заголовок как на главной */}
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-800">
        AI Signal Max
      </h1>
      <p className="text-center text-neutral-600 mb-8 leading-relaxed font-semibold">
        Быстрая проверка сайта
      </p>

      {/* Адрес сайта и дата */}
      {siteUrl && (
        <p className="text-center text-sm text-neutral-500 mb-8">
          {siteUrl} • {date}
        </p>
      )}

      {/* Центральный блок проверки */}
      {!showFinal ? (
        <>
          {/* Фактор в том же месте, где поле ввода */}
          <div className="mb-4 text-center text-lg font-medium text-neutral-800 h-[24px] flex items-center justify-center">
            {steps[currentIndex]}
          </div>

          {/* Полоса проверки — на месте синей кнопки */}
          <div className="w-full h-[48px] bg-gray-200 rounded-md overflow-hidden mb-4 flex items-center">
            <div
              className="h-full bg-gradient-to-r from-gray-300 via-blue-400 to-blue-600 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Таймер — на месте зелёной кнопки */}
          <div className="w-full h-[44px] bg-gray-100 rounded-md flex items-center justify-center text-neutral-600 text-sm mb-4">
            Проверка завершится через{" "}
            <span className="font-semibold ml-1">{timeLeft}s</span>
          </div>
        </>
      ) : (
        <div className="text-center mt-12">
          <p className="text-2xl font-semibold text-neutral-800 mb-4">
            Проверка завершена
          </p>
          <div className="w-full h-[48px] bg-gray-200 rounded-md overflow-hidden">
            <div className="h-full w-full bg-blue-600" />
          </div>
        </div>
      )}

      {/* Нижний дисклеймер */}
      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2026 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data. Not legal advice.
        </span>
      </footer>
    </main>
  );
}
