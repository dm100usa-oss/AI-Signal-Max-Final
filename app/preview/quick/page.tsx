"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function QuickPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);

  const items = [
    "Проверяем robots.txt",
    "Проверяем sitemap.xml",
    "Проверяем X-Robots-Tag",
    "Проверяем meta robots",
    "Проверяем canonical",
    "Проверяем title и meta description",
    "Проверяем Open Graph и H1",
    "Проверяем структурированные данные",
    "Проверяем мобильную адаптацию",
    "Проверяем HTTPS и SSL",
    "Проверяем alt-тексты изображений",
    "Проверяем favicon и страницу 404",
    "Анализируем факторы, снижающие видимость сайта",
    "Определяем факторы, требующие небольшой доработки",
    "Формируем предварительный результат проверки",
  ];

  useEffect(() => {
    const durations = [
      0.9, 1.0, 1.1, 0.8, 1.0, 1.1, 1.2, 1.0,
      1.3, 1.6, 1.0, 1.1, 1.4, 1.6, 1.9,
    ];
    let total = 0;

    items.forEach((_, i) => {
      total += durations[i] * 1000;
      setTimeout(() => setCurrentIndex(i + 1), total);
    });

    // финальная пауза + переход к оплате
    setTimeout(() => {
      setDone(true);
      setTimeout(() => {
        router.push(`/pay?url=${encodeURIComponent(url)}`);
      }, 2800);
    }, total + 1000);
  }, [router, url]);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-10">
        Мы начали проверку:
      </h1>

      <div className="w-full max-w-xl space-y-5">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div
              className={`text-base ${
                index < currentIndex ? "text-gray-900" : "text-gray-400"
              } transition-colors duration-300`}
            >
              {item}
            </div>

            <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  index < currentIndex
                    ? "bg-gradient-to-r from-gray-400 via-sky-500 to-sky-600"
                    : "bg-gray-200"
                }`}
                style={{
                  width: index < currentIndex ? "100%" : "0%",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {done && (
        <div className="mt-10 text-lg text-gray-900 font-medium transition-opacity duration-700 text-center max-w-md">
          Проверка завершена.
        </div>
      )}
    </main>
  );
}
