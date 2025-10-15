"use client";

import { useEffect, useState } from "react";

export default function QuickPreview() {
  const [siteUrl, setSiteUrl] = useState("");
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const u = params.get("url") || "";
      setSiteUrl(u);
    }
  }, []);

  // 10 шагов проверки
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

  // Время на каждый шаг
  const durations = [1000, 1300, 1000, 900, 1000, 800, 1300, 1300, 1600, 1400];
  const fadeDelay = 300;
  const holdAtFull = 350; // пауза в конце каждого шага
  const redirectDelay = 1200; // пауза перед оплатой

  // Анимация шагов
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let frame: number;

    if (index < steps.length) {
      setVisible(true);
      setProgress(0);
      const duration = durations[index];
      let start: number | null = null;

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const ratio = Math.min(elapsed / duration, 1);
        // плавная ease-in-out функция
        const eased =
          ratio < 0.5 ? 2 * ratio * ratio : -1 + (4 - 2 * ratio) * ratio;
        setProgress(eased * 100);

        if (elapsed < duration) {
          frame = requestAnimationFrame(animate);
        } else {
          // удерживаем полосу на 100% перед исчезновением
          setProgress(100);
          timeout = setTimeout(() => {
            setVisible(false);
            setTimeout(() => setIndex((prev) => prev + 1), fadeDelay);
          }, holdAtFull);
        }
      };

      frame = requestAnimationFrame(animate);
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timeout);
      };
    } else {
      const t = setTimeout(() => setShowFinal(true), 400);
      return () => clearTimeout(t);
    }
  }, [index]);

  // Автоматический переход на оплату (Stripe)
  useEffect(() => {
    if (showFinal && siteUrl) {
      const timer = setTimeout(async () => {
        try {
          const resp = await fetch("/api/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "quick", url: siteUrl }),
          });
          const json = await resp.json();
          if (json?.url) {
            window.location.href = json.url;
          }
        } catch (err) {
          console.error("Payment redirect failed:", err);
        }
      }, redirectDelay);
      return () => clearTimeout(timer);
    }
  }, [showFinal, siteUrl]);

  // Плавный переход цвета серый → синий
  const getBarColor = (value: number) => {
    const start = { r: 209, g: 213, b: 219 }; // #D1D5DB
    const end = { r: 59, g: 130, b: 246 }; // #3B82F6
    const ratio = value / 100;
    const r = Math.round(start.r + (end.r - start.r) * ratio);
    const g = Math.round(start.g + (end.g - start.g) * ratio);
    const b = Math.round(start.b + (end.b - start.b) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full font-sans">
      {!showFinal ? (
        <div className="w-full text-center transition-all duration-500">
          <p className="text-xl md:text-2xl font-medium text-neutral-800 mb-10">
            Мы начали проверку:
          </p>

          <div
            className={`h-7 flex items-center justify-center text-lg font-medium text-neutral-800 mb-6 transition-opacity duration-400 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            {steps[index]}
          </div>

          {/* Полоса проверки */}
          <div className="w-full h-[8px] bg-gray-200 rounded-md overflow-hidden">
            <div
              className="h-[8px] rounded-md transition-[width] duration-150 ease-linear"
              style={{
                width: `${progress}%`,
                background: getBarColor(progress),
                transition: "width 0.15s linear, background 0.3s ease-out",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="text-center mt-8">
          <p className="text-2xl font-semibold text-neutral-800">
            Проверка завершена.
          </p>
        </div>
      )}
    </div>
  );
}
