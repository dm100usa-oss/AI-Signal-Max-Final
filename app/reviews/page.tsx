"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [admin, setAdmin] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const key = searchParams.get("key");
    if (key && key === process.env.NEXT_PUBLIC_ADMIN_KEY) {
      setAdmin(true);
    }
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data || []));
  }, [searchParams]);

  const addReview = async () => {
    if (!name || !text) return;
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, text, rating }),
    });
    const data = await res.json();
    setReviews(data);
    setName("");
    setText("");
    setRating(5);
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Удалить отзыв?")) return;
    const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    setReviews(data);
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pt-20 pb-16">
      <h1 className="text-center text-4xl font-semibold mb-3">Отзывы</h1>
      <div className="text-center text-lg mb-2 text-yellow-500">★★★★★ Средняя оценка: 4.9 / 5</div>
      <p className="text-center text-neutral-600 mb-6">
        Поделитесь своим мнением.
        <br />
        Расскажите о себе или своей компании.
        <br />
        Ваш отзыв увидят тысячи пользователей по всему миру.
      </p>

      {admin && (
        <div className="mb-10 border rounded-lg p-4 shadow-sm bg-neutral-50">
          <h2 className="text-xl font-semibold mb-3">Добавить отзыв</h2>
          <div className="mb-2 flex space-x-1 text-yellow-400 text-2xl">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                onClick={() => setRating(i)}
                className={`cursor-pointer ${i <= rating ? "text-yellow-400" : "text-neutral-300"}`}
              >
                ★
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mb-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Ваш отзыв"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full border rounded-md px-3 py-2 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addReview}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 transition-colors"
          >
            Добавить отзыв
          </button>
        </div>
      )}

      <div className="space-y-6">
        {reviews.length === 0 && (
          <p className="text-center text-neutral-500">Пока нет отзывов.</p>
        )}
        {reviews
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((r) => (
            <div
              key={r.id}
              className="border rounded-lg p-5 shadow-sm bg-white"
            >
              <div className="flex space-x-1 text-yellow-400 text-lg mb-1">
                {Array.from({ length: r.rating }, (_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <div className="font-semibold text-neutral-800">{r.name}</div>
              <div className="text-sm text-neutral-500 mb-3">
                {r.date || ""}
              </div>
              <div className="text-neutral-700 leading-relaxed">{r.text}</div>
              {admin && (
                <button
                  onClick={() => deleteReview(r.id)}
                  className="text-sm text-rose-600 mt-2 hover:underline"
                >
                  Удалить
                </button>
              )}
            </div>
          ))}
      </div>
    </main>
  );
}
