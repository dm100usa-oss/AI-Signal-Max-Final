"use client";

import { useEffect, useState } from "react";

export interface AiScores {
  overall: number;
  tech: number;
  home: number;
  content: number;
  authority: number;
}

interface PartTexts {
  explainTitle: string;
  explainIntro: string;
  partsTitle: string;
  home: string;
  tech: string;
  content: string;
  authority: string;
  homeHint: string;
  techHint: string;
  contentHint: string;
  authorityHint: string;
  weakNote: string;
}

function colorFor(value: number): string {
  // пороги методики AI Scores (5 ступеней): 85 / 75 / 55 / 35
  if (value >= 75) return "#10b981"; // зелёный — хорошая / высокая готовность
  if (value >= 55) return "#f59e0b"; // жёлтый — частичная готовность
  return "#ef4444"; // красный — базовая / низкая
}

function SmallDonut({ score, label, hint, weak }: { score: number; label: string; hint: string; weak: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1400;
    const target = Math.min(Math.max(score, 0), 100);
    function animate(ts: number) {
      if (!start) start = ts;
      const f = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - f, 3);
      setProgress(eased * target);
      if (f < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [score]);

  const radius = 42;
  const stroke = 8;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;
  const size = 110;
  const c = size / 2;

  return (
    <div
      className="flex flex-col items-center text-center px-2 py-3 rounded-2xl"
      style={{
        background: weak ? "rgba(239,68,68,0.06)" : "transparent",
        border: weak ? "1px solid rgba(239,68,68,0.35)" : "1px solid transparent",
      }}
    >
      <svg width={size} height={size}>
        <circle stroke="#e5e7eb" fill="transparent" strokeWidth={stroke} r={radius} cx={c} cy={c} />
        <circle
          stroke={colorFor(progress)}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          r={radius}
          cx={c}
          cy={c}
          transform={`rotate(-90 ${c} ${c})`}
          style={{ transition: "stroke 0.3s linear" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="26"
          fontWeight="700"
          fill="#111827"
        >
          {progress.toFixed(0)}
        </text>
      </svg>
      <p className="mt-2 text-sm font-semibold text-gray-800">{label}</p>
      <p className="mt-1 text-xs text-gray-500 leading-snug max-w-[140px]">{hint}</p>
    </div>
  );
}

export default function PartScores({ scores, t }: { scores: AiScores; t: PartTexts }) {
  // самая слабая часть — для подсветки
  const parts = [
    { key: "home", value: scores.home, label: t.home, hint: t.homeHint },
    { key: "tech", value: scores.tech, label: t.tech, hint: t.techHint },
    { key: "content", value: scores.content, label: t.content, hint: t.contentHint },
    { key: "authority", value: scores.authority, label: t.authority, hint: t.authorityHint },
  ];
  const minValue = Math.min(...parts.map((p) => p.value));

  return (
    <div className="max-w-2xl mx-auto mb-10">
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
        {t.explainTitle}
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6 max-w-xl mx-auto leading-relaxed">
        {t.explainIntro}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 justify-items-center">
        {parts.map((p) => (
          <SmallDonut
            key={p.key}
            score={p.value}
            label={p.label}
            hint={p.hint}
            weak={p.value === minValue && p.value < 75}
          />
        ))}
      </div>
      {minValue < 75 && (
        <p className="text-xs text-center text-red-500 mt-4">{t.weakNote}</p>
      )}
    </div>
  );
}
