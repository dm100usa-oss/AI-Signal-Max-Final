"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function QuickPreviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const url = searchParams.get("url") || "";
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("Checking website...");
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

  useEffect(() => {
    if (!url) {
      router.push("/");
      return;
    }

    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 800);

    const timer = setTimeout(async () => {
      try {
        setStatus("Redirecting to secure payment...");
        setRedirecting(true);

        const resp = await fetch("/api/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "quick",
            url,
          }),
        });

        const data = await resp.json();

        if (data?.url) {
          window.location.href = data.url;
        } else {
          setStatus("Payment session could not be created.");
          setRedirecting(false);
        }
      } catch (err) {
        console.error(err);
        setStatus("Error connecting to payment system.");
        setRedirecting(false);
      }
    }, steps.length * 800 + 500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [url, router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
      <h1 className="text-2xl font-semibold mb-6">
        We started checking your website
      </h1>
      {!redirecting ? (
        <>
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
        <p className="text-green-600 text-lg font-medium animate-pulse">
          {status}
        </p>
      )}
    </main>
  );
}
