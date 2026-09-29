// Общая валидация адреса сайта для полей быстрой/детальной проверки.
// Перенесена из инструмента AI Signal Max, чтобы планка качества совпадала.

export const normalizeUrl = (v: string) =>
  v.replace(/^\s*checked\s+website:\s*/i, "").trim();

export const isValidUrl = (u: string): boolean => {
  try {
    const url = new URL(u.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const hostname = url.hostname.toLowerCase();
    if (!hostname.includes(".")) return false;
    if (hostname === "localhost") return false;
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return false;
    const parts = hostname.split(".");
    const tld = parts[parts.length - 1];
    if (!/^[a-z]{2,}$/.test(tld)) return false;
    if (parts.some((p) => p.length === 0)) return false;
    return true;
  } catch {
    return false;
  }
};

export const BLOCKED_DOMAINS = [
  "example.com", "example.org", "example.net",
  "test.com", "test.org", "127.0.0.1", "0.0.0.0",
  "dummy.com", "invalid", "example.local", "test.local",
];

// Готовит адрес: подставляет https://, проверяет.
// Возвращает чистый URL или код ошибки.
export function prepareUrl(
  raw: string
): { ok: true; url: string } | { ok: false; reason: "invalid" | "blocked" } {
  let u = normalizeUrl(raw);
  if (!u.startsWith("http://") && !u.startsWith("https://")) {
    u = "https://" + u;
  }
  if (!isValidUrl(u)) return { ok: false, reason: "invalid" };
  const hostname = new URL(u).hostname.toLowerCase();
  if (BLOCKED_DOMAINS.includes(hostname)) return { ok: false, reason: "blocked" };
  return { ok: true, url: u };
}
