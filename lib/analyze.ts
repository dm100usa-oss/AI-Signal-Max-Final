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

export interface CheckItem {
  key: CheckKey;
  name: string;
  passed: boolean | null;
  description: string;
  status?: "Good" | "Moderate" | "Poor";
}

export interface AnalyzeResult {
  url: string;
  mode: Mode;
  items: CheckItem[];
  score: number;
  interpretation: ReturnType<typeof interpret>;
  results: Record<string, "Good" | "Moderate" | "Poor">;
  factors: Record<string, { status: "Good" | "Moderate" | "Poor" }>;
}

const DEFAULT_UA =
  "Mozilla/5.0 (compatible; AIVCheckBot/1.0; +https://aivcheck.com)";

export async function analyze(rawUrl: string, mode: Mode): Promise<AnalyzeResult> {
  const { origin, url } = normalizeUrl(rawUrl);
  const { html, headers, schemeOk } = await fetchHTML(url);

  const all: Record<CheckKey, CheckItem> = {
    robots_txt: await checkRobotsTxt(origin),
    sitemap_xml: await checkSitemap(origin),
    x_robots_tag: checkXRobots(headers),
    meta_robots: checkMetaRobots(html),
    canonical: checkCanonical(html, origin),
    title_tag: checkTitle(html),
    meta_description: checkMetaDescription(html),
    open_graph: checkOpenGraph(html),
    h1_present: checkH1(html),
    structured_data: checkJSONLD(html),
    mobile_friendly: checkViewport(html),
    https: {
      key: "https",
      name: nameOf("https"),
      passed: schemeOk,
      description: schemeOk ? "HTTPS detected" : "Page is not served via HTTPS",
    },
    alt_attributes: checkAltAttributes(html),
    favicon: await checkFavicon(html, origin),
    page_404: await check404(origin),
  };

  const score = calcWeightedScore(all);
  const keysToShow = mode === "quick" ? QUICK_KEYS : PRO_KEYS;
  const items = keysToShow.map((k) => all[k]);

  const results: Record<string, "Good" | "Moderate" | "Poor"> = {};
  const factors: Record<string, { status: "Good" | "Moderate" | "Poor" }> = {};

  for (const [key, item] of Object.entries(all)) {
    const cleanKey = key
      .replace(/_txt|_xml|_tag|_present|_data|_attributes/g, "")
      .replace("meta_description", "metadesc")
      .replace("open_graph", "og")
      .replace("structured_data", "schema")
      .replace("mobile_friendly", "mobile")
      .replace("alt_attributes", "alt")
      .replace("page_404", "404")
      .replace("h1_present", "h1")
      .replace("title_tag", "title")
      .replace("meta_robots", "meta")
      .replace("robots_txt", "robots")
      .replace("sitemap_xml", "sitemap")
      .replace("x_robots_tag", "xrobots");

    const status =
      item.passed === true ? "Good" : item.passed === false ? "Poor" : "Moderate";

    results[cleanKey] = status;
    factors[cleanKey] = { status };
  }

  return {
    url,
    mode,
    items,
    score,
    interpretation: interpret(score),
    results,
    factors,
  };
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
): Promise<{ html: string | null; headers: Headers; schemeOk: boolean }> {
  const res = await fetchWithTimeout(url);
  const schemeOk = url.startsWith("https://") && res.ok;
  const html = res.ok ? await res.text() : null;
  return { html, headers: res.headers, schemeOk };
}

/* ---------- individual checks ---------- */
function item(key: CheckKey, passed: boolean | null, description: string): CheckItem {
  return { key, name: nameOf(key), passed, description };
}

function textMatch(html: string | null, re: RegExp) {
  if (!html) return null;
  const m = html.match(re);
  return m ? m[1] || m[0] : null;
}

function stripTags(s: string) {
  return s.replace(/<[^>]*>/g, "").trim();
}

async function checkRobotsTxt(origin: string): Promise<CheckItem> {
  const url = origin + "/robots.txt";
  try {
    const res = await fetchWithTimeout(url, { method: "GET" });
    if (!res.ok) return item("robots_txt", false, "robots.txt not found");
    const text = await res.text();
    const blocksAll =
      /Disallow:\s*\/\s*$/im.test(text) ||
      /User-agent:\s*\*\s*[\r\n]+Disallow:\s*\/\s*$/im.test(text);
    return item(
      "robots_txt",
      blocksAll ? false : true,
      blocksAll ? "robots.txt blocks all" : "robots.txt valid"
    );
  } catch {
    return item("robots_txt", null, "robots.txt not accessible");
  }
}

async function checkSitemap(origin: string): Promise<CheckItem> {
  const paths = ["/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml"];
  for (const p of paths) {
    try {
      const res = await fetchWithTimeout(origin + p, { method: "GET" });
      if (res.ok) return item("sitemap_xml", true, `Found ${p}`);
    } catch {}
  }
  return item("sitemap_xml", false, "Sitemap not found");
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
  return item("title_tag", t.length ? true : false, t.length ? `Title: ${t}` : "Missing <title>");
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
    d ? `Meta description: ${d}` : "Missing meta description"
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
  if (t && d) return item("open_graph", true, "OG tags found");
  if (!t && !d) return item("open_graph", false, "OG tags missing");
  return item("open_graph", null, "OG tags partially found");
}

function checkH1(html: string | null): CheckItem {
  const h1 = stripTags(
    textMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || ""
  );
  return item("h1_present", h1.length ? true : false, h1 ? `H1: ${h1}` : "Missing H1");
}

function checkJSONLD(html: string | null): CheckItem {
  if (!html) return item("structured_data", false, "No JSON-LD structured data");
  const re =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ok = false;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const json = JSON.parse(m[1]);
      if (json) {
        ok = true;
        break;
      }
    } catch {}
  }
  return item(
    "structured_data",
    ok ? true : false,
    ok ? "Valid JSON-LD present" : "No JSON-LD structured data"
  );
}

function checkViewport(html: string | null): CheckItem {
  const v =
    textMatch(
      html,
      /<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["'][^>]*>/i
    ) || "";
  if (!v) return item("mobile_friendly", false, "Missing viewport meta");
  const ok = /width\s*=\s*device-width/i.test(v);
  return item("mobile_friendly", ok ? true : null, `viewport: ${v}`);
}

function checkAltAttributes(html: string | null): CheckItem {
  if (!html) return item("alt_attributes", null, "No images detected");
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  if (!imgTags.length) return item("alt_attributes", null, "No images on page");
  let withAlt = 0;
  for (const tag of imgTags) {
    const alt = (tag.match(/alt\s*=\s*["']([^"']*)["']/i) || [,""])[1].trim();
    if (alt.length > 0) withAlt++;
  }
  const ratio = withAlt / imgTags.length;
  if (ratio >= 0.8)
    return item("alt_attributes", true, `Images with alt: ${withAlt}/${imgTags.length}`);
  if (ratio >= 0.3)
    return item("alt_attributes", null, `Partial alts: ${withAlt}/${imgTags.length}`);
  return item("alt_attributes", false, `Poor alts: ${withAlt}/${imgTags.length}`);
}

async function checkFavicon(
  html: string | null,
  origin: string
): Promise<CheckItem> {
  const linkHref =
    textMatch(
      html,
      /<link[^>]+rel=["'](?:shortcut\s+icon|icon)["'][^>]+href=["']([^"']+)["'][^>]*>/i
    ) || "";
  if (linkHref) return item("favicon", true, `Icon: ${linkHref}`);
  try {
    const res = await fetchWithTimeout(origin + "/favicon.ico", { method: "HEAD" });
    if (res.ok) return item("favicon", null, "/favicon.ico found but no <link>");
    return item("favicon", false, "No favicon");
  } catch {
    return item("favicon", false, "No favicon");
  }
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
