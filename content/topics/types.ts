import type { Lang } from "@/locales/config";

export type Source = {
  label: string; // как показать ссылку
  url: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

// Необязательная таблица внутри блока подробного объяснения.
// headers — заголовки столбцов, rows — строки (каждая строка = массив ячеек).
// caption — короткая подпись: что это за таблица и в чём её ценность (для ИИ).
export type TopicTable = {
  headers: string[];
  rows: string[][];
  caption?: string;
};

// Контент темы на одном языке — 8 блоков по ТЗ (B.5)
export type TopicContent = {
  h1: string; // 1. H1-вопрос
  subtitle?: string; // подзаголовок: раскрытие направлений ниши (стоматология, дерматология...)
  methodology?: string; // короткий блок методологии (задает статус "исследование")
  crumb?: string; // короткое название для хлебных крошек (если нет — берётся h1)
  directAnswer: string; // 2. короткий прямой ответ
  keyFacts: string[]; // 3. Key Facts (7–9 пунктов)
  // 4. подробное объяснение; table — необязательная таблица под текстом блока
  body: { heading: string; text: string; table?: TopicTable }[];
  actions: string[]; // 5. практические действия
  faq: FaqItem[]; // 6. FAQ
  nextStepLabel: string; // 7. следующий шаг (текст ссылки)
  nextHref?: string; // необязательный адрес следующего материала (если не задан — ведёт на раздел)
  // 8-й блок (ссылка на инструмент/услугу) берётся из siteConfig — единый на сайте
};

export type Topic = {
  slug: string;
  section: string; // слаг раздела, к которому относится тема
  kind?: "article" | "research"; // тип материала (по умолчанию article)
  status: "draft" | "published"; // управление индексацией (C.6)
  datePublished: string; // ISO, напр. "2026-06-11"
  accent?: string; // цвет плашки статьи (один и тот же в списке и внутри статьи)
  sources?: Source[]; // первоисточники (E-E-A-T)
  content: Record<Lang, TopicContent>;
};
