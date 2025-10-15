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
  const [timeLeft, setTimeLeft] = useState(18);
  const [showFinal, setShowFinal] = useState(false);

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
    "Считает ли ИИ ваш сайт безопасным",
    "Учитывает ли ИИ ваш сайт при поиске",
    "Видит ли ИИ ваш сайт среди конкурентов",
    "Как оценивает ИИ ваш сайт",
  ];

  const durations = [2000, 2200, 2100, 2000, 2300, 2100, 2200, 2000, 2300, 2500];
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
        const ratio = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - ratio, 3);
        setProgress(eased * 100);

        if (elapsed < duration) {
          frame = requestAnimationFrame(animate);
        } else {
          setProgress(100);
          timeout1 = setTimeout(() => {
            setVisible(false);
            timeout2 = setTimeout(() => {
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
      const t = setTimeout(() => setShowFinal(true), 400);
      return () => clearTimeout(t);
    }
  }, [index]);

  useEffect(() => {
    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(t);
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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-800">
          AI Signal Max
        </h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">
          Быстрая проверка сайта
        </p>
        {siteUrl && (
          <p className="text-sm text-neutral-500 mt-1">
            {siteUrl} • {date}
          </p>
        )}
      </div>

      {!showFinal ? (
        <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl px-8 py-14 transition-all duration-500">
          <p
            className={`text-xl md:text-2xl font-semibold mb-10 text-neutral-700 transition-all duration-1000 ${
              index > 0 ? "opacity-40 scale-95" : "opacity-100"
            }`}
          >
            Мы начали проверку сайта
          </p>

          <div
            className={`h-8 flex items-center justify-center text-lg font-semibold text-neutral-800 mb-4 transition-opacity duration-700 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            {steps[index]}
          </div>

          <ProgressBar progress={progress} />

          <div className="mt-6 text-sm text-neutral-500">
            Проверка завершится через <span className="font-semibold">{timeLeft}s</span>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl px-8 py-16">
          <p className="text-2xl font-semibold text-neutral-800">
            Проверка завершена
          </p>
        </div>
      )}
    </div>
  );
}
