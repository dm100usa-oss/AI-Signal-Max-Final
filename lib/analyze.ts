// lib/analyze.ts
import {
  QUICK_KEYS,
  PRO_KEYS,
  weightOf,
  nameOf,
  interpret,
  CheckKey,
  Mode,
} from "./score";
import { saveData } from "./storage";
import { computeAiScores, FactorKey, AiScores } from "./partScores";

export interface CheckItem {
  key: CheckKey;
  name: string;
  passed: boolean | null;
  description: string;
  status?: "Good" | "Moderate" | "Poor";
  value?: string;
}

export interface AnalyzeResult {
  url: string;
  mode: Mode;
  items: CheckItem[];
  allItems: CheckItem[];
  score: number;
  interpretation: ReturnType<typeof interpret>;
  results: Record<string, "Good" | "Moderate" | "Poor">;
  factors: Record<string, { status: "Good" | "Moderate" | "Poor" }>;
  aiScores?: AiScores;
}

const DEFAULT_UA =
  "Mozilla/5.0 (compatible; AIVCheckBot/1.0; +https://aivcheck.com)";

export async function analyze(rawUrl: string, mode: Mode): Promise<AnalyzeResult> {
  const { origin, url } = normalizeUrl(rawUrl);
  const { html, headers, schemeOk, responseTimeMs } = await fetchHTML(url);

  const sitemapResult = await checkSitemap(origin, html, headers);

  const all: Record<CheckKey, CheckItem> = {
    robots_txt: await checkRobotsTxt(origin),
    sitemap_xml: sitemapResult.pageCount,
    sitemap_lastmod: sitemapResult.lastmod,
    x_robots_tag: checkXRobots(headers),
    meta_robots: checkMetaRobots(html),
    canonical: checkCanonical(html, origin),
    title_tag: checkTitle(html),
    meta_description: checkMetaDescription(html),
    open_graph: checkOpenGraph(html),
    h1_present: checkH1(html),
    h2_present: checkH2(html),
    structured_data: checkJSONLD(html),
    mobile_friendly: checkViewport(html),
    https: {
      key: "https",
      name: nameOf("https"),
      passed: schemeOk,
      description: schemeOk ? "HTTPS detected" : "Page is not served via HTTPS",
      value: schemeOk ? "HTTPS" : "HTTP",
    },
    alt_attributes: checkAltAttributes(html),
    page_speed: checkPageSpeed(responseTimeMs),
    page_404: await check404(origin),
    contacts: checkContacts(html),
    site_language: checkLanguage(html),
  };

  // --- 9 новых факторов (20-28) для AI Scores ---
  const newFacts = {
    theme:      checkTheme(html),
    services:   checkServices(html),
    prices:     checkPrices(html),
    faq:        checkFAQ(html),
    tables:     checkTables(html),
    reviews:    checkReviews(html),
    org_schema: checkOrgSchema(html),
    author:     checkAuthor(html),
    social:     checkSocial(html),
  };

  const score = calcWeightedScore(all);
  const keysToShow = mode === "quick" ? QUICK_KEYS : PRO_KEYS;
  const items = keysToShow.map((k) => all[k]);
  const allItems = Object.values(all);

  const results: Record<string, "Good" | "Moderate" | "Poor"> = {};
  const factors: Record<string, { status: "Good" | "Moderate" | "Poor" }> = {};

  for (const [key, item] of Object.entries(all)) {
    const status =
      item.passed === true ? "Good" : item.passed === false ? "Poor" : "Moderate";
    results[key] = status;
    factors[key] = { status };
  }

  // статусы новых факторов (theme и др.) тоже кладём в results для показа
  for (const [key, item] of Object.entries(newFacts)) {
    const status =
      item.passed === true ? "Good" : item.passed === false ? "Poor" : "Moderate";
    results[key] = status;
    factors[key] = { status };
  }

  // --- AI Scores: собираем факторы, которые ЕСТЬ на сайте ---
  const present = new Set<FactorKey>();
  for (const [key, it] of Object.entries(all)) {
    if (it.passed === true) present.add(key as FactorKey);
  }
  for (const [key, it] of Object.entries(newFacts)) {
    if (it.passed === true) present.add(key as FactorKey);
  }
  const aiScores = computeAiScores(present);

  const resultData = {
    url,
    mode,
    items,
    allItems,
    score,
    interpretation: interpret(score),
    results,
    factors,
    aiScores,
  };

  const sessionKey = `${mode}:${url}`;
  await saveData(sessionKey, resultData);

  return resultData;
}

function calcWeightedScore(all: Record<CheckKey, CheckItem>): number {
  const total = PRO_KEYS.reduce((a, k) => a + weightOf(k), 0);
  const pass = PRO_KEYS.reduce(
    (a, k) => a + (all[k].passed === true ? weightOf(k) : 0),
    0
  );
  return Math.round((pass / total) * 100);
}

function normalizeUrl(input: string): { origin: string; url: string } {
  let u = input.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  const urlObj = new URL(u);
  return { origin: urlObj.origin, url: urlObj.toString() };
}

async function fetchWithTimeout(
  resource: string,
  opts: RequestInit & { timeoutMs?: number } = {}
) {
  const { timeoutMs = 12000, ...rest } = opts;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(resource, {
      ...rest,
      redirect: "follow",
      headers: { "user-agent": DEFAULT_UA, ...(rest.headers || {}) },
      signal: controller.signal,
      cache: "no-store",
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function fetchHTML(
  url: string
): Promise<{ html: string | null; headers: Headers; schemeOk: boolean; responseTimeMs: number }> {
  const start = Date.now();
  const res = await fetchWithTimeout(url);
  const responseTimeMs = Date.now() - start;
  const schemeOk = url.startsWith("https://") && res.ok;
  const html = res.ok ? await res.text() : null;
  return { html, headers: res.headers, schemeOk, responseTimeMs };
}

function item(key: CheckKey, passed: boolean | null, description: string, value?: string): CheckItem {
  return { key, name: nameOf(key), passed, description, value };
}

function textMatch(html: string | null, re: RegExp) {
  if (!html) return null;
  const m = html.match(re);
  return m ? m[1] || m[0] : null;
}

function stripTags(s: string) {
  return s.replace(/<[^>]*>/g, "").trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

async function checkRobotsTxt(origin: string): Promise<CheckItem> {
  const url = origin + "/robots.txt";
  try {
    const res = await fetchWithTimeout(url, { method: "GET" });
    if (!res.ok) return item("robots_txt", false, "robots.txt not found", "Blocked");
    const text = await res.text();
    const blocksAll =
      /Disallow:\s*\/\s*$/im.test(text) ||
      /User-agent:\s*\*\s*[\r\n]+Disallow:\s*\/\s*$/im.test(text);
    return item(
      "robots_txt",
      blocksAll ? false : true,
      blocksAll ? "robots.txt blocks all" : "robots.txt valid",
      blocksAll ? "Blocked" : "Open"
    );
  } catch {
    return item("robots_txt", null, "robots.txt not accessible", "Blocked");
  }
}

function formatDate(raw: string): string {
  try {
    const d = new Date(raw.trim());
    if (isNaN(d.getTime())) return raw.trim();
    return d.toLocaleDateString("ru-RU", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch {
    return raw.trim();
  }
}

async function checkSitemap(
  origin: string,
  html: string | null,
  headers: Headers
): Promise<{ pageCount: CheckItem; lastmod: CheckItem }> {
  const paths = ["/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml"];
  for (const p of paths) {
    try {
      const res = await fetchWithTimeout(origin + p, { method: "GET" });
      if (res.ok) {
        const text = await res.text();
        const urlCount = (text.match(/<url>/gi) || []).length;
        const sitemapCount = (text.match(/<sitemap>/gi) || []).length;
        const count = urlCount > 0 ? urlCount : sitemapCount;
        const lastmodRaw = textMatch(text, /<lastmod>([^<]+)<\/lastmod>/i);
        const countStr = count > 0 ? `${count}` : "Found";
        const lastmodFormatted = lastmodRaw ? formatDate(lastmodRaw) : "Not found";
        return {
          pageCount: item("sitemap_xml", true, `Found ${p}`, countStr),
          lastmod: item("sitemap_lastmod", lastmodRaw ? true : null, `lastmod: ${lastmodRaw}`, lastmodFormatted),
        };
      }
    } catch {}
  }

  // Sitemap не найден — ищем дату в других местах
  const lastmodFormatted = getFallbackDate(html, headers);
  return {
    pageCount: item("sitemap_xml", false, "Sitemap not found", "Not found"),
    lastmod: item("sitemap_lastmod", lastmodFormatted ? true : null, "fallback date", lastmodFormatted || "Not found"),
  };
}

function getFallbackDate(html: string | null, headers: Headers): string {
  // 1. Мета-тег article:modified_time
  const metaModified = textMatch(
    html,
    /<meta[^>]+property=["']article:modified_time["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );
  if (metaModified) return formatDate(metaModified);

  // 2. Мета-тег last-modified
  const metaLastMod = textMatch(
    html,
    /<meta[^>]+name=["']last-modified["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );
  if (metaLastMod) return formatDate(metaLastMod);

  // 3. HTTP заголовок Last-Modified
  const headerDate = headers.get("last-modified");
  if (headerDate) return formatDate(headerDate);

  return "";
}

function checkXRobots(headers: Headers): CheckItem {
  const v = headers.get("x-robots-tag") || "";
  if (!v) return item("x_robots_tag", null, "No X-Robots-Tag header");
  const blocked = /\bnoindex\b|\bnone\b/i.test(v);
  return item("x_robots_tag", blocked ? false : true, `X-Robots-Tag: ${v}`);
}

function checkMetaRobots(html: string | null): CheckItem {
  const content =
    textMatch(
      html,
      /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i
    ) || "";
  if (!content) return item("meta_robots", null, "No meta robots tag");
  const blocked = /\bnoindex\b|\bnone\b/i.test(content);
  return item("meta_robots", blocked ? false : true, `meta robots: ${content}`);
}

function checkCanonical(html: string | null, origin: string): CheckItem {
  const href =
    textMatch(
      html,
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i
    ) || "";
  if (!href) return item("canonical", null, "No canonical link");
  const abs = /^https?:\/\//i.test(href);
  const sameOrigin = abs ? href.startsWith(origin) : true;
  return item("canonical", sameOrigin ? true : false, `canonical: ${href}`);
}

function checkTitle(html: string | null): CheckItem {
  const t = stripTags(
    textMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || ""
  );
  return item("title_tag", t.length ? true : false, t.length ? `Title: ${t}` : "Missing <title>", t || "Not found");
}

function checkMetaDescription(html: string | null): CheckItem {
  const d =
    textMatch(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i
    ) || "";
  return item(
    "meta_description",
    d.trim().length ? true : false,
    d ? `Meta description: ${d}` : "Missing meta description",
    d || "Not found"
  );
}

function checkOpenGraph(html: string | null): CheckItem {
  const t =
    textMatch(
      html,
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i
    ) || "";
  const d =
    textMatch(
      html,
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i
    ) || "";
  if (t && d) return item("open_graph", true, "OG tags found", t);
  if (!t && !d) return item("open_graph", false, "OG tags missing", "Not found");
  return item("open_graph", null, "OG tags partially found", t || "Partial");
}

function checkH1(html: string | null): CheckItem {
  const h1 = stripTags(
    textMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || ""
  );
  return item("h1_present", h1.length ? true : false, h1 ? `H1: ${h1}` : "Missing H1", h1 || "Not found");
}

function checkH2(html: string | null): CheckItem {
  const h2 = decodeEntities(stripTags(
    textMatch(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i) || ""
  ));
  return item("h2_present", h2.length ? true : null, h2 ? `H2: ${h2}` : "Missing H2", h2 || "Not found");
}

function checkContacts(html: string | null): CheckItem {
  if (!html) return item("contacts", null, "No contacts found", "Not found");
  const phone = textMatch(html, /href=["']tel:([^"']+)["']/i);
  if (phone) return item("contacts", true, `Phone: ${phone}`, phone.trim());
  const email = textMatch(html, /href=["']mailto:([^"']+)["']/i);
  if (email) return item("contacts", true, `Email: ${email}`, email.trim());
  return item("contacts", null, "No contacts found", "Not found");
}

const LANG_MAP: Record<string, string> = {
  ru: "Russian", en: "English", de: "Deutsch", fr: "Français",
  es: "Español", it: "Italiano", pt: "Português", zh: "中文",
  ja: "日本語", ko: "한국어", ar: "العربية", tr: "Türkçe",
  pl: "Polski", nl: "Nederlands", uk: "Ukrainian",
};

function checkLanguage(html: string | null): CheckItem {
  const lang = textMatch(html, /<html[^>]+lang=["']([^"']+)["']/i);
  if (!lang) return item("site_language", null, "No lang attribute", "Unknown");
  const code = lang.split("-")[0].toLowerCase();
  const name = LANG_MAP[code] || lang.toUpperCase();
  return item("site_language", true, `Language: ${lang}`, name);
}

function checkJSONLD(html: string | null): CheckItem {
  if (!html) return item("structured_data", false, "No JSON-LD structured data", "Not detected");
  const re =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ok = false;
  let schemaType = "";
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const json = JSON.parse(m[1]);
      if (json) {
        ok = true;
        schemaType = json["@type"] || "";
        break;
      }
    } catch {}
  }
  return item(
    "structured_data",
    ok ? true : false,
    ok ? "Valid JSON-LD present" : "No JSON-LD structured data",
    ok ? (schemaType || "Found") : "Not detected"
  );
}

function checkViewport(html: string | null): CheckItem {
  const v =
    textMatch(
      html,
      /<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["'][^>]*>/i
    ) || "";
  if (!v) return item("mobile_friendly", false, "Missing viewport meta", "No");
  const ok = /width\s*=\s*device-width/i.test(v);
  return item("mobile_friendly", ok ? true : null, `viewport: ${v}`, ok ? "Yes" : "No");
}

function checkAltAttributes(html: string | null): CheckItem {
  if (!html) return item("alt_attributes", null, "No images detected");
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  if (!imgTags.length) return item("alt_attributes", null, "No images on page");
  let withAlt = 0;
  for (const tag of imgTags) {
    const alt = (tag.match(/alt\s*=\s*["']([^"']*)["']/i) || [, ""])[1].trim();
    if (alt.length > 0) withAlt++;
  }
  const ratio = withAlt / imgTags.length;
  if (ratio >= 0.8)
    return item("alt_attributes", true, `Images with alt: ${withAlt}/${imgTags.length}`);
  if (ratio >= 0.3)
    return item("alt_attributes", null, `Partial alts: ${withAlt}/${imgTags.length}`);
  return item("alt_attributes", false, `Poor alts: ${withAlt}/${imgTags.length}`);
}

function checkPageSpeed(responseTimeMs: number): CheckItem {
  const valueStr = `${responseTimeMs} мс`;
  if (responseTimeMs <= 1500)
    return item("page_speed", true, `Response time: ${responseTimeMs}ms — fast`, valueStr);
  if (responseTimeMs <= 3000)
    return item("page_speed", null, `Response time: ${responseTimeMs}ms — moderate`, valueStr);
  return item("page_speed", false, `Response time: ${responseTimeMs}ms — slow`, valueStr);
}

async function check404(origin: string): Promise<CheckItem> {
  const url = `${origin}/__aivcheck_not_found_${Date.now().toString(36)}.html`;
  try {
    const res = await fetchWithTimeout(url, { method: "GET" });
    const text = await res.text();
    const hint = /404/i.test(text) || /not found/i.test(text);
    const ok = res.status === 404 || hint;
    return item(
      "page_404",
      ok ? true : false,
      ok ? "Proper 404 response" : `Unexpected status ${res.status}`
    );
  } catch {
    return item("page_404", null, "404 check inconclusive");
  }
}

// ===== 9 новых проверок для AI Scores (20-28) =====
// Все читают только из кода страницы, без браузера.
// Бонусные факторы проверяются грубо (есть блок / нет) — этого достаточно для скора.

function checkTheme(html: string | null): CheckItem {
  // Тема видна, если ИИ есть из чего её понять: title + H1 + description (или тип JSON-LD)
  if (!html) return item("theme" as CheckKey, false, "No HTML to detect theme", "Not detected");
  const hasTitle = /<title[^>]*>[^<]+<\/title>/i.test(html);
  const hasH1 = /<h1[^>]*>[\s\S]*?<\/h1>/i.test(html);
  const hasDesc = /<meta[^>]+name=["']description["'][^>]+content=["'][^"']+["']/i.test(html);
  const ok = hasTitle && hasH1 && hasDesc;
  return item("theme" as CheckKey, ok ? true : false, ok ? "Theme is clear" : "Theme unclear", ok ? "Clear" : "Unclear");
}

function checkServices(html: string | null): CheckItem {
  if (!html) return item("services" as CheckKey, null, "No HTML", "Not detected");
  const ok = /(services|услуг|our services|what we do|наши услуги|сервис)/i.test(html);
  return item("services" as CheckKey, ok ? true : null, ok ? "Services block found" : "No services block", ok ? "Yes" : "No");
}

function checkPrices(html: string | null): CheckItem {
  if (!html) return item("prices" as CheckKey, null, "No HTML", "Not detected");
  const ld = (html.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || []).join(" ");
  const ok = /"price"/i.test(ld) || /[\$€₽£]\s?\d|\d+\s?(usd|eur|руб|\$)/i.test(html);
  return item("prices" as CheckKey, ok ? true : null, ok ? "Prices found" : "No prices", ok ? "Yes" : "No");
}

function checkFAQ(html: string | null): CheckItem {
  if (!html) return item("faq" as CheckKey, null, "No HTML", "Not detected");
  const ld = (html.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || []).join(" ");
  const ok = /"FAQPage"/i.test(ld) || /(faq|часто задаваемые|frequently asked|вопрос[\s-]*ответ)/i.test(html);
  return item("faq" as CheckKey, ok ? true : null, ok ? "FAQ found" : "No FAQ", ok ? "Yes" : "No");
}

function checkTables(html: string | null): CheckItem {
  if (!html) return item("tables" as CheckKey, null, "No HTML", "Not detected");
  const ok = /<table[\s\S]*?<\/table>/i.test(html);
  return item("tables" as CheckKey, ok ? true : null, ok ? "Table found" : "No tables", ok ? "Yes" : "No");
}

function checkReviews(html: string | null): CheckItem {
  if (!html) return item("reviews" as CheckKey, null, "No HTML", "Not detected");
  const ld = (html.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || []).join(" ");
  const ok = /"(aggregateRating|review|Review)"/i.test(ld) || /(rating|review|отзыв|звёзд|stars|★)/i.test(html);
  return item("reviews" as CheckKey, ok ? true : null, ok ? "Reviews/rating found" : "No reviews", ok ? "Yes" : "No");
}

function checkOrgSchema(html: string | null): CheckItem {
  if (!html) return item("org_schema" as CheckKey, false, "No HTML", "Not detected");
  const ld = (html.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || []).join(" ");
  const ok = /"@type"\s*:\s*"(Organization|LocalBusiness|Corporation|[A-Za-z]*Business)"/i.test(ld);
  return item("org_schema" as CheckKey, ok ? true : false, ok ? "Organization schema found" : "No organization schema", ok ? "Yes" : "No");
}

function checkAuthor(html: string | null): CheckItem {
  if (!html) return item("author" as CheckKey, null, "No HTML", "Not detected");
  const ld = (html.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || []).join(" ");
  const ok = /"author"/i.test(ld) || /rel=["']author["']/i.test(html) || /(автор|author)[\s:]/i.test(html);
  return item("author" as CheckKey, ok ? true : null, ok ? "Author found" : "No author", ok ? "Yes" : "No");
}

function checkSocial(html: string | null): CheckItem {
  if (!html) return item("social" as CheckKey, null, "No HTML", "Not detected");
  const ok = /(facebook\.com|instagram\.com|twitter\.com|x\.com|linkedin\.com|youtube\.com|t\.me|vk\.com)/i.test(html);
  return item("social" as CheckKey, ok ? true : null, ok ? "Social links found" : "No social links", ok ? "Yes" : "No");
}
