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
  const [showSummary, setShowSummary] = useState(false); // задержка перед появлением текста

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

        // 🔹 Полный унифицированный список из 15 человеческих факторов
        const allFactors: Factor[] = [
          {
            key: "robots_txt",
            name: "Открыт ли сайт для ИИ",
            desc: "Проверяет, разрешён ли доступ ИИ-платформам к вашему сайту.",
            status: data.results["robots_txt"] || "Moderate",
          },
          {
            key: "h1_present",
            name: "Понимает ли ИИ, о чём ваш сайт",
            desc: "Проверяет, есть ли на сайте основной заголовок H1, который помогает ИИ определить тему страницы.",
            status: data.results["h1_present"] || "Moderate",
          },
          {
            key: "sitemap_xml",
            name: "Понятна ли ИИ структура сайта",
            desc: "Проверяет, есть ли карта сайта sitemap.xml и помогает ли она ИИ понять структуру страниц.",
            status: data.results["sitemap_xml"] || "Moderate",
          },
          {
            key: "title_tag",
            name: "Видит ли ИИ заголовки и описания",
            desc: "Определяет корректность тегов Title и Description, по которым ИИ формирует предварительное описание сайта.",
            status: data.results["title_tag"] || "Moderate",
          },
          {
            key: "structured_data",
            name: "Видит ли ИИ содержание страниц",
            desc: "Проверяет наличие структурированных данных (JSON-LD), помогающих ИИ понять контент сайта.",
            status: data.results["structured_data"] || "Moderate",
          },
          {
            key: "alt_attributes",
            name: "Видит ли ИИ изображения на сайте",
            desc: "Проверяет наличие alt-тегов у изображений, которые позволяют ИИ понимать визуальные элементы.",
            status: data.results["alt_attributes"] || "Moderate",
          },
          {
            key: "https",
            name: "Считает ли ИИ ваш сайт безопасным",
            desc: "Определяет наличие защищённого соединения HTTPS, влияющего на доверие ИИ к сайту.",
            status: data.results["https"] || "Moderate",
          },
          {
            key: "x_robots_tag",
            name: "Учитывает ли ИИ ваш сайт при поиске",
            desc: "Проверяет разрешение на индексацию страниц ИИ-сервисами (X-Robots-Tag).",
            status: data.results["x_robots_tag"] || "Moderate",
          },
          {
            key: "open_graph",
            name: "Выделяет ли ИИ ваш сайт среди других",
            desc: "Проверяет наличие Open Graph-разметки, формирующей привлекательное отображение ссылок.",
            status: data.results["open_graph"] || "Moderate",
          },
          {
            key: "score",
            name: "Как оценивает ИИ ваш сайт",
            desc: "Итоговая оценка на основе всех параметров анализа.",
            status: data.score >= 80 ? "Good" : data.score >= 40 ? "Moderate" : "Poor",
          },
          // 🔸 Дополнительные 5 факторов для полной проверки
          {
            key: "canonical",
            name: "Считает ли ИИ ваш сайт логичным",
            desc: "Проверяет корректность канонических ссылок, влияющих на понимание структуры сайта.",
            status: data.results["canonical"] || "Moderate",
          },
          {
            key: "structured_data_org",
            name: "Воспринимает ли ИИ сайт как источник информации",
            desc: "Определяет наличие схемы Organization / Author / Publisher, повышающей авторитет сайта.",
            status: data.results["structured_data_org"] || "Moderate",
          },
          {
            key: "meta_description",
            name: "Понимает ли ИИ категорию вашего сайта",
            desc: "Проверяет, соответствует ли метаописание теме страницы и помогает ли определить категорию.",
            status: data.results["meta_description"] || "Moderate",
          },
          {
            key: "internal_links",
            name: "Может ли ИИ переходить по ссылкам сайта",
            desc: "Анализирует внутренние связи и навигацию для правильного восприятия логики сайта ИИ.",
            status: data.results["internal_links"] || "Moderate",
          },
          {
            key: "content_quality",
            name: "Считает ли ИИ ваш сайт полезным",
            desc: "Оценивает полноту, актуальность и релевантность контента на страницах.",
            status: data.results["content_quality"] || "Moderate",
          },
        ];

        // 🔹 Для быстрой проверки берём ровно утверждённые 10 пунктов
        const quickKeys = [
          "robots_txt",
          "h1_present",
          "structured_data",
          "title_tag",
          "sitemap_xml",
          "alt_attributes",
          "https",
          "x_robots_tag",
          "open_graph",
          "score",
        ];

        const quickFactors = allFactors.filter((f) => quickKeys.includes(f.key));

        setFactors(mode === "quick" ? quickFactors : allFactors);

        // 🔹 Текст под кругом
        if (data.score >= 80) {
          setSummary(
            "Ваш сайт хорошо виден для ИИ-платформ. ИИ понимает, о чём ваш сайт, видит структуру, содержание и изображения. Большинство параметров настроены корректно и формируют положительное восприятие ресурса. Это помогает клиентам и ИИ-сервисам быстрее находить вас среди конкурентов."
          );
        } else if (data.score >= 40) {
          setSummary(
            "Ваш сайт частично виден для ИИ-платформ. ИИ распознаёт основные разделы и заголовки, но не всегда правильно понимает содержание или связи между страницами. Рекомендуется уточнить структуру и описания, чтобы улучшить восприятие сайта. Сейчас ваш сайт показывается по ограниченному числу запросов и не всегда попадает в ответы ИИ-ассистентов."
          );
        } else {
          setSummary(
            "Ваш сайт слабо виден для ИИ-платформ. ИИ затрудняется определить тематику, содержание и структуру сайта. Большинство параметров требуют настройки, чтобы сайт стал понятен и доступен для ИИ-систем. При таком уровне видимости сайт почти не показывается в запросах и ответах ИИ-ассистентов."
          );
        }

        // 🔹 Задержка перед показом блока под кругом (2 секунды)
        setTimeout(() => setShowSummary(true), 2000);
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

      {/* Улучшенный блок под кругом с задержкой 2 секунды */}
      {showSummary && (
        <div className="animate-fadeIn max-w-xl mx-auto rounded-2xl p-6 mb-10 bg-white/60 backdrop-blur-sm shadow-md border border-gray-100 text-justify">
          <p className="text-lg font-semibold text-gray-800 mb-2 text-center">
            {score >= 80
              ? "Высокая видимость сайта"
              : score >= 40
              ? "Средняя видимость сайта"
              : "Низкая видимость сайта"}
          </p>
          <p className="text-base text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>

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
