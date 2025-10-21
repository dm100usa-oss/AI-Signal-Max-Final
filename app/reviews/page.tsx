"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReviewsPage() {
  const router = useRouter();

  useEffect(() => {
    document.body.style.opacity = "1";
  }, []);

  const reviews = [
    {
      name: "Michael S.",
      date: "October 18, 2025",
      rating: 5,
      text: "Accurate and fast. The report helped me understand why my site wasn’t visible in ChatGPT.",
    },
    {
      name: "Anna R.",
      date: "October 14, 2025",
      rating: 5,
      text: "Very clear explanations. I fixed several issues immediately after the report.",
    },
    {
      name: "Carlos M.",
      date: "October 12, 2025",
      rating: 4,
      text: "Helpful overview, though I’d like to see deeper analysis for structured data.",
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 transition-opacity duration-700">
      <h1 className="text-2xl font-semibold text-center mb-2">
        Reviews & Stories
      </h1>

      <p className="text-center text-gray-700 mb-8">
        ★★★★★ 4.9 (128)
      </p>

      <p className="text-center text-neutral-600 leading-relaxed mb-12">
        Share your thoughts. <br />
        Tell us about yourself or your company. <br />
        Your story will be seen by thousands of people around the world.
      </p>

      <div className="space-y-6">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-6 text-left"
          >
            <p className="text-yellow-500 mb-2">
              {"★★★★★".slice(0, r.rating)}
            </p>
            <p className="font-semibold text-gray-800">{r.name}</p>
            <p className="text-sm text-neutral-500 mb-3">{r.date}</p>
            <p className="text-gray-700 leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 rounded-2xl text-white"
          style={{
            background:
              "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
          }}
        >
          Back to Home
        </button>
      </div>

      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data.
          Not legal advice.
        </span>
      </footer>
    </main>
  );
}
