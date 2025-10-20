"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReviewsPage() {
  const router = useRouter();

  useEffect(() => {
    document.body.style.opacity = "1";
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center">
      <h1 className="text-3xl font-semibold mb-4">Отзывы</h1>
      <p className="text-neutral-600 mb-8">
        Спасибо, что пользуетесь AI Signal Max.<br />
        Здесь скоро появятся отзывы пользователей.
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-sm transition-colors"
      >
        Вернуться на главную
      </button>
    </main>
  );
}
