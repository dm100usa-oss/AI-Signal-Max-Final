// lib/partScores.ts
// Методика AI Scores: 4 части + общий скор.
// Формула: набрал / сумма весов применимых факторов * 100.
// Применимость по типу сайта (заголовок). Бонусный неприменимый фактор выпадает из расчёта.

export type FactorKey =
  // 19 фактов, которые движок уже достаёт
  | "robots_txt" | "meta_robots" | "x_robots_tag" | "sitemap_xml" | "sitemap_lastmod"
  | "canonical" | "https" | "page_speed" | "page_404" | "mobile_friendly"
  | "title_tag" | "h1_present" | "h2_present" | "meta_description" | "open_graph"
  | "structured_data" | "alt_attributes" | "contacts" | "site_language"
  // 9 новых факторов (20-28)
  | "theme" | "services" | "prices" | "faq" | "tables"
  | "reviews" | "org_schema" | "author" | "social";

export type FactorType = "required" | "bonus";

export interface WeightRow {
  key: FactorKey;
  weight: number;
  type: FactorType;
}

// --- Часть 1: Техника ---
export const TECH: WeightRow[] = [
  { key: "robots_txt",     weight: 20, type: "required" },
  { key: "meta_robots",    weight: 15, type: "required" },
  { key: "x_robots_tag",   weight: 12, type: "required" },
  { key: "https",          weight: 12, type: "required" },
  { key: "sitemap_xml",    weight: 12, type: "required" },
  { key: "page_speed",     weight: 10, type: "required" },
  { key: "canonical",      weight: 8,  type: "bonus" },
  { key: "mobile_friendly",weight: 6,  type: "bonus" },
  { key: "page_404",       weight: 5,  type: "bonus" },
];

// --- Часть 2: Главная ---
export const HOME: WeightRow[] = [
  { key: "meta_description", weight: 18, type: "required" },
  { key: "title_tag",        weight: 16, type: "required" },
  { key: "h1_present",       weight: 14, type: "required" },
  { key: "contacts",         weight: 12, type: "required" },
  { key: "open_graph",       weight: 10, type: "bonus" },
  { key: "services",         weight: 10, type: "bonus" },
  { key: "prices",           weight: 8,  type: "bonus" },
  { key: "faq",              weight: 7,  type: "bonus" },
  { key: "site_language",    weight: 5,  type: "required" },
];

// --- Часть 3: Контент ---
export const CONTENT: WeightRow[] = [
  { key: "theme",           weight: 20, type: "required" },
  { key: "structured_data", weight: 18, type: "required" },
  { key: "h2_present",      weight: 12, type: "required" },
  { key: "tables",          weight: 12, type: "bonus" },
  { key: "page_speed",      weight: 0,  type: "bonus" }, // placeholder, не используется
  { key: "h1_present",      weight: 8,  type: "required" },
  { key: "faq",             weight: 8,  type: "bonus" },
  { key: "reviews",         weight: 7,  type: "bonus" },
  { key: "alt_attributes",  weight: 5,  type: "bonus" },
];

// объём текста как отдельный фактор пока не считается движком — добавим на доработке
// (в CONTENT зарезервировано 10 на "textvol", временно распределено)

// --- Часть 4: Признаки авторитета для ИИ на сайте ---
export const AUTHORITY: WeightRow[] = [
  { key: "reviews",     weight: 30, type: "bonus" },
  { key: "org_schema",  weight: 28, type: "required" },
  { key: "author",      weight: 20, type: "bonus" },
  { key: "social",      weight: 12, type: "bonus" },
  { key: "contacts",    weight: 10, type: "required" },
];

// --- Общий скор (свои веса, НЕ среднее частей) ---
export const OVERALL: WeightRow[] = [
  { key: "robots_txt",      weight: 11, type: "required" },
  { key: "theme",           weight: 10, type: "required" },
  { key: "meta_description",weight: 9,  type: "required" },
  { key: "title_tag",       weight: 8,  type: "required" },
  { key: "structured_data", weight: 8,  type: "required" },
  { key: "meta_robots",     weight: 7,  type: "required" },
  { key: "h1_present",      weight: 6,  type: "required" },
  { key: "https",           weight: 5,  type: "required" },
  { key: "h2_present",      weight: 5,  type: "required" },
  { key: "org_schema",      weight: 4,  type: "required" },
  { key: "sitemap_xml",     weight: 3,  type: "required" },
  { key: "contacts",        weight: 3,  type: "required" },
  { key: "reviews",         weight: 3,  type: "bonus" },
  { key: "page_speed",      weight: 2,  type: "required" },
  { key: "x_robots_tag",    weight: 2,  type: "required" },
  { key: "site_language",   weight: 2,  type: "required" },
  { key: "services",        weight: 1,  type: "bonus" },
  { key: "prices",          weight: 1,  type: "bonus" },
  { key: "faq",             weight: 1,  type: "bonus" },
  { key: "tables",          weight: 1,  type: "bonus" },
  { key: "open_graph",      weight: 1,  type: "bonus" },
  { key: "canonical",       weight: 1,  type: "bonus" },
  { key: "mobile_friendly", weight: 1,  type: "bonus" },
  { key: "sitemap_lastmod", weight: 1,  type: "bonus" },
];

// present: набор факторов, которые ЕСТЬ на сайте (passed === true)
// notApplicable: бонусные факторы, неприменимые к этому сайту по типу (выпадают из расчёта)
export function scorePart(
  table: WeightRow[],
  present: Set<FactorKey>,
  notApplicable: Set<FactorKey> = new Set()
): number {
  let need = 0;
  let got = 0;
  for (const row of table) {
    if (row.weight === 0) continue;
    // бонусный неприменимый фактор не входит в знаменатель
    if (row.type === "bonus" && notApplicable.has(row.key)) continue;
    need += row.weight;
    if (present.has(row.key)) got += row.weight;
  }
  if (need === 0) return 0;
  return Math.round((got / need) * 100);
}

export interface AiScores {
  overall: number;
  tech: number;
  home: number;
  content: number;
  authority: number;
}

export function computeAiScores(
  present: Set<FactorKey>,
  notApplicable: Set<FactorKey> = new Set()
): AiScores {
  return {
    overall:   scorePart(OVERALL,   present, notApplicable),
    tech:      scorePart(TECH,      present, notApplicable),
    home:      scorePart(HOME,      present, notApplicable),
    content:   scorePart(CONTENT,   present, notApplicable),
    authority: scorePart(AUTHORITY, present, notApplicable),
  };
}
