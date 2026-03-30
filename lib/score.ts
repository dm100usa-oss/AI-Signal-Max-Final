export type Mode = "quick" | "pro";

export type CheckKey =
  | "robots_txt"
  | "sitemap_xml"
  | "x_robots_tag"
  | "meta_robots"
  | "canonical"
  | "title_tag"
  | "meta_description"
  | "open_graph"
  | "h1_present"
  | "structured_data"
  | "mobile_friendly"
  | "https"
  | "alt_attributes"
  | "favicon"
  | "page_404";

export interface CheckMeta {
  key: CheckKey;
  name: string;
  weight: number;
}

export const CHECKS: CheckMeta[] = [
  { key: "robots_txt",       name: "robots.txt",                 weight: 12 },
  { key: "sitemap_xml",      name: "sitemap.xml",                weight: 10 },
  { key: "x_robots_tag",     name: "X-Robots-Tag (headers)",     weight: 8  },
  { key: "meta_robots",      name: "Meta robots",                weight: 8  },
  { key: "canonical",        name: "Canonical",                  weight: 7  },
  { key: "title_tag",        name: "Title tag",                  weight: 7  },
  { key: "meta_description", name: "Meta description",           weight: 7  },
  { key: "open_graph",       name: "Open Graph",                 weight: 5  },
  { key: "h1_present",       name: "H1",                         weight: 6  },
  { key: "structured_data",  name: "Structured Data (JSON-LD)",  weight: 10 },
  { key: "mobile_friendly",  name: "Mobile friendly (viewport)", weight: 7  },
  { key: "https",            name: "HTTPS / SSL",                weight: 6  },
  { key: "alt_attributes",   name: "Alt attributes",             weight: 4  },
  { key: "favicon",          name: "Favicon",                    weight: 2  },
  { key: "page_404",         name: "404 page",                   weight: 2  },
]; // total = 100

export const PRO_KEYS: CheckKey[] = CHECKS.map((c) => c.key);

export const QUICK_KEYS: CheckKey[] = [
  "robots_txt",
  "sitemap_xml",
  "meta_robots",
  "canonical",
  "title_tag",
];

export function weightOf(key: CheckKey): number {
  const it = CHECKS.find((c) => c.key === key);
  return it ? it.weight : 0;
}

export function nameOf(key: CheckKey): string {
  const it = CHECKS.find((c) => c.key === key);
  return it ? it.name : key;
}

export function interpret(
  score: number
): "Excellent" | "Good" | "Moderate" | "Poor" {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Moderate";
  return "Poor";
}

// Color for factor status (used in UI)
export function statusColor(
  passed: boolean | null
): "green" | "yellow" | "red" {
  if (passed === true) return "green";
  if (passed === false) return "red";
  return "yellow";
}
