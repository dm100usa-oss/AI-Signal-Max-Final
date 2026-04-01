import fs from "node:fs/promises";
import path from "node:path";

type GeneratePDFParams = {
  type: "owner" | "developer";
  data: {
    website: string;
    score: string;
    date: string;
    results: Record<string, string>;
  };
};

const API_URL =
  process.env.HTML2PDF_API_URL || "https://api.html2pdf.app/v1/generate";
const API_KEY =
  process.env.HTML2PDF_API_KEY || process.env.HTML2PDF_X_API_KEY;

export async function generatePDF({
  type,
  data,
}: GeneratePDFParams): Promise<Buffer> {
  const filename = type === "owner" ? "owner.html" : "developer.html";
  const templatePath = path.join(process.cwd(), "public", "templates", filename);
  const template = await fs.readFile(templatePath, "utf8");

  const base64Logo = await getBase64Logo();
  const scoreValue = parseInt(data.score.replace("%", "")) || 0;
  const donutColor = getDonutColor(scoreValue);
  const donutOffset = getDonutOffset(scoreValue);
  const visibilityLevel = getVisibilityText(scoreValue);

  const placeholders: Record<string, string> = {
    website: data.website,
    date: data.date,
    score: data.score,
    base64_logo: base64Logo,
    donut_color: donutColor,
    donut_offset: donutOffset.toString(),
    visibility_level: visibilityLevel,
    ...buildFactorStatuses(data.results),
    ...buildFactorClasses(data.results),
    assessment_p1: getAssessmentText1(scoreValue),
    assessment_p2: getAssessmentText2(scoreValue),
  };

  const filledHtml = fillPlaceholders(template, placeholders);

  if (!API_KEY) {
    throw new Error("Missing HTML2PDF API key (set HTML2PDF_API_KEY).");
  }

  const nocache = Date.now();
  const body = {
    html: filledHtml,
    options: {
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", right: "14mm", bottom: "18mm", left: "14mm" },
    },
    inline: true,
    apiKey: API_KEY,
  };

  const res = await fetch(`${API_URL}?nocache=${nocache}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTML2PDF error: ${res.status} – ${text}`);
  }

  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

function fillPlaceholders(template: string, data: Record<string, string>): string {
  let html = template;
  for (const [key, value] of Object.entries(data)) {
    const safe = value ?? "";
    const re = new RegExp(`{{\\s*${escapeRegExp(key)}\\s*}}`, "g");
    html = html.replace(re, safe);
  }
  html = html.replace(/{{\s*[\w.-]+\s*}}/g, "");
  return html;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getBase64Logo(): Promise<string> {
  try {
    const logoPath = path.join(process.cwd(), "public", "templates", "logo.png");
    const buffer = await fs.readFile(logoPath);
    return buffer.toString("base64");
  } catch {
    return "";
  }
}

function getDonutColor(score: number): string {
  if (score <= 50) return interpolateColor("#ef4444", "#f59e0b", score / 50);
  return interpolateColor("#f59e0b", "#10b981", (score - 50) / 50);
}

function getDonutOffset(score: number): number {
  const circumference = 2 * Math.PI * 90;
  return circumference - (score / 100) * circumference;
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const result = {
    r: Math.round(c1.r + (c2.r - c1.r) * factor),
    g: Math.round(c1.g + (c2.g - c1.g) * factor),
    b: Math.round(c1.b + (c2.b - c1.b) * factor),
  };
  return `rgb(${result.r}, ${result.g}, ${result.b})`;
}

function hexToRgb(hex: string) {
  const parsed = parseInt(hex.slice(1), 16);
  return { r: (parsed >> 16) & 255, g: (parsed >> 8) & 255, b: parsed & 255 };
}

function getVisibilityText(score: number): string {
  if (score >= 80) return "High visibility";
  if (score >= 40) return "Moderate visibility";
  return "Low visibility";
}

function getAssessmentText1(score: number): string {
  if (score >= 80)
    return "Your site demonstrates excellent visibility for AI platforms.";
  if (score >= 40)
    return "Your site is moderately visible for AI platforms.";
  return "Your site currently has low visibility for AI platforms.";
}

function getAssessmentText2(score: number): string {
  if (score >= 80)
    return "Minor improvements may further enhance exposure across AI tools.";
  if (score >= 40)
    return "Some parameters require improvement to achieve better indexing.";
  return "Several critical settings need attention to improve AI visibility.";
}

function buildFactorStatuses(results: Record<string, string>): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [key, status] of Object.entries(results)) {
    map[`status_${key}`] = status;
  }
  return map;
}

function buildFactorClasses(results: Record<string, string>): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [key, status] of Object.entries(results)) {
    const lower = (status || "").toLowerCase();
    map[`status_${key}_class`] =
      lower === "good"
        ? "good"
        : lower === "moderate"
        ? "moderate"
        : "poor";
  }
  return map;
}
