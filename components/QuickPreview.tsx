"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TimeProgress from "./TimeProgress";
import ProgressBar from "./ProgressBar";

export default function QuickPreview() {
  const router = useRouter();
  const params = useSearchParams();
  const [siteUrl, setSiteUrl] = useState("");
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [fadeHeader, setFadeHeader] = useState(false);

  useEffect(() => {
    const url = params.get("url") || "";
    setSiteUrl(url);
  }, [params]);

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

  const durations = [2000, 2200, 2000, 2300, 2100, 2000, 2200, 2300, 2400, 2500];

  useEffect(() => {
    if (index === 1) setFadeHeader(true);
    if (index >= steps.length) {
      setTimeout(() => setShowFinal(true), 400);
      return;
    }

    setProgress(0);
    const duration = durations[index];
    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const ratio = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - ratio, 3);
      setProgress(eased * 100);
      if (ratio < 1) requestAnimationFrame(animate);
      else setTimeout(() => setIndex((prev) => prev + 1), 300);
    };
    requestAnimationFrame(animate);
  }, [index]);

  useEffect(() => {
    if (showFinal && siteUrl) {
      setTimeout(() => {
        router.push(`/pay?url=${encodeURIComponent(siteUrl)}`);
      }, 1000);
    }
  }, [showFinal, router, siteUrl]);

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full bg-white border border-neutral-200 shadow-sm rounded-2xl p-8 sm:p-10 transition-all duration-500">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-800">
          AI Signal Max
        </h1>
        <p className="text-base font-semibold text-neutral-700 mt-2">
          Быстрая проверка сайта
        </p>
        {siteUrl && (
          <p className="text-sm text-neutral-500 mt-1">
            {siteUrl} &nbsp; | &nbsp; {date}
          </p>
        )}
      </div>

      {!showFinal ? (
        <>
          <p
            className={`text-lg md:text-xl font-medium text-center text-neutral-700 mb-6 transition-all duration-700 ${
              fadeHeader ? "opacity-50 text-base" : "opacity-100"
            }`}
          >
            Мы начали проверку
          </p>

          <div className="text-center text-lg font-semibold text-neutral-800 mb-4">
            {steps[index]}
          </div>

          <ProgressBar progress={progress} />
        </>
      ) : (
        <div className="text-center text-xl font-semibold text-neutral-800 py-6">
          Проверка завершена
        </div>
      )}

      {!showFinal && <TimeProgress />}
    </div>
  );
}
