"use client";

import { useState, useEffect } from "react";

export default function AddReviewPage() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showMessage, setShowMessage] = useState(false);

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

        // скрыть сообщение через 3 секунды
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-500">
      {!showMessage && status !== "success" && (
        <>
          <h1 className="text-2xl font-semibold mb-6">Оставить отзыв</h1>

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
        </>
      )}

      {showMessage && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-md text-center transition-opacity duration-700">
          <p className="text-lg font-medium">Спасибо!</p>
          <p>Ваш отзыв отправлен на модерацию.</p>
        </div>
      )}

      {status === "error" && !showMessage && (
        <p className="text-red-600 mt-4">Ошибка. Попробуйте позже.</p>
      )}
    </div>
  );
}
