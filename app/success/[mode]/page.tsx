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
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = currentUrl.searchParams.get("url") || "";
        setUrl(targetUrl);

        const res = await fetch(`/api/result?url=${encodeURIComponent(targetUrl)}&mode=${mode}`);
        const data = await res.json();

        if (!data || !data.score) throw new Error("No valid data");
        setScore(data.score);

        const allFactors = [
          { key: "robots_txt", name: "Открыт ли сайт для ИИ", desc: "Проверяет, разрешён ли доступ ИИ-платформам к вашему сайту." },
          { key: "h1_present", name: "Понимает ли ИИ, о чём ваш сайт", desc: "Проверяет наличие главного заголовка (H1), объясняющего содержание страницы." },
          { key: "structured_data", name: "Видит ли ИИ содержание страниц", desc: "Проверяет наличие структурированных данных (JSON-LD), которые помогают ИИ понимать контент." },
          { key: "title_tag", name: "Видит ли ИИ заголовки и описания", desc: "Проверяет корректность тегов Title и Description для правильного отображения в результатах." },
          { key: "sitemap_xml", name: "Понятна ли ИИ структура сайта", desc: "Проверяет наличие карты сайта (sitemap.xml), чтобы ИИ знал все страницы." },
          { key: "alt_attributes", name: "Видит ли ИИ изображения на сайте", desc: "Проверяет наличие alt-текстов у изображений, помогающих ИИ распознавать визуалы." },
          { key: "https", name: "Считает ли ИИ ваш сайт безопасным", desc: "Проверяет, используется ли защищённое соединение HTTPS." },
          { key: "x_robots_tag", name: "Учитывает ли ИИ ваш сайт при поиске", desc: "Проверяет наличие X-Robots-Tag и отсутствие запретов на индексацию." },
          { key: "open_graph", name: "Выделяет ли ИИ ваш сайт среди других", desc: "Проверяет настройки Open Graph, влияющие на то, как сайт выглядит в ИИ и соцсетях." },
          { key: "overall", name: "Как оценивает ИИ ваш сайт", desc: "Определяет общий уровень видимости сайта на основе всех параметров." },
          { key: "canonical", name: "Понимает ли ИИ, какая страница главная", desc: "Проверяет корректность канонических ссылок, чтобы избежать дубликатов." },
          { key: "meta_description", name: "Понимает ли ИИ категорию вашего сайта", desc: "Проверяет описание сайта для правильной тематической классификации." },
          { key: "internal_links", name: "Считает ли ИИ ваш сайт логичным", desc: "Проверяет внутреннюю структуру ссылок и навигации." },
          { key: "content_quality", name: "Считает ли ИИ ваш сайт полезным", desc: "Оценивает качество и полноту контента." },
          { key: "score", name: "Формирует итоговую оценку", desc: "Подсчитывает совокупный результат всех проверок." },
        ];

        const mappedFactors = allFactors.map((f) => ({
          ...f,
          status: data.results[f.key] || "Moderate",
        }));

        const quickFactors = mappedFactors.slice(0, 10);
        setFactors(mode === "quick" ? quickFactors : mappedFactors);

        // --- ТЕКСТЫ ---
        if (data.score >= 75) {
          const quickText = `Ваш сайт хорошо подготовлен к рекомендациям со стороны ИИ-систем. Он уже может попадать в ответы и привлекать клиентов, благодаря корректной структуре и настройкам.<br/><br/>
В рамках быстрой проверки мы показываем ключевые параметры, которые уже работают корректно и поддерживают вашу готовность.<br/><br/>
С уважением, команда AI Signal Max.`;

          const proText = `Ваш сайт хорошо подготовлен к рекомендациям со стороны ИИ-систем. Он уже может попадать в ответы и привлекать клиентов, благодаря корректной структуре и настройкам.<br/><br/>
Основные параметры настроены правильно, и ИИ-системы воспринимают сайт как понятный и надёжный источник. Дальнейшие точечные улучшения помогут усилить позиции и увеличить поток обращений.<br/><br/>
Мы отправили вам два PDF-файла на email: подробный отчёт с разъяснениями и техническое задание для разработчика. Это позволит закрепить результат и повысить эффективность сайта.<br/><br/>
С уважением, команда AI Signal Max.`;

          setSummary(mode === "pro" ? proText : quickText);
        } else if (data.score >= 40) {
          const quickText = `Ваш сайт частично готов к рекомендациям со стороны ИИ-систем. Вы близки к хорошему результату – достаточно доработать детали, чтобы структура стала понятнее для ИИ. Тогда сайт сможет чаще появляться в ответах, и вы получите больше переходов и обращений.<br/><br/>
В рамках быстрой проверки мы показываем основные параметры, которые требуют доработки.<br/><br/>
С уважением, команда AI Signal Max.`;

          const proText = `Ваш сайт частично готов к рекомендациям со стороны ИИ-систем. Вы близки к хорошему результату – достаточно доработать детали, чтобы структура стала понятнее для ИИ. Тогда сайт сможет чаще появляться в ответах, и вы получите больше переходов и обращений.<br/><br/>
Отдельные параметры пока настроены не полностью, из-за этого сайт не всегда попадает в ответы ИИ. Их точечная корректировка повысит готовность сайта к рекомендациям и позволит чаще появляться в ответах.<br/><br/>
Мы отправили вам два PDF-файла на email: подробный отчёт с разъяснениями и техническое задание для разработчика. Это готовый план действий, который можно сразу передать в работу и затем проверить результат повторно.<br/><br/>
С уважением, команда AI Signal Max.`;

          setSummary(mode === "pro" ? proText : quickText);
        } else {
          const quickText = `Ваш сайт пока не готов к рекомендациям со стороны ИИ-систем. В текущем состоянии он не попадает в ответы, из-за чего вы теряете потенциальных клиентов и обращения.<br/><br/>
В рамках быстрой проверки мы показываем основные параметры, которые требуют срочного исправления.<br/><br/>
С уважением, команда AI Signal Max.`;

          const proText = `Ваш сайт пока не готов к рекомендациям со стороны ИИ-систем. В текущем состоянии он не попадает в ответы, из-за чего вы теряете потенциальных клиентов и обращения.<br/><br/>
Критически важные параметры настроены некорректно или отсутствуют. Без их исправления сайт не сможет рекомендоваться ИИ-системами.<br/><br/>
Мы отправили вам два PDF-файла на email: подробный отчёт с разъяснениями и техническое задание для разработчика. Это пошаговый план, который позволит исправить ошибки и подготовить сайт к получению трафика из ИИ.<br/><br/>
С уважением, команда AI Signal Max.`;

          setSummary(mode === "pro" ? proText : quickText);
        }
      } catch (err) {
        console.error("Failed to load analysis:", err);
      } finally {
        setLoading(false);
        setTimeout(() => setShowSummary(true), 2000);
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

      <div
        className="max-w-xl mx-auto rounded-2xl p-6 mb-10 bg-white/60 backdrop-blur-sm shadow-md border border-gray-100 text-justify transition-all duration-1000 ease-in-out"
        style={{
          minHeight: "180px",
          opacity: showSummary ? 1 : 0,
        }}
      >
        {showSummary && (
          <>
            <p className="text-lg font-semibold text-gray-800 mb-2 text-center">
              {score >= 75
                ? "Высокая видимость сайта"
                : score >= 40
                ? "Средняя видимость сайта"
                : "Низкая видимость сайта"}
            </p>
            <p
              className="text-base text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </>
        )}
      </div>

      <h2 className="text-lg font-semibold text-gray-800 text-center mt-8 mb-6">
        Проверенные параметры
      </h2>

      <div className="space-y-4">
        {factors.map((f, i) => (
          <FactorItem key={i} factor={f} />
        ))}
      </div>

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
