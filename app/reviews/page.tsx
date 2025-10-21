"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewsPage() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    document.body.style.opacity = "1";

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setShowButton(scrollY > height * 0.2); // появляется после 20% прокрутки
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const reviews = [
    {
      name: "Сергей К.",
      date: "18 октября 2025",
      rating: 5,
      text: "Не знал, что у сайта может быть «видимость для ИИ». После проверки понял, почему ChatGPT не находил мой бизнес. Очень полезно — теперь хотя бы ясно, с чего начинать.",
    },
    {
      name: "Елена М.",
      date: "16 октября 2025",
      rating: 5,
      text: "Прошла полную проверку и получила готовое техническое задание для разработчика. Чётко, по пунктам, с пояснениями. Это реально сэкономило время и деньги — раньше на это ушли бы недели.",
    },
    {
      name: "Андрей П.",
      date: "14 октября 2025",
      rating: 4,
      text: "Интересная идея — измерять, как ИИ видит сайт. Сделал оценку сам, всё просто. Потом отправил отчёт друзьям-владельцам сайтов как подарок. Все были удивлены результатами.",
    },
    {
      name: "Марина С.",
      date: "11 октября 2025",
      rating: 5,
      text: "Обратилась в AI Signal Max, потому что потеряла контакт со старым разработчиком. Тут сразу разобрали, что мешает видимости сайта. Приятно, когда работаешь с теми, кто реально понимает, что делает.",
    },
    {
      name: "Алексей Г.",
      date: "15 октября 2025",
      rating: 5,
      text: "Занимаюсь интернет-маркетингом и помогаю компаниям выстраивать digital-присутствие. Когда узнал про AI Signal Max, решил проверить, насколько мои сайты видны для ИИ-платформ. После полной проверки получил подробный отчёт и готовое ТЗ для разработчиков — сразу внёс нужные правки. Теперь проекты клиентов лучше индексируются нейросетями. Если интересно — вот мой сайт brandpoint.pro и один из кейсов coffeehub.store.",
    },
  ];

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`inline-block ${
            i <= full ? "text-yellow-400" : "text-transparent"
          }`}
          style={{
            fontSize: "18px",
            WebkitTextStroke: "0.8px #eab308",
            marginRight: "2px",
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleBack = () => {
    document.body.style.transition = "opacity 0.6s ease";
    document.body.style.opacity = "0";
    setTimeout(() => router.push("/"), 600);
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 transition-opacity duration-700 relative">
      {/* Заголовок */}
      <h1
        className="text-2xl font-semibold text-center mb-2"
        style={{ color: "#9ca3af" }}
      >
        Отзывы и Истории
      </h1>

      {/* Звёзды под заголовком */}
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
        <span className="text-gray-700">4.9 (128)</span>
      </p>

      {/* Три строки вступления */}
      <p
        className="text-center leading-relaxed mb-12 text-[16px]"
        style={{ color: "#475569" }}
      >
        Поделитесь своим мнением. <br />
        Расскажите о себе или своей компании. <br />
        Вашу историю увидят тысячи пользователей по всему миру.
      </p>

      {/* Список отзывов */}
      <div className="space-y-6">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-start space-x-2 mb-3">
              <div className="flex">{renderStars(r.rating)}</div>
              <span className="font-semibold text-gray-800">{r.name}</span>
              <span className="text-neutral-400 text-sm">· {r.date}</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-[15px] text-justify">
              {r.text}
            </p>
          </div>
        ))}
      </div>

      {/* Плавающая кнопка */}
      {showButton && (
        <button
          onClick={handleBack}
          className="fixed bottom-6 right-6 px-4 py-3 rounded-full text-white text-sm font-medium shadow-lg transition-opacity"
          style={{
            background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
            opacity: 0.95,
          }}
        >
          На главную
        </button>
      )}

      {/* Футер */}
      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. Все права защищены.
        <br />
        <span className="opacity-60">
          Оценки видимости рассчитаны приблизительно на основе открытых данных.
          Не являются юридической консультацией.
        </span>
      </footer>
    </main>
  );
}
