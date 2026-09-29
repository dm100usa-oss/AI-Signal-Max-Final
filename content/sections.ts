import type { Lang } from "@/locales/config";

export type SectionContent = {
  title: string;
  description: string;
};

export type Section = {
  slug: string;
  order: number;
  content: Record<Lang, SectionContent>;
};

// 9 разделов центра знаний (0–8). Слаги — из ТЗ (B.2).
// Описания нейтральные, без выдуманных фактов.
export const sections: Section[] = [
  {
    slug: "why-it-matters",
    order: 0,
    content: {
      en: {
        title: "Why does this matter?",
        description:
          "Why people increasingly turn to AI to search, and why this changes how businesses are found.",
      },
      ru: {
        title: "Почему это важно?",
        description:
          "Почему всё больше людей ищут через ИИ и как это меняет то, как находят бизнес.",
      },
    },
  },
  {
    slug: "why-not-appearing",
    order: 1,
    content: {
      en: {
        title: "Why doesn't my site appear in AI answers?",
        description:
          "The most common reasons a website stays invisible to AI assistants.",
      },
      ru: {
        title: "Почему мой сайт не появляется в ответах ИИ?",
        description:
          "Самые частые причины, по которым сайт остаётся невидимым для ИИ-ассистентов.",
      },
    },
  },
  {
    slug: "how-ai-chooses",
    order: 2,
    content: {
      en: {
        title: "How do AI assistants choose websites?",
        description:
          "Where AI assistants take information from and how they decide which sources to trust.",
      },
      ru: {
        title: "Как ИИ выбирают сайты для ответов?",
        description:
          "Откуда ИИ берут информацию и как решают, каким источникам доверять.",
      },
    },
  },
  {
    slug: "check-readiness",
    order: 3,
    content: {
      en: {
        title: "How to check if your site is ready for AI?",
        description:
          "How to assess your website yourself and which signals matter most.",
      },
      ru: {
        title: "Как проверить готовность сайта к ИИ?",
        description:
          "Как оценить сайт самостоятельно и какие показатели важнее всего.",
      },
    },
  },
  {
    slug: "what-site-needs",
    order: 4,
    content: {
      en: {
        title: "What does a site need to be recommended by AI?",
        description:
          "Which pages, structure and elements a website needs to be understood and recommended.",
      },
      ru: {
        title: "Что должно быть на сайте для рекомендаций ИИ?",
        description:
          "Какие страницы, структура и элементы нужны сайту, чтобы его понимали и рекомендовали.",
      },
    },
  },
  {
    slug: "content-ai-uses",
    order: 5,
    content: {
      en: {
        title: "What kind of content do AI assistants use?",
        description:
          "Which articles, answers and formats AI assistants cite most often.",
      },
      ru: {
        title: "Какой контент используют ИИ?",
        description:
          "Какие статьи, ответы и форматы ИИ-ассистенты цитируют чаще всего.",
      },
    },
  },
  {
    slug: "why-competitors",
    order: 6,
    content: {
      en: {
        title: "Why do AI assistants recommend competitors?",
        description:
          "What competitors do better and how to find and close your own weak spots.",
      },
      ru: {
        title: "Почему ИИ используют сайты конкурентов?",
        description:
          "Что конкуренты делают лучше и как найти и закрыть свои слабые места.",
      },
    },
  },
  {
    slug: "become-authority",
    order: 7,
    content: {
      en: {
        title: "How to become a trusted source for AI?",
        description:
          "What topical authority is and how AI assistants recognise reliable experts.",
      },
      ru: {
        title: "Как стать авторитетным источником для ИИ?",
        description:
          "Что такое тематический авторитет и как ИИ определяют надёжных экспертов.",
      },
    },
  },
  {
    slug: "step-by-step",
    order: 8,
    content: {
      en: {
        title: "A step-by-step plan to appear in AI answers",
        description:
          "A clear sequence of steps — from checking your site to tracking results.",
      },
      ru: {
        title: "Пошаговый план появления в ответах ИИ",
        description:
          "Понятная последовательность шагов — от проверки сайта до контроля результатов.",
      },
    },
  },
];

export function getSection(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug);
}

export const sectionSlugs = sections.map((s) => s.slug);
