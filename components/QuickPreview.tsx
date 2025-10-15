"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickPreview() {
  const router = useRouter();
  const [siteUrl, setSiteUrl] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dimIntro, setDimIntro] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const animRef = useRef<number | null>(null);
  const lastTimestamp = useRef<number>(0);

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

  // параметры
  const stepDuration = 1200;
  const holdPause = 300;
  const fadePause = 250;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSiteUrl(params.get("url") || "");
  }, []);

  useEffect(() => {
    if (currentStep >= steps.length) {
      setShowFinal(true);
      const timer = setTimeout(() => {
        if (siteUrl) router.push(`/pay?url=${encodeURIComponent(siteUrl)}`);
      }, 1000);
      return () => clearTimeout(timer);
    }

    let start: number | null = null;
    let finished = false;

    function animate(timestamp: number) {
      if (!start) {
        start = timestamp;
        if (currentStep === 0) setTimeout(() => setDimIntro(true), 700);
      }

      const elapsed = timestamp - start;
      const t = Math.min(elapsed / stepDuration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
      setProgress(eased * 100);

      if (elapsed < stepDuration) {
        animRef.current = requestAnimationFrame(animate);
      } else if (!finished) {
        finished = true;
        setProgress(100);
        setTimeout(() => {
          setProgress(0);
          setCurrentStep((p) => p + 1);
        }, holdPause + fadePause);
      }
    }

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [currentStep, siteUrl, router]);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 bg-[#F9FAFB] min-h-screen flex flex-col items-center font-sans text-neutral-800">
      {/* бренд */}
      <div className="text-center text-3xl font-semibold text-neutral-400 opacity-60 mb-12 select-none tracking-tight">
        AI Signal Max
      </div>

      {!showFinal ? (
        <div className="w-full bg-[#FDFDFB] border border-neutral-200 shadow-sm rounded-xl px-8 py-14 text-left">
          <p
            className={`text-xl md:text-2xl font-medium text-neutral-800 mb-10 text-center transition-opacity duration-700 ${
              dimIntro ? "opacity-40" : "opacity-100"
            }`}
          >
            Мы начали проверку:
          </p>

          <div className="h-8 flex items-center justify-center text-lg text-neutral-700 mb-6">
            {steps[currentStep]}
          </div>

          <div className="w-full h-[10px] bg-[#E5E7EB] rounded-[2px] overflow-hidden">
            <div
              className="h-[10px] rounded-[2px]"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(to right, #E5E7EB 0%, #60A5FA 60%, #2563EB 100%)",
                transition: "width 0.05s linear",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full bg-[#FDFDFB] border border-neutral-200 shadow-sm rounded-xl px-8 py-16 text-center animate-fade-in">
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
