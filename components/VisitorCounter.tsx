"use client";

import { useEffect, useRef, useState } from "react";
import { baseVisitors } from "@/lib/visits";

// Счётчик посетителей: базовое число (растёт со временем) + реальные заходы из Redis.
// Анимация повторяет поведение CountUp (easeOutCubic от 0 до итогового числа).
export function VisitorCounter({
  duration = 2200,
  className,
  labels,
}: {
  duration?: number;
  className?: string;
  labels?: { one: string; few: string; many: string };
}) {
  // выбор формы слова по числу (русское правило; для англ. one/many совпадают)
  function pluralLabel(n: number): string {
    if (!labels) return "";
    const mod100 = n % 100;
    const mod10 = n % 10;
    if (mod100 >= 11 && mod100 <= 14) return labels.many;
    if (mod10 === 1) return labels.one;
    if (mod10 >= 2 && mod10 <= 4) return labels.few;
    return labels.many;
  }
  // стартовое итоговое число — база на момент монтирования (реальные заходы добавятся после ответа API)
  const [target, setTarget] = useState<number>(() => baseVisitors());
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>();

  // задержка перед стартом анимации: первая секунда счётчик пустой
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // запрос реальных заходов: увеличивает счётчик на сервере и прибавляет к базе
  useEffect(() => {
    let cancelled = false;
    fetch("/api/visits")
      .then((r) => r.json())
      .then((d: { real?: number }) => {
        if (cancelled) return;
        const real = typeof d.real === "number" ? d.real : 0;
        setTarget(baseVisitors() + real);
      })
      .catch(() => {
        /* база уже показана, реальные заходы недоступны — это нормально */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // анимация до target (только после 3-секундной задержки)
  useEffect(() => {
    if (!started) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setValue(target);
      return;
    }

    startRef.current = null;
    const from = value;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // намеренно зависим только от target: анимируем при каждом изменении цели
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, started]);

  return (
    <>
      <span
        className={className}
        style={{
          display: "inline-block",
          fontVariantNumeric: "tabular-nums",
          minWidth: `${String(target).length}ch`,
          textAlign: "right",
        }}
      >
        {started ? value : ""}
      </span>
      {started && labels ? ` ${pluralLabel(target)}` : ""}
    </>
  );
}
