// lib/generatePDF.ts
import fs from "node:fs/promises";
import path from "node:path";

type GeneratePDFParams = {
  type: "owner" | "developer";
  data: Record<string, string>;
};

const API_URL =
  process.env.HTML2PDF_API_URL || "https://api.html2pdf.app/v1/generate";
const API_KEY =
  process.env.HTML2PDF_API_KEY || process.env.HTML2PDF_X_API_KEY;

export async function generatePDF({
  type,
  data,
}: GeneratePDFParams): Promise<Buffer> {
  const filename = type === "owner" ? "owner.html" : "developer_v2.html";
  const templatePath = path.join(process.cwd(), "public", "templates", filename);
  const template = await fs.readFile(templatePath, "utf8");

  const filledHtml = fillPlaceholders(template, data);

  if (!API_KEY) {
    throw new Error("Missing HTML2PDF API key (set HTML2PDF_API_KEY).");
  }

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

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `HTML2PDF error: ${res.status} ${res.statusText} - ${text}`
    );
  }

  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

function fillPlaceholders(template: string, data: Record<string, string>) {
  let html = template;

  for (const [key, value] of Object.entries(data)) {
    const safeValue = value ?? "";
    const re = new RegExp(`{{\\s*${escapeRegExp(key)}\\s*}}`, "g");
    html = html.replace(re, safeValue);
  }

  html = html.replace(/{{\s*[\w.-]+\s*}}/g, "");

  if (data.donut_color) {
    html = html.replace(
      /<stop offset="0%" stop-color="#ef4444"\/>/,
      `<stop offset="0%" stop-color="${data.donut_color}" />`
    );
  }

  return html;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
