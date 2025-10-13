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

import { saveData } from "./storage";

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

  const resultData = {
    url,
    mode,
    items,
    score,
    interpretation: interpret(score),
    results,
    factors,
  };

  const sessionKey = `${mode}:${url}`;
  await saveData(sessionKey, resultData);

  return resultData;
}
