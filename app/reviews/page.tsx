"use client";

import { useState } from "react";

export default function ReviewsPage() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-semibold mb-6">Оставить отзыв</h1>

      {status === "success" ? (
        <p className="text-green-600 text-lg">Спасибо! Ваш отзыв успешно отправлен.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-md"
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
      )}

      {status === "error" && (
        <p className="text-red-600 mt-4">Ошибка. Попробуйте позже.</p>
      )}
    </div>
  );
}
