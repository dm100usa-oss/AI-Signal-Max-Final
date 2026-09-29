import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/locales";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FloatingBack } from "@/components/FloatingBack";
import { ButtonLink } from "@/components/Button";

// =============================================================
//  /[lang]/method — страница методики AIRS (AI Ready Score).
//  Объясняет, ЧТО такое AIRS и что он даёт, но НЕ раскрывает,
//  КАК он считает внутри (ноу-хау). Единый вид со статьями:
//  заголовки в плашках, широкая колонка, кнопка «Назад» сверху
//  и снизу, обе даты.
// =============================================================

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${siteConfig.url}/${l}/method`;
  }

  const title =
    lang === "ru"
      ? "Методика AIRS (AI Ready Score) — AI Answers Rank"
      : "The AIRS methodology (AI Ready Score) — AI Answers Rank";
  const description =
    lang === "ru"
      ? "AIRS (AI Ready Score) — методика оценки готовности сайта к использованию ИИ в качестве источника информации при формировании ответов и рекомендаций."
      : "AIRS (AI Ready Score) is a methodology for assessing a website's readiness to be used by AI as a source for answers and recommendations.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/method`,
      languages,
    },
  };
}

// Дата публикации методики (фиксированная). Дата обновления — авто при сборке.
const PUBLISHED = "2026-07-03";

type Block = { h: string; p: string; items?: string[] };
const copy: Record<
  Lang,
  {
    title: string;
    lead: string;
    published: string;
    updated: string;
    blocks: Block[];
    ctaIntro: string;
  }
> = {
  ru: {
    title: "Методика AIRS (AI Ready Score)",
    lead: "AIRS (AI Ready Score) — методика оценки готовности сайта к использованию ИИ в качестве источника информации при формировании ответов и рекомендаций. Она измеряет видимость сайта в ответах ИИ (AI Answer Visibility) — вероятность того, что искусственный интеллект использует сайт при формировании ответа или рекомендации.",
    published: "Опубликовано",
    updated: "Обновлено",
    blocks: [
      {
        h: "Откуда взялась методика",
        p: "Методика AIRS выросла из практики. Мы провели большое количество экспериментов: задавали запросы ведущим ИИ-ассистентам и разбирали, какие сайты попадают в топ их ответов и рекомендаций и почему. Так мы близко изучили принципы, по которым искусственный интеллект отбирает источники для своих ответов.",
      },
      {
        h: "Эталонный сайт как основа оценки",
        p: "Чтобы перевести эти наблюдения в измеримую величину, мы создали эталонный сайт и довели его до почти стопроцентного соответствия принципам отбора источников современными ИИ-ассистентами. В процессе стало ясно, какой полный набор факторов влияет на выбор искусственного интеллекта и каким должен быть каждый фактор в идеале. Этот эталон стал нашей линейкой: AIRS сравнивает проверяемый сайт с эталоном, и разница между ними даёт итоговый процент готовности — насколько сайт близок к идеалу, который ИИ выбирает в первую очередь.",
      },
      {
        h: "Что оценивает AIRS?",
        p: "AIRS оценивает сайт по 28 факторам, объединённым в четыре направления. Каждое направление отвечает за свою сторону готовности сайта к работе с ИИ.",
        items: [
          "Главная страница — понимает ли ИИ с первого экрана, чем занимается бизнес, кому и в каком регионе он помогает",
          "Технические факторы — может ли ИИ вообще прочитать сайт: открыт ли он для сканирования, виден ли контент без сложного JavaScript",
          "Контент — есть ли на страницах прямые ответы, факты, структура и цитируемые блоки, которые ИИ может взять в свой ответ",
          "Сигналы авторитетности — выглядит ли сайт надёжным источником: ясная идентичность бизнеса, единообразие данных, подтверждённое присутствие",
        ],
      },
      {
        h: "Воспроизводимость оценки",
        p: "Методика AIRS является воспроизводимой: одинаковый сайт при одинаковом состоянии получает одинаковую оценку, а изменение факторов приводит к изменению результата.",
      },
      {
        h: "Чем AIRS отличается от классического SEO-аудита?",
        p: "Классический SEO-аудит оценивает сайт по признакам, важным для поисковых систем: позиции, ссылки, ключевые слова. AIRS оценивает другое — насколько сайт понятен и полезен искусственному интеллекту. Это разные задачи: сайт может быть хорошо оптимизирован под поиск и при этом оставаться невидимым для ИИ.",
      },
      {
        h: "Что вы получаете по итогам оценки?",
        p: "AIRS даёт не одну общую отметку «хорошо или плохо», а понятную картину: общий уровень готовности сайта и список приоритетных улучшений — что исправить в первую очередь, а что можно отложить. Это позволяет принимать решения на основе оценки, а не догадок.",
      },
      {
        h: "Почему методике можно доверять?",
        p: "AIRS построена на принципах, проверенных на реальных сайтах. Мы не только измеряем сайты, но и дорабатываем их по этой методике и фиксируем результат. Один из таких сайтов — проект по полной замене крыш в одном из крупнейших городов США — после доработки за 24 дня вышел в топ ответов всех ведущих ИИ-ассистентов, без единой внешней ссылки. Это подтверждает: методика измеряет именно то, что влияет на выбор искусственного интеллекта.",
      },
    ],
    ctaIntro:
      "На основе методики AIRS работает инструмент AI Answers Score, который автоматически проверяет сайт и показывает, что улучшить в первую очередь.",
  },
  en: {
    title: "The AIRS methodology (AI Ready Score)",
    lead: "AIRS (AI Ready Score) is a methodology for assessing a website's readiness to be used by AI as a source for answers and recommendations. It measures a site's AI Answer Visibility — the probability that an AI will use the site when forming an answer or recommendation.",
    published: "Published",
    updated: "Updated",
    blocks: [
      {
        h: "Where the methodology comes from",
        p: "AIRS grew out of practice. We ran a large number of experiments: querying leading AI assistants and analyzing which sites make it into the top of their answers and recommendations, and why. This is how we came to closely understand the principles by which artificial intelligence selects the sources for its answers.",
      },
      {
        h: "A reference site as the basis for scoring",
        p: "To turn these observations into a measurable value, we built a reference site and optimized it to align as closely as possible with the source selection principles used by modern AI assistants. In the process it became clear which full set of factors influences an AI's choice, and what each factor should ideally look like. That reference became our benchmark: AIRS compares the site being checked against the benchmark, and the gap between them yields the final readiness percentage — how closely the site matches the characteristics AI systems tend to prioritize.",
      },
      {
        h: "What does AIRS assess?",
        p: "AIRS assesses a site across 28 factors grouped into four dimensions. Each dimension covers a different side of a site's readiness to work with AI.",
        items: [
          "Homepage — whether an AI understands from the first screen what the business does, who it serves, and in which region",
          "Technical factors — whether an AI can read the site at all: is it open to crawling, is the content visible without heavy JavaScript",
          "Content — whether pages have direct answers, facts, structure, and citable units an AI can lift into its response",
          "Authority signals — whether the site looks like a reliable source: a clear business identity, consistent data, confirmed presence",
        ],
      },
      {
        h: "Reproducibility of the assessment",
        p: "AIRS is a reproducible methodology: the same website in the same condition will always receive the same score, while changes to the evaluated factors produce corresponding changes in the result.",
      },
      {
        h: "How is AIRS different from a classic SEO audit?",
        p: "A classic SEO audit assesses a site by what matters to search engines: rankings, links, keywords. AIRS assesses something else — how clear and useful the site is to artificial intelligence. These are different tasks: a site can be well optimized for search and still be invisible to AI.",
      },
      {
        h: "What do you get from the assessment?",
        p: "AIRS gives more than a single good-or-bad mark: it gives a clear picture — an overall readiness level and a list of priority improvements, showing what to fix first and what can wait. This lets you make decisions based on assessment rather than guesswork.",
      },
      {
        h: "Why can the methodology be trusted?",
        p: "AIRS is built on principles tested on real sites. We don't just measure sites — we also improve them using this methodology and record the outcome. One such site — a full roof replacement project in one of the largest cities in the US — reached the top of answers across all leading AI assistants within 24 days of the work, with no external links. This confirms that the methodology measures exactly what drives an AI's choice.",
      },
    ],
    ctaIntro:
      "The AIRS methodology powers the AI Answers Score tool, which automatically checks a site and shows what to improve first.",
  },
};

export default function MethodPage({ params }: { params: { lang: string } }) {
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
    backgroundColor: "rgba(139,92,246,0.185)",
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pt-8 pb-8 text-justify">
      <Breadcrumbs
        baseUrl={siteConfig.url}
        items={[
          { name: siteConfig.name, href: `/${lang}` },
          { name: c.title, href: `/${lang}/method` },
        ]}
      />

      {/* Заголовок в плашке */}
      <div
        className="mt-6 flex items-center justify-center rounded-[16px] px-5 py-3.5 sm:rounded-[18px] sm:px-6 sm:py-4"
        style={plaque}
      >
        <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-[#111111] sm:text-2xl">
          {c.title}
        </h1>
      </div>

      {/* Обе даты */}
      <p className="mt-3 text-center text-xs text-neutral-400">
        {c.published}: {fmt(PUBLISHED)} · {c.updated}: {fmt(dateModified)}
      </p>

      {/* Прямое определение */}
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
            {b.items && (
              <ul className="mt-4 space-y-2.5">
                {b.items.map((it, j) => (
                  <li
                    key={j}
                    className="flex gap-3 text-neutral-700 leading-relaxed"
                  >
                    <span
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: "#7C3AED",
                        boxShadow:
                          "inset 0 1px 1px rgba(255,255,255,0.45), 0 1px 2px rgba(60,40,110,0.55)",
                      }}
                    />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {/* Переход к инструменту */}
      <section className="mt-12 space-y-4">
        <p className="text-neutral-700 leading-relaxed">{c.ctaIntro}</p>
        <ButtonLink
          href={siteConfig.funnel.aiAnswersScore.url}
          variant="primary"
          external
        >
          {t.home.whatToDoSteps[0].ctaText}
        </ButtonLink>
      </section>

      <FloatingBack label={t.common.back} />
    </main>
  );
}
