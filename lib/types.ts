// lib/types.ts
export type FactorStatus = "Excellent" | "Good" | "Moderate" | "Poor";

export interface Factor {
  status: FactorStatus;
}

export interface AnalyzeResult {
  url: string;
  mode: "quick" | "pro" | "test";
  score: number;
  interpretation: FactorStatus;
  results: Record<string, FactorStatus>;
  factors: Record<string, Factor>;
}

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
