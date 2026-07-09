// lib/paramMapping.ts
// Таблица соответствия: понятный параметр на экране -> факторы новой системы (partScores).
// Названия параметров и их смысл НЕ меняются. Меняется только источник цвета (статуса):
// теперь он считается по новой системе AI Scores, а не по старой технической.
//
// Один понятный параметр может опираться на несколько факторов.
// Статус параметра = средняя доля его факторов (0..1), затем порог в цвет.

import type { FactorKey } from "./partScores";

// Ключ параметра на экране -> список факторов новой системы, определяющих его смысл.
export const PARAM_TO_FACTORS: Record<string, FactorKey[]> = {
  // --- Доступ / чтение сайта ИИ ---
  robots_txt:      ["robots_txt"],
  meta_robots:     ["meta_robots"],
  x_robots_tag:    ["x_robots_tag"],

  // --- Понимает ли ИИ, о чём сайт / его категорию ---
  // "theme" = категория бизнеса: специализация + описание + разметка организации
  theme:           ["specialization", "meta_description", "org_schema"],

  // --- Видит ли ИИ название сайта (Title) ---
  title_tag:       ["title_tag"],

  // --- Описание сайта ---
  meta_description:["meta_description"],

  // --- Ориентация на странице (подзаголовки) ---
  h2_present:      ["structured_content"],

  // --- Структура сайта (карта) ---
  sitemap_xml:     ["sitemap_xml"],

  // --- Безопасность ---
  https:           ["https"],

  // --- Скорость ---
  page_speed:      ["page_speed"],

  // --- Разметка данных (JSON-LD) ---
  structured_data: ["structured_data"],

  // --- Приоритет страниц (canonical) ---
  canonical:       ["canonical"],

  // --- Мобильные ---
  mobile_friendly: ["mobile_friendly"],

  // --- Изображения (alt) ---
  alt_attributes:  ["alt_attributes"],

  // --- Обработка ошибок (404) ---
  page_404:        ["page_404"],

  // --- Контент виден без JS (может ли ИИ читать страницы) ---
  no_js:           ["no_js"],

  // --- Open Graph ---
  open_graph:      ["open_graph"],

  // --- Итоговый: будет ли ИИ рекомендовать (используем общий скор отдельно) ---
  // score обрабатывается напрямую по overall, здесь не мапится.
};

// Доля параметра (0..1) по факторам новой системы.
// notApplicable-факторы выпадают; если все выпали — параметр не применим (null).
export function paramShare(
  paramKey: string,
  factorScores: Partial<Record<FactorKey, number>>,
  notApplicable: Set<FactorKey>
): number | null {
  const keys = PARAM_TO_FACTORS[paramKey];
  if (!keys || keys.length === 0) return null;
  let sum = 0;
  let count = 0;
  for (const k of keys) {
    if (notApplicable.has(k)) continue;
    const v = factorScores[k];
    if (typeof v !== "number") continue;
    sum += v;
    count += 1;
  }
  if (count === 0) return null;
  return sum / count;
}

// Доля -> цвет/статус. Пороги совпадают с общей логикой (Good/Moderate/Poor).
export function shareToStatus(
  share: number | null
): "Good" | "Moderate" | "Poor" {
  if (share === null) return "Moderate";
  if (share >= 0.75) return "Good";
  if (share >= 0.35) return "Moderate";
  return "Poor";
}
