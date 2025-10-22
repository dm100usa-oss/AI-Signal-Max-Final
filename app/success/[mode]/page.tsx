"use client";

import { useEffect, useState } from "react";
import Donut from "../../../components/Donut";

type Mode = "quick" | "pro";

interface Factor {
  key: string;
  name: string;
  desc: string;
  status: "Good" | "Moderate" | "Poor";
}

export default function SuccessPage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode as Mode;
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = currentUrl.searchParams.get("url") || "";
        setUrl(targetUrl);

        const res = await fetch(`/api/result?url=${encodeURIComponent(targetUrl)}`);
        const data = await res.json();

        if (!data || !data.score) throw new Error("No valid data");

        setScore(data.score);

        const allFactors = [
          { key: "robots_txt", name: "Robots.txt", desc: "Управляет тем, видят ли ваш сайт ИИ-платформы." },
          { key: "sitemap_xml", name: "Sitemap.xml", desc: "Сообщает ИИ, какие страницы существуют и должны индексироваться." },
          { key: "x_robots_tag", name: "X-Robots-Tag", desc: "Серверная настройка, разрешающая отображение страниц в результатах." },
          { key: "meta_robots", name: "Meta Robots", desc: "Мета-тег, контролирующий, могут ли страницы показываться ИИ." },
          { key: "canonical", name: "Canonical", desc: "Указывает ИИ, какая страница является основной." },
          { key: "title_tag", name: "Title Tag", desc: "Определяет заголовок, который видят пользователи и ИИ." },
          { key: "meta_description", name: "Meta Description", desc: "Краткое описание страницы, отображаемое под заголовком." },
          { key: "open_graph", name: "Open Graph", desc: "Делает ссылки красивыми в превью и результатах ИИ." },
          { key: "h1_present", name: "H1 Heading", desc: "Главный заголовок, поясняющий ИИ, о чём страница." },
          { key: "structured_data", name: "Structured Data", desc: "Разметка JSON-LD, помогающая ИИ понимать содержание страницы." },
          { key: "mobile_friendly", name: "Mobile Friendly", desc: "Обеспечивает удобство просмотра на мобильных устройствах." },
          { key: "https", name: "HTTPS", desc: "Безопасный протокол, повышающий доверие и рейтинг." },
          { key: "alt_attributes", name: "Alt Texts", desc: "Подписи к изображениям, помогающие ИИ интерпретировать визуалы." },
          { key: "favicon", name: "Favicon", desc: "Маленький значок, завершающий визуальную идентичность сайта." },
          { key: "page_404", name: "404 Page", desc: "Сообщает ИИ, что запрашиваемая страница не существует." },
        ];

        const mappedFactors = allFactors.map((f) => ({
          ...f,
          status: data.results[f.key] || "Moderate",
        }));

        setFactors(mode === "quick" ? mappedFactors.slice(0, 5) : mappedFactors);

        if (data.score >= 80) {
          setSummary("Ваш сайт хорошо виден для ИИ-платформ. Большинство параметров настроены корректно.");
        } else if (data.score >= 40) {
          setSummary("Ваш сайт частично виден для ИИ-платформ. Некоторые параметры требуют доработки.");
        } else {
          setSummary("Ваш сайт плохо виден для ИИ-платформ. Большинство параметров настроены неверно и ограничивают видимость.");
        }
      } catch (err) {
        console.error("Failed to load analysis:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mode]);

  const date = new Date().toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center text-gray-600">
        <p>Загрузка результатов...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold text-center mb-2">
        {mode === "quick"
          ? "Результаты быстрой проверки видимости сайта"
          : "Полный аудит видимости сайта"}
      </h1>

      {url && (
        <div className="mb-6 text-center text-sm text-neutral-600">
          Сайт: {url} &nbsp; | &nbsp; Дата: {date}
        </div>
      )}

      <div className="flex justify-center mb-6">
        <Donut score={score} />
      </div>

      <div className="max-w-xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 text-center mb-10">
        <p className="text-lg font-medium text-gray-800">{summary}</p>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 text-center mt-8 mb-6">
        Проверенные параметры
      </h2>

      <div className="space-y-4">
        {factors.map((f, i) => (
          <FactorItem key={i} factor={f} />
        ))}
      </div>

      <div className="mt-10 text-center space-y-4">
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-2 rounded-2xl text-white"
          style={{
            background:
              mode === "quick"
                ? "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)"
                : "linear-gradient(90deg, #059669 0%, #10b981 100%)",
          }}
        >
          На главную
        </button>

        {/* Новая кнопка оставить отзыв */}
        <button
          onClick={() => (window.location.href = "/reviews")}
          className="px-6 py-2 rounded-2xl text-black font-medium border border-yellow-400 hover:bg-yellow-50 transition-colors"
          style={{
            background: "#fef9c3",
          }}
        >
          ★ Оставить отзыв
        </button>

        {mode === "pro" && (
          <p className="text-sm text-gray-600 mt-3">
            Полный отчёт и чек-лист для разработчика отправлены на ваш email.
          </p>
        )}
      </div>

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

function StatusText({ status }: { status: Factor["status"] }) {
  const colors = {
    Good: "text-green-600",
    Moderate: "text-yellow-600",
    Poor: "text-red-600",
  };
  const labels = {
    Good: "Хорошо",
    Moderate: "Средне",
    Poor: "Плохо",
  };
  return (
    <span className={`text-base font-semibold ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

function FactorItem({ factor }: { factor: Factor }) {
  const borderColors = {
    Good: "border-green-500",
    Moderate: "border-yellow-500",
    Poor: "border-red-500",
  };
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm flex items-center">
      <div className="flex items-start space-x-4 flex-1">
        <div
          className={`w-5 h-5 flex-shrink-0 rounded-full border-2 ${borderColors[factor.status]}`}
        />
        <div>
          <p className="font-semibold">{factor.name}</p>
          <p className="text-sm text-gray-600">{factor.desc}</p>
        </div>
      </div>
      <div className="w-24 text-right">
        <StatusText status={factor.status} />
      </div>
    </div>
  );
}
