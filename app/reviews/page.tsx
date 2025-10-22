"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewsPageWrapper() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Загрузка...</div>}>
      <ReviewsPage />
    </Suspense>
  );
}

function ReviewsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const isAddMode = params.get("add") === "true";

  const [reviews, setReviews] = useState([
    { name: "Сергей", text: "Очень полезный инструмент — быстро и понятно." },
    { name: "Елена", text: "AI Signal Max помог найти ошибки на сайте!" },
    { name: "Андрей", text: "Отличная идея! Теперь вижу, как улучшить SEO и AI-доступность." },
    { name: "Марина", text: "Всё чётко, лаконично и профессионально." },
    { name: "Алексей", text: "Настоящая находка для бизнеса." },
  ]);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showForm, setShowForm] = useState(isAddMode);
  const [showThanks, setShowThanks] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setStatus("loading");

    await new Promise((r) => setTimeout(r, 3000));

    try {
      const res = await fetch("/api/reviews/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });
      const data = await res.json();

      if (data.ok) {
        setStatus("success");
        setReviews((prev) => [{ name, text }, ...prev]);
        setName("");
        setText("");
        setShowThanks(true);
        setShowForm(false);
        setTimeout(() => setShowThanks(false), 4000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 pt-16 pb-20">
      <h1 className="text-2xl font-semibold text-center mb-6">Отзывы</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => router.push("/reviews?sort=new")}
          className="text-sm text-blue-600 hover:underline"
        >
          Сначала новые
        </button>
        <button
          onClick={() => router.push("/reviews?sort=popular")}
          className="text-sm text-blue-600 hover:underline"
        >
          Сначала популярные
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 p-4 border border-gray-200 rounded-lg shadow-sm transition-opacity duration-500"
        >
          <input
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-3 p-2 border border-gray-300 rounded-md"
            required
          />
          <textarea
            placeholder="Ваш отзыв"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full mb-3 p-2 border border-gray-300 rounded-md h-24"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? (
              <span className="inline-flex items-end">
                Отправка<span className="dot">.</span>
                <span className="dot dot2">.</span>
                <span className="dot dot3">.</span>
              </span>
            ) : (
              "Отправить отзыв"
            )}
          </button>
          <style jsx>{`
            .dot {
              opacity: 0.2;
              animation: aiv-dots 1200ms infinite;
            }
            .dot2 {
              animation-delay: 200ms;
            }
            .dot3 {
              animation-delay: 400ms;
            }
            @keyframes aiv-dots {
              0% {
                opacity: 0.2;
              }
              30% {
                opacity: 1;
              }
              60% {
                opacity: 0.2;
              }
              100% {
                opacity: 0.2;
              }
            }
          `}</style>
        </form>
      )}

      {showThanks && (
        <div className="mb-10 p-6 text-center border border-green-200 rounded-lg bg-green-50 text-green-700 opacity-100 transition-opacity duration-1000">
          Спасибо! Ваш отзыв отправлен на модерацию
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            <p className="font-medium mb-1">{r.name}</p>
            <p className="text-gray-700">{r.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-blue-600 hover:underline"
        >
          На главную страницу
        </button>
      </div>
    </main>
  );
}
