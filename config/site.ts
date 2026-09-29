// =============================================================
//  AI Answers Rank — конфигурация сайта
//  Вся специфика проекта собрана здесь. Чтобы изменить данные
//  на всём сайте, правится только этот файл.
// =============================================================

export const siteConfig = {
  // --- Бренд ---
  name: "AI Answers Rank",
  domain: "aianswersrank.com",
  url: "https://aianswersrank.com",
  slogan: "Help your website appear in AI answers",
  description:
    "Learn how to make your website appear in AI answers and recommendations — ChatGPT, Perplexity, Gemini and more.",

  // --- Контакты ---
  // [ЧЕРНОВИК — временные данные, заменить на реальные позже]
  contacts: {
    email: "info@aianswersrank.com", // [ЧЕРНОВИК]
    phone: "", // [ЧЕРНОВИК — не задан]
    location: "USA",
    social: {
      // [ЧЕРНОВИК — не заданы]
    },
  },

  // --- Ссылки воронки ---
  funnel: {
    // Инструмент проверки AI Answers Score — теперь внутри этого же сайта (страница /check).
    aiAnswersScore: {
      name: "AI Answers Score",
      url: "/check",
    },
    // [ЧЕРНОВИК — способ заказа услуги не выбран; пока ведёт на email]
    serviceContact: "mailto:info@aianswersrank.com",
  },

  // --- Языки ---
  // По умолчанию English. ru — добавочный. es — задел на будущее.
  locales: {
    default: "en",
    available: ["en", "ru"], // расширяемо: добавить "es"
    labels: {
      en: "English",
      ru: "Русский",
      es: "Español",
    },
  },

  // --- Контент ---
  content: {
    updateCycle: "monthly", // цикл обновления
    // текущий год подставляется автоматически при сборке
  },

  // --- Рейтинг (статично; меняется здесь в одном месте) ---
  reviews: {
    rating: 4.9,
  },
} as const;

export type SiteConfig = typeof siteConfig;
