"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Dots({ colorClass = "text-neutral-400" }: { colorClass?: string }) {
  return (
    <span className={`inline-flex justify-start tabular-nums align-middle ${colorClass}`}>
      <span className="dot">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
      <style jsx>{`
        .dot {
          opacity: 0.2;
          animation: aiv-dots 1200ms infinite;
        }
        .dot2 {
          animation-delay: 200ms;
        }
        .dot3 {
          animation-delay: 400ms;
        }
        @keyframes aiv-dots {
          0% {
            opacity: 0.2;
          }
          30% {
            opacity: 1;
          }
          60% {
            opacity: 0.2;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </span>
  );
}

function TopLights({ active }: { active: boolean }) {
  return (
    <div
      className={`flex justify-center mb-6 h-6 items-center space-x-3 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-6px]"}`}
      style={{ pointerEvents: "none" }}
    >
      <span className={`top-light yellow-light ${active ? "light-active" : ""}`} />
      <span className={`top-light blue-light ${active ? "light-active" : ""}`} />
      <span className={`top-light green-light ${active ? "light-active" : ""}`} />

      <style jsx>{`
        .top-light {
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          opacity: 0;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: inset 0 0 0.5px rgba(255, 255, 255, 0.6);
        }

        .yellow-light {
          background: radial-gradient(circle at 30% 30%, #fde68a, #f59e0b 65%);
        }

        .blue-light {
          background: radial-gradient(circle at 30% 30%, #93c5fd, #2563eb 65%);
        }

        .green-light {
          background: radial-gradient(circle at 30% 30%, #6ee7b7, #059669 65%);
        }

        .light-active {
          animation: minimalWave 3.3s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        .blue-light.light-active {
          animation-delay: 0.35s;
        }

        .green-light.light-active {
          animation-delay: 0.7s;
        }

        @keyframes minimalWave {
          0% {
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          30% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default function QuickPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";

  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const factors = [
    "Открыт ли сайт для ИИ",
    "Понимает ли ИИ, о чём ваш сайт",
    "Видит ли ИИ содержание страниц",
    "Видит ли ИИ заголовки и описания",
    "Понятна ли ИИ структура сайта",
    "Видит ли ИИ изображения на сайте",
    "Считает ли ИИ ваш сайт безопасным",
    "Учитывает ли ИИ ваш сайт при поиске",
    "Выделяет ли ИИ ваш сайт среди других",
    "Как оценивает ИИ ваш сайт",
  ];

  const totalTime = 20;
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [finished, setFinished] = useState(false);
  const [fadeHeader, setFadeHeader] = useState(false);
  const [showDots, setShowDots] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showResultText, setShowResultText] = useState(false);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 100 / totalTime));
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    const factorTimer = setInterval(() => {
      setCurrent((p) => (p < factors.length - 1 ? p + 1 : p));
    }, (totalTime / factors.length) * 1000);

    setTimeout(() => setFadeHeader(true), 1500);
    setTimeout(() => setShowDots(true), 1900);

    setTimeout(() => {
      setFinished(true);
      setTimeout(() => setShowFinal(true), 1400);
      setTimeout(() => setShowResultText(true), 2200);

      setTimeout(async () => {
        try {
          const resp = await fetch("/api/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "quick", url }),
          });
          const json = await resp.json();
          if (json?.url) router.push(json.url);
          else router.push("/pay");
        } catch {
          router.push("/pay");
        }
      }, 4000);
    }, totalTime * 1000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(factorTimer);
    };
  }, [router, url]);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      <TopLights active={showDots} />

      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      <p className="text-base text-neutral-400 mt-1 mb-2">
        https://www.magicofdiscoveries.com/english &nbsp; | &nbsp; Дата: {today}
      </p>

      <div className="my-6 flex items-center justify-center">
        <div
          className={`flex items-center justify-center text-[22px] sm:text-[24px] font-bold transition-all duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)] transform ${
            fadeHeader
              ? "opacity-60 text-neutral-400 translate-y-[-6px]"
              : "opacity-100 text-neutral-800 translate-y-0"
          }`}
        >
          Мы начали проверку
          <span className="inline-flex w-[1.7ch] justify-start tabular-nums align-middle ml-1">
            {showDots && (
              <>
                <Dots colorClass="text-neutral-400" />
                <Dots colorClass="text-blue-400/70 absolute" />
              </>
            )}
          </span>
        </div>
      </div>

      <div className="rounded-md p-0">
        <div className="h-[64px] flex items-center justify-center transition-opacity duration-700 ease-in-out">
          <p key={current} className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp">
            {factors[current]}
          </p>
          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fadeInUp {
              animation: fadeInUp 0.8s ease forwards;
            }
          `}</style>
        </div>

        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
          {showResultText && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn flex items-center">
                Получить результат
                <Dots colorClass="text-white ml-1" />
              </p>
              <style jsx>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }
                .animate-fadeIn {
                  animation: fadeIn 1s ease forwards;
                }
              `}</style>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-neutral-600 mb-4">
          Анализ 10 ключевых факторов
        </p>

        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
          {!finished && (
            <div
              className="absolute left-0 top-0 h-full bg-gray-300 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / totalTime) * 100}%` }}
            />
          )}

          {finished && (
            <div
              className={`absolute left-0 top-0 h-full w-full transition-all duration-700 ease-in-out ${
                showFinal
                  ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 opacity-100"
                  : "bg-gray-200 opacity-0"
              }`}
            />
          )}

          {!finished && (
            <div className="relative z-10 flex items-center justify-center h-full text-neutral-500 text-sm font-medium transition-opacity duration-500">
              {timeLeft > 0 ? `Проверка завершится через ${timeLeft} сек` : ""}
            </div>
          )}

          {finished && showFinal && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm transition-opacity duration-700">
                Проверка завершена
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-20 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data. Not legal advice.
        </span>
      </footer>
    </main>
  );
}
