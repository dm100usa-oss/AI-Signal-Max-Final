"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewsPage() {
  const router = useRouter();
  const [sortMode, setSortMode] = useState<"new" | "popular">("new");
  const [rating, setRating] = useState<number>(4.9);
  const [reviewsCount, setReviewsCount] = useState<number>(128);

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
      {/* Звёзды, рейтинг и количество */}
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
          {rating.toFixed(1)} ({reviewsCount})
        </span>
      </p>

      {/* Текст приглашения */}
      <p
        className="text-center leading-relaxed text-[17px] mb-6"
        style={{ color: "#475569" }}
      >
        Поделитесь своим мнением, расскажите о себе или своей компании, вашу
        историю увидят тысячи пользователей по всему миру.
      </p>

      {/* Кнопки сортировки */}
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

            {/* Лайки, дизлайки, ответ */}
            <div className="flex items-center space-x-6 mt-3 text-sm text-neutral-500">
              <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                {/* Палец вверх (наш SVG) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 9V5a3 3 0 0 0-6 0v4H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h9l5-9V9h-4z" />
                </svg>
                <span>{r.likes}</span>
              </button>

              <button className="flex items-center space-x-1 hover:text-rose-600 transition-colors">
                {/* Палец вниз (наш SVG) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 15v4a3 3 0 0 0 6 0v-4h4a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-9l-5 9v2h4z" />
                </svg>
              </button>

              <button className="hover:text-blue-600 transition-colors">
                Ответить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Фиксированная кнопка */}
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

      {/* Футер */}
      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Показатели видимости рассчитаны приблизительно и основаны на
          общедоступных данных. Не являются юридической консультацией.
        </span>
      </footer>
    </main>
  );
}
