import fs from "node:fs/promises";
import path from "node:path";

type GeneratePDFParams = {
  type: "owner" | "developer";
  lang?: "en" | "ru";
  data: {
    website: string;
    score: string;
    date: string;
    results: Record<string, string>;
  };
};

const API_URL =
  process.env.HTML2PDF_API_URL || "https://api.html2pdf.app/v1/generate";
const API_KEY =
  process.env.HTML2PDF_API_KEY || process.env.HTML2PDF_X_API_KEY;

export async function generatePDF({
  type,
  lang = "ru",
  data,
}: GeneratePDFParams): Promise<Buffer> {
  const isEn = lang === "en";
  const filename = type === "owner"
    ? (isEn ? "owner_en.html" : "owner.html")
    : (isEn ? "developer_en.html" : "developer.html");
  const templatePath = path.join(process.cwd(), "public", "templates", filename);
  const template = await fs.readFile(templatePath, "utf8");

  const base64Logo = await getBase64Logo();
  const scoreValue = parseInt(data.score.replace("%", "")) || 0;
  const donutColor = getDonutColor(scoreValue);
  const donutOffset = getDonutOffset(scoreValue);
  const visibilityLevel = getVisibilityText(scoreValue);

  const placeholders: Record<string, string> = {
    website: data.website,
    date: data.date,
    score: data.score,
    base64_logo: base64Logo,
    donut_color: donutColor,
    donut_offset: donutOffset.toString(),
    visibility_level: visibilityLevel,
    visibility_class: getVisibilityClass(scoreValue),
    visibility_title: getVisibilityTitle(scoreValue),
    visibility_text: getVisibilityTextFull(scoreValue),
    ...buildFactorStatuses(data.results),
    ...buildFactorClasses(data.results),
    ...buildPriorityLists(data.results),
    ...buildConditionalTasks(data.results),
    checklist_rows: buildChecklistRows(data.results),
    assessment_p1: getAssessmentText1(scoreValue),
    assessment_p2: getAssessmentText2(scoreValue),
    verdict_conclusion: getVerdictConclusion(scoreValue),
    score_factor_card: getScoreFactorCard(scoreValue),
  };

  const filledHtml = fillPlaceholders(template, placeholders);

  if (!API_KEY) {
    throw new Error("Missing HTML2PDF API key (set HTML2PDF_API_KEY).");
  }

  const nocache = Date.now();
  const body = {
    html: filledHtml,
    options: {
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", right: "14mm", bottom: "18mm", left: "14mm" },
    },
    inline: true,
    apiKey: API_KEY,
  };

  const res = await fetch(`${API_URL}?nocache=${nocache}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTML2PDF error: ${res.status} – ${text}`);
  }

  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

function fillPlaceholders(template: string, data: Record<string, string>): string {
  let html = template;
  for (const [key, value] of Object.entries(data)) {
    const safe = value ?? "";
    const re = new RegExp(`{{\\s*${escapeRegExp(key)}\\s*}}`, "g");
    html = html.replace(re, safe);
  }
  html = html.replace(/{{\s*[\w.-]+\s*}}/g, "");
  return html;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getBase64Logo(): Promise<string> {
  try {
    const logoPath = path.join(process.cwd(), "public", "templates", "logo.png");
    const buffer = await fs.readFile(logoPath);
    return buffer.toString("base64");
  } catch {
    return "";
  }
}

function getDonutColor(score: number): string {
  if (score <= 50) return interpolateColor("#ef4444", "#f59e0b", score / 50);
  return interpolateColor("#f59e0b", "#10b981", (score - 50) / 50);
}

function getDonutOffset(score: number): number {
  const circumference = 2 * Math.PI * 90;
  return circumference - (score / 100) * circumference;
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const result = {
    r: Math.round(c1.r + (c2.r - c1.r) * factor),
    g: Math.round(c1.g + (c2.g - c1.g) * factor),
    b: Math.round(c1.b + (c2.b - c1.b) * factor),
  };
  return `rgb(${result.r}, ${result.g}, ${result.b})`;
}

function hexToRgb(hex: string) {
  const parsed = parseInt(hex.slice(1), 16);
  return { r: (parsed >> 16) & 255, g: (parsed >> 8) & 255, b: parsed & 255 };
}

function getVisibilityText(score: number): string {
  if (score >= 80) return "High visibility";
  if (score >= 40) return "Moderate visibility";
  return "Low visibility";
}

function getVisibilityClass(score: number): string {
  if (score >= 80) return "good";
  if (score >= 40) return "moderate";
  return "poor";
}

function getVisibilityTitle(score: number): string {
  if (score >= 75) return "Высокая готовность сайта";
  if (score >= 40) return "Средняя готовность сайта";
  return "Низкая готовность сайта";
}

function getVisibilityTextFull(score: number): string {
  if (score >= 75)
    return `Ваш сайт хорошо подготовлен к рекомендациям со стороны ИИ-систем. <strong>Он уже может чаще появляться в ответах ИИ</strong>, благодаря корректной структуре и настройкам.<br/><br/>Основные параметры настроены правильно, и ИИ-системы воспринимают сайт как понятный и надёжный источник. <strong>Дальнейшие точечные улучшения помогут усилить позиции и увеличить поток обращений.</strong>`;
  if (score >= 40)
    return `Ваш сайт частично готов к рекомендациям со стороны ИИ-систем. <strong>Вы близки к хорошему результату</strong> — достаточно доработать детали, чтобы структура стала понятнее для ИИ. Тогда сайт сможет чаще появляться в ответах, и вы получите больше переходов и обращений.<br/><br/>Отдельные параметры пока настроены не полностью, из-за этого сайт не всегда попадает в ответы ИИ. <strong>Их точечная корректировка повысит готовность сайта к рекомендациям и позволит чаще появляться в ответах.</strong>`;
  return `Ваш сайт пока не готов к рекомендациям со стороны ИИ-систем. <strong>В текущем состоянии он не попадает в ответы</strong>, из-за чего вы теряете потенциальных клиентов и обращения.<br/><br/>Критически важные параметры настроены некорректно или отсутствуют. <strong>Без их исправления это значительно снижает шансы на появление сайта в ответах ИИ.</strong>`;
}

function getScoreFactorCard(score: number): string {
  const statusClass = score >= 75 ? "good" : score >= 40 ? "moderate" : "poor";
  const statusLabel = score >= 75 ? "Хорошо" : score >= 40 ? "Средне" : "Плохо";
  const desc = score >= 75
    ? "Ваш сайт хорошо подготовлен к рекомендациям ИИ-ассистентов — технические параметры настроены корректно и обеспечивают высокий приоритет для ИИ-систем."
    : score >= 40
    ? "Ваш сайт иногда уже может попадать в ответы ИИ, однако текущие настройки ограничивают его приоритет для ИИ-ассистентов и снижают приток потенциальных клиентов."
    : "Ваш сайт пока не попадает в ответы ИИ-ассистентов — текущие настройки критически снижают его приоритет для ИИ-систем и лишают вас потока потенциальных клиентов.";

  return `<div class="factor">
    <div class="factor-head">
      <div class="factor-lead ${statusClass}"><span class="dot"></span><div class="factor-name">Будет ли ИИ рекомендовать ваш сайт</div></div>
      <div class="status ${statusClass}">${statusLabel}</div>
    </div>
    <div class="factor-tech">Итоговая оценка: ${score}%</div>
    <p class="factor-desc">${desc}</p>
  </div>`;
}

function getVerdictConclusion(score: number): string {
  if (score >= 75)
    return `<span style="font-weight:700;">Главный вывод:</span> ИИ-ассистенты могут рекомендовать ваш сайт. По результатам проверки технические параметры настроены корректно - сайт доступен для ИИ-краулеров, его тематика понятна, и он воспринимается как надёжный источник.`;
  if (score >= 40)
    return `<span style="font-weight:700;">Главный вывод:</span> ИИ-ассистенты могут рекомендовать ваш сайт частично. Часть параметров работает корректно, однако имеющиеся недочёты снижают шансы на появление в ответах. После их устранения результат заметно улучшится.`;
  return `<span style="font-weight:700;">Главный вывод:</span> ИИ-ассистенты пока не рекомендуют ваш сайт. По результатам проверки ряд важных параметров настроен некорректно или отсутствует - это существенно снижает шансы на появление в ответах. Выполнение задач из технического задания поможет исправить ситуацию.`;
}

function getAssessmentText1(score: number): string {
  if (score >= 80)
    return "Your site demonstrates excellent visibility for AI platforms.";
  if (score >= 40)
    return "Your site is moderately visible for AI platforms.";
  return "Your site currently has low visibility for AI platforms.";
}

function getAssessmentText2(score: number): string {
  if (score >= 80)
    return "Minor improvements may further enhance exposure across AI tools.";
  if (score >= 40)
    return "Some parameters require improvement to achieve better indexing.";
  return "Several critical settings need attention to improve AI visibility.";
}

function buildFactorStatuses(results: Record<string, string>): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [key, status] of Object.entries(results)) {
    const lower = (status || "").toLowerCase();
    map[`status_${key}`] =
      lower === "good" ? "Хорошо" : lower === "moderate" ? "Средне" : "Плохо";
  }
  return map;
}

function buildFactorClasses(results: Record<string, string>): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [key, status] of Object.entries(results)) {
    const lower = (status || "").toLowerCase();
    map[`status_${key}_class`] =
      lower === "good"
        ? "good"
        : lower === "moderate"
        ? "moderate"
        : "poor";
  }
  return map;
}

// Человеческие названия параметров
const FACTOR_NAMES: Record<string, string> = {
  robots_txt: "Открыт ли сайт для ИИ",
  meta_description: "Понимает ли ИИ, о чём ваш сайт",
  title_tag: "Видит ли ИИ название сайта",
  h1_present: "Видит ли ИИ главный заголовок сайта",
  h2_present: "Может ли ИИ ориентироваться на странице",
  sitemap_xml: "Понятна ли ИИ структура сайта",
  https: "Считает ли ИИ ваш сайт безопасным",
  page_speed: "Достаточна ли скорость сайта для ИИ",
  structured_data: "Видит ли ИИ разметку данных сайта",
  theme: "Понимает ли ИИ категорию вашего сайта",
  meta_robots: "Может ли ИИ читать страницы сайта",
  page_404: "Корректна ли работа сайта для ИИ",
  canonical: "Понимает ли ИИ приоритет страниц",
  mobile_friendly: "Удобен ли сайт на мобильных устройствах",
  alt_attributes: "Понимает ли ИИ изображения на сайте",
};

// Краткие задачи для чеклиста
const CHECKLIST_TASKS: Record<string, { poor: string; moderate: string }> = {
  robots_txt: {
    poor: "Открыть доступ для GPTBot, ClaudeBot, Google-Extended",
    moderate: "Проверить корректность директив, добавить путь к sitemap.xml",
  },
  meta_description: {
    poor: "Добавить уникальные описания 120–160 символов на все страницы",
    moderate: "Устранить дублирующиеся и пустые описания",
  },
  title_tag: {
    poor: "Добавить уникальный title 50–60 символов на каждую страницу",
    moderate: "Проверить уникальность и информативность заголовков",
  },
  h1_present: {
    poor: "Добавить один H1 на каждую страницу, отражающий главную тему",
    moderate: "Проверить уникальность H1, убедиться что на странице только один",
  },
  h2_present: {
    poor: "Добавить информативные подзаголовки H2 на ключевые страницы",
    moderate: "Проверить логику H2 — не дублировать H1",
  },
  sitemap_xml: {
    poor: "Создать sitemap.xml, добавить в robots.txt, отправить в Search Console",
    moderate: "Настроить автообновление, проверить валидность XML",
  },
  https: {
    poor: "Установить SSL, настроить редирект HTTP → HTTPS, устранить mixed content",
    moderate: "Проверить срок сертификата, включить HSTS",
  },
  page_speed: {
    poor: "Добиться времени ответа до 1.5 сек: CDN, кэш, WebP, Gzip/Brotli",
    moderate: "Аудит Lighthouse, устранить render-blocking ресурсы",
  },
  structured_data: {
    poor: "Добавить JSON-LD разметку Schema.org (Organization, Service, Article)",
    moderate: "Проверить разметку через Rich Results Test, устранить ошибки",
  },
  theme: {
    poor: "Сделать тему сайта однозначной: title, H1, описание и разметка должны чётко отражать нишу",
    moderate: "Согласовать title, H1 и описание по теме, дополнить разметку Organization сферой деятельности",
  },
  open_graph: {
    poor: "Добавить og:title, og:description, og:image (1200x630px), og:url, og:type",
    moderate: "Проверить наличие всех OG-тегов, убедиться в загрузке изображений",
  },
  meta_robots: {
    poor: "Удалить noindex с публичных страниц, устранить конфликты директив",
    moderate: "Аудит директив: служебные — noindex, публичные — index, follow",
  },
  page_404: {
    poor: "Настроить возврат кода 404, создать кастомную страницу с навигацией",
    moderate: "Проверить отсутствие soft 404 (код 200 на несуществующих страницах)",
  },
  canonical: {
    poor: "Добавить canonical с абсолютным HTTPS-URL на все страницы",
    moderate: "Проверить корректность canonical, устранить цепочки редиректов",
  },
  mobile_friendly: {
    poor: "Добавить viewport meta-тег, устранить горизонтальную прокрутку",
    moderate: "Тестирование Google Mobile-Friendly Test, устранить замечания",
  },
  alt_attributes: {
    poor: "Добавить alt ко всем изображениям, описывающий содержание",
    moderate: "Заполнить пустые alt, декоративным изображениям — alt=\"\"",
  },
};

function buildPriorityLists(results: Record<string, string>): Record<string, string> {
  const urgent: string[] = [];
  const improve: string[] = [];
  const ok: string[] = [];

  for (const [key, status] of Object.entries(results)) {
    const name = FACTOR_NAMES[key];
    if (!name) continue;
    const lower = (status || "").toLowerCase();
    if (lower === "poor") urgent.push(`<li>${name}</li>`);
    else if (lower === "moderate") improve.push(`<li>${name}</li>`);
    else ok.push(`<li>${name}</li>`);
  }

  return {
    priority_urgent_list: urgent.length ? urgent.join("") : "<li>Нет параметров требующих срочного исправления</li>",
    priority_improve_list: improve.length ? improve.join("") : "<li>Нет параметров требующих улучшения</li>",
    priority_ok_list: ok.length ? ok.join("") : "<li>Нет параметров с хорошим статусом</li>",
  };
}

function buildConditionalTasks(results: Record<string, string>): Record<string, string> {
  const map: Record<string, string> = {};

  const tasksPoor: Record<string, string> = {
    robots_txt: "<p><span class=\"task-label\">Задача:</span> проверить файл robots.txt на наличие директивы Disallow: / — она блокирует всех ботов. Добавить явное разрешение для GPTBot, ClaudeBot, Google-Extended. Убедиться что файл доступен по адресу /robots.txt.</p>",
    meta_description: "<p><span class=\"task-label\">Задача:</span> добавить тег &lt;meta name=\"description\"&gt; на все ключевые страницы. Текст 120–160 символов, естественный, отражает суть страницы.</p>",
    title_tag: "<p><span class=\"task-label\">Задача:</span> добавить уникальный тег &lt;title&gt; на каждую страницу. Длина 50–60 символов. Не дублировать между страницами.</p>",
    h1_present: "<p><span class=\"task-label\">Задача:</span> добавить один тег H1 на каждую страницу. Он должен отражать главную тему страницы, не дублировать title и не содержать вложенных ссылок.</p>",
    h2_present: "<p><span class=\"task-label\">Задача:</span> добавить подзаголовки H2 на ключевые страницы. Они должны отражать разделы контента и отвечать на конкретные вопросы пользователя.</p>",
    sitemap_xml: "<p><span class=\"task-label\">Задача:</span> создать файл sitemap.xml в корне сайта. Включить все публичные страницы. Указать путь в robots.txt. Отправить в Google Search Console.</p>",
    https: "<p><span class=\"task-label\">Задача:</span> установить SSL-сертификат. Настроить автоматический редирект с HTTP на HTTPS. Устранить mixed content (смешанные HTTP/HTTPS ресурсы на страницах).</p>",
    page_speed: "<p><span class=\"task-label\">Задача:</span> добиться времени ответа сервера до 1.5 сек. Подключить CDN, настроить кэширование на стороне сервера, оптимизировать изображения (WebP, сжатие), включить Gzip/Brotli сжатие.</p>",
    structured_data: "<p><span class=\"task-label\">Задача:</span> добавить JSON-LD разметку Schema.org на ключевые страницы. Для бизнеса — LocalBusiness или Organization. Для услуг — Service. Для статей — Article.</p>",
    open_graph: "<p><span class=\"task-label\">Задача:</span> добавить на все страницы теги og:title, og:description, og:image, og:url, og:type. Изображение минимум 1200x630px.</p>",
    theme: "<p><span class=\"task-label\">Задача:</span> сделать тему сайта однозначной: чёткий title и H1 с названием ниши, meta description с темой, JSON-LD разметка Organization/LocalBusiness с указанием сферы деятельности.</p>",
    meta_robots: "<p><span class=\"task-label\">Задача:</span> проверить наличие тега &lt;meta name=\"robots\" content=\"noindex\"&gt; на публичных страницах — удалить его. Убедиться что не конфликтует с robots.txt и X-Robots-Tag.</p>",
    page_404: "<p><span class=\"task-label\">Задача:</span> настроить сервер на возврат кода 404 для несуществующих страниц. Создать кастомную страницу 404 с навигацией на главную и основные разделы.</p>",
    canonical: "<p><span class=\"task-label\">Задача:</span> добавить тег &lt;link rel=\"canonical\"&gt; на все страницы с абсолютным HTTPS-URL. Устранить циклические или конфликтующие canonical.</p>",
    mobile_friendly: "<p><span class=\"task-label\">Задача:</span> добавить мета-тег &lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"&gt;. Проверить отображение на мобильных устройствах — устранить горизонтальную прокрутку и мелкие элементы.</p>",
    alt_attributes: "<p><span class=\"task-label\">Задача:</span> добавить атрибут alt ко всем изображениям на сайте. Текст должен описывать содержание изображения, не использовать ключевые слова как спам.</p>",
  };

  const tasksModerate: Record<string, string> = {
    robots_txt: "<p><span class=\"task-label\">Задача:</span> проверить корректность директив — убедиться что нужные разделы открыты, служебные закрыты. Указать путь к sitemap.xml внутри файла.</p>",
    meta_description: "<p><span class=\"task-label\">Задача:</span> проверить уникальность описаний на всех страницах. Устранить дубликаты и пустые значения.</p>",
    title_tag: "<p><span class=\"task-label\">Задача:</span> проверить уникальность и информативность заголовков. Привести в соответствие с содержанием страницы.</p>",
    h1_present: "<p><span class=\"task-label\">Задача:</span> проверить что на каждой странице только один H1. Убедиться что H1 уникален и логично отражает тему страницы.</p>",
    h2_present: "<p><span class=\"task-label\">Задача:</span> проверить логику структуры H2 — убедиться что они не дублируют H1 и отражают реальные разделы страницы.</p>",
    sitemap_xml: "<p><span class=\"task-label\">Задача:</span> убедиться что sitemap обновляется автоматически при добавлении страниц. Проверить валидность XML-формата.</p>",
    https: "<p><span class=\"task-label\">Задача:</span> проверить срок действия сертификата. Включить HSTS. Устранить предупреждения о смешанном контенте.</p>",
    page_speed: "<p><span class=\"task-label\">Задача:</span> провести аудит через Google Lighthouse. Устранить блокирующие загрузку ресурсы (render-blocking JS/CSS).</p>",
    structured_data: "<p><span class=\"task-label\">Задача:</span> проверить корректность существующей разметки через Rich Results Test. Устранить ошибки и предупреждения.</p>",
    open_graph: "<p><span class=\"task-label\">Задача:</span> проверить наличие всех обязательных OG-тегов. Убедиться что изображения загружаются корректно.</p>",
    theme: "<p><span class=\"task-label\">Задача:</span> усилить ясность темы: убедиться, что title, H1 и описание согласованы и однозначно отражают нишу. Дополнить разметку Organization сферой деятельности.</p>",
    meta_robots: "<p><span class=\"task-label\">Задача:</span> провести аудит всех страниц на предмет корректности директив. Служебные страницы — noindex, публичные — index, follow.</p>",
    page_404: "<p><span class=\"task-label\">Задача:</span> проверить что страница 404 возвращает именно код 404, а не 200 (soft 404). Улучшить дизайн страницы ошибки.</p>",
    canonical: "<p><span class=\"task-label\">Задача:</span> проверить что canonical указывает на правильную версию страницы. Убедиться в отсутствии цепочек редиректов.</p>",
    mobile_friendly: "<p><span class=\"task-label\">Задача:</span> провести тестирование через Google Mobile-Friendly Test. Устранить все выявленные замечания.</p>",
    alt_attributes: "<p><span class=\"task-label\">Задача:</span> проверить все изображения — заполнить пустые alt. Декоративные изображения — alt=\"\".</p>",
  };

  const tools: Record<string, string> = {
    robots_txt: "<p><span class=\"task-label\">Инструмент проверки:</span> Google Search Console — Robots Testing Tool.</p>",
    meta_description: "<p><span class=\"task-label\">Инструмент проверки:</span> Google Search Console — Coverage.</p>",
    title_tag: "<p><span class=\"task-label\">Инструмент проверки:</span> Screaming Frog SEO Spider.</p>",
    h1_present: "<p><span class=\"task-label\">Инструмент проверки:</span> Screaming Frog SEO Spider.</p>",
    h2_present: "<p><span class=\"task-label\">Инструмент проверки:</span> просмотр исходного кода страницы.</p>",
    sitemap_xml: "<p><span class=\"task-label\">Инструмент проверки:</span> Google Search Console — Sitemaps.</p>",
    https: "<p><span class=\"task-label\">Инструмент проверки:</span> SSL Labs — ssllabs.com/ssltest.</p>",
    page_speed: "<p><span class=\"task-label\">Инструмент проверки:</span> Google PageSpeed Insights.</p>",
    structured_data: "<p><span class=\"task-label\">Инструмент проверки:</span> Google Rich Results Test — search.google.com/test/rich-results.</p>",
    open_graph: "<p><span class=\"task-label\">Инструмент проверки:</span> Facebook Sharing Debugger — developers.facebook.com/tools/debug.</p>",
    theme: "<p><span class=\"task-label\">Инструмент проверки:</span> Schema.org Validator — validator.schema.org. Проверить тип и сферу деятельности в разметке.</p>",
    meta_robots: "<p><span class=\"task-label\">Инструмент проверки:</span> Screaming Frog SEO Spider.</p>",
    page_404: "<p><span class=\"task-label\">Инструмент проверки:</span> curl -I [url]/nonexistent-page — проверить код ответа.</p>",
    canonical: "<p><span class=\"task-label\">Инструмент проверки:</span> Screaming Frog SEO Spider.</p>",
    mobile_friendly: "<p><span class=\"task-label\">Инструмент проверки:</span> Google Mobile-Friendly Test — search.google.com/test/mobile-friendly.</p>",
    alt_attributes: "<p><span class=\"task-label\">Инструмент проверки:</span> Screaming Frog SEO Spider — вкладка Images.</p>",
  };

  const allKeys = Object.keys(FACTOR_NAMES);
  allKeys.push("h1_present");

  for (const key of allKeys) {
    const status = (results[key] || "poor").toLowerCase();
    const isPoor = status === "poor";
    const isModerate = status === "moderate";
    const isGood = status === "good";

    // Вердикт
    if (isGood) {
      map[`verdict_${key}`] = `<div class="factor-verdict-good">Не требует доработки</div>`;
    } else if (isModerate) {
      map[`verdict_${key}`] = `<div class="factor-verdict-moderate">Требует доработки</div>`;
    } else {
      map[`verdict_${key}`] = `<div class="factor-verdict-poor">Требует исправления</div>`;
    }

    // Одна задача по статусу
    if (isGood) {
      map[`task_${key}`] = "";
      map[`tool_${key}`] = "";
    } else if (isModerate) {
      map[`task_${key}`] = tasksModerate[key] || "";
      map[`tool_${key}`] = tools[key] || "";
    } else {
      map[`task_${key}`] = tasksPoor[key] || "";
      map[`tool_${key}`] = tools[key] || "";
    }
  }

  return map;
}

function buildChecklistRows(results: Record<string, string>): string {
  const rows: string[] = [];
  let num = 0;

  // Сначала Poor (Срочно), потом Moderate (Улучшить)
  const poor: [string, string][] = [];
  const moderate: [string, string][] = [];

  for (const [key, status] of Object.entries(results)) {
    const lower = (status || "").toLowerCase();
    if (lower === "poor") poor.push([key, status]);
    else if (lower === "moderate") moderate.push([key, status]);
  }

  for (const [key] of [...poor, ...moderate]) {
    const name = FACTOR_NAMES[key];
    const tasks = CHECKLIST_TASKS[key];
    if (!name || !tasks) continue;

    const status = (results[key] || "").toLowerCase();
    const isPoor = status === "poor";
    const priorityLabel = isPoor ? "Срочно" : "Улучшить";
    const priorityClass = isPoor ? "pri-urgent" : "pri-improve";
    const task = isPoor ? tasks.poor : tasks.moderate;
    num++;

    rows.push(`
      <tr>
        <td class="num">${num}</td>
        <td>${name}</td>
        <td class="pri"><span class="${priorityClass}">${priorityLabel}</span></td>
        <td>${task}</td>
        <td class="cb">☐</td>
      </tr>`);
  }

  return rows.length
    ? rows.join("")
    : `<tr><td colspan="5" style="text-align:center;color:#16a34a;font-weight:700;">Все параметры настроены корректно</td></tr>`;
}
