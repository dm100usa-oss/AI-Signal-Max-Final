"use client";

import { useState } from "react";
import { useLang } from "@/hooks/useTranslation";
import en from "@/locales/en";
import ru from "@/locales/ru";

export default function AddReviewPage() {
  const lang = useLang();
  const t = lang === "ru" ? ru.addReview : en.addReview;

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
        setTimeout(() => setShowMessage(false), 3000);
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
          <h1 className="text-2xl font-semibold mb-6">{t.title}</h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full max-w-md"
          >
            <input
              type="text"
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
              required
            />
            <textarea
              placeholder={t.reviewPlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border border-gray-300 rounded-md p-2 h-32 resize-none"
              required
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.12), 0 6px 16px rgba(30,40,60,0.16)" }}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] md:ring-1 md:ring-black/5 disabled:opacity-50"
            >
              {status === "loading" ? t.submitting : t.submitButton}
            </button>
          </form>
        </>
      )}

      {showMessage && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-md text-center transition-opacity duration-700">
          <p className="text-lg font-medium">{t.successTitle}</p>
          <p>{t.successMessage}</p>
        </div>
      )}

      {status === "error" && !showMessage && (
        <p className="text-red-600 mt-4">{t.errorMessage}</p>
      )}
    </div>
  );
}
