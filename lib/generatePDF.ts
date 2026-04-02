import fs from "node:fs/promises";
import path from "node:path";

type GeneratePDFParams = {
  type: "owner" | "developer";
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
  data,
}: GeneratePDFParams): Promise<Buffer> {
  const filename = type === "owner" ? "owner.html" : "developer.html";
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
  meta_description: "Понимает ли ИИ, о чём сайт",
  title_tag: "Видит ли ИИ заголовки страниц",
  h2_present: "Понимает ли ИИ категорию сайта",
  sitemap_xml: "Понятна ли ИИ структура сайта",
  https: "Считает ли ИИ сайт безопасным",
  page_speed: "Достаточна ли скорость сайта для ИИ",
  structured_data: "Видит ли ИИ разметку страниц",
  open_graph: "Содержит ли ссылка заголовок, описание и изображение",
  meta_robots: "Не запрещена ли индексация страниц",
  page_404: "Считает ли ИИ сайт качественным",
  canonical: "Указана ли основная страница сайта",
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

  for (const key of Object.keys(FACTOR_NAMES)) {
    const status = (results[key] || "poor").toLowerCase();
    const isPoor = status === "poor";
    const isModerate = status === "moderate";
    const isGood = status === "good";

    // Показываем задачу "Плохо" только если статус poor
    map[`task_poor_${key}`] = isPoor ? "" : "<!--";
    map[`/task_poor_${key}`] = isPoor ? "" : "-->";

    // Показываем задачу "Средне" если статус poor или moderate
    map[`task_moderate_${key}`] = (isPoor || isModerate) ? "" : "<!--";
    map[`/task_moderate_${key}`] = (isPoor || isModerate) ? "" : "-->";

    // Инструмент проверки показываем если не good
    map[`task_tool_${key}`] = !isGood ? "" : "<!--";
    map[`/task_tool_${key}`] = !isGood ? "" : "-->";
  }

  return map;
}

function buildChecklistRows(results: Record<string, string>): string {
  const rows: string[] = [];

  for (const [key, status] of Object.entries(results)) {
    const name = FACTOR_NAMES[key];
    const tasks = CHECKLIST_TASKS[key];
    if (!name || !tasks) continue;

    const lower = (status || "").toLowerCase();
    if (lower === "good") continue; // Хорошо — не включаем

    const isPoor = lower === "poor";
    const statusLabel = isPoor ? "Плохо" : "Средне";
    const statusClass = isPoor ? "poor" : "moderate";
    const priorityLabel = isPoor ? "Срочно" : "Улучшить";
    const priorityClass = isPoor ? "pri-urgent" : "pri-improve";
    const task = isPoor ? tasks.poor : tasks.moderate;

    rows.push(`
      <tr>
        <td>${name}</td>
        <td><span class="status ${statusClass}">${statusLabel}</span></td>
        <td class="pri"><span class="${priorityClass}">${priorityLabel}</span></td>
        <td>${task}</td>
        <td class="cb">☐</td>
      </tr>`);
  }

  return rows.length
    ? rows.join("")
    : `<tr><td colspan="5" style="text-align:center;color:rgb(16,185,129);font-weight:700;">Все параметры настроены корректно</td></tr>`;
}
