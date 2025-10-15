"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickPreview() {
  const router = useRouter();
  const [siteUrl, setSiteUrl] = useState("");
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [finished, setFinished] = useState(false);

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

  useEffect(() => {
    if (index >= steps.length) {
      const endTimer = setTimeout(() => setFinished(true), 600);
      return () => clearTimeout(endTimer);
    }

    let frame: number;
    let timeout: NodeJS.Timeout;
    let start: number | null = null;
    const duration = durations[index];

    setVisible(true);
    setProgress(0);

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const ratio = Math.min(elapsed / duration, 1);
      setProgress(ratio * 100);
      if (elapsed < duration) {
        frame = requestAnimationFrame(animate);
      } else {
        timeout = setTimeout(() => {
          setVisible(false);
          setTimeout(() => {
            setIndex((prev) => prev + 1);
          }, fadeOutDelay);
        }, 150);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [index]);

  useEffect(() => {
    if (finished && siteUrl) {
      const pauseBeforeRedirect = setTimeout(() => {
        const redirectDelay = setTimeout(() => {
          router.push(`/pay?url=${encodeURIComponent(siteUrl)}`);
        }, 2000); // 2 сек пауза перед переходом
        return () => clearTimeout(redirectDelay);
      }, 800); // 0.8 сек после появления фразы
      return () => clearTimeout(pauseBeforeRedirect);
    }
  }, [finished, router, siteUrl]);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 bg-gray-50 min-h-screen flex flex-col justify-center font-sans text-neutral-800">
      <div className="w-full bg-white border border-neutral-200 shadow-sm rounded-xl px-4 py-10 transition-all duration-700">
        {!finished ? (
          <>
            <p className="text-center text-xl md:text-2xl font-medium text-neutral-800 mb-8">
              Мы начали проверку:
            </p>

            <div
              className={`h-7 flex items-center justify-center text-lg md:text-xl text-neutral-700 mb-6 transition-opacity duration-500 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            >
              {steps[index]}
            </div>

            <div className="w-full h-2 bg-gray-300 rounded-[1px] overflow-hidden transition-opacity duration-300">
              <div
                className={`h-2 rounded-[1px] transition-all duration-300 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(to right, #D1D5DB, #3B82F6)",
                  transition: "width 60ms linear",
                }}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-16 fade-in">
            <p className="text-xl md:text-2xl font-semibold text-neutral-800">
              Проверка завершена.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
