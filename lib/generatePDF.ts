import fs from "fs";
import path from "path";
import axios from "axios";
import Handlebars from "handlebars";
import { getDonutOffset } from "./pdfHelpers";
import { AnalyzeResult } from "./types";

const HTML2PDF_API = "https://api.html2pdf.app/v1/generate";

export async function generatePDF(
  result: AnalyzeResult,
  type: "owner" | "developer"
): Promise<Buffer> {
  const templatePath = path.join(
    process.cwd(),
    "public",
    "templates",
    `${type}.html`
  );
  const htmlTemplate = fs.readFileSync(templatePath, "utf-8");

  const template = Handlebars.compile(htmlTemplate);

  const base64Logo = fs
    .readFileSync(path.join(process.cwd(), "public", "logo-base64.txt"))
    .toString();

  const donutOffset = getDonutOffset(result.score);
  const date = new Date().toLocaleDateString("en-US");

  const html = template({
    base64_logo: base64Logo,
    website: result.website,
    date,
    score: result.score,
    level: result.level,
    assessment_p1: result.assessment_p1,
    assessment_p2: result.assessment_p2,
    donut_offset: donutOffset,
    status_robots: result.factors.robots.status,
    status_robots_class: result.factors.robots.status.toLowerCase(),
    status_sitemap: result.factors.sitemap.status,
    status_sitemap_class: result.factors.sitemap.status.toLowerCase(),
    status_xrobots: result.factors.xrobots.status,
    status_xrobots_class: result.factors.xrobots.status.toLowerCase(),
    status_meta: result.factors.meta.status,
    status_meta_class: result.factors.meta.status.toLowerCase(),
    status_canonical: result.factors.canonical.status,
    status_canonical_class: result.factors.canonical.status.toLowerCase(),
    status_title: result.factors.title.status,
    status_title_class: result.factors.title.status.toLowerCase(),
    status_metadesc: result.factors.metadesc.status,
    status_metadesc_class: result.factors.metadesc.status.toLowerCase(),
    status_og: result.factors.og.status,
    status_og_class: result.factors.og.status.toLowerCase(),
    status_h1: result.factors.h1.status,
    status_h1_class: result.factors.h1.status.toLowerCase(),
    status_schema: result.factors.schema.status,
    status_schema_class: result.factors.schema.status.toLowerCase(),
    status_mobile: result.factors.mobile.status,
    status_mobile_class: result.factors.mobile.status.toLowerCase(),
    status_https: result.factors.https.status,
    status_https_class: result.factors.https.status.toLowerCase(),
    status_alt: result.factors.alt.status,
    status_alt_class: result.factors.alt.status.toLowerCase(),
    status_favicon: result.factors.favicon.status,
    status_favicon_class: result.factors.favicon.status.toLowerCase(),
    status_404: result.factors["404"].status,
    status_404_class: result.factors["404"].status.toLowerCase(),
  });

  const payload = {
    html,
    apiKey: process.env.HTML2PDF_API_KEY,
    options: {
      format: "Letter",
      printBackground: true,
      margin: {
        top: "40px",
        right: "50px",
        bottom: "40px",
        left: "50px",
      },
    },
  };

  const response = await axios.post(HTML2PDF_API, payload, {
    responseType: "arraybuffer",
  });

  return Buffer.from(response.data);
}
