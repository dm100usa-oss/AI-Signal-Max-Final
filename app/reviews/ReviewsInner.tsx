"use client";

import { useState, useEffect } from "react";

interface Review {
  id: number;
  name: string;
  text: string;
  date: string;
  rating: number;
}

export default function ReviewsInner() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const stored = localStorage.getItem("reviews");
    if (stored) setReviews(JSON.parse(stored));
  }, []);

  const addReview = () => {
    if (!name.trim() || !text.trim()) return;
    const newReview: Review = {
      id: Date.now(),
      name,
      text,
      rating,
      date: new Date().toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem("reviews", JSON.stringify(updated));
    setName("");
    setText("");
    setRating(5);
  };

  const deleteReview = (id: number) => {
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    localStorage.setItem("reviews", JSON.stringify(updated));
  };

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16">
      <h1 className="text-center text-3xl font-semibold mb-2">Отзывы</h1>
      <p className="text-center text-yellow-400 text-lg mb-2">★★★★★ Средняя оценка: 4.9 / 5</p>
      <p className="text-center text-neutral-600 mb-8">
        Поделитесь своим мнением. Расскажите о себе или своей компании. <br />
        Ваш отзыв увидят тысячи пользователей по всему миру.
      </p>

      {/* Форма */}
      <div className="mb-8 space-y-3">
        <input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-md px-3 py-2 border-neutral-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <textarea
          placeholder="Ваш отзыв"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full border rounded-md px-3 py-2 border-neutral-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <div className="flex justify-between items-center">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded-md px-2 py-1 border-neutral-300 text-sm focus:ring-1 focus:ring-blue-500"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} ★
              </option>
            ))}
          </select>
          <button
            onClick={addReview}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            Добавить отзыв
          </button>
        </div>
      </div>

      {/* Список отзывов */}
      <div className="space-y-6">
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-neutral-200 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 text-lg">
                  {"★".repeat(r.rating)}
                  <span className="text-neutral-300">
                    {"★".repeat(5 - r.rating)}
                  </span>
                </span>
                <span className="font-medium">{r.name}</span>
              </div>
              <span className="text-sm text-neutral-500">{r.date}</span>
            </div>
            <p className="text-neutral-700 text-sm mb-2">{r.text}</p>
            <button
              onClick={() => deleteReview(r.id)}
              className="text-xs text-rose-500 hover:underline"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
