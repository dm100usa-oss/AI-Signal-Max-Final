import type { Topic } from "./types";
import whyNotAppearingMain from "./why-not-appearing--main";
import whatIsGeoMain from "./what-is-geo--main";
import technicalGeoChecklistMain from "./technical-geo-checklist--main";
import schemaOrgForAiMain from "./schema-org-for-ai--main";
import writingCitableContentMain from "./writing-citable-content--main";
import whyAiRecommendsCompetitorsMain from "./why-ai-recommends-competitors--main";
import restaurantsCafesAiMain from "./restaurants-cafes-ai-recommendations--main";
import homeServicesAiMain from "./home-services-ai-recommendations--main";
import healthBeautyAiMain from "./health-beauty-ai-recommendations--main";

// Реестр всех тем. Новые темы добавляются сюда.
export const topics: Topic[] = [
  whatIsGeoMain,
  whyNotAppearingMain,
  technicalGeoChecklistMain,
  schemaOrgForAiMain,
  writingCitableContentMain,
  whyAiRecommendsCompetitorsMain,
  restaurantsCafesAiMain,
  homeServicesAiMain,
  healthBeautyAiMain,
];

export function getTopic(section: string, slug: string): Topic | undefined {
  return topics.find((t) => t.section === section && t.slug === slug);
}

// Темы раздела (только опубликованные — для списков и индексации)
export function publishedTopicsOfSection(section: string): Topic[] {
  return topics.filter((t) => t.section === section && t.status === "published");
}

// Все опубликованные темы (для sitemap позже)
export function allPublishedTopics(): Topic[] {
  return topics.filter((t) => t.status === "published");
}

// Опубликованные статьи (kind article или без kind) — для списка /articles
export function allPublishedArticles(): Topic[] {
  return topics.filter(
    (t) => t.status === "published" && (t.kind ?? "article") === "article"
  );
}

// Опубликованные исследования — для витрины /research
export function allPublishedResearch(): Topic[] {
  return topics.filter((t) => t.status === "published" && t.kind === "research");
}

export type { Topic };
