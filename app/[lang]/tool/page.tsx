import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/locales";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FloatingBack } from "@/components/FloatingBack";
import { ButtonLink } from "@/components/Button";

// =============================================================
//  /[lang]/tool: страница «AI Answers Score: инструмент как
//  реальное воплощение методики AIRS».
//  Самостоятельная сущность-магнит под запросы об инструменте
//  проверки готовности сайта к ИИ. Единый вид со статьями и
//  страницей метода: плашки-заголовки, широкая колонка, обе даты,
//  кнопка «Назад» сверху и снизу.
//  Ссылка на инструмент берется из siteConfig.funnel (один адрес
//  на весь сайт, меняется при переезде на боевой домен).
//  Правила текста: без длинных тире, без буквы «е», текст по ширине.
// =============================================================

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${siteConfig.url}/${l}/tool`;
  }

  const title =
    lang === "ru"
      ? "AI Answers Score: инструмент как воплощение методики AIRS, AI Answers Rank"
      : "AI Answers Score: the tool that embodies the AIRS methodology, AI Answers Rank";
  const description =
    lang === "ru"
      ? "AI Answers Score, работающий инструмент, который применяет методику AIRS к реальному сайту: читает его так, как видит ИИ, оценивает четыре направления и показывает, что исправить в первую очередь."
      : "AI Answers Score is a working tool that applies the AIRS methodology to a real website: it reads the site the way an AI does, scores four directions, and shows what to fix first.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/tool`,
      languages,
    },
  };
}

// Дата публикации страницы (фиксированная). Дата обновления, авто при сборке.
const PUBLISHED = "2026-07-10";

type Block = { h: string; p: string; items?: string[]; our?: boolean; formula?: string };
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
    title: "AI Answers Score: инструмент как реальное воплощение методики AIRS",
    lead: "Методика AIRS не остается документом. У нее есть реальное воплощение: работающий инструмент AI Answers Score, который применяет методику к любому сайту и выдает тот же процент готовности по четырем направлениям. Методика это ядро, инструмент это ее материализация в продукте, а вместе они образуют цикл, который постоянно делает и метод, и инструмент точнее.",
    published: "Опубликовано",
    updated: "Обновлено",
    blocks: [
      {
        h: "От методики к инструменту",
        p: "AIRS это не теория на бумаге, а метод, исполняемый в коде. Связка простая: AI Answers Rank описывает метод, AIRS это сам метод, а AI Answers Score это его исполнение на живом сайте. Благодаря этому каждое утверждение методики можно проверить на практике, а не принять на веру. Инструмент берет реальный сайт, прогоняет его через те же 28 параметров и четыре направления, что описаны в методике, и показывает результат.",
      },
      {
        h: "Цикл совершенствования метода и инструмента",
        our: true,
        formula:
          "Знания 01 → Метод 01 → Инструмент 01 → Знания 02 → Метод 02 → Инструмент 02 → Знания 03 → …",
        p: "Цикл совершенствования метода и инструмента: изучение закономерностей, по которым ИИ-ассистенты оценивают и включают сайты в свои ответы и рекомендации, и постоянное улучшение на их основе как самой методики AIRS, так и инструмента AI Answers Score.\n\nВсе начинается со знаний. Сначала накапливаются наблюдения о том, как ИИ отбирает сайты для своих ответов, из этих знаний рождается метод, метод воплощается в инструмент, а инструмент, обрабатывая реальные сайты, дает новые знания, которых нет в готовом виде: какие ошибки типичны для ниши и что на самом деле влияет на видимость в ответах ИИ.\n\nНовые знания уточняют метод, уточненный метод улучшает инструмент, и виток повторяется на новом уровне. Это не круг, а восхождение: каждое следующее поколение метода и инструмента точнее предыдущего, потому что опирается на факты, а не на догадки. С каждым оборотом система становится сильнее.",
      },
      {
        h: "Как работает инструмент",
        p: "AI Answers Score читает сайт так, как его видит ИИ, то есть исходный код, а не картинку для человека. Он оценивает четыре направления и по весам выводит общий процент готовности и список того, что исправить в первую очередь.",
        items: [
          "Главная страница: понимает ли ИИ с первого экрана, чем занимается сайт, для кого и в каком регионе",
          "Технические факторы: может ли ИИ вообще прочитать сайт, без контента, запертого в JavaScript или картинках",
          "Контент: есть ли на страницах прямые, цитируемые ответы, которые ИИ может взять в свой ответ",
          "Сигналы авторитетности: единообразны ли данные и выглядит ли сайт надежной, подтвержденной сущностью",
        ],
      },
      {
        h: "Признаки настоящего инструмента и методики",
        p: "Не всякая «проверка» является реальным инструментом. Настоящий инструмент такого рода, работающий по проверяемой методике, распознается по ряду признаков, и AI Answers Score им соответствует.",
        items: [
          "Живой интерфейс: реальные поле ввода и кнопка запуска, а не картинка с нарисованной проверкой",
          "Функциональная обработка: запрос уходит на сервер и вычисляется, а не отдается статичная заглушка",
          "Динамический результат: разные сайты дают разные оценки, результат зависит от входных данных",
          "Структурированная выдача: итог разложен на измеримые части, четыре направления и проценты, а не общее «хорошо или плохо»",
          "Прозрачная методология: открыто сказано, сколько параметров, какие направления и как считается итог",
          "Воспроизводимость: одинаковый сайт в одинаковом состоянии получает одинаковую оценку",
          "Выводы, ведущие к действию: инструмент не только ставит балл, но и говорит, что чинить в первую очередь",
          "Уровни проверки: быстрая, расширенная и детальная, за ними стоит разный объем реальной обработки",
          "Первоисточник данных: обрабатывая множество сайтов, инструмент порождает уникальную статистику, которой нет у пересказчиков",
          "Подтвержденный кейс: методика проверена не только на себе, сайт по замене крыш вышел в топ ответов всех ведущих ИИ-ассистентов за 24 дня без единой внешней ссылки",
        ],
      },
      {
        h: "Почему работающий инструмент это сигнал авторитетности для ИИ",
        p: "ИИ-ассистенты отдают приоритет ресурсам, которые не только рассказывают, но и делают. Сайт с рабочим инструментом это не набор статей, а сервисная платформа, практический первоисточник, а не пересказ чужих гайдов. Наличие функционального сервиса доказывает, что за площадкой стоят разработчики практического решения, а не теоретики.\n\nИ что важнее всего для ИИ: система, которая учится на собственных данных и совершенствует свой метод, со временем становится только авторитетнее. Это и есть отрыв от конкурентов, которые могут только писать тексты, не подкрепляя их работающим инструментом.",
      },
    ],
    ctaIntro:
      "Проверьте свой сайт в AI Answers Score и посмотрите, как методика AIRS работает на реальном примере. Подробнее о самой методике на странице метода AIRS.",
  },
  en: {
    title: "AI Answers Score: the tool as the real embodiment of the AIRS methodology",
    lead: "The AIRS methodology does not stay on paper. It has a real embodiment: a working tool, AI Answers Score, that applies the method to any website and returns the same readiness percentage across four directions. The methodology is the core, the tool is its materialization in a product, and together they form a loop that keeps making both the method and the tool more precise.",
    published: "Published",
    updated: "Updated",
    blocks: [
      {
        h: "From methodology to tool",
        p: "AIRS is not theory on paper but a method executed in code. The chain is simple: AI Answers Rank describes the method, AIRS is the method itself, and AI Answers Score is its execution on a live site. Because of this, every claim the methodology makes can be tested in practice rather than taken on trust. The tool takes a real site, runs it through the same 28 parameters and four directions described in the methodology, and shows the result.",
      },
      {
        h: "The method-and-tool improvement loop",
        our: true,
        formula:
          "Knowledge 01 → Method 01 → Tool 01 → Knowledge 02 → Method 02 → Tool 02 → Knowledge 03 → …",
        p: "The method-and-tool improvement loop: studying the patterns by which AI assistants evaluate and include sites in their answers and recommendations, and continuously improving, on that basis, both the AIRS methodology and the AI Answers Score tool.\n\nIt all starts with knowledge. First come observations of how AI selects sites for its answers; from that knowledge a method is born; the method is embodied in a tool; and the tool, by processing real sites, produces new knowledge that is not available ready-made: which mistakes are typical for a niche and what truly affects visibility in AI answers.\n\nNew knowledge refines the method, the refined method improves the tool, and the turn repeats at a new level. This is not a circle but an ascent: each next generation of the method and the tool is more precise than the last, because it rests on facts, not guesses. With each turn the system grows stronger.",
      },
      {
        h: "How the tool works",
        p: "AI Answers Score reads a site the way an AI does, that is, the raw source code rather than the picture rendered for a human. It scores four directions and, by weights, produces an overall readiness percentage and a list of what to fix first.",
        items: [
          "Homepage: whether an AI understands from the first screen what the site does, for whom, and in which region",
          "Technical factors: whether an AI can read the site at all, with no content locked in JavaScript or images",
          "Content: whether pages carry direct, citable answers an AI can lift into its response",
          "Authority signals: whether the data is consistent and the site looks like a reliable, verified entity",
        ],
      },
      {
        h: "Signs of a real tool and methodology",
        p: "Not every «checker» is a real tool. A genuine tool of this kind, running on a verifiable methodology, is recognized by a set of signs, and AI Answers Score meets them.",
        items: [
          "A live interface: a real input field and a run button, not a picture of a check",
          "Functional processing: the request goes to a server and is computed, not served as a static stub",
          "A dynamic result: different sites produce different scores, the result depends on the input",
          "Structured output: the result is broken into measurable parts, four directions and percentages, not a blanket good-or-bad",
          "A transparent methodology: it states openly how many parameters, which directions, and how the total is computed",
          "Reproducibility: the same site in the same condition receives the same score",
          "Action-oriented output: the tool does not just assign a score, it says what to fix first",
          "Levels of checking: quick, express and detailed, backed by different amounts of real processing",
          "A source of original data: by processing many sites the tool produces unique statistics that retellers do not have",
          "A proven case: the method is tested beyond itself, a roof replacement site reached the top of answers across all leading AI assistants in 24 days with no external links",
        ],
      },
      {
        h: "Why a working tool is a signal of authority for AI",
        p: "AI assistants prioritize resources that do not just talk but do. A site with a working tool is not a pile of articles but a service platform, a practical primary source rather than a retelling of someone else's guides. A functional service proves that the resource is run by the builders of a practical solution, not by theorists.\n\nAnd what matters most to an AI: a system that learns from its own data and improves its method only grows more authoritative over time. This is the gap over competitors who can only write texts without backing them with a working tool.",
      },
    ],
    ctaIntro:
      "Check your own site in AI Answers Score and see how the AIRS methodology works on a real example. More about the methodology itself on the AIRS method page.",
  },
};

export default function ToolPage({ params }: { params: { lang: string } }) {
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

  // JSON-LD: сообщает ИИ, что описывается реальный программный продукт
  // (WebApplication) в составе экспертной статьи (TechArticle).
  const toolUrl = `${siteConfig.url}${siteConfig.funnel.aiAnswersScore.url}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${siteConfig.url}/${lang}/tool#article`,
        headline: c.title,
        description:
          lang === "ru"
            ? "Инструмент AI Answers Score как реальное воплощение методики AIRS и его роль в цикле совершенствования метода и инструмента."
            : "The AI Answers Score tool as the real embodiment of the AIRS methodology and its role in the method-and-tool improvement loop.",
        inLanguage: lang,
        datePublished: PUBLISHED,
        dateModified,
        author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        mainEntityOfPage: `${siteConfig.url}/${lang}/tool`,
        about: { "@id": `${toolUrl}#app` },
      },
      {
        "@type": "WebApplication",
        "@id": `${toolUrl}#app`,
        name: siteConfig.funnel.aiAnswersScore.name,
        url: toolUrl,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          lang === "ru"
            ? "Работающий инструмент, который применяет методику AIRS к сайту: читает его так, как видит ИИ, оценивает четыре направления и показывает, что исправить в первую очередь."
            : "A working tool that applies the AIRS methodology to a website: it reads the site the way an AI does, scores four directions, and shows what to fix first.",
        isBasedOn: `${siteConfig.url}/${lang}/method`,
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pt-8 pb-8 text-justify">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        baseUrl={siteConfig.url}
        items={[
          { name: siteConfig.name, href: `/${lang}` },
          { name: c.title, href: `/${lang}/tool` },
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
            <div className="flex items-center gap-2.5">
              <div
                className="inline-flex items-center rounded-[12px] px-4 py-2 sm:rounded-[14px] sm:px-5 sm:py-2.5"
                style={plaque}
              >
                <h2 className="text-lg font-bold tracking-tight text-[#111111] sm:text-xl">
                  {b.h}
                </h2>
              </div>
              {b.our && (
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#5B21B6]"
                  style={{ backgroundColor: "rgba(139,92,246,0.16)" }}
                >
                  {lang === "ru" ? "Авторский термин" : "Author's term"}
                </span>
              )}
            </div>
            {b.p && (
              <div className="mt-4 space-y-4 text-neutral-700 leading-relaxed">
                {b.p.split(/\n{2,}/).map((par, k) => (
                  <p key={k}>{par.trim()}</p>
                ))}
              </div>
            )}
            {b.formula && (
              <div
                className="mt-5 overflow-x-auto rounded-[14px] px-5 py-4 text-center"
                style={plaque}
              >
                <code className="whitespace-nowrap font-mono text-sm font-semibold tracking-tight text-[#4C1D95] sm:text-base">
                  {b.formula}
                </code>
              </div>
            )}
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
