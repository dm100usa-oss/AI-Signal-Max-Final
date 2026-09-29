"use client";

import { useEffect, useState } from "react";

const BARS = [
  { from: "#4F86FF", to: "#0D5BFF" },
  { from: "#FF9244", to: "#FF6A00" },
  { from: "#3FC68C", to: "#22A06B" },
];

export default function WorkBars({ size = 120 }: { size?: number }) {
  // visible — сколько столбиков уже показано (0..3)
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setVisible(3);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    function run() {
      setVisible(0);
      // появляются друг за другом
      timers.push(setTimeout(() => setVisible(1), 300));
      timers.push(setTimeout(() => setVisible(2), 1100));
      timers.push(setTimeout(() => setVisible(3), 1900));
    }

    run();
    const interval = setInterval(run, 10000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  const gap = size * 0.04;
  const barWidth = (size - gap * 2) / 3;
  const barHeight = size * 0.5;

  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{ width: size, height: size, gap }}
    >
      {BARS.map((bar, i) => (
        <div
          key={i}
          className="flex items-center justify-center font-bold text-white"
          style={{
            width: barWidth,
            height: barHeight,
            fontSize: barWidth * 0.5,
            background: `linear-gradient(180deg, ${bar.from} 0%, ${bar.to} 100%)`,
            borderRadius: size * 0.05,
            opacity: i < visible ? 1 : 0,
            transform: i < visible ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.55s ease-out, transform 0.55s ease-out",
            boxShadow:
              "0 8px 18px rgba(0,0,0,0.25), inset 0 2px 5px rgba(255,255,255,0.45), inset 0 -4px 8px rgba(0,0,0,0.18)",
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}
