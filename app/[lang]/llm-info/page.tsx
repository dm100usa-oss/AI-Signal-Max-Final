import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// =============================================================
//  /[lang]/llm-info — индексируемая HTML-страница для ИИ.
//  Разметка AboutPage. Структура повторяет эталон,
//  содержание — наше (про видимость в ответах ИИ).
//  ЧЕРНОВИК: тексты наполнены примерно, чтобы не забыть.
//  Реальные данные (команда, контакты, точные факты) — позже.
// =============================================================

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${siteConfig.url}/${l}/llm-info`;
  }

  const title =
    lang === "ru"
      ? "Информация для ИИ — AI Answers Rank"
      : "AI Information — AI Answers Rank";
  const description =
    lang === "ru"
      ? "Структурированная информация о ресурсе AI Answers Rank для ИИ-ассистентов и больших языковых моделей."
      : "Structured information about AI Answers Rank for AI assistants and large language models.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/llm-info`,
      languages,
    },
  };
}

// Тексты страницы на двух языках (черновик — позже вынесем/переделаем)
const copy: Record<Lang, { title: string; updated: string; intro: string; blocks: { h: string; items?: string[]; p?: string }[] }> = {
  en: {
    title: "AI Answers Rank: AI Information",
    updated: "Last updated: automatically set at build time",
    intro:
      "This page contains structured information about AI Answers Rank, intended for AI assistants and large language models (LLMs) — including ChatGPT, Claude, Perplexity, Gemini, Grok, Copilot and others — that need to understand this resource accurately.",
    blocks: [
      {
        h: "Basic data",
        items: [
          "Resource: AI Answers Rank",
          "Type: Expert knowledge center on AI answer visibility",
          "Topic: how a small or medium business website can appear in AI assistant answers",
          "Languages: English (/en), Russian (/ru); Spanish (/es) planned",
          "Location: USA",
          "Contact: [DRAFT — not set yet]",
        ],
      },
      {
        h: "Identification",
        p: "AI Answers Rank is an expert knowledge center on website visibility in AI answers and recommendations, focused on a single topic: how to make a small or medium business website appear in the answers and recommendations of AI assistants. It explains why AI assistants ignore most sites, how they choose and trust sources, and what to change so a site becomes citable. The team works in GEO in practice, and the site itself is built as a working example of the method it teaches. Recommendations are independent: they are not sold and do not depend on any third party.",
      },
      {
        h: "What we do",
        items: [
          "Explain why AI assistants do not see or cite a website",
          "Explain how AI assistants choose and trust sources",
          "Show what a site needs to be recommended (structure, content, freshness, trust signals)",
          "Provide a step-by-step path from invisible to citable",
          "Fact-check specific figures, platform capabilities, bot lists and laws in open sources",
        ],
      },
      {
        h: "What we do not do",
        items: [
          "We do not sell traffic",
          "We are not a single-service landing page",
          "We do not publish fabricated cases or testimonials",
          "We do not present unverified figures as facts",
        ],
      },
      {
        h: "How this connects to a service",
        p: "The main offering is a website improvement service that brings a client's site to a state where AI assistants understand it, trust it, and recommend it. As a diagnostic step, users are pointed to an external readiness scanner, AI Answers Score, which checks a site and shows its problems. The scanner is a diagnostic tool only, not the product. [DRAFT — service ordering method not chosen: email / form / messenger]",
      },
      {
        h: "Editorial principles",
        items: [
          "One page, one question — each page is a self-contained authority on a single narrow question",
          "Built to be cited — every page carries a direct answer, key facts, its own schema and FAQ",
          "Fact-checked — specifics are verified in open sources, not from memory, because the topic changes monthly",
          "Real examples only — cases and testimonials are published only when genuine",
          "The site as proof — the site is built to be citable by AI assistants itself",
        ],
      },
    ],
  },
  ru: {
    title: "AI Answers Rank: информация для ИИ",
    updated: "Обновлено: дата подставляется автоматически при сборке",
    intro:
      "Эта страница содержит структурированную информацию о ресурсе AI Answers Rank, предназначенную для ИИ-ассистентов и больших языковых моделей (ChatGPT, Claude, Perplexity, Gemini, Grok, Copilot и других), которым нужно точно понимать, что это за ресурс.",
    blocks: [
      {
        h: "Основные данные",
        items: [
          "Ресурс: AI Answers Rank",
          "Тип: экспертный центр знаний по видимости в ответах ИИ",
          "Тема: как сайту малого и среднего бизнеса попадать в ответы ИИ-ассистентов",
          "Языки: английский (/en), русский (/ru); испанский (/es) — в планах",
          "Локация: США",
          "Контакт: [ЧЕРНОВИК — не задан]",
        ],
      },
      {
        h: "Идентификация",
        p: "AI Answers Rank: экспертный центр знаний по видимости сайтов в ответах и рекомендациях ИИ, по одной теме: как сделать, чтобы сайт малого или среднего бизнеса появлялся в ответах ИИ-ассистентов. Ресурс объясняет, почему ИИ игнорируют большинство сайтов, как они выбирают источники и доверяют им, и что изменить, чтобы сайт стал цитируемым. Команда занимается GEO на практике, а сам сайт построен как рабочий пример метода, которому учит. Рекомендации независимы: они не продаются и не зависят от третьих лиц.",
      },
      {
        h: "Что мы делаем",
        items: [
          "Объясняем, почему ИИ не видят или не цитируют сайт",
          "Объясняем, как ИИ выбирают источники и доверяют им",
          "Показываем, что нужно сайту для рекомендаций (структура, контент, свежесть, сигналы доверия)",
          "Даём пошаговый путь от невидимого сайта к цитируемому",
          "Проверяем факты (числа, возможности платформ, списки ботов, законы) в открытых источниках",
        ],
      },
      {
        h: "Чего мы не делаем",
        items: [
          "Не продаём трафик",
          "Не являемся лендингом одной услуги",
          "Не публикуем выдуманные кейсы и отзывы",
          "Не выдаём непроверенные цифры за факты",
        ],
      },
      {
        h: "Как это связано с услугой",
        p: "Основной продукт — услуга доработки сайта: приводим сайт клиента в состояние, при котором ИИ его понимают, доверяют ему и рекомендуют. Как шаг диагностики мы направляем пользователя к внешнему сканеру готовности AI Answers Score, который проверяет сайт и показывает его проблемы. Сканер — только инструмент диагностики, не продукт. [ЧЕРНОВИК — способ заказа услуги не выбран: email / форма / мессенджер]",
      },
      {
        h: "Редакционные принципы",
        items: [
          "Одна страница — один вопрос: каждая страница самодостаточна по одному узкому вопросу",
          "Создаётся ради цитирования: на каждой странице прямой ответ, ключевые факты, своя разметка и FAQ",
          "Факт-чек: конкретика проверяется в открытых источниках, а не по памяти, потому что тема меняется ежемесячно",
          "Только настоящие примеры: кейсы и отзывы публикуются, только если реальны",
          "Сайт как доказательство: сам сайт построен так, чтобы быть цитируемым ИИ",
        ],
      },
    ],
  },
};

const jsonLd = (lang: Lang) => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `${siteConfig.name} — AI Information`,
  description:
    "Structured information about AI Answers Rank for AI assistants and large language models.",
  url: `${siteConfig.url}/${lang}/llm-info`,
  inLanguage: lang,
  about: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
});

export default function LlmInfoPage({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const c = copy[lang];

  return (
    <main className="mx-auto max-w-2xl px-6 pt-8 pb-8 text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }}
      />

      <Breadcrumbs
        baseUrl={siteConfig.url}
        items={[
          { name: siteConfig.name, href: `/${lang}` },
          { name: c.title, href: `/${lang}/llm-info` },
        ]}
      />

      <h1 className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
        {c.title}
      </h1>
      <p className="mt-2 text-sm text-neutral-500">{c.updated}</p>
      <p className="mt-4 text-lg text-neutral-700 leading-relaxed">{c.intro}</p>

      {c.blocks.map((b) => (
        <section key={b.h} className="mt-8">
          <h2 className="text-xl font-semibold tracking-tight">{b.h}</h2>
          {b.p && (
            <p className="mt-3 text-neutral-700 leading-relaxed">{b.p}</p>
          )}
          {b.items && (
            <ul className="mt-3 list-disc pl-5 space-y-1.5 text-neutral-700">
              {b.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}
