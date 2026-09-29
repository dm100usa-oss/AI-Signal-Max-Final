import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { LOCALES } from "@/locales/config";
import { sections } from "@/content/sections";
import { allPublishedTopics } from "@/content/topics";

// =============================================================
//  sitemap.ts — генерируемый роут (отдаётся как /sitemap.xml).
//  Сам подхватывает новые разделы и темы из данных проекта.
//  В карту попадают только published-темы (draft исключены
//  на уровне хелпера allPublishedTopics).
//  По одной записи на каждый язык из LOCALES (en, ru; задел es).
// =============================================================

const BASE = siteConfig.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of LOCALES) {
    const prefix = `${BASE}/${lang}`;

    // Главная страница языка
    entries.push({
      url: prefix,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    });

    // Список статей и страница методики
    entries.push({
      url: `${prefix}/articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    entries.push({
      url: `${prefix}/research`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    entries.push({
      url: `${prefix}/method`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
    entries.push({
      url: `${prefix}/tool`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
    entries.push({
      url: `${prefix}/knowledge-system`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
    entries.push({
      url: `${prefix}/why-not-in-ai-answers`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    });
    entries.push({
      url: `${prefix}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });

    // Страницы-обзоры разделов
    for (const section of sections) {
      entries.push({
        url: `${prefix}/${section.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    // Опубликованные страницы-темы
    for (const topic of allPublishedTopics()) {
      entries.push({
        url: `${prefix}/${topic.section}/${topic.slug}`,
        lastModified: topic.datePublished ? new Date(topic.datePublished) : now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
