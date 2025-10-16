"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function QuickPreview_v2() {
  const params = useSearchParams();
  const router = useRouter();
  const siteUrl = params.get("url") || "";

  useEffect(() => {
    const totalDuration = 20000; // полная длительность анимации (20 сек)
    const t = setTimeout(() => {
      router.push(`/pay?url=${encodeURIComponent(siteUrl)}`);
    }, totalDuration);
    return () => clearTimeout(t);
  }, [router, siteUrl]);

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
    "Факторы, снижающие видимость сайта",
    "Факторы, требующие небольшой доработки",
    "Факторы, способствующие видимости сайта",
    "Формируем отчёт для владельца сайта",
    "Создаём техническое задание для разработчика",
    "Проверка завершена",
  ];

  return (
    <div className="text-center w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">AI Signal Max</h1>
        <p className="text-sm text-neutral-500 font-semibold mt-1">
          Быстрая проверка сайта
        </p>
        {siteUrl && (
          <p className="text-sm text-neutral-500 mt-1">
            {siteUrl} • {new Date().toLocaleDateString("en-US")}
          </p>
        )}
      </div>

      <div className="relative bg-white border border-neutral-200 shadow-sm rounded-2xl px-8 py-16 overflow-hidden">
        {steps.map((text, i) => (
          <div
            key={i}
            className="absolute inset-0 flex flex-col items-center justify-center opacity-0 animate-step"
            style={{
              animationDelay: `${i * 1.2}s`,
              animationDuration: "1.2s",
            }}
          >
            <p className="text-lg md:text-xl font-semibold text-neutral-800 mb-6">
              {text}
            </p>
            <div className="w-full max-w-md h-[12px] bg-gray-200 overflow-hidden">
              <div className="h-full w-0 animate-bar" />
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data. Not legal advice.
        </span>
      </footer>

      <style jsx>{`
        @keyframes fadeStep {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes fillBar {
          0% {
            width: 0%;
            background: #d1d5db;
          }
          85% {
            width: 100%;
            background: linear-gradient(
              to right,
              #d1d5db 0%,
              #60a5fa 60%,
              #3b82f6 100%
            );
          }
          100% {
            width: 100%;
            background: #3b82f6;
          }
        }

        .animate-step {
          animation-name: fadeStep;
          animation-timing-function: ease-in-out;
          animation-fill-mode: both;
        }

        .animate-bar {
          animation-name: fillBar;
          animation-timing-function: linear;
          animation-duration: 1.2s;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}

