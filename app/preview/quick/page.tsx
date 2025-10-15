"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function QuickPreview() {
  const router = useRouter();
  const params = useSearchParams();
  const url = params.get("url") || "";

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

  const durations = [1000, 1300, 1000, 900, 1000, 800, 1300, 1300, 1600, 1400];
  const totalDuration = durations.reduce((a, b) => a + b, 0) + 2000;

  const [current, setCurrent] = useState<number>(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let time = 0;
    steps.forEach((_, i) => {
      setTimeout(() => setCurrent(i), time);
      time += durations[i];
    });
    // финальная надпись
    setTimeout(() => setDone(true), totalDuration - 2000);
    // переход к оплате
    setTimeout(() => {
      router.push(`/api/pay?mode=quick&url=${encodeURIComponent(url)}`);
    }, totalDuration);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-2xl bg-white border border-neutral-200 shadow-sm rounded-md p-8">
        <h1 className="text-center text-xl md:text-2xl font-medium text-neutral-800 mb-8">
          Мы начали проверку:
        </h1>

        <div className="space-y-5">
          {steps.map((text, i) => (
            <div key={i} className="transition-opacity duration-300">
              <p
                className={`text-neutral-700 text-base mb-1 ${
                  i <= current ? "opacity-100" : "opacity-40"
                }`}
              >
                {text}
              </p>
              <div className="h-2 w-full bg-gray-300 rounded-[1px] overflow-hidden">
                <div
                  className={`h-2 rounded-[1px] bg-gradient-to-r from-gray-300 to-blue-500 transition-all duration-700`}
                  style={{
                    width:
                      i < current
                        ? "100%"
                        : i === current
                        ? "100%"
                        : "0%",
                    opacity: i <= current ? 1 : 0.2,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {done && (
          <div className="text-center text-xl md:text-2xl font-semibold text-neutral-800 mt-10 fade-in">
            Проверка завершена.
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-neutral-500">
          © 2025 AI Signal Max. All rights reserved.
          <br />
          <span className="opacity-60">
            Visibility scores are estimated and based on publicly available data. Not legal advice.
          </span>
        </footer>

        <style jsx>{`
          .fade-in {
            animation: fadeIn 0.8s ease-in;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </main>
  );
}
