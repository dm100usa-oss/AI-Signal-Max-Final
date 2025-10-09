// lib/prepareData.ts
import { getDonutOffset } from "./pdfHelpers";
import { AnalyzeResult, FactorStatus } from "./types";

export interface PreparedData {
  website: string;
  date: string;
  score: number;
  level: string;
  assessment_p1: string;
  assessment_p2: string;
  donut_offset: string;
  [key: string]: string | number;
}

function getLevel(score: number): string {
  if (score >= 80) return "High Visibility";
  if (score >= 50) return "Moderate Visibility";
  return "Low Visibility";
}

function getAssessment(level: string) {
  switch (level) {
    case "High Visibility":
      return {
        p1: "Your website is well structured for AI visibility. Most parameters are correctly configured and accessible.",
        p2: "To further improve performance, you can fine-tune content signals and structured data for enhanced AI indexing."
      };
    case "Moderate Visibility":
      return {
        p1: "Your website is generally visible to AI platforms, but some parameters require improvement.",
        p2: "Adjusting configuration of metadata, tags, and structured data can noticeably increase AI visibility and trust."
      };
    default:
      return {
        p1: "Your site is poorly visible for AI platforms. Most parameters are misconfigured, which limits visibility.",
        p2: "Fixing fundamental issues such as robots.txt, metadata, and structured data will significantly enhance visibility."
      };
  }
}

function getClass(status: FactorStatus): string {
  switch (status) {
    case "Good":
      return "good";
    case "Moderate":
      return "moderate";
    case "Poor":
      return "poor";
    default:
      return "moderate";
  }
}

export function prepareData(result: AnalyzeResult): PreparedData {
  const { url, score, factors } = result;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const level = getLevel(score);
  const { p1, p2 } = getAssessment(level);
  const donut_offset = getDonutOffset(score);

  const data: PreparedData = {
    website: url,
    date,
    score,
    level,
    assessment_p1: p1,
    assessment_p2: p2,
    donut_offset
  };

  // unified 15 keys — exact match with analyze.ts and PDF templates
  const orderedKeys = [
    "robots",
    "sitemap",
    "xrobots",
    "meta",
    "canonical",
    "title",
    "metadesc",
    "og",
    "h1",
    "schema",
    "mobile",
    "https",
    "alt",
    "favicon",
    "404"
  ];

  for (const key of orderedKeys) {
    const factor = factors[key];
    const status = factor?.status || "Moderate";
    data[`status_${key}`] = status;
    data[`status_${key}_class`] = getClass(status as FactorStatus);
  }

  return data;
}
