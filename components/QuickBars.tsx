"use client";

import type { AiScores } from "./PartScores";

function colorFor(value: number): string {
  if (value >= 75) return "#16a34a"; // зелёный
  if (value >= 40) return "#eab308"; // жёлтый
  return "#dc2626"; // красный
}

interface QuickBarsProps {
  scores: AiScores;
  title: string;
  labels: { home: string; content: string; tech: string; authority: string };
}

export default function QuickBars({ scores, title, labels }: QuickBarsProps) {
  const rows = [
    { label: labels.home, value: scores.home },
    { label: labels.content, value: scores.content },
    { label: labels.tech, value: scores.tech },
    { label: labels.authority, value: scores.authority },
  ];

  return (
    <div className="max-w-xl mx-auto mb-6">
      <div className="rounded-2xl p-4 sm:p-6 bg-white/60 backdrop-blur-sm shadow-md border border-gray-100">
        <p className="text-lg font-semibold text-gray-800 text-center mb-4">{title}</p>
        <div className="flex flex-col gap-3">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1 text-base text-gray-800">{r.label}</div>
              <div className="w-24 h-3 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full w-full origin-left"
                  style={{
                    backgroundColor: colorFor(r.value),
                    animation: "quickBarCycle 10s ease-in-out infinite",
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes quickBarCycle {
          0% { transform: scaleX(0); opacity: 1; }
          30% { transform: scaleX(1); opacity: 1; }
          75% { transform: scaleX(1); opacity: 1; }
          88% { transform: scaleX(1); opacity: 0; }
          100% { transform: scaleX(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
