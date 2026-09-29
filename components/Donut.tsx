"use client";

import { useEffect, useState } from "react";

export default function Donut({ score }: { score: number }) {
  const [circleProgress, setCircleProgress] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 2000;
    const target = Math.min(Math.max(score, 0), 100);

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const fraction = Math.min(elapsed / duration, 1);

      // ease-out cubic
      const eased = 1 - Math.pow(1 - fraction, 3);

      setCircleProgress(eased * target);

      if (fraction < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [score]);

  const radius = 90;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circleProgress / 100) * circumference;

  const getGradientColor = (value: number) => {
    if (value <= 50) {
      const ratio = value / 50;
      return interpolateColor("#ef4444", "#f59e0b", ratio);
    } else {
      const ratio = (value - 50) / 50;
      return interpolateColor("#f59e0b", "#10b981", ratio);
    }
  };

  function interpolateColor(color1: string, color2: string, factor: number) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    const result = {
      r: Math.round(c1.r + (c2.r - c1.r) * factor),
      g: Math.round(c1.g + (c2.g - c1.g) * factor),
      b: Math.round(c1.b + (c2.b - c1.b) * factor),
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  }

  function hexToRgb(hex: string) {
    const parsed = parseInt(hex.slice(1), 16);
    return {
      r: (parsed >> 16) & 255,
      g: (parsed >> 8) & 255,
      b: parsed & 255,
    };
  }

  return (
    <svg width="260" height="260" className="drop-shadow-lg">
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={radius}
        cx="130"
        cy="130"
      />
      <circle
        stroke={getGradientColor(circleProgress)}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx="130"
        cy="130"
        transform="rotate(-90 130 130)"
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
        dy=".3em"
        fontSize="48"
        fontWeight="700"
        fill="#111827"
        style={{
          filter:
            "drop-shadow(0 0 3px white) drop-shadow(0 0 4px rgba(0,0,0,0.25))",
        }}
      >
        {circleProgress.toFixed(0)}%
      </text>
    </svg>
  );
}
