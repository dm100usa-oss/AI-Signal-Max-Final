"use client";

import { useEffect, useState } from "react";

export default function QuickPreview() {
  const factors = [
    { text: "Открыт ли сайт для ИИ", duration: 1.0 },
    { text: "Понимает ли ИИ, о чём ваш сайт", duration: 1.4 },
    { text: "Может ли ИИ читать содержание страниц", duration: 1.0 },
    { text: "Видит ли ИИ заголовки и описания", duration: 0.8 },
    { text: "Понимает ли ИИ структуру сайта", duration: 1.0 },
    { text: "Видит ли ИИ изображения на сайте", duration: 0.8 },
    { text: "Считает ли ИИ ваш сайт безопасным и заслуживающим доверия", duration: 1.4 },
    { text: "Учитывает ли ИИ ваш сайт при поиске", duration: 1.3 },
    { text: "Видит ли ИИ ваш сайт среди конкурентов", duration: 1.6 },
    { text: "Как оценивает ИИ ваш сайт", duration: 1.5 },
  ];

  const totalTime = factors.reduce((sum, f) => sum + f.duration, 0) + 3.4; // добавляем паузу и финал
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Math.ceil(totalTime));

  useEffect(() => {
    let elapsed = 0;
    let index = 0;

    const updateFactor = () => {
      if (index < factors.length - 1) {
        index++;
        setCurrent(index);
        setTimeout(updateFactor, factors[index].duration * 1000);
      } else {
        setTimeout(() => {
          setFinished(true);
        }, 700); // короткая пауза перед финальной надписью
        setTimeout(() => {
          window.location.href = "/pay";
        }, 700 + 2000); // 2 сек до перехода
      }
    };

    // прогресс — с ускорениями и замедлениями
    const progressTimer = setInterval(() => {
      elapsed += 0.05;
      const totalDur = factors.slice(0, current + 1).reduce((s, f) => s + f.duration, 0);
      const target = (totalDur / totalTime) * 100;
      const easing = current % 2 === 0 ? 0.08 : 0.03; // лёгкое колебание скорости
      setProgress((prev) => {
        const diff = target - prev;
        return prev + diff * easing;
      });
      setTimeLeft((prev) => (prev > 0 ? prev - 0.05 : 0));
    }, 50);

    setTimeout(updateFactor, factors[0].duration * 1000);

    return () => clearInterval(progressTimer);
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center">
      {/* Пара 1 */}
      <h1 className="text-4xl font-semibold tracking-tight mb-2">
        AI Signal Max
      </h1>

      {/* Пара 2 */}
      <div className="text-neutral-600 mb-8">
        <p className="font-semibold mb-1">Быстрая проверка сайта</p>
        <p className="text-sm text-neutral-500">
          https://school.profit-zone.com/ | October 15, 2025
        </p>
      </div>

      {/* Пара 3 */}
      <div
        key={current}
        className={`border rounded-md px-4 py-6 mb-4 bg-white text-neutral-800 text-2xl font-medium shadow-sm transition-opacity duration-700 ease-in ${
          finished ? "opacity-0" : "opacity-100"
        }`}
      >
        {factors[current].text}
      </div>

      {/* Пара 4 — полоса */}
      <div className="w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-3">
        <div
          className={`h-full transition-all ease-linear duration-200`}
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(to right, rgba(180,200,255,0.4), #60a5fa, #2563eb)",
            opacity: finished ? 0.3 : 1,
          }}
        />
      </div>

      {/* Пара 5 — таймер или финал */}
      <div
        className={`w-full h-12 rounded-md bg-gray-100 flex items-center justify-center text-neutral-500 font-medium transition-opacity duration-700 ${
          finished ? "opacity-30 text-2xl" : "text-sm opacity-100"
        }`}
      >
        {finished
          ? "Проверка завершена"
          : `Проверка завершится через ${Math.ceil(timeLeft)} сек`}
      </div>

      {/* Пара 6 — дисклеймер */}
      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data.
          Not legal advice.
        </span>
      </footer>
    </main>
  );
}
