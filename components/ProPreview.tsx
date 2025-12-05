"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// dots
function Dots({ colorClass = "text-white" }: { colorClass?: string }) {
  return (
    <span className={`inline-flex w-[1.7ch] justify-start tabular-nums align-middle ${colorClass}`}>
      <span className="dot">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
    </span>
  );
}

export default function FullPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "https://example.com";

  const factors = [
    "Открыт ли сайт для ИИ",
    "Понимает ли ИИ, о чём ваш сайт",
    "Понятна ли ИИ структура сайта",
    "Видит ли ИИ заголовки и описания",
    "Видит ли ИИ содержание страниц",
    "Видит ли ИИ изображения на сайте",
    "Может ли ИИ переходить по ссылкам сайта",
    "Воспринимает ли ИИ сайт как источник информации",
    "Считает ли ИИ ваш сайт логичным",
    "Считает ли ИИ ваш сайт безопасным",
    "Понимает ли ИИ категорию вашего сайта",
    "Учитывает ли ИИ ваш сайт при поиске",
    "Выделяет ли ИИ ваш сайт среди других",
    "Считает ли ИИ ваш сайт полезным",
    "Как оценивает ИИ ваш сайт",
  ];

  const totalTime = 47;
  const auditTime = 30;
  const reportTime = 14;

  const [current, setCurrent] = useState(0);
  const [progressAudit, setProgressAudit] = useState(0);
  const [progressReport, setProgressReport] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [fadeHeader, setFadeHeader] = useState(false);
  const [auditDone, setAuditDone] = useState(false);
  const [reportsDone, setReportsDone] = useState(false);
  const [finished, setFinished] = useState(false);
  const [reportStage, setReportStage] = useState<"audit" | "owner" | "dev" | "final">("audit");

  // svg ref
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    // движение пунктов
    const factorTimer = setInterval(() => {
      setCurrent((p) => (p < factors.length - 1 ? p + 1 : p));
    }, (auditTime / factors.length) * 1000);

    // движение progressAudit
    const auditProgressTimer = setInterval(() => {
      setProgressAudit((p) => {
        const next = p + 100 / auditTime;
        if (next >= 100) {
          clearInterval(auditProgressTimer);
          setAuditDone(true);
          setTimeout(() => setReportStage("owner"), 300);
        }
        return Math.min(next, 100);
      });
    }, 1000);

    // reportStage
    const reportStartDelay = auditTime * 1000;
    setTimeout(() => {
      const reportProgressTimer = setInterval(() => {
        setProgressReport((p) => {
          const next = p + 100 / reportTime;
          if (next >= 100) {
            clearInterval(reportProgressTimer);
            setReportsDone(true);
          }
          if (next >= 100 - 100 / reportTime) {
            setReportStage("final");
          }
          return Math.min(next, 100);
        });
      }, 1000);
      setTimeout(() => setReportStage("dev"), 6000);
    }, reportStartDelay);

    // общий таймер
    const overallTimer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    // переход на оплату
    setTimeout(() => {
      setFinished(true);
      setTimeout(async () => {
        try {
          const resp = await fetch("/api/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "pro", url }),
          });
          const json = await resp.json();
          if (json?.url) router.push(json.url);
          else router.push("/pay");
        } catch {
          router.push("/pay");
        }
      }, 4000);
    }, totalTime * 1000);

    setTimeout(() => setFadeHeader(true), 1500);

    return () => {
      clearInterval(factorTimer);
      clearInterval(overallTimer);
    };
  }, [router, url]);

  // вычисление заполнения для пути svg
  const totalCircles = 15;
  const positions = Array.from({ length: totalCircles }, (_, i) => (i / (totalCircles - 1)) * 100);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center bg-white">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-4 text-neutral-900">
        AI Signal Max
      </h1>

      <p className="text-base text-neutral-400 mt-1 mb-2">
        {url} &nbsp; | &nbsp; Date:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {/* header */}
      <div
        className={`text-[22px] sm:text-[24px] font-bold my-6 flex items-center justify-center transition-all duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          fadeHeader
            ? "opacity-60 text-neutral-400 translate-y-[-6px]"
            : "opacity-100 text-neutral-800 translate-y-0"
        }`}
      >
        <span className="flex items-center justify-center">
          Мы начали полный аудит
          <span className="inline-flex w-[1.7ch] justify-start ml-1">
            {fadeHeader && <Dots colorClass="text-green-400/70" />}
          </span>
        </span>
      </div>

      <div className="rounded-md p-0">
        {/* Факторы */}
        <div className="h-[64px] flex items-center justify-center transition-opacity duration-700 ease-in-out">
          <p key={current} className="text-lg sm:text-xl font-medium text-neutral-900 animate-fadeInUp">
            {factors[current]}
          </p>
        </div>

        {/* Верхняя полоса */}
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-4">
          <div
            className={`h-full bg-green-600 transition-[width] duration-1000 ease-linear`}
            style={{
              width: `${progressAudit}%`,
            }}
          />
          {auditDone && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn">
                Аудит завершён
              </p>
            </div>
          )}
        </div>

        {/* подпись */}
        <div className="h-[32px] flex items-center justify-center mb-2">
          <p key={reportStage} className="text-sm sm:text-base text-neutral-600 font-medium animate-fadeInUp">
            {reportStage === "final"
              ? "Отчёт для владельца • ТЗ для разработчика"
              : reportStage === "audit"
              ? "Аудит 15 ключевых факторов"
              : reportStage === "owner"
              ? "Формируем отчёт для владельца сайта"
              : "Создаём ТЗ для разработчика"}
          </p>
        </div>

        {/* НОВАЯ СРЕДНЯЯ ПОЛОСА */}
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200 mb-6 flex items-center justify-center">
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
          >
            {/* Серая линия-основа */}
            <line
              x1="50"
              y1="50"
              x2="950"
              y2="50"
              stroke="#d1d5db"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Зелёная линия-прогресс */}
            <line
              x1="50"
              y1="50"
              x2={50 + (900 * progressAudit) / 100}
              y2="50"
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
              style={{ transition: "x2 1s linear" }}
            />

            {/* Кружки + галочки */}
            {positions.map((pos, i) => {
              const cx = 50 + (900 * pos) / 100;
              const cy = 50;

              const threshold = pos;
              const active = progressAudit >= threshold;

              return (
                <g key={i}>
                  {/* круг */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    stroke="#d1d5db"
                    fill="none"
                    strokeWidth="3"
                  />

                  {/* галочка */}
                  {active && (
                    <polyline
                      points={`${cx - 6},${cy} ${cx - 2},${cy + 5} ${cx + 7},${cy - 8}`}
                      stroke="#22c55e"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ opacity: active ? 1 : 0, transition: "opacity 0.5s linear" }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="h-4"></div>

        {/* Нижняя */}
        <div className="relative w-full h-12 rounded-md overflow-hidden bg-gray-200">
          {!finished && (
            <>
              <div
                className="absolute left-0 top-0 h-full bg-gray-300 transition-[width] duration-1000 ease-linear"
                style={{ width: `${(timeLeft / totalTime) * 100}%` }}
              />
              <div className="relative z-10 flex items-center justify-center h-full text-neutral-500 text-sm font-medium transition-opacity duration-500">
                {`Полный аудит завершится через ${timeLeft} сек`}
              </div>
            </>
          )}
          {finished && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-600 animate-fadeIn">
              <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-sm animate-fadeIn flex items-center justify-center">
                Получить результат <Dots colorClass="text-white" />
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease forwards;
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
      `}</style>

      <footer className="mt-20 text-center text-xs text-neutral-500">
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
