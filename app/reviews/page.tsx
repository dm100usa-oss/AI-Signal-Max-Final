"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/hooks/useTranslation";
import en from "@/locales/en";
import ru from "@/locales/ru";

export default function ReviewsPageWrapper() {
  return (
    <Suspense fallback={null}>
      <ReviewsPage />
    </Suspense>
  );
}

function Dots() {
  return (
    <span className="inline-flex w-[1.7ch] justify-start tabular-nums align-baseline">
      <span className="dot">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
      <style jsx>{`
        .dot { opacity: 0.2; animation: aiv-dots 1200ms infinite; position: relative; top: 2px; }
        .dot2 { animation-delay: 200ms; }
        .dot3 { animation-delay: 400ms; }
        @keyframes aiv-dots { 0% { opacity: 0.2; } 30% { opacity: 1; } 60% { opacity: 0.2; } 100% { opacity: 0.2; } }
      `}</style>
    </span>
  );
}

function ReviewsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const isAddMode = params.get("add") === "true";
  const lang = useLang();
  const t = lang === "ru" ? ru.reviews : en.reviews;
  const tf = lang === "ru" ? ru.footer : en.footer;

  const [rating, setRating] = useState<number | null>(null);
  const [reviewsCount, setReviewsCount] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showSuccess, setShowSuccess] = useState(false);
  const [hideForm, setHideForm] = useState(false);

  useEffect(() => {
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
        console.error("Error loading reviews:", err);
      }
    }
    fetchData();
  }, []);

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
        style={{ fontSize: "18px", WebkitTextStroke: "0.8px #eab308", marginRight: "2px" }}
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
        body: JSON.stringify({ name, text, rating: userRating }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
        setShowSuccess(true);
        setHideForm(true);
        setName("");
        setText("");
        setUserRating(5);
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 transition-opacity duration-700 relative">
      <p className="text-center mb-8 text-lg">
        <span
          className="inline-block"
          style={{ fontSize: "18px", color: "#facc15", WebkitTextStroke: "0.8px #eab308", letterSpacing: "2px" }}
        >
          ★★★★★
        </span>{" "}
        <span className="text-gray-700 ml-[6px]">
          {rating !== null ? rating.toFixed(1) : ""}{" "}
          <span className="text-neutral-500">
            {reviewsCount !== null ? `(${reviewsCount})` : ""}
          </span>
        </span>
      </p>

      <div className="mb-12 text-center">
        <h2 className="text-sm font-medium text-neutral-500 mb-4">
          {t.whatUsersNote}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 text-sm font-medium">
          {t.tags.map((tag, i) => (
            <span key={i} className="px-4 py-1 rounded-full bg-blue-50 text-blue-600">{tag}</span>
          ))}
        </div>
      </div>

      {isAddMode && !hideForm && (
        <form onSubmit={handleSubmit} className="mb-12 flex flex-col gap-4 w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
            required
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">{t.ratingLabel}</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl transition-all hover:scale-110"
                  style={{
                    color: star <= (hoverRating || userRating) ? "#facc15" : "#d1d5db",
                    WebkitTextStroke: "1px #eab308",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            placeholder={t.reviewPlaceholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border border-gray-300 rounded-md p-2 h-32 resize-none"
            required
          />
          <button
            type="submit"
            disabled={status === "loading" || userRating === 0}
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.12), 0 6px 16px rgba(30,40,60,0.16)" }}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] md:ring-1 md:ring-black/5 disabled:opacity-70 flex justify-center items-center"
          >
            {status === "loading" ? (
              <span className="inline-flex items-center">{t.submitting}<Dots /></span>
            ) : (
              t.submitButton
            )}
          </button>
        </form>
      )}

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl text-green-700 text-center py-4 shadow-sm transition-all duration-700 mb-10">
          {t.successMessage}
        </div>
      )}

      {status === "error" && !showSuccess && (
        <div className="text-red-600 text-center mb-6">{t.errorMessage}</div>
      )}

      <p className="text-center leading-relaxed text-[16px] mb-14" style={{ color: "#475569" }}>
        {t.shareText}
      </p>

      <div className="space-y-6">
        {sortedReviews.map((r, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-start space-x-2 mb-3">
              <div className="flex">{renderStars(r.rating || 5)}</div>
              <span className="font-semibold text-gray-800">{r.name}</span>
              {r.date && (
                <span className="text-neutral-400 text-sm">
                  ·{" "}
                  {new Date(r.date).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed text-[15px] text-justify">{r.text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleBack}
        className="fixed bottom-16 right-6 px-4 py-3 rounded-full text-white text-sm font-medium transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] md:ring-1 md:ring-black/5"
        style={{ background: "linear-gradient(90deg,#2563eb 0%,#3b82f6 100%)", opacity: 0.9, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.12), 0 6px 16px rgba(30,40,60,0.16)" }}
      >
        {t.backHome}
      </button>

      <footer className="mt-12 text-center text-xs text-neutral-500 leading-relaxed">
        <p className="text-neutral-700">{tf.copyright}</p>
        <p className="opacity-60">{tf.disclaimer}</p>
      </footer>
    </main>
  );
}
