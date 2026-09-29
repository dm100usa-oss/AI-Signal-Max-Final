import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/locales";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FloatingBack } from "@/components/FloatingBack";

// =============================================================
//  /[lang]/about — страница «О нас».
//  Единый вид со статьями и страницей метода: заголовки в плашках,
//  широкая колонка, кнопка «Назад» снизу, обе даты.
//  Без имён. Экспертная позиция, тематический авторитет.
//  Разметка AboutPage (Schema.org) для доверия и ИИ.
//  Правило: длинных тире нет.
// =============================================================

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${siteConfig.url}/${l}/about`;
  }

  const title =
    lang === "ru"
      ? "О нас - AI Answers Rank"
      : "About us - AI Answers Rank";
  const description =
    lang === "ru"
      ? "AI Answers Rank ведёт команда аналитиков, разработчиков и практиков с опытом управления бизнесом. Мы делаем ИИ доступным и полезным инструментом для бизнеса."
      : "AI Answers Rank is led by a team of analysts, developers and business practitioners. We make AI a genuinely useful, accessible tool for business.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/about`,
      languages,
    },
  };
}

// Дата публикации страницы (фиксированная). Дата обновления - авто при сборке.
const PUBLISHED = "2026-07-03";

type Block = { h: string; p: string };
const copy: Record<
  Lang,
  {
    title: string;
    lead: string;
    slogan: string;
    published: string;
    updated: string;
    blocks: Block[];
  }
> = {
  ru: {
    title: "Кто стоит за AI Answers Rank?",
    lead: "AI Answers Rank ведёт команда аналитиков, разработчиков и практиков с опытом управления бизнесом. Мы работали с компаниями в сложных ситуациях и выводили их в устойчивую прибыль, а сегодня направили тот же подход на одну задачу: сделать бизнес видимым в ответах ИИ (искусственного интеллекта).",
    slogan: "Делаем ИИ доступным и полезным инструментом для бизнеса",
    published: "Опубликовано",
    updated: "Обновлено",
    blocks: [
      {
        h: "На чём стоит наш опыт?",
        p: "За проектом стоит сочетание трёх компетенций: аналитики, которая разбирает бизнес по фактам и находит, что мешает ему расти; разработки, которая понимает, как устроен сайт изнутри и что мешает ИИ его читать; и управленческого опыта, который привык отвечать за результат, а не за обещания. Это соединение и позволяет нам видеть задачу видимости в ИИ целиком, от строчки кода до бизнес-цели.",
      },
      {
        h: "Чем мы занимаемся?",
        p: "Мы занимаемся видимостью бизнеса в ответах ИИ, тем, что называют генеративной оптимизацией (GEO). Поиск меняется на глазах: вместо списка ссылок люди всё чаще получают готовый ответ ассистента, и большинство компаний в этих ответах просто не появляются. Мы разбираемся, почему сайт остаётся невидимым для ИИ и что изменить, чтобы он стал источником, который ИИ понимает, которому доверяет и который цитирует.",
      },
      {
        h: "Как мы работаем?",
        p: "Мы работаем как аналитики, а не как рекламное агентство. Мы не обещаем мгновенных чудес и честно говорим о границах: техника открывает дверь, но решают ясность, структура и доверие к источнику. Мы опираемся на проверяемые данные и открытые источники, а не на догадки. И придерживаемся простого правила: наш собственный сайт построен по тем же принципам, о которых мы пишем, он сам служит примером того, чему мы учим.",
      },
      {
        h: "Во что мы верим?",
        p: "Мы верим, что видимость в ИИ должна быть доступна бизнесу любого размера, а не только крупным игрокам с большими бюджетами. Малый и средний бизнес заслуживает быть увиденным в ответах ИИ наравне с большими компаниями. Поэтому мы объясняем, а не напускаем туман: чем понятнее устроена эта новая среда, тем честнее конкуренция в ней.",
      },
      {
        h: "На чём основана наша методика?",
        p: "Свой опыт мы свели в методику AIRS (AI Ready Score), оценку готовности сайта к эпохе ИИ по четырём направлениям: техника, контент, авторитет и структура. Она показывает, что мешает сайту попадать в ответы ИИ и с чего начать, превращая размытую задачу стать заметным для ИИ в понятные шаги.",
      },
    ],
  },
  en: {
    title: "Who is behind AI Answers Rank?",
    lead: "AI Answers Rank is led by a team of analysts, developers and business practitioners. We have worked with companies in difficult situations and brought them into steady profit, and today we have turned that same approach to one task: making a business visible in the answers of AI assistants.",
    slogan: "Making AI a genuinely useful, accessible tool for business",
    published: "Published",
    updated: "Updated",
    blocks: [
      {
        h: "What is our experience built on?",
        p: "The project rests on three combined strengths: analysis that examines a business by the facts and finds what holds it back; development that understands how a site works under the hood and what stops AI from reading it; and management experience used to answering for results rather than promises. This combination is what lets us see the whole task of AI visibility, from a line of code to a business goal.",
      },
      {
        h: "What do we do?",
        p: "We work on making businesses visible in AI answers, what is known as generative engine optimization (GEO). Search is changing in front of us: instead of a list of links, people increasingly get a finished answer from an assistant, and most companies simply do not appear in those answers. We work out why a site stays invisible to AI and what to change so it becomes a source the AI understands, trusts and cites.",
      },
      {
        h: "How do we work?",
        p: "We work as analysts, not as an advertising agency. We do not promise instant miracles and we are honest about the limits: the technical layer opens the door, but clarity, structure and trust in the source are what decide the outcome. We rely on verifiable data and open sources rather than guesswork. And we hold to a simple rule: our own site is built on the same principles we write about, serving as a live example of what we teach.",
      },
      {
        h: "What do we believe?",
        p: "We believe visibility in AI should be within reach of a business of any size, not only large players with big budgets. Small and mid-size businesses deserve to be seen in AI answers alongside the big companies. That is why we explain rather than mystify: the clearer this new environment is understood, the fairer the competition within it.",
      },
      {
        h: "What is our methodology based on?",
        p: "We have distilled our experience into the AIRS methodology (AI Ready Score), an assessment of how ready a site is for the AI era across four dimensions: technical health, content, authority and structure. It shows what stops a site from appearing in AI answers and where to start, turning the vague goal of becoming visible to AI into clear steps.",
      },
    ],
  },
};

export default function AboutPage({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const t = getDictionary(lang);
  const c = copy[lang];

  const now = new Date();
  const dateModified = now.toISOString().slice(0, 10);
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const plaque = {
    backgroundColor: "rgba(59,130,246,0.185)",
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: c.title,
    description: c.lead,
    url: `${siteConfig.url}/${lang}/about`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      slogan: c.slogan,
    },
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pt-8 pb-8 text-justify">
      <Breadcrumbs
        baseUrl={siteConfig.url}
        items={[
          { name: siteConfig.name, href: `/${lang}` },
          { name: lang === "ru" ? "О нас" : "About us", href: `/${lang}/about` },
        ]}
      />

      {/* Заголовок в плашке */}
      <div
        className="mt-6 flex items-center justify-center rounded-[16px] px-5 py-3.5 sm:rounded-[18px] sm:px-6 sm:py-4"
        style={plaque}
      >
        <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-balance text-[#111111] sm:text-2xl">
          {c.title}
        </h1>
      </div>

      {/* Обе даты */}
      <p className="mt-3 text-center text-xs text-neutral-400">
        {c.published}: {fmt(PUBLISHED)} · {c.updated}: {fmt(dateModified)}
      </p>

      {/* Слоган */}
      <p className="mt-5 text-center text-lg font-semibold text-[#0d3a6b]">
        {c.slogan}
      </p>

      {/* Прямое вступление */}
      <p className="mt-5 text-lg text-neutral-800 leading-relaxed">{c.lead}</p>

      {/* Блоки */}
      <div className="mt-10 space-y-8">
        {c.blocks.map((b, i) => (
          <section key={i}>
            <div
              className="inline-flex items-center rounded-[12px] px-4 py-2 sm:rounded-[14px] sm:px-5 sm:py-2.5"
              style={plaque}
            >
              <h2 className="text-lg font-bold tracking-tight text-[#111111] sm:text-xl">
                {b.h}
              </h2>
            </div>
            <p className="mt-4 text-neutral-700 leading-relaxed">{b.p}</p>
          </section>
        ))}
      </div>

      <div className="mt-12">
        <FloatingBack label={t.common.back} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
