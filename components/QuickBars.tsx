"use client";

import type { AiScores } from "./PartScores";

type Status = "good" | "olive" | "amber" | "redorange" | "poor";

function statusFor(value: number): Status {
  if (value >= 80) return "good";
  if (value >= 65) return "olive";
  if (value >= 55) return "amber";
  if (value >= 40) return "redorange";
  return "poor";
}

// приглушённые полупрозрачные градиенты; зелёный только с 80
const GRADIENTS: Record<Status, string> = {
  good: "linear-gradient(180deg, rgba(52,211,153,0.62) 0%, rgba(22,163,74,0.62) 60%, rgba(18,129,60,0.62) 100%)",
  olive: "linear-gradient(180deg, rgba(163,196,89,0.62) 0%, rgba(132,169,22,0.62) 60%, rgba(110,140,17,0.62) 100%)",
  amber: "linear-gradient(180deg, rgba(251,191,36,0.62) 0%, rgba(217,119,6,0.62) 60%, rgba(180,98,4,0.62) 100%)",
  redorange: "linear-gradient(180deg, rgba(248,113,63,0.62) 0%, rgba(220,80,38,0.62) 60%, rgba(185,60,28,0.62) 100%)",
  poor: "linear-gradient(180deg, rgba(220,60,60,0.62) 0%, rgba(178,28,28,0.62) 60%, rgba(140,20,20,0.62) 100%)",
};

const STATUS_KEY: Record<Status, "good" | "moderate" | "poor"> = {
  good: "good",
  olive: "good",
  amber: "moderate",
  redorange: "poor",
  poor: "poor",
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
        <div className="flex flex-col gap-3">
          {rows.map((r, i) => {
            const st = statusFor(r.value);
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 text-base text-gray-800 whitespace-nowrap">{r.label}</div>
                <div
                  className="rounded-md overflow-hidden shrink-0"
                  style={{ width: "96px", height: "32px", backgroundColor: "#eef0f2", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)" }}
                >
                  <div
                    className="h-full w-full flex items-center justify-center origin-left"
                    style={{
                      backgroundImage: GRADIENTS[st],
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                      borderRadius: "6px",
                      animation: "quickBarFill 20s ease-in-out infinite",
                      animationDelay: `${i * 0.6}s`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#fff",
                        textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                        animation: "quickBarText 20s ease-in-out infinite",
                        animationDelay: `${i * 0.6}s`,
                      }}
                    >
                      {statusText[STATUS_KEY[st]]}
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
