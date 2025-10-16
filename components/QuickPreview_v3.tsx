"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickPreview_v3() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [showFinal, setShowFinal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [siteUrl, setSiteUrl] = useState("");

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

  const durations = [1000, 1400, 1000, 800, 1000, 800, 1400, 1300, 1600, 1500];
  const totalTime = durations.reduce((a, b) => a + b, 0) / 1000 + 3;

  useEffect(() => {
    setTimeLeft(Math.ceil(totalTime));
  }, [totalTime]);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (timeLeft > 0) {
      t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [timeLeft]);

  useEffect(() => {
    if (index >= steps.length) {
      setTimeout(() => setShowFinal(true), 400);
      return;
    }

    setVisible(true);
    setProgress(0);
    const duration = durations[index];
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct * 100);

      if (pct < 1) requestAnimationFrame(animate);
      else {
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => setIndex((i) => i + 1), 250);
        }, 200);
      }
    };
    requestAnimationFrame(animate);
  }, [index]);

  useEffect(() => {
    if (showFinal && siteUrl) {
      const timer = setTimeout(() => {
        router.push(`/pay?url=${encodeURIComponent(siteUrl)}&mode=quick`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showFinal, router, siteUrl]);

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 bg-gray-50 min-h-screen flex flex-col items-center justify-start">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-800">
        AI Signal Max
      </h1>
      <p className="text-center text-neutral-600 mb-8 leading-relaxed font-semibold">
        Быстрая проверка сайта
      </p>
      {siteUrl && (
        <p className="text-center text-neutral-500 mb-6 text-sm">
          {siteUrl} • {date}
        </p>
      )}

      {!showFinal ? (
        <div className="w-full bg-white border border-neutral-200 shadow-sm rounded-2xl px-8 py-12 text-center transition-all duration-500">
          <p className="text-xl font-semibold text-neutral-700 mb-10">
            Мы начали проверку сайта
          </p>

          <div
            className={`h-8 flex items-center justify-center text-lg font-semibold text-neutral-800 mb-4 transition-opacity duration-700 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            {steps[index]}
          </div>

          <div className="w-full h-[12px] bg-[#E5E7EB] overflow-hidden">
            <div
              className="h-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(to right, #D1D5DB 0%, #60A5FA 50%, #3B82F6 100%)",
              }}
            ></div>
          </div>

          <div className="mt-6 text-sm text-neutral-500">
            Проверка завершится через{" "}
            <span className="font-semibold">{timeLeft}s</span>
          </div>
        </div>
      ) : (
        <div className="w-full bg-white border border-neutral-200 shadow-sm rounded-2xl px-8 py-16 text-center">
          <p className="text-2xl font-semibold text-neutral-800 mb-4">
            Проверка завершена
          </p>
          <div className="w-full h-[12px] bg-[#E5E7EB] overflow-hidden">
            <div
              className="h-full"
              style={{
                width: "100%",
                background:
                  "linear-gradient(to right, #D1D5DB 0%, #60A5FA 50%, #3B82F6 100%)",
                transition: "width 1.5s linear",
              }}
            ></div>
          </div>
        </div>
      )}

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
