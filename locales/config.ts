// =============================================================
//  Локализация — единая точка настройки языков.
//  Чтобы добавить язык (например es): добавить код в LOCALES,
//  метку в LOCALE_LABELS и создать файл словаря locales/es.ts.
// =============================================================

export const LOCALES = ["en", "ru"] as const; // расширяемо: добавить "es"
export type Lang = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Lang = "en";

export const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  ru: "Русский",
  es: "Español",
};

// Короткая метка для переключателя (как в AI Answers Score: EN / RU)
export const LOCALE_SHORT: Record<Lang, string> = {
  en: "EN",
  ru: "RU",
};

export function isLang(value: string): value is Lang {
  return (LOCALES as readonly string[]).includes(value);
}
