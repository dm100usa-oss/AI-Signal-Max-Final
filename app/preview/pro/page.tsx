"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutUrl = `/api/pay?mode=pro&url=${encodeURIComponent(
    searchParams.get("url") || ""
  )}`;

  // 15 пунктов для полной проверки
  const steps = [
    { text: "Открыт ли сайт для ИИ", color: "#22C55E", duration: 1.2 },
    { text: "Понимает ли ИИ, о чём ваш сайт", color: "#22C55E", duration: 1.3 },
    { text: "Может ли ИИ читать содержание страниц", color: "#FACC15", duration: 1.0 },
    { text: "Видит ли ИИ заголовки и описания", color: "#FACC15", duration: 0.8 },
    { text: "Понимает ли ИИ структуру сайта", color: "#22C55E", duration: 1.0 },
    { text: "Видит ли ИИ изображения на сайте", color: "#FACC15", duration: 0.8 },
    { text: "Считает ли ИИ ваш сайт безопасным и заслуживающим доверия", color: "#22C55E", duration: 1.3 },
    { text: "Учитывает ли ИИ ваш сайт при поиске", color: "#22C55E", duration: 1.3 },
    { text: "Видит ли ИИ ваш сайт среди конкурентов", color: "#EF4444", duration: 1.6 },
    { text: "Как оценивает ИИ ваш сайт", color: "#FACC15", duration: 1.3 },
    { text: "Собираем факторы, снижающие видимость сайта", color: "#EF4444", duration: 1.5 },
    { text: "Определяем факторы, требующие небольшой доработки", color: "#FACC15", duration: 1.3 },
    { text: "Выделяем факторы, способствующие видимости сайта", color: "#22C55E", duration: 1.4 },
    { text: "Формируем отчёт для владельца сайта", color: "#22C55E", duration: 1.3 },
    { text: "Формируем техническое задание для разработчика", color: "#22C55E", duration: 1.9 },
  ];

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Основная логика показа шагов и перехода на оплату
  useEffect(() => {
    if (index >= steps.length) {
      const timer = setTimeout(() => router.push(checkoutUrl), 2500);
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

            {/* Полоса прогресса */}
            <div className="h-[6px] w-full bg-gray-200 rounded-[1px] overflow-hidden">
              <div
                className="h-[6px] rounded-[1px] transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(to right, #D1D5DB, ${currentStep.color})`,
                  transition: `width ${currentStep.duration}s linear`,
                }}
              ></div>
            </div>
          </>
        ) : (
          // Финальный экран
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-neutral-800 mb-3">
              Проверка завершена.
            </h1>
            <p className="text-base text-neutral-700">
              Вы получите полные данные на указанный email.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
