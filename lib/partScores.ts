// lib/partScores.ts
// Методика AI Scores: 4 направления + общий скор.
//
// Каждое направление считается отдельно по своей таблице весов.
// Общий скор — взвешенная сумма четырёх направлений (НЕ плоская таблица):
//   overall = authority*0.35 + content*0.30 + home*0.20 + tech*0.15
//
// Формула направления: earned / applicable * 100, где
//   earned     = сумма (вес фактора * доля выполнения 0..1)
//   applicable = сумма весов факторов, применимых к сайту
//
// Доля выполнения (factorScores): 0 = нет, 1 = есть, 0.25/0.5/0.75 = частично.
//   - обычные факторы: 0 или 1
//   - составные ("реальный бизнес"): дробная шкала по полноте признаков
//   - связки: доля уже уменьшена движком до передачи сюда
// notApplicable: фактор нельзя применить к нише — выпадает из знаменателя.

export type FactorKey =
  // --- Техника ---
  | "no_js" | "robots_txt" | "meta_robots" | "sitemap_xml" | "https"
  | "x_robots_tag" | "page_speed" | "mobile_friendly" | "canonical" | "page_404"
  // --- Главная ---
  | "specialization" | "services" | "title_tag" | "meta_description" | "h1_present"
  | "contacts" | "site_language" | "offer" | "region" | "open_graph" | "faq"
  // --- Контент ---
  | "facts" | "topic_coverage" | "structured_content" | "direct_answers"
  | "structured_data" | "tables_lists" | "topic_volume" | "freshness" | "alt_attributes"
  // --- Авторитет ---
  | "real_business" | "org_schema" | "reviews" | "experience"
  | "trust_signals" | "authorship" | "social";

export interface WeightRow {
  key: FactorKey;
  weight: number;
}

// ================== ТАБЛИЦЫ ВЕСОВ НАПРАВЛЕНИЙ (сумма = 100) ==================

// --- Техника (вес направления в общем скоре: 15%) ---
export const TECH: WeightRow[] = [
  { key: "no_js",           weight: 22 },
  { key: "robots_txt",      weight: 16 },
  { key: "meta_robots",     weight: 12 },
  { key: "sitemap_xml",     weight: 12 },
  { key: "https",           weight: 10 },
  { key: "x_robots_tag",    weight: 8 },
  { key: "page_speed",      weight: 8 },
  { key: "mobile_friendly", weight: 6 },
  { key: "canonical",       weight: 4 },
  { key: "page_404",        weight: 2 },
];

// --- Главная (вес направления: 20%) ---
export const HOME: WeightRow[] = [
  { key: "specialization",   weight: 18 },
  { key: "services",         weight: 16 },
  { key: "title_tag",        weight: 12 },
  { key: "meta_description", weight: 12 },
  { key: "h1_present",       weight: 10 },
  { key: "contacts",         weight: 10 },
  { key: "site_language",    weight: 5 },
  { key: "offer",            weight: 8 },
  { key: "region",           weight: 4 },
  { key: "open_graph",       weight: 3 },
  { key: "faq",              weight: 2 },
];

// --- Контент (вес направления: 30%) ---
export const CONTENT: WeightRow[] = [
  { key: "facts",              weight: 25 },
  { key: "topic_coverage",     weight: 23 },
  { key: "structured_content", weight: 17 },
  { key: "direct_answers",     weight: 14 },
  { key: "structured_data",    weight: 9 },
  { key: "tables_lists",       weight: 5 },
  { key: "topic_volume",       weight: 4 },
  { key: "freshness",          weight: 2 },
  { key: "alt_attributes",     weight: 1 },
];

// --- Авторитет (вес направления: 35%) ---
export const AUTHORITY: WeightRow[] = [
  { key: "real_business",  weight: 35 },
  { key: "reviews",        weight: 18 },
  { key: "org_schema",     weight: 15 },
  { key: "experience",     weight: 12 },
  { key: "trust_signals",  weight: 8 },
  { key: "authorship",     weight: 6 },
  { key: "social",         weight: 4 },
  { key: "freshness",      weight: 2 },
];

// ================== ВЕСА НАПРАВЛЕНИЙ В ОБЩЕМ СКОРЕ ==================
export const DIRECTION_WEIGHTS = {
  authority: 0.35,
  content: 0.30,
  home: 0.20,
  tech: 0.15,
} as const;

// ================== РАСЧЁТ ==================

// factorScores: доля выполнения каждого фактора (0..1)
// notApplicable: факторы, не применимые к нише — выпадают из знаменателя
export function scorePart(
  table: WeightRow[],
  factorScores: Partial<Record<FactorKey, number>>,
  notApplicable: Set<FactorKey> = new Set()
): number {
  let applicable = 0;
  let earned = 0;
  for (const row of table) {
    if (row.weight === 0) continue;
    if (notApplicable.has(row.key)) continue;
    applicable += row.weight;
    const share = clamp01(factorScores[row.key] ?? 0);
    earned += row.weight * share;
  }
  if (applicable === 0) return 0;
  return Math.round((earned / applicable) * 100);
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

export interface AiScores {
  overall: number;
  tech: number;
  home: number;
  content: number;
  authority: number;
}

export function computeAiScores(
  factorScores: Partial<Record<FactorKey, number>>,
  notApplicable: Set<FactorKey> = new Set()
): AiScores {
  const tech      = scorePart(TECH,      factorScores, notApplicable);
  const home      = scorePart(HOME,      factorScores, notApplicable);
  const content   = scorePart(CONTENT,   factorScores, notApplicable);
  const authority = scorePart(AUTHORITY, factorScores, notApplicable);

  const overall = Math.round(
    authority * DIRECTION_WEIGHTS.authority +
    content   * DIRECTION_WEIGHTS.content +
    home      * DIRECTION_WEIGHTS.home +
    tech      * DIRECTION_WEIGHTS.tech
  );

  return { overall, tech, home, content, authority };
}

// Пороги готовности (предварительные, до калибровки)
export function gradeOf(score: number):
  "high" | "good" | "partial" | "basic" | "low" {
  if (score >= 85) return "high";
  if (score >= 75) return "good";
  if (score >= 55) return "partial";
  if (score >= 35) return "basic";
  return "low";
}
