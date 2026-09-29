"use client";

import { useEffect, useState } from "react";

export default function ScoreRing({
  score = 78,
  size = 132,
}: {
  score?: number;
  size?: number;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = Math.min(Math.max(score, 0), 100);

    if (prefersReduced) {
      setProgress(target);
      return;
    }

    let raf = 0;
    let start: number | null = null;

    function animate(timestamp: number) {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const fraction = Math.min(elapsed / 3500, 1);
      // ease-in-out cubic — плавный разгон и плавная остановка
      const eased =
        fraction < 0.5
          ? 4 * fraction * fraction * fraction
          : 1 - Math.pow(-2 * fraction + 2, 3) / 2;
      setProgress(eased * target);
      if (fraction < 1) raf = requestAnimationFrame(animate);
    }

    function run() {
      start = null;
      setProgress(0);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(animate);
    }

    run();
    const interval = setInterval(run, 10000);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
    };
  }, [score]);

  const stroke = size * 0.081;
  const center = size / 2;
  const radius = size * 0.346;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  function hexToRgb(hex: string) {
    const parsed = parseInt(hex.slice(1), 16);
    return { r: (parsed >> 16) & 255, g: (parsed >> 8) & 255, b: parsed & 255 };
  }

  function interpolateColor(c1hex: string, c2hex: string, factor: number) {
    const c1 = hexToRgb(c1hex);
    const c2 = hexToRgb(c2hex);
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  }

  const getColor = (value: number) => {
    if (value <= 50) {
      return interpolateColor("#ef4444", "#f59e0b", value / 50);
    }
    return interpolateColor("#f59e0b", "#10b981", (value - 50) / 50);
  };

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={radius}
        cx={center}
        cy={center}
      />
      <circle
        stroke={getColor(progress)}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={center}
        cy={center}
        transform={`rotate(-90 ${center} ${center})`}
        style={{
          filter:
            "drop-shadow(0 2px 4px rgba(0,0,0,0.25)) drop-shadow(0 0 6px rgba(0,0,0,0.15))",
          transition: "stroke 0.3s linear",
        }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".35em"
        fontSize={size * 0.185}
        fontWeight={700}
        fill="#111827"
        style={{
          filter:
            "drop-shadow(0 0 3px white) drop-shadow(0 0 4px rgba(0,0,0,0.25))",
        }}
      >
        {progress.toFixed(0)}%
      </text>
    </svg>
  );
}
