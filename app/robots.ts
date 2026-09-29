import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// =============================================================
//  robots.ts — генерируемый роут (отдаётся как /robots.txt).
//  Открываем сайт всем значимым ИИ-ботам и обычным поисковикам.
//  Список ИИ-ботов проверяется веб-поиском (тема меняется) —
//  актуально на июнь 2026. При обновлении списка правится здесь.
// =============================================================

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // По умолчанию — пускаем всех
      { userAgent: "*", allow: "/" },

      // Обычные поисковики
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "YandexBot", allow: "/" },

      // OpenAI (ChatGPT)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },

      // Anthropic (Claude)
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },

      // Perplexity
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },

      // Google (ИИ)
      { userAgent: "Google-Extended", allow: "/" },

      // Apple
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },

      // Прочие ИИ-краулеры
      { userAgent: "meta-externalagent", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
