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

interface CheckItem {
  key: string;
  name?: string;
  value?: string;
}

export default function SuccessPage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode as Mode;
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [items, setItems] = useState<CheckItem[]>([]);
  const [allItems, setAllItems] = useState<CheckItem[]>([]);
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
        if (data.items) setItems(data.items);
        if (data.allItems) setAllItems(data.allItems);

        const allFactors = [
          { key: "robots_txt", name: "Открыт ли сайт для ИИ", desc: "Проверяет, разрешён ли доступ ИИ-платформам к вашему сайту." },
          { key: "h1_present", name: "Понимает ли ИИ, о чём ваш сайт", desc: "Проверяет наличие главного заголовка H1, объясняющего содержание страницы." },
          { key: "title_tag", name: "Видит ли ИИ заголовки страниц", desc: "Проверяет наличие и корректность тега Title." },
          { key: "meta_description", name: "Понимает ли ИИ категорию вашего сайта", desc: "Проверяет описание сайта для правильной тематической классификации." },
          { key: "sitemap_xml", name: "Понятна ли ИИ структура сайта", desc: "Проверяет наличие карты сайта sitemap.xml, чтобы ИИ знал все страницы." },
          { key: "https", name: "Считает ли ИИ ваш сайт безопасным", desc: "Проверяет, используется ли защищённое соединение HTTPS." },
          { key: "page_speed", name: "Достаточна ли скорость сайта для ИИ", desc: "Проверяет скорость ответа сервера — медленный сайт может быть пропущен ИИ-краулером." },
          { key: "structured_data", name: "Видит ли ИИ разметку страниц", desc: "Проверяет наличие структурированных данных JSON-LD, которые помогают ИИ понимать контент." },
          { key: "open_graph", name: "Содержит ли ссылка заголовок, описание и изображение", desc: "Проверяет настройки Open Graph, влияющие на то, как сайт выглядит при распространении." },
          { key: "meta_robots", name: "Не запрещена ли индексация страниц", desc: "Проверяет мета-теги и заголовки сервера на наличие запретов индексации для ИИ." },
          { key: "page_404", name: "Считает ли ИИ ваш сайт качественным", desc: "Проверяет корректность обработки ошибок — сайт должен правильно сообщать об отсутствующих страницах." },
          { key: "canonical", name: "Указана ли основная страница сайта", desc: "Проверяет корректность канонических ссылок, чтобы ИИ не путался в дублях." },
          { key: "mobile_friendly", name: "Удобен ли ваш сайт на мобильных устройствах", desc: "Проверяет наличие мета-тега viewport для корректного отображения на мобильных." },
          { key: "alt_attributes", name: "Понимает ли ИИ изображения на сайте", desc: "Проверяет наличие alt-атрибутов у изображений." },
          { key: "score", name: "Будет ли ИИ рекомендовать ваш сайт", desc: "Итоговая оценка готовности сайта к рекомендациям со стороны ИИ-систем." },
        ];

        const scoreStatus: "Good" | "Moderate" | "Poor" =
          data.score >= 75 ? "Good" : data.score >= 40 ? "Moderate" : "Poor";

        const mappedFactors = allFactors.map((f) => ({
          ...f,
          status: f.key === "score"
            ? scoreStatus
            : data.results[f.key] || "Moderate",
        }));

        const QUICK_FACTOR_KEYS = [
          "robots_txt", "h1_present", "title_tag", "meta_description",
          "sitemap_xml", "https", "page_speed", "structured_data", "open_graph", "score",
        ];
        const quickFactors = mappedFactors.filter(f => QUICK_FACTOR_KEYS.includes(f.key));
        setFactors(mode === "quick" ? quickFactors : mappedFactors);

        // --- ТЕКСТЫ ---
        if (data.score >= 75) {
          const quickText = `Ваш сайт хорошо подготовлен к рекомендациям со стороны ИИ-систем. <strong>Он уже может попадать в ответы и привлекать клиентов</strong>, благодаря корректной структуре и настройкам.<br/><br/>
В рамках быстрой проверки мы показываем <strong>ключевые параметры</strong>, которые уже работают корректно и поддерживают вашу готовность.<br/><br/>
С уважением, команда AI Signal Max.`;

          const proText = `Ваш сайт хорошо подготовлен к рекомендациям со стороны ИИ-систем. <strong>Он уже может попадать в ответы и привлекать клиентов</strong>, благодаря корректной структуре и настройкам.<br/><br/>
Основные параметры настроены правильно, и ИИ-системы воспринимают сайт как понятный и надёжный источник. <strong>Дальнейшие точечные улучшения помогут усилить позиции и увеличить поток обращений.</strong><br/><br/>
Мы отправили вам два PDF-файла на email: <strong>подробный отчёт с разъяснениями для владельца и техническое задание для разработчика</strong>. Это позволит закрепить результат и повысить эффективность сайта.<br/><br/>
С уважением, команда AI Signal Max.`;

          setSummary(mode === "pro" ? proText : quickText);
        } else if (data.score >= 40) {
          const quickText = `Ваш сайт частично готов к рекомендациям со стороны ИИ-систем. <strong>Вы близки к хорошему результату</strong> – достаточно доработать детали, чтобы структура стала понятнее для ИИ. Тогда сайт сможет чаще появляться в ответах, и вы получите больше переходов и обращений.<br/><br/>
В рамках быстрой проверки мы показываем <strong>основные параметры</strong>, которые требуют доработки.<br/><br/>
С уважением, команда AI Signal Max.`;

          const proText = `Ваш сайт частично готов к рекомендациям со стороны ИИ-систем. <strong>Вы близки к хорошему результату</strong> – достаточно доработать детали, чтобы структура стала понятнее для ИИ. Тогда сайт сможет чаще появляться в ответах, и вы получите больше переходов и обращений.<br/><br/>
Отдельные параметры пока настроены не полностью, из-за этого сайт не всегда попадает в ответы ИИ. <strong>Их точечная корректировка повысит готовность сайта к рекомендациям и позволит чаще появляться в ответах.</strong><br/><br/>
Мы отправили вам два PDF-файла на email: <strong>подробный отчёт с разъяснениями для владельца и техническое задание для разработчика</strong>. Это готовый план действий, который можно сразу передать в работу и затем проверить результат повторно.<br/><br/>
С уважением, команда AI Signal Max.`;

          setSummary(mode === "pro" ? proText : quickText);
        } else {
          const quickText = `Ваш сайт пока не готов к рекомендациям со стороны ИИ-систем. <strong>В текущем состоянии он не попадает в ответы</strong>, из-за чего вы теряете потенциальных клиентов и обращения.<br/><br/>
В рамках быстрой проверки мы показываем <strong>основные параметры</strong>, которые требуют срочного исправления.<br/><br/>
С уважением, команда AI Signal Max.`;

          const proText = `Ваш сайт пока не готов к рекомендациям со стороны ИИ-систем. <strong>В текущем состоянии он не попадает в ответы</strong>, из-за чего вы теряете потенциальных клиентов и обращения.<br/><br/>
Критически важные параметры настроены некорректно или отсутствуют. <strong>Без их исправления сайт не сможет рекомендоваться ИИ-системами.</strong><br/><br/>
Мы отправили вам два PDF-файла на email: <strong>подробный отчёт с разъяснениями для владельца и техническое задание для разработчика</strong>. Это пошаговый план, который позволит исправить ошибки и подготовить сайт к получению трафика из ИИ.<br/><br/>
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
          : "Результаты полного аудита сайта"}
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
                ? "Высокая готовность сайта"
                : score >= 40
                ? "Средняя готовность сайта"
                : "Низкая готовность сайта"}
            </p>
            <p
              className="text-base text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </>
        )}
      </div>

      <h2 className="text-lg font-semibold text-gray-800 text-center mt-8 mb-4">
        Материалы проверки
      </h2>

      <MaterialsBlock
        url={url}
        mode={mode}
        items={items}
        allItems={allItems}
      />

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

// Ключи, которые показываются явно (primary)
const PRIMARY_QUICK_KEYS = ["title_tag", "h1_present", "meta_description"];
const PRIMARY_PRO_KEYS = [
  "title_tag", "meta_description", "h2_present",
  "site_language", "mobile_friendly", "robots_txt",
];

const LABEL_MAP: Record<string, string> = {
  title_tag:        "Заголовок",
  h1_present:       "H1",
  h2_present:       "Сейчас на сайте",
  meta_description: "Описание",
  site_language:    "Язык",
  mobile_friendly:  "Мобильная версия сайта",
  contacts:         "Контакт",
  robots_txt:       "Доступ для ИИ",
  sitemap_xml:      "Страниц",
  sitemap_lastmod:  "Обновлён",
  https:            "Протокол",
  page_speed:       "Ответ",
  structured_data:  "JSON-LD",
  open_graph:       "Open Graph",
  canonical:        "Canonical",
  x_robots_tag:     "X-Robots",
  meta_robots:      "Meta robots",
  alt_attributes:   "ALT атрибуты",
  page_404:         "Страница 404",
};

// Обрамляет текстовые значения в кавычки (без обрезки)
function quoted(value: string): string {
  if (!value || value === "Не найден" || value === "Не найдено" || value === "Не обнаружен") {
    return value;
  }
  return `«${value}»`;
}

// Значения, не требующие кавычек
const RAW_VALUE_KEYS = new Set([
  "https", "page_speed", "robots_txt", "sitemap_xml", "sitemap_lastmod",
  "structured_data", "open_graph", "canonical", "contacts",
  "site_language", "mobile_friendly",
  "x_robots_tag", "meta_robots", "alt_attributes", "page_404",
]);

function MaterialRow({ label, value, withQuotes }: { label: string; value: string; withQuotes: boolean }) {
  const display = withQuotes ? quoted(value) : value;
  return (
    <div className="flex items-baseline gap-0 min-w-0">
      <span className="text-gray-400 shrink-0" style={{ width: "8rem" }}>{label}:</span>
      <span className="text-gray-800 min-w-0 break-words">{display}</span>
    </div>
  );
}

function MaterialsBlock({
  url,
  mode,
  items,
  allItems,
}: {
  url: string;
  mode: Mode;
  items: CheckItem[];
  allItems: CheckItem[];
}) {
  const primaryKeys = mode === "pro" ? PRIMARY_PRO_KEYS : PRIMARY_QUICK_KEYS;

  // Объединяем items + allItems в один lookup (allItems приоритетнее)
  const lookup = new Map<string, string>();
  for (const item of [...items, ...allItems]) {
    if (item.value) lookup.set(item.key, item.value);
  }

  // Дополнительные строки — те что не в primary и есть в allItems с value
  const extraRows = allItems.filter(
    (item) => !primaryKeys.includes(item.key) && item.value && LABEL_MAP[item.key]
  );

  let hostname = "";
  try { hostname = new URL(url).hostname; } catch {}

  return (
    <div className="max-w-xl mx-auto rounded-xl border border-gray-200 bg-gray-50 px-4 sm:px-6 py-4 mb-10 text-xs sm:text-sm text-gray-700 leading-relaxed">
      {/* Сайт */}
      <MaterialRow label="Сайт" value={hostname} withQuotes={false} />

      {/* Primary строки */}
      {primaryKeys.map((key) => {
        const value = lookup.get(key);
        if (!value) return null;
        const label = LABEL_MAP[key] || key;
        const withQuotes = !RAW_VALUE_KEYS.has(key);
        return (
          <div className="mt-1" key={key}>
            <MaterialRow label={label} value={value} withQuotes={withQuotes} />
          </div>
        );
      })}

      {/* Подсказка */}
      <div className="mt-2 text-gray-400 text-xs">и другие данные...</div>
    </div>
  );
}
