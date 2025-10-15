"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickPreview() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Открыт ли сайт для ИИ",
    "Понимает ли ИИ, о чём ваш сайт",
    "Может ли ИИ читать содержание страниц",
    "Видит ли ИИ заголовки и описания",
    "Понимает ли ИИ структуру сайта",
    "Видит ли ИИ изображения на сайте",
    "Считает ли ИИ ваш сайт безопасным и заслуживающим доверия",
    "Учитывает ли ИИ ваш сайт при поиске",
    "Видит ли ИИ ваш сайт среди конкурентов",
    "Как оценивает ИИ ваш сайт",
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => setCurrentStep((prev) => prev + 1), 900);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => router.push("/api/pay"), 1000);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-md p-10 text-center">
        <h1 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 bg-clip-text text-transparent animate-pulse-smooth">
          Мы начали проверку вашего сайта
        </h1>

        <div className="space-y-6">
          {steps.slice(0, currentStep).map((step, index) => (
            <div key={index} className="text-left">
              <p className="text-gray-800 mb-2 font-medium">{step}</p>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-smooth {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-pulse-smooth {
          background-size: 200% 200%;
          animation: pulse-smooth 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
