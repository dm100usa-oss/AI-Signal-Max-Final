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

  const timings = [1000, 1300, 1000, 900, 1000, 800, 1300, 1300, 1600, 1400];
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!url) {
      router.push("/");
      return;
    }

    let total = 0;
    steps.forEach((_, i) => {
      total += timings[i];
      setTimeout(() => setActiveIndex(i), total);
    });

    const finishTime = total + 1500;
    const redirectTime = finishTime + 1000;

    const finishTimer = setTimeout(() => setIsDone(true), finishTime);
    const redirectTimer = setTimeout(() => {
      router.push(`/pay?url=${encodeURIComponent(url)}`);
    }, redirectTime);

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
          {steps.map((text, i) => (
            <div
              key={i}
              className={`transition-opacity duration-500 ${
                i <= activeIndex ? "opacity-100" : "opacity-20"
              }`}
            >
              <p className="text-neutral-800 text-base mb-2">{text}</p>
              <div className="w-full h-2 bg-gray-300 rounded-[1px] overflow-hidden">
                <div
                  className={`h-2 bg-gradient-to-r from-gray-300 to-blue-600 transition-all duration-[${timings[i]}ms]`}
                  style={{
                    width: i <= activeIndex ? "100%" : "0%",
                    transition: `width ${timings[i]}ms linear`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {isDone && (
          <p className="text-center text-xl font-semibold text-neutral-800 mt-12">
            Проверка завершена.
          </p>
        )}
      </div>
    </main>
  );
}
