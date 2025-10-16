"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickPreview() {
  const router = useRouter();
  const [siteUrl, setSiteUrl] = useState("");
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
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
    "Считает ли ИИ ваш сайт безопасным и заслуживающим доверия",
    "Учитывает ли ИИ ваш сайт при поиске",
    "Видит ли ИИ ваш сайт среди конкурентов",
    "Как оценивает ИИ ваш сайт",
  ];

  const durations = [1800, 2000, 1900, 1800, 2000, 1900, 2000, 1900, 2000, 2200];
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
      const t = setTimeout(() => setShowFinal(true), 500);
      return () => clearTimeout(t);
    }
  }, [index]);

  useEffect(() => {
    if (showFinal && siteUrl) {
      const timer = setTimeout(() => {
        router.push(`/pay?url=${encodeURIComponent(siteUrl)}`);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [showFinal, router, siteUrl]);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-neutral-800 font-sans">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4">
        AI Signal Max
      </h1>
      <p className="text-center text-neutral-600 mb-8 leading-relaxed font-semibold">
        Быстрая проверка сайта
      </p>

      <div className="mb-2 relative">
        <div className="w-full rounded-md border px-4 py-3 text-base border-neutral-300 bg-white text-center text-neutral-700">
          {visible ? steps[index] : ""}
        </div>
      </div>

      <div className="w-full h-[44px] mt-4 bg-gray-200 rounded-md overflow-hidden">
        <div
          className="h-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(to right, #D1D5DB 0%, #60A5FA 50%, #3B82F6 100%)",
          }}
        />
      </div>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Проверка сайта выполняется...
      </p>

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
