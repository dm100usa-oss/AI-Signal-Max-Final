"use client";

import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

export default function QuickPreview() {
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center">
      {/* Статичная строка с плавным уменьшением и тускнением */}
      <p
        className={`font-semibold tracking-tight text-neutral-800 mb-8 transition-all duration-700 ${
          faded ? "text-lg opacity-60" : "text-2xl opacity-100"
        }`}
      >
        Мы начали проверку:
      </p>

      {/* Первый фактор — жирный, фокусный */}
      <p className="text-lg md:text-xl font-bold tracking-tight text-neutral-800 mb-4">
        Открыт ли сайт для ИИ
      </p>

      {/* Полоса прогресса */}
      <div className="w-full">
        <ProgressBar progress={100} duration={2000} />
      </div>
    </div>
  );
}
