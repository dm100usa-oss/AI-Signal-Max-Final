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
  );
}

function ReviewsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const isAddMode = params.get("add") === "true";

  const [sortMode, setSortMode] = useState<"new" | "popular">("new");
  const [rating, setRating] = useState<number>(4.9);
  const [reviewsCount, setReviewsCount] = useState<number>(128);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showSuccess, setShowSuccess] = useState(false);
  const [hideForm, setHideForm] = useState(false);

  useEffect(() => {
    document.body.style.opacity = "1";
    async function fetchStats() {
      try {
        const resp = await fetch("/api/reviews/stats");
        if (resp.ok) {
          const data = await resp.json();
          if (data?.rating && data?.reviews) {
            setRating(data.rating);
            setReviewsCount(data.reviews);
          }
        }
      } catch {}
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const reviews = [
    {
      name: "Сергей К.",
      date: "2025-10-18",
      rating: 5,
      text: "Не знал, что у сайта может быть «видимость для ИИ». После проверки понял, почему ChatGPT не находил мой бизнес. Очень полезно — теперь хотя бы ясно, с чего начинать.",
    },
    {
      name: "Елена М.",
      date: "2025-10-16",
      rating: 5,
      text: "Прошла полную проверку и получила готовое техническое задание для разработчика. Чётко, по пунктам, с пояснениями. Это реально сэкономило время и деньги — раньше на это ушли бы недели.",
    },
    {
      name: "Андрей П.",
      date: "2025-10-14",
      rating: 4,
      text: "Интересная идея — измерять, как ИИ видит сайт. Сделал оценку сам, всё просто. Потом отправил отчёт друзьям-владельцам сайтов как подарок. Все были удивлены результатами.",
    },
    {
      name: "Марина С.",
      date: "2025-10-11",
      rating: 5,
      text: "Обратилась в AI Signal Max, потому что потеряла контакт со старым разработчиком. Тут сразу разобрали, что мешает видимости сайта. Приятно, когда работаешь с теми, кто реально понимает, что делает.",
    },
    {
      name: "Алексей Г.",
      date: "2025-10-15",
      rating: 5,
      text: "Занимаюсь интернет-маркетингом и помогаю компаниям выстраивать digital-присутствие. После полной проверки получил отчёт и готовое ТЗ — сразу внёс нужные правки. Теперь проекты клиентов лучше индексируются нейросетями.",
    },
  ];

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortMode === "new") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortMode === "popular") return b.rating - a.rating;
    return 0;
  });

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

    await new Promise((resolve) => setTimeout(resolve, 2000));

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
        setTimeout(() => setShowSuccess(false), 4000);
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

      {isAddMode && !hideForm && (
        <div className="mb-12">
          {showSuccess ? (
            <div
              className={`bg-green-50 border border-green-200 rounded-xl text-green-700 text-center py-4 shadow-sm transition-all duration-700 ${
                showSuccess ? "opacity-100" : "opacity-0"
              }`}
            >
              Спасибо! Ваш отзыв отправлен на модерацию.
            </div>
          ) : (
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
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                  {status === "loading" ? (
                    <span className="inline-flex items-center">
                      Отправка
                      <Dots />
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
          )}
        </div>
      )}

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

      <div className="space-y-6">
        {sortedReviews.map((r, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-start space-x-2 mb-3">
              <div className="flex">{renderStars(r.rating)}</div>
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
        ))}
      </div>

      {/* Панель модерации, видна только при admin=true */}
      {params.get("admin") === "true" && (
        <section className="mt-16 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Модерация отзывов</h2>
          <AdminPanel />
        </section>
      )}

      <button
        onClick={handleBack}
        className="fixed bottom-16 right-6 px-4 py-3 rounded-full text-white text-sm font-medium shadow-lg transition-opacity"
        style={{
          background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
          opacity: 0.9,
        }}
      >
        На главную
      </button>

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

/* ----- Админ-панель для одобрения отзывов ----- */
function AdminPanel() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPending() {
      try {
        const res = await fetch("/api/reviews/pending");
        const data = await res.json();
        if (data.ok) setPending(data.reviews);
      } catch {
        setPending([]);
      }
    }
    loadPending();
  }, []);

  async function handleApprove(name: string, text: string) {
    setLoading(true);
    await fetch("/api/reviews/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, text }),
    });
    setPending((prev) => prev.filter((r) => r.name !== name || r.text !== text));
    setLoading(false);
  }

  if (!pending.length) {
    return <p className="text-center text-gray-500">Нет отзывов на модерации</p>;
  }

  return (
    <div className="space-y-4">
      {pending.map((r, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm flex justify-between items-start"
        >
          <div>
            <p className="font-medium text-gray-800 mb-1">{r.name}</p>
            <p className="text-gray-600">{r.text}</p>
          </div>
          <button
            onClick={() => handleApprove(r.name, r.text)}
            disabled={loading}
            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            Одобрить
          </button>
        </div>
      ))}
    </div>
  );
}
