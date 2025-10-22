"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Обёртка для Suspense (Next.js 14)
export default function ReviewsPageWrapper() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Загрузка...</div>}>
      <ReviewsPage />
    </Suspense>
  );
}

// Анимация точек
function Dots() {
  return (
    <span className="inline-flex w-[1.7ch] justify-start tabular-nums align-baseline">
      <span className="dot">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
      <style jsx>{`
        .dot {
          opacity: 0.2;
          animation: aiv-dots 1200ms infinite;
          position: relative;
          top: 2px;
        }
        .dot2 {
          animation-delay: 200ms;
        }
        .dot3 {
          animation-delay: 400ms;
        }
        @keyframes aiv-dots {
          0% { opacity: 0.2; }
          30% { opacity: 1; }
          60% { opacity: 0.2; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </span>
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
  const [hideForm, setHideForm] = useState(false);

  // Загружаем статистику и реальные отзывы
  useEffect(() => {
    document.body.style.opacity = "1";
    async function fetchData() {
      try {
        const [statsResp, reviewsResp] = await Promise.all([
          fetch("/api/reviews/stats"),
          fetch("/api/reviews/list"),
        ]);
        const stats = await statsResp.json();
        const data = await reviewsResp.json();

        if (stats?.rating) setRating(stats.rating);
        if (stats?.reviews) setReviewsCount(stats.reviews);
        if (data?.ok && Array.isArray(data.reviews)) setReviews(data.reviews);
      } catch (err) {
        console.error("Ошибка загрузки отзывов:", err);
      }
    }
    fetchData();
  }, []);
  // Автоматическое скрытие карточки "Спасибо!"
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

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

    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });
      const data = await res.json();

      if (data.ok) {
        setStatus("success");
        setShowSuccess(true);
        setHideForm(true);
        setName("");
        setText("");
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const sortedReviews = [...reviews].sort((a, b) =>
    sortMode === "new"
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : (b.rating || 0) - (a.rating || 0)
  );

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 transition-opacity duration-700 relative">
      {/* Рейтинг и количество */}
      <p className="text-center mb-8 text-lg">
        <span
          className="inline-block"
          style={{ fontSize: "18px", color: "#facc15", WebkitTextStroke: "0.8px #eab308", letterSpacing: "2px" }}
        >
          ★★★★★
        </span>{" "}
        <span className="text-gray-700 ml-[6px]">
          {rating.toFixed(1)} <span className="text-neutral-500">({reviewsCount})</span>
        </span>
      </p>

      {isAddMode && !hideForm && (
        <form onSubmit={handleSubmit} className="mb-12 flex flex-col gap-4 w-full max-w-md mx-auto">
          <input type="text" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md p-2" required />
          <textarea placeholder="Ваш отзыв..." value={text} onChange={(e) => setText(e.target.value)}
            className="border border-gray-300 rounded-md p-2 h-32 resize-none" required />
          <button type="submit" disabled={status === "loading"}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center items-center">
            {status === "loading" ? <span className="inline-flex items-center">Отправка<Dots /></span> : "Отправить"}
          </button>
        </form>
      )}

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl text-green-700 text-center py-4 shadow-sm transition-all duration-700 mb-10">
          Спасибо! Ваш отзыв отправлен на модерацию.
        </div>
      )}

      <p className="text-center leading-relaxed text-[16px] mb-14" style={{ color: "#475569" }}>
        Поделитесь своим мнением, расскажите о себе или своей компании, вашу историю увидят тысячи пользователей по всему миру
      </p>

      <div className="flex justify-center space-x-4 mt-6 mb-10 text-sm font-medium">
        <button onClick={() => setSortMode("new")} className={`px-3 py-1 rounded-full transition-colors ${
          sortMode === "new" ? "text-blue-600 bg-blue-50" : "text-neutral-600 hover:bg-neutral-100"
        }`}>Сначала новые</button>
        <button onClick={() => setSortMode("popular")} className={`px-3 py-1 rounded-full transition-colors ${
          sortMode === "popular" ? "text-blue-600 bg-blue-50" : "text-neutral-600 hover:bg-neutral-100"
        }`}>Сначала популярные</button>
      </div>

      <div className="space-y-6">
        {sortedReviews.map((r, i) => (
          <div key={i} className="bg-gray-50 rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-start space-x-2 mb-3">
              <div className="flex">{renderStars(r.rating || 5)}</div>
              <span className="font-semibold text-gray-800">{r.name}</span>
              {r.date && (
                <span className="text-neutral-400 text-sm">
                  · {new Date(r.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed text-[15px] text-justify">{r.text}</p>
          </div>
        ))}
      </div>

      <button onClick={handleBack} className="fixed bottom-16 right-6 px-4 py-3 rounded-full text-white text-sm font-medium shadow-lg transition-opacity"
        style={{ background: "linear-gradient(90deg,#2563eb 0%,#3b82f6 100%)", opacity: 0.9 }}>
        На главную
      </button>

      <footer className="mt-12 text-center text-xs text-neutral-500 leading-relaxed">
        <p className="text-neutral-700">© 2025 AI Signal Max. All rights reserved.</p>
        <p className="opacity-60">Показатели видимости рассчитаны приблизительно и основаны на общедоступных данных.</p>
        <p className="opacity-60">Не являются юридической консультацией.</p>
      </footer>
    </main>
  );
}
