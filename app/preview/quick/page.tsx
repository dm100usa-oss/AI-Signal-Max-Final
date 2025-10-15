"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickPreviewPage({ searchParams }: { searchParams: { url?: string } }) {
  const router = useRouter();
  const url = searchParams?.url || "";

  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Starting analysis...");
  const [redirecting, setRedirecting] = useState(false);

  const steps = [
    "Connecting to the server",
    "Reading robots.txt and sitemap.xml",
    "Checking HTTPS and redirects",
    "Analyzing meta and OG tags",
    "Reviewing structured data",
    "Checking favicon and images",
    "Testing mobile-friendliness",
    "Measuring visibility factors",
    "Calculating AI Visibility Score",
    "Preparing payment session",
  ];

  // запуск имитации анализа
  useEffect(() => {
    if (!url) {
      router.push("/");
      return;
    }

    let i = 0;
    const stepInterval = setInterval(() => {
      setStep((prev) => {
        if (prev < steps.length - 1) {
          i++;
          setProgress(Math.min(100, ((i + 1) / steps.length) * 100));
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 800);

    const timer = setTimeout(async () => {
      try {
        setStatus("Redirecting to secure payment...");
        setRedirecting(true);

        const resp = await fetch("/api/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "quick", url }),
        });

        const data = await resp.json();
        if (data?.url) {
          window.location.href = data.url;
        } else {
          setStatus("Payment session could not be created.");
          setRedirecting(false);
        }
      } catch {
        setStatus("Error connecting to payment system.");
        setRedirecting(false);
      }
    }, steps.length * 800 + 500);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [url, router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
      <h1 className="text-2xl font-semibold mb-6">We started checking your website</h1>

      {!redirecting ? (
        <>
          {/* Анимация круга как на Success Page */}
          <div className="relative w-40 h-40 mb-8">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#3b82f6"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-semibold text-neutral-700">
                {Math.floor(progress)}%
              </span>
            </div>
          </div>

          <p className="text-neutral-600 mb-8">
            Please wait while we analyze your site before payment.
          </p>

          <ul className="text-sm text-neutral-700 max-w-md w-full text-left space-y-2">
            {steps.map((s, i) => (
              <li
                key={i}
                className={`transition-opacity duration-300 ${
                  i <= step ? "opacity-100" : "opacity-20"
                }`}
              >
                {i < step ? "✅" : "⏳"} {s}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-green-600 text-lg font-medium animate-pulse">{status}</p>
      )}

      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data. Not legal advice.
        </span>
      </footer>
    </main>
  );
}
