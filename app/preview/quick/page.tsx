"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickPreviewPage() {
  const router = useRouter();
  const [url, setUrl] = useState<string>("");

  // берём url из query вручную (без useSearchParams)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const siteUrl = params.get("url") || "";
    if (!siteUrl) router.push("/");
    setUrl(siteUrl);
  }, [router]);

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

  const [currentStep, setCurrentStep] = useState(-1);
  const [filled, setFilled] = useState(Array(steps.length).fill(false));
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!url) return;

    let total = 0;
    steps.forEach((_, i) => {
      total += timings[i];
      setTimeout(() => {
        setCurrentStep(i);
        setFilled((prev) => {
          const updated = [...prev];
          updated[i] = true;
          return updated;
        });
      }, total);
    });

    const finish = total + 1500;
    const redirect = finish + 1000;

    const finishTimer = setTimeout(() => setDone(true), finish);
    const redirectTimer = setTimeout(() => {
      router.push(`/pay?url=${encodeURIComponent(url)}`);
    }, redirect);

    return () => {
      clearTimeout(finishTimer);
      clearTimeout(redirectTimer);
    };
  }, [url, router]);

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
              className={`transition-opacity duration-700 ${
                i <= currentStep ? "opacity-100" : "opacity-20"
              }`}
            >
              <p className="text-neutral-800 text-base mb-2">{text}</p>
              <div className="w-full h-2 bg-gray-300 rounded-[1px] overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-gray-300 to-blue-600 transition-all"
                  style={{
                    width: filled[i] ? "100%" : "0%",
                    transition: `width ${timings[i]}ms linear`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {done && (
          <p className="text-center text-xl font-semibold text-neutral-800 mt-12">
            Проверка завершена.
          </p>
        )}
      </div>
    </main>
  );
}
