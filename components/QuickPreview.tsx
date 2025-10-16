"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";

export default function QuickPreview() {
  const router = useRouter();
  const [siteUrl, setSiteUrl] = useState("");
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(25);
  const [showFinal, setShowFinal] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const u = params.get("url") || "";
      setSiteUrl(u);
    }
  }, []);

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
  const holdAtFull = 400;
  const fadeOutDelay = 250;

  useEffect(() => {
    let frame: number;
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;
    let start: number | null = null;

    if (index < steps.length) {
      setVisible(true);
      const duration = durations[index];

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;

        // плавное движение, с лёгким замедлением на больших факторах
        const ratio = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - ratio, 3);
        setProgress(easeOut * 100);

        if (elapsed < duration) {
          frame = requestAnimationFrame(animate);
        } else {
          setProgress(100);
          timeout1 = setTimeout(() => {
            setFadeOut(true);
            timeout2 = setTimeout(() => {
              setFadeOut(false);
              setVisible(false);
              setProgress(0);
              setIndex((prev) => prev + 1);
            }, fadeOutDelay);
          }, holdAtFull);
        }
      };

      frame = requestAnimationFrame(animate);
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    } else {
      const t = setTimeout(() => setShowFinal(true), 700);
      return () => clearTimeout(t);
    }
  }, [index]);

  // таймер обратного отсчёта
  useEffect(() => {
    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timeLeft]);

  // переход на оплату
  useEffect(() => {
    if (showFinal && siteUrl) {
      const timer = setTimeout(() => {
        router.push(`/pay?url=${encodeURIComponent(siteUrl)}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showFinal, router, siteUrl]);

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center">
      <h1 className="text-4xl font-semibold tracking-tight mb-2 text-neutral-800">
        AI Signal Max
      </h1>
      <p className="text-sm text-neutral-600 font-semibold mb-1">
        Быстрая проверка сайта
      </p>
      {siteUrl && (
        <p className="text-sm text-neutral-500 mb-8">
          {siteUrl} | {date}
        </p>
      )}

      {!showFinal ? (
        <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl px-8 py-14 transition-all duration-500">
          <p
            className={`text-2xl font-semibold mb-10 text-neutral-700 transition-opacity duration-700 ${
              fadeOut ? "opacity-30" : "opacity-100"
            }`}
          >
            Мы начали проверку сайта
          </p>

          <div
            className={`h-8 flex items-center justify-center text-2xl font-semibold text-neutral-800 mb-6 transition-opacity duration-700 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            {steps[index]}
          </div>

          <ProgressBar progress={progress} />

          <div
            className={`mt-6 text-sm text-neutral-500 transition-opacity duration-700 ${
              fadeOut ? "opacity-30" : "opacity-100"
            }`}
          >
            Проверка завершится через{" "}
            <span className="font-semibold">{timeLeft}s</span>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl px-8 py-16">
          <p className="text-2xl font-semibold text-neutral-800 fade-in">
            Проверка завершена
          </p>
        </div>
      )}

      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data. Not legal advice.
        </span>
      </footer>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.7s ease-in forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  );
}
