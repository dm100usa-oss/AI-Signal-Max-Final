"use client";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full h-[12px] bg-gray-200 rounded-md overflow-hidden">
      <div
        className="h-[12px] bg-gradient-to-r from-gray-300 via-blue-400 to-blue-600 transition-all duration-300 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
