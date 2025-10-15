"use client";

import ProgressBar from "./ProgressBar";

export default function QuickPreview() {
  return (
    <div className="text-center">
      {/* Статичная строка */}
      <p className="text-xl font-medium text-neutral-800 mb-8">
        Мы начали проверку:
      </p>

      {/* Первый фактор */}
      <p className="text-lg md:text-xl text-neutral-700 mb-4">
        Открыт ли сайт для ИИ
      </p>

      {/* Полоса прогресса */}
      <div className="w-full">
        <ProgressBar progress={100} duration={2000} />
      </div>
    </div>
  );
}
