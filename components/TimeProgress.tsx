"use client";

import { useEffect, useState } from "react";

export default function TimeProgress() {
  const totalTime = 24; // секунд
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      setProgress(Math.min((elapsed / totalTime) * 100, 100));
      setTimeLeft(Math.max(totalTime - Math.floor(elapsed), 0));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[10px] bg-gray-200 rounded-full overflow-hidden mt-8">
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-300 via-blue-400 to-blue-600 transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-neutral-600 text-sm font-medium">
        {timeLeft > 0 ? `Осталось: ${timeLeft} сек` : "Проверка завершена"}
      </div>
    </div>
  );
}
