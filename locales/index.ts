import en from "./en";
import ru from "./ru";
import type { Lang } from "./config";
import type { Dictionary } from "./en";

const dictionaries: Record<Lang, Dictionary> = {
  en,
  ru,
};

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang] ?? en;
}

// Подстановка значений в строку: fill("© {year} ...", { year: 2026 })
export function fill(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in values ? String(values[key]) : `{${key}}`
  );
}

export type { Dictionary };
