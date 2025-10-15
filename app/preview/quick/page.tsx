"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function QuickPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutUrl = `/api/pay?mode=quick&url=${encodeURIComponent(
    searchParams.get("url") || ""
  )}`;

  // 10 пунктов быстрой проверки (с оптимизированными таймингами)
  const steps = [
    { text: "Открыт ли сайт для ИИ", duration: 1.0 },
    { text: "Понимает ли ИИ, о чём ваш сайт", duration: 1.3 },
    { text: "Может ли ИИ читать содержание страниц", duration: 1.0 },
    { text: "Видит ли ИИ заголовки и описания", duration: 0.8 },
    { text: "Понимает ли ИИ структуру сайта", duration: 1.0 },
    { text: "Видит ли ИИ изображения на сайте", duration: 0.8 },
    { text: "Считает ли ИИ ваш сайт безопасным и заслуживающим доверия", duration: 1.3 },
    { text: "Учитывает ли ИИ ваш сайт при поиске", duration: 1.3 },
    { text: "Видит ли ИИ ваш сайт среди конкурентов", duration: 1.6 },
    { text: "Как оценивает ИИ ваш сайт", duration: 1.4 },
  ];

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Основная логика показа шагов и автоматического перехода
  useEffect(() => {
    if (index >= steps.length) {
      // Когда все пункты завершены
      const timer = setTimeout(() => router.push(checkoutUrl), 2000);
      return () => clearTimeout(timer);
    }

    setProgress(0);
    const step = steps[index];
    const start = Date.now();
    const durationMs = step.duration * 1000;

    const animate = () => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(percent);
      if (percent < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => setIndex((i) => i + 1), 200);
      }
    };

    requestAnimationFrame(animate);
  }, [index]);

  const currentStep = steps[index];

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-xl border border-neutral-200 bg-white p-8 shadow-sm text-center">
        {index < steps.length ? (
          <>
            {/* Заголовок */}
            <h1 className="mb-6 text-xl md:text-2xl font-medium text-neutral-800">
              Мы начали проверку:
            </h1>

            {/* Текущий пункт */}
            <p className="text-lg md:text-xl text-neutral-800 mb-3">
              {currentStep.text}
            </p>

            {/* Анимированная полоса */}
            <div className="h-[6px] w-full bg-gray-200 rounded-[1px] overflow-hidden">
              <div
                className="h-[6px] rounded-[1px] transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(to right, #D1D5DB, #3B82F6)`,
                  transition: `width ${currentStep.duration}s linear`,
                }}
              ></div>
            </div>
          </>
        ) : (
          // Финальный экран
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-800">
            Проверка завершена.
          </h1>
        )}
      </div>
    </main>
  );
}
