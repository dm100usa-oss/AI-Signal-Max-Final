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
          { key: "robots_txt", name: "Robots.txt", desc: "Определяет, могут ли платформы ИИ видеть ваш сайт." },
          { key: "sitemap_xml", name: "Sitemap.xml", desc: "Сообщает ИИ, какие страницы существуют и подлежат индексации." },
          { key: "x_robots_tag", name: "X-Robots-Tag", desc: "Указывает ИИ, могут ли страницы появляться в результатах." },
          { key: "meta_robots", name: "Meta Robots", desc: "Контролирует, может ли ИИ показывать страницу." },
          { key: "canonical", name: "Canonical", desc: "Указывает ИИ, какая страница является основной версией." },
          { key: "title_tag", name: "Title Tag", desc: "Определяет заголовок, видимый в результатах поиска или ИИ." },
          { key: "meta_description", name: "Meta Description", desc: "Краткое описание, отображаемое ИИ под заголовком." },
          { key: "open_graph", name: "Open Graph", desc: "Делает ссылки красивыми в ИИ и социальных сетях." },
          { key: "h1_present", name: "H1 Heading", desc: "Главный заголовок, объясняющий ИИ, о чём страница." },
          { key: "structured_data", name: "Structured Data", desc: "Разметка JSON-LD, помогающая ИИ понять контент страницы." },
          { key: "mobile_friendly", name: "Mobile Friendly", desc: "Обеспечивает удобство использования на телефонах и планшетах." },
          { key: "https", name: "HTTPS", desc: "Протокол безопасности, повышающий доверие и рейтинг." },
          { key: "alt_attributes", name: "Alt Texts", desc: "Подписи к изображениям, помогающие ИИ понимать визуалы." },
          { key: "favicon", name: "Favicon", desc: "Маленькая иконка, завершающая визуальный стиль сайта." },
          { key: "page_404", name: "404 Page", desc: "Сообщает ИИ, что запрашиваемого ресурса не существует." },
        ];

        const mappedFactors = allFactors.map((f) => ({
          ...f,
          status: data.results[f.key] || "Moderate",
        }));

        setFactors(mode === "quick" ? mappedFactors.slice(0, 5) : mappedFactors);

        if (data.score >= 80) {
          setSummary("Ваш сайт хорошо виден для ИИ-платформ. Большинство параметров настроены корректно.");
        } else if (data.score >= 40) {
          setSummary("Ваш сайт частично виден для ИИ-платформ. Некоторые параметры требуют улучшения.");
        } else {
          setSummary("Ваш сайт слабо виден для ИИ-платформ. Большинство параметров настроены неправильно.");
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
          ? "Результаты быстрой проверки"
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

      {/* Кнопки */}
      <div className="mt-10 flex flex-col items-center space-y-3">
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full max-w-xs px-6 py-3 rounded-2xl text-white font-medium text-base"
          style={{
            background:
              mode === "quick"
                ? "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)"
                : "linear-gradient(90deg, #059669 0%, #10b981 100%)",
          }}
        >
          Назад на главную
        </button>

        <button
          onClick={() => (window.location.href = "/reviews?add=true")}
          className="w-full max-w-xs px-6 py-3 rounded-2xl text-gray-800 font-medium text-base bg-yellow-100 border border-yellow-400 hover:bg-yellow-200 transition-colors flex items-center justify-center space-x-2"
        >
          <span
            style={{
              color: "#facc15",
              WebkitTextStroke: "0.8px #eab308",
              fontSize: "20px",
              lineHeight: "20px",
            }}
          >
            ★
          </span>
          <span>Оставить отзыв</span>
        </button>
      </div>

      {mode === "pro" && (
        <p className="text-sm text-gray-600 text-center mt-4">
          Полный отчёт и чек-лист разработчика отправлены вам на email.
        </p>
      )}

      <footer className="mt-12 text-center text-xs text-neutral-500 leading-relaxed">
        <p>© 2025 AI Signal Max. All rights reserved.</p>
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
  return (
    <span className={`text-base font-semibold ${colors[status]}`}>
      {status === "Good"
        ? "Хорошо"
        : status === "Moderate"
        ? "Средне"
        : "Плохо"}
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
