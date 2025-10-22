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

  const [sortMode, setSortMode] = useState<"new" | "popular">("new");
  const [rating, setRating] = useState<number>(4.9);
  const [reviewsCount, setReviewsCount] = useState<number>(128);
  const [reviews, setReviews] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showSuccess, setShowSuccess] = useState(false);

  // загрузка отзывов из Redis
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews/store", { cache: "no-store" });
        const data = await res.json();
        if (data?.ok && Array.isArray(data.reviews)) {
          const sorted = data.reviews.sort(
            (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setReviews(sorted);
          setReviewsCount(sorted.length);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchReviews();
  }, []);

  // имитация отправки и плавное исчезновение карточки
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`inline-block ${i < full ? "text-yellow-400" : "text-transparent"}`}
        style={{
          fontSize: "18px",
          WebkitTextStroke: "0.8px #eab308",
          marginRight: "2px",
        }}
      >
        ★
      </span>
    ));
  };

  const handleBack = () => router.push("/");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // имитация задержки 2 секунды
      await new Promise((r) => setTimeout(r, 2000));

      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });

      const data = await res.json();

      if (data.ok) {
        setStatus("success");
        setShowSuccess(true);
        setName("");
        setText("");

        // обновить список отзывов
        const updated = await fetch("/api/reviews/store", { cache: "no-store" });
        const updatedData = await updated.json();
        if (updatedData?.ok && Array.isArray(updatedData.reviews)) {
          const sorted = updatedData.reviews.sort(
            (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setReviews(sorted);
          setReviewsCount(sorted.length);
        }
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 transition-opacity duration-700 relative">
      {/* Рейтинг и количество */}
      <p className="text-center mb-8 text-lg">
        <span
          className="inline-block"
          style={{
            fontSize: "18px",
            color: "#facc15",
            WebkitTextStroke: "0.8px #eab308",
            letterSpacing: "2px",
          }}
        >
          ★★★★★
        </span>{" "}
        <span className="text-gray-700 ml-[6px]">
          {rating.toFixed(1)}{" "}
          <span className="text-neutral-500">({reviewsCount})</span>
        </span>
      </p>

      {/* Форма добавления */}
      {isAddMode && (
        <div className="mb-12">
          {showSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-xl text-green-700 text-center py-4 shadow-sm opacity-100 transition-opacity duration-700">
              Спасибо! Ваш отзыв отправлен на модерацию.
            </div>
          ) : status === "idle" || status === "error" ? (
            <>
              <h2 className="text-xl font-semibold text-center mb-6">Оставить отзыв</h2>
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
                  {status === "loading" ? (
                    <span className="inline-flex items-end">
                      Отправка
                      <span className="inline-flex w-[1.7ch] justify-start tabular-nums align-baseline ml-1">
                        <span className="dot">.</span>
                        <span className="dot dot2">.</span>
                        <span className="dot dot3">.</span>
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
                      </span>
                    </span>
                  ) : (
                    "Отправить"
                  )}
                </button>
              </form>
              {status === "error" && (
                <p className="text-red-600 mt-4 text-center">
                  Ошибка. Попробуйте позже.
                </p>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* Текст и сортировка */}
      <p
        className="text-center leading-relaxed text-[16px] mb-14"
        style={{ color: "#475569" }}
      >
        Поделитесь своим мнением, расскажите о себе или своей компании, вашу историю увидят тысячи пользователей по всему миру
      </p>

      <div className="flex justify-center space-x-4 mt-6 mb-10 text-sm font-medium">
        <button
          onClick={() => setSortMode("new")}
          className={`px-3 py-1 rounded-full transition-colors ${
            sortMode === "new"
              ? "text-blue-600 bg-blue-50"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          Сначала новые
        </button>
        <button
          onClick={() => setSortMode("popular")}
          className={`px-3 py-1 rounded-full transition-colors ${
            sortMode === "popular"
              ? "text-blue-600 bg-blue-50"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          Сначала популярные
        </button>
      </div>

      {/* Список отзывов */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((r, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-start space-x-2 mb-3">
                <div className="flex">{renderStars(5)}</div>
                <span className="font-semibold text-gray-800">{r.name}</span>
                <span className="text-neutral-400 text-sm">
                  ·{" "}
                  {new Date(r.date).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed text-[15px] text-justify">
                {r.text}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Отзывов пока нет</p>
        )}
      </div>

      {/* Кнопка "На главную" */}
      <button
        onClick={handleBack}
        className="fixed bottom-24 right-6 px-4 py-3 rounded-full text-white text-sm font-medium shadow-lg transition-opacity"
        style={{
          background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
          opacity: 0.9,
        }}
      >
        На главную
      </button>

      {/* Футер */}
      <footer className="mt-12 text-center text-xs text-neutral-500 leading-relaxed">
        <p className="text-neutral-700">© 2025 AI Signal Max. All rights reserved.</p>
        <p className="opacity-60">
          Показатели видимости рассчитаны приблизительно и основаны на общедоступных данных.
        </p>
        <p className="opacity-60">Не являются юридической консультацией.</p>
      </footer>
    </main>
  );
}
