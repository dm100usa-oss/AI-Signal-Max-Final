"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickPreview() {
  const router = useRouter();
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
    "Считает ли ИИ ваш сайт безопасным",
    "Учитывает ли ИИ ваш сайт при поиске",
    "Сравнивает ли ИИ ваш сайт с конкурентами",
    "Оценивает ли ИИ ваш сайт корректно",
  ];

  // Длительность каждого шага
  const durations = [1000, 1200, 900, 1000, 1000, 900, 1200, 1100, 1300, 1400];
  const fadeDelay = 300;
  const redirectDelay = 1200; // пауза перед переходом

  // Анимация полосы и текста
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
        // линейная плавность
        const eased = 1 - Math.pow(1 - ratio, 2);
        setProgress(eased * 100);
        if (elapsed < duration) {
          frame = requestAnimationFrame(animate);
        } else {
          timeout = setTimeout(() => {
            setVisible(false);
            setTimeout(() => setIndex((prev) => prev + 1), fadeDelay);
          }, 200);
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

  // Переход на страницу оплаты
  useEffect(() => {
    if (showFinal && siteUrl) {
      const timer = setTimeout(() => {
        router.push(`/pay?url=${encodeURIComponent(siteUrl)}`);
      }, redirectDelay);
      return () => clearTimeout(timer);
    }
  }, [showFinal, router, siteUrl]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!showFinal ? (
        <div className="text-center transition-all duration-500">
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

          {/* Полоса прогресса */}
          <div className="w-full h-[8px] bg-gray-200 rounded-md overflow-hidden">
            <div
              className="h-[8px] bg-[#3B82F6] rounded-md transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-semibold text-neutral-800">
            Проверка завершена.
          </p>
        </div>
      )}
    </div>
  );
}
