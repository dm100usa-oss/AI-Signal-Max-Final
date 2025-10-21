"use client";

import { useEffect, useState } from "react";

export default function ReviewsPage() {
  const [mode, setMode] = useState<"view" | "write" | "loading">("loading");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      setMode("view");
      return;
    }

    async function validate() {
      try {
        const res = await fetch(`/api/reviews/validate?token=${token}`);
        const data = await res.json();

        if (data.ok) {
          setMode("write");
        } else {
          setMode("view");
        }
      } catch {
        setMode("view");
      }
    }

    validate();
  }, []);

  if (mode === "loading") {
    return (
      <div className="flex h-[60vh] items-center justify-center text-neutral-500">
        Проверка доступа...
      </div>
    );
  }

  if (mode === "write") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold mb-6 text-center">Оставить отзыв</h1>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Ваше имя"
            className="w-full border rounded-lg px-4 py-2"
          />
          <textarea
            placeholder="Ваш отзыв..."
            className="w-full border rounded-lg px-4 py-2 h-32"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Отправить
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold mb-6 text-center">Отзывы пользователей</h1>
      <p className="text-neutral-500 text-center mb-8">
        Чтобы оставить отзыв, пройдите оплату проверки или перейдите по ссылке из письма.
      </p>

      {/* Здесь будет список отзывов */}
      <div className="space-y-6">
        <div className="border p-4 rounded-lg shadow-sm">
          <p className="font-medium mb-2">Анна, владелец сайта</p>
          <p className="text-neutral-600">
            Очень интересный сервис — отчёт оказался полезным для разработчика.
          </p>
        </div>

        <div className="border p-4 rounded-lg shadow-sm">
          <p className="font-medium mb-2">Михаил, SEO-специалист</p>
          <p className="text-neutral-600">
            Проверка помогла найти технические ошибки и повысить видимость в ChatGPT.
          </p>
        </div>
      </div>
    </div>
  );
}
