"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickPreview() {
  const router = useRouter();
  const [siteUrl, setSiteUrl] = useState("");
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [visible, setVisible] = useState(true);
  const [introDim, setIntroDim] = useState(false);

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

  const durations = [1400, 1300, 1200, 1100, 1300, 1200, 1400, 1300, 1500, 1600];
  const holdAtFull = 300;
  const fadeOutDelay = 300;
  const finalPause = 1000;

  // Основная анимация шагов
  useEffect(() => {
    let frame: number;
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;
    let start: number | null = null;

    if (index < steps.length) {
      setVisible(true);
      const duration = durations[index];

      if (index === 0) {
        // плавное затухание фразы "Мы начали проверку"
        setTimeout(() => setIntroDim(true), 600);
      }

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const ratio = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - ratio, 3); // ease-out cubic
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

  // Переход к оплате Stripe
  useEffect(() => {
    if (showFinal && siteUrl) {
      const timer = setTimeout(() => {
        router.push(`/pay?url=${encodeURIComponent(siteUrl)}`);
      }, finalPause);
      return () => clearTimeout(timer);
    }
  }, [showFinal, siteUrl, router]);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 bg-[#F9FAFB] min-h-screen flex flex-col items-center font-sans text-neutral-800">
      {/* Логотип / бренд */}
      <div className="text-center text-3xl font-semibold text-neutral-400 opacity-60 mb-12 select-none tracking-tight transition-all duration-1000">
        AI Signal Max
      </div>

      {/* Блок проверки */}
      {!showFinal ? (
        <div className="w-full bg-[#FDFDFB] border border-neutral-200 shadow-sm rounded-xl px-8 py-14 text-left transition-all duration-500">
          <p
            className={`text-xl md:text-2xl font-medium text-neutral-800 mb-10 text-center transition-opacity duration-700 ${
              introDim ? "opacity-40" : "opacity-100"
            }`}
          >
            Мы начали проверку:
          </p>

          <div
            className={`h-8 flex items-center text-lg text-neutral-700 mb-6 transition-opacity duration-500 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="mx-auto">{steps[index]}</span>
          </div>

          <div className="w-full h-[10px] bg-[#E5E7EB] rounded-[2px] overflow-hidden">
            <div
              className="h-[10px] rounded-[2px] transition-[width] duration-100 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(to right, #E5E7EB 0%, #60A5FA 50%, #2563EB 100%)",
                transition: "width 0.15s ease-out",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full bg-[#FDFDFB] border border-neutral-200 shadow-sm rounded-xl px-8 py-16 text-center">
          <p className="text-2xl font-semibold text-neutral-800 mb-2">
            Проверка завершена
          </p>
          <p className="text-neutral-600">Переход к оплате...</p>
        </div>
      )}

      <footer className="mt-16 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
      </footer>
    </main>
  );
}
