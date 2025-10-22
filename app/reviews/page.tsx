"use client";

import { useEffect, useState } from "react";

interface Review {
  id: string;
  name: string;
  text: string;
  date: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetch("/api/reviews/list")
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch((err) => console.error("Error loading reviews:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });

      const data = await res.json();

      if (data.ok) {
        setStatus("success");
        setName("");
        setText("");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // Проверка на параметр ?add=true — показывать форму только после успеха проверки
  const [canAdd, setCanAdd] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("add") === "true") {
      setCanAdd(true);
    }
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold text-center mb-6">Отзывы</h1>

      {canAdd && !showMessage && status !== "success" && (
        <section className="bg-white shadow-sm rounded-xl p-6 mb-10 text-center">
          <h2 className="text-xl font-semibold mb-4">Оставить отзыв</h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full max-w-md mx-auto"
          >
            <input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
              required
            />
            <textarea
              placeholder="Ваш отзыв..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border border-gray-300 rounded-md p-2 h-32 resize-none"
              required
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Отправка..." : "Отправить"}
            </button>
          </form>

          {status === "error" && (
            <p className="text-red-600 mt-3">Ошибка. Попробуйте позже.</p>
          )}
        </section>
      )}

      {showMessage && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-md text-center mb-10 transition-opacity duration-700">
          <p className="text-lg font-medium">Спасибо!</p>
          <p>Ваш отзыв отправлен на модерацию.</p>
        </div>
      )}

      <p className="text-center text-gray-600 mb-6">
        Поделитесь своим мнением, расскажите о себе или своей компании, вашу историю увидят тысячи пользователей по всему миру
      </p>

      <div className="flex justify-center mb-6 space-x-4">
        <button className="text-blue-600 font-medium">Сначала новые</button>
        <button className="text-gray-400 hover:text-gray-600 transition">
          Сначала популярные
        </button>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white shadow-sm rounded-xl p-6"
          >
            <p className="font-semibold text-gray-800 mb-1">
              {review.name} <span className="text-gray-400 text-sm">· {review.date}</span>
            </p>
            <p className="text-gray-700">{review.text}</p>
          </div>
        ))}
      </div>

      <footer className="mt-12 text-center text-xs text-neutral-500 leading-relaxed">
        <p>© 2025 AI Signal Max. All rights reserved.</p>
        <p className="opacity-60">
          Показатели видимости рассчитаны приблизительно и основаны на общедоступных данных.
        </p>
        <p className="opacity-60">Не являются юридической консультацией.</p>
      </footer>
    </main>
  );
}
