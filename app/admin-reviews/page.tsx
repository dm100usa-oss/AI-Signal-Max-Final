"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Review {
  name: string;
  text: string;
  rating: number;
  date: string;
  approved: boolean;
}

export default function AdminReviews() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [pending, setPending] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const ADMIN_PASSWORD = "admin123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
      loadPending();
    } else {
      alert("Неверный пароль");
    }
  };

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews/pending");
      const data = await res.json();
      if (data.ok) {
        setPending(data.reviews || []);
      }
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    }
    setLoading(false);
  };

  const handleApprove = async (review: Review) => {
    try {
      const res = await fetch("/api/reviews/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      const data = await res.json();
      if (data.ok) {
        alert("Отзыв одобрен!");
        loadPending();
      } else {
        alert("Ошибка одобрения");
      }
    } catch (err) {
      alert("Ошибка: " + err);
    }
  };

  const handleDelete = async (review: Review) => {
    if (!confirm("Удалить этот отзыв?")) return;
    
    try {
      const res = await fetch("/api/reviews/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: review.name, text: review.text }),
      });
      const data = await res.json();
      if (data.ok) {
        alert("Отзыв удалён!");
        loadPending();
      } else {
        alert("Ошибка удаления");
      }
    } catch (err) {
      alert("Ошибка: " + err);
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Админ-панель</h1>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 mb-4"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Модерация отзывов</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          На главную
        </button>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Неодобренных отзывов: <span className="font-bold">{pending.length}</span>
        </p>
        <button
          onClick={loadPending}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Обновить
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Загрузка...</p>}

      {!loading && pending.length === 0 && (
        <p className="text-center text-gray-500 py-12">Нет отзывов на модерации</p>
      )}

      <div className="space-y-4">
        {pending.map((review, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-lg">{review.name}</p>
                <p className="text-sm text-gray-500">
                  Рейтинг: {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} ({review.rating}/5)
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(review.date).toLocaleString("ru-RU")}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{review.text}</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(review)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                ✓ Одобрить
              </button>
              <button
                onClick={() => handleDelete(review)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                ✕ Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
