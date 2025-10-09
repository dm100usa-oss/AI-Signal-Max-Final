// lib/pdfHelpers.ts
export type FactorStatus = "Good" | "Moderate" | "Poor";

export function getDonutOffset(score: number, radius = 90): string {
  const s = clamp(score, 0, 100);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - s / 100);
  return offset.toFixed(2);
}

/**
 * Color logic:
 * - 0–39% → red (#EF4444)
 * - 40–79% → yellow (#F59E0B)
 * - 80–100% → green (#10B981)
 */
export function getDonutColor(score: number): string {
  const s = clamp(score, 0, 100);
  if (s < 40) return "#EF4444"; // red
  if (s < 80) return "#F59E0B"; // yellow
  return "#10B981"; // green
}

export function buildAssessment(score: number): {
  level: "High Visibility" | "Moderate Visibility" | "Low Visibility";
  p1: string;
  p2: string;
} {
  if (score >= 80) {
    return {
      level: "High Visibility",
      p1: "Your website is already well-prepared for AI platforms. Most of the key parameters are configured correctly, which ensures a high probability of appearing in results from ChatGPT, Copilot, Gemini, and other tools. This means that search and AI systems recognize your site as a reliable and user-friendly source of information.",
      p2: "However, even with high visibility, certain technical details require regular monitoring. Small errors or outdated settings can gradually reduce your performance. That is why it is important to continue periodic checks—at least every few months—to preserve and strengthen your results.",
    };
  }
  if (score >= 40) {
    return {
      level: "Moderate Visibility",
      p1: "Your website is generally visible to AI platforms, but some important parameters are misconfigured or require improvement. In its current state, the site may appear in AI results, but with limited trust and often ranked below competitors. This reduces the number of visitors and lowers your share of visibility.",
      p2: "This situation is not critical. By carefully following the recommendations, visibility can be significantly improved. Many companies achieve their strongest growth in traffic and inquiries precisely at this stage, once corrections are made.",
    };
  }
  return {
    level: "Low Visibility",
    p1: "At present, your website has serious visibility limitations for AI platforms. Several critical parameters are misconfigured or missing entirely. This means your site remains invisible to ChatGPT, Copilot, Gemini, and other systems—potential customers simply do not find you where they are searching.",
    p2: "A low visibility score indicates systemic issues. Fixing them requires a comprehensive approach, but it also unlocks new opportunities to reach audiences and position your business in the digital environment. Without addressing these problems, your site will continue to lose ground to competitors.",
  };
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
