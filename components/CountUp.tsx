"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({
  to,
  duration = 2200,
  className,
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setValue(to);
      return;
    }

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      // easeOutCubic — быстрый старт, плавная остановка
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [to, duration]);

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        fontVariantNumeric: "tabular-nums",
        minWidth: `${String(to).length}ch`,
        textAlign: "right",
      }}
    >
      {value}
    </span>
  );
}
