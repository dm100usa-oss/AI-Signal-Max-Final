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
  const fadeOutDelay = 300;
  const finalPause = 2200;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let frame: number;

    if (index < steps.length) {
      setVisible(true);
      let start: number | null = null;
      const duration = durations[index];
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const ratio = Math.min(elapsed / duration, 1);
        const easing =
          ratio < 0.85 ? ratio : ratio - Math.sin((ratio - 0.85) * 15) * 0.04;
        setProgress(easing * 100);
        if (elapsed < duration) {
          frame = requestAnimationFrame(animate);
        } else {
          timeout = setTimeout(() => {
            setVisible(false);
            setTimeout(() => {
              setProgress(0);
              setIndex((prev) => prev + 1);
            }, fadeOutDelay);
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

  useEffect(() => {
    if (showFinal && siteUrl) {
      const timer = setTimeout(() => {
        const redirect = `/pay?url=${encodeURIComponent(siteUrl)}`;
        router.push(redirect);
      }, finalPause);
      return () => clearTimeout(timer);
    }
  }, [showFinal, router, siteUrl]);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 bg-gray-50 min-h-screen flex flex-col items-center font-sans text-neutral-800">
      <div className="text-center text-3xl font-semibold text-neutral-400 opacity-60 mb-10 select-none">
        AI Signal Max
      </div>

      {!showFinal ? (
        <div className="w-full bg-white border border-neutral-200 shadow-sm rounded-lg px-4 py-12 text-center transition-all duration-500">
          <p className="text-xl md:text-2xl font-medium mb-8">
            Мы начали проверку:
          </p>

          <div
            className={`h-8 flex items-center justify-center text-lg text-neutral-700 mb-3 transition-opacity duration-500 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            {steps[index]}
          </div>

          <div className="w-full h-2 bg-gray-300 rounded-[1px] overflow-hidden">
            <div
              className="h-2 rounded-[1px]"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(to right, #D1D5DB, #3B82F6)",
                transition: "width 60ms linear",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full bg-white border border-neutral-200 shadow-sm rounded-lg px-4 py-16 text-center">
          <p className="text-xl md:text-2xl font-semibold text-neutral-800">
            Проверка завершена.
          </p>
        </div>
      )}
    </main>
  );
}
