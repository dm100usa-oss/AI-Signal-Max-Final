"use client";

import type { AiScores } from "./PartScores";

type Status = "good" | "moderate" | "poor";

function statusFor(value: number): Status {
  if (value >= 75) return "good";
  if (value >= 40) return "moderate";
  return "poor";
}

// премиальные градиенты в стиле кнопок: светлее сверху, темнее снизу
const GRADIENTS: Record<Status, string> = {
  good: "linear-gradient(180deg, #34d399 0%, #16a34a 60%, #12813c 100%)",
  moderate: "linear-gradient(180deg, #fbbf24 0%, #eab308 60%, #ca9a04 100%)",
  poor: "linear-gradient(180deg, #f87171 0%, #dc2626 60%, #b41d1d 100%)",
};

interface QuickBarsProps {
  scores: AiScores;
  title: string;
  labels: { home: string; content: string; tech: string; authority: string };
  statusText: { good: string; moderate: string; poor: string };
}

export default function QuickBars({ scores, title, labels, statusText }: QuickBarsProps) {
  const rows = [
    { label: labels.home, value: scores.home },
    { label: labels.content, value: scores.content },
    { label: labels.tech, value: scores.tech },
    { label: labels.authority, value: scores.authority },
  ];

  return (
    <div className="max-w-xl mx-auto mb-6">
      <div className="rounded-2xl p-4 sm:p-6 bg-white/60 backdrop-blur-sm shadow-md border border-gray-100">
        <p className="text-lg font-semibold text-gray-800 text-center mb-5">{title}</p>
        <div className="flex flex-col gap-3.5">
          {rows.map((r, i) => {
            const st = statusFor(r.value);
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="text-base text-gray-800 flex-shrink-0" style={{ width: "120px" }}>
                  {r.label}
                </div>
                <div
                  className="flex-1 rounded-md overflow-hidden"
                  style={{ height: "26px", backgroundColor: "#eef0f2", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)" }}
                >
                  <div
                    className="h-full w-full flex items-center justify-center origin-left"
                    style={{
                      backgroundImage: GRADIENTS[st],
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), 0 1px 2px rgba(0,0,0,0.12)",
                      borderRadius: "6px",
                      animation: "quickBarFill 10s ease-in-out infinite",
                      animationDelay: `${i * 0.5}s`,
                    }}
                  >
                    <span
                      className="quick-bar-label"
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#fff",
                        textShadow: "0 1px 1px rgba(0,0,0,0.25)",
                        animation: "quickBarText 10s ease-in-out infinite",
                        animationDelay: `${i * 0.5}s`,
                      }}
                    >
                      {statusText[st]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        @keyframes quickBarFill {
          0% { transform: scaleX(0); opacity: 1; }
          25% { transform: scaleX(1); opacity: 1; }
          80% { transform: scaleX(1); opacity: 1; }
          92% { transform: scaleX(1); opacity: 0; }
          100% { transform: scaleX(0); opacity: 0; }
        }
        @keyframes quickBarText {
          0%, 24% { opacity: 0; }
          30% { opacity: 1; }
          80% { opacity: 1; }
          88% { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
