"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ReviewsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [sortMode, setSortMode] = useState<"new" | "popular">("new");
  const [rating, setRating] = useState<number>(4.9);
  const [reviewsCount, setReviewsCount] = useState<number>(128);
  const [canInteract, setCanInteract] = useState(false);

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

    async function validate() {
      if (!token) return;
      try {
        const resp = await fetch(`/api/reviews/validate?token=${token}`);
        const data = await resp.json();
        if (data.ok) setCanInteract(true);
      } catch {}
    }

    fetchStats();
    validate();
  }, [token]);

  const reviews = [
    {
      name: "Сергей К.",
      date: "2025-10-18",
      rating: 5,
      likes: 42,
      text: "Не знал, что у сайта может быть «видимость для ИИ». После проверки понял, почему ChatGPT не находил мой бизнес. Очень полезно — теперь хотя бы ясно, с чего начинать.",
    },
    {
      name: "Елена М.",
      date: "2025-10-16",
      rating: 5,
      likes: 51,
      text: "Прошла полную проверку и получила готовое техническое задание для разработчика. Чётко, по пунктам, с пояснениями. Это реально сэкономило время и деньги — раньше на это ушли бы недели.",
    },
    {
      name: "Андрей П.",
      date: "2025-10-14",
      rating: 4,
      likes: 33,
      text: "Интересная идея — измерять, как ИИ видит сайт. Сделал оценку сам, всё просто. Потом отправил отчёт друзьям-владельцам сайтов как подарок. Все были удивлены результатами.",
    },
    {
      name: "Марина С.",
      date: "2025-10-11",
      rating: 5,
      likes: 60,
      text: "Обратилась в AI Signal Max, потому что потеряла контакт со старым разработчиком. Тут сразу разобрали, что мешает видимости сайта. Приятно, когда работаешь с теми, кто реально понимает, что делает.",
    },
    {
      name: "Алексей Г.",
      date: "2025-10-15",
      rating: 5,
      likes: 47,
      text: "Занимаюсь интернет-маркетингом и помогаю компаниям выстраивать digital-присутствие. Когда узнал про AI Signal Max, решил проверить, насколько мои сайты видны для ИИ-платформ. После полной проверки получил подробный отчёт и готовое ТЗ для разработчиков — сразу внёс нужные правки. Теперь проекты клиентов лучше индексируются нейросетями.",
    },
  ];

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortMode === "new") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortMode === "popular") return b.likes - a.likes;
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

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 transition-opacity duration-700 relative">
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

            <div
              className={`grid grid-cols-3 items-center text-center mt-4 text-sm text-neutral-600 w-[140px] ${
                canInteract ? "" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center">
                  <span
                    style={{
                      color: "#eab308",
                      fontWeight: "600",
                      transform: "scale(1.3)",
                      display: "inline-block",
                    }}
                  >
                    +
                  </span>
                </div>
              </div>
              <span className="text-center font-medium">{r.likes}</span>
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center">
                  <span style={{ color: "#111111", fontWeight: "600" }}>−</span>
                </div>
              </div>
            </div>

            {canInteract && (
              <div className="mt-3 text-sm text-blue-600 hover:underline cursor-pointer w-fit">
                Ответить
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleBack}
        className="fixed bottom-6 right-6 px-4 py-3 rounded-full text-white text-sm font-medium shadow-lg transition-opacity"
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

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-neutral-500">Загрузка...</div>}>
      <ReviewsContent />
    </Suspense>
  );
}
