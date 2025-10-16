"use client";

import { useEffect, useRef } from "react";

interface ProgressBarProps {
  progress: number;
  duration?: number;
}

export default function ProgressBar({ progress, duration = 2000 }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    let start: number | null = null;
    let frame: number;

    const target = Math.min(Math.max(progress, 0), 100);

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const fraction = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - fraction, 3);
      const width = eased * target;

      if (barRef.current) {
        barRef.current.style.width = `${width}%`;
      }

      if (fraction < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [progress, duration]);

  return (
    <div className="w-full h-[12px] bg-[#E5E7EB] rounded-[2px] overflow-hidden">
      <div
        ref={barRef}
        className="h-[12px] rounded-[2px]"
        style={{
          width: "0%",
          background: "linear-gradient(to right, #F3F4F6 0%, #93C5FD 50%, #3B82F6 100%)",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}
