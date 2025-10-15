"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";

export default function QuickPreview() {
  const router = useRouter();
  const [siteUrl, setSiteUrl] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dimIntro, setDimIntro] = useState(false);
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSiteUrl(params.get("url") || "");
  }, []);

  // анимация шагов
  useEffect(() => {
    if (currentStep >= steps.length) {
      setShowFinal(true);
      const t = setTimeout(() => {
        if (siteUrl) router.push(`/pay?url=${encodeURIComponent(siteUrl)}`);
      }, 1000);
      return () => clearTimeout(t);
    }

    const duration = 2000; // можно позже варьировать
    setProgress(100);
    const hold = setTimeout(() => {
      setProgress(0);
      setCurrentStep((p) => p + 1);
    }, duration + 300);

    if (currentStep === 0) {
      setTimeout(() => setDimIntro(true), 700);
    }

    return () => clearTimeout(hold);
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

          <ProgressBar progress={progress} duration={2000} />
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
