"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickPreviewPage({ searchParams }: { searchParams: { url?: string } }) {
  const router = useRouter();
  const url = searchParams?.url || "";

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

  const stepTimings = [1000, 1300, 1000, 900, 1000, 800, 1300, 1300, 1600, 1400];
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // имитация последовательного анализа
  useEffect(() => {
    if (!url) {
      router.push("/");
      return;
    }

    let total = 0;
    steps.forEach((_, index) => {
      total += stepTimings[index];
      setTimeout(() => setCurrentStep(index + 1), total);
    });

    const finishDelay = total + 1500;
    const redirectDelay = finishDelay + 1000;

    const finishTimer = setTimeout(() => setIsFinished(true), finishDelay);
    const redirectTimer = setTimeout(() => {
      router.push(`/pay?url=${encodeURIComponent(url)}`);
    }, redirectDelay);

    return () => {
      clearTimeout(finishTimer);
      clearTimeout(redirectTimer);
    };
  }, [router, url]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="w-full max-w-2xl bg-white border border-neutral-200 shadow-sm rounded-lg px-6 py-12">
        <h1 className="text-center text-2xl font-semibold text-neutral-800 mb-10">
          Мы начали проверку:
        </h1>

        <div className="space-y-6">
          {steps.slice(0, currentStep).map((step, index) => (
            <div key={index}>
              <p className="text-neutral-800 text-base mb-2">{step}</p>
              <div className="w-full h-2 bg-gray-300 rounded-[1px] overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 animate-[fill_1s_linear_forwards]"
                  style={{
                    animationDuration: `${stepTimings[index] / 1000}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {isFinished && (
          <p className="text-center text-xl font-semibold text-neutral-800 mt-12 transition-opacity duration-700">
            Проверка завершена.
          </p>
        )}
      </div>

      <style jsx global>{`
        @keyframes fill {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
