import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/locales";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FloatingBack } from "@/components/FloatingBack";
import { ButtonLink } from "@/components/Button";

// =============================================================
//  /[lang]/knowledge-system: научная статья про AIKS
//  (AI Knowledge System): саморазвивающуюся систему знаний о
//  закономерностях выбора источников ИИ.
//  Отдельная сущность. НОВОЕ понятие: не конфликтует с AIRS
//  (AI Ready Score, методика) и AI Answers Score (инструмент).
//  Иерархия: AIKS (система) > AIRS (методика) > AI Answers Score
//  (инструмент), все под брендом AI Answers Rank.
//  Единый вид со страницей метода: плашки-заголовки, обе даты.
//  Правила текста: без длинных тире, без буквы «е с точками»,
//  текст по ширине. Внешние факты подкреплены источниками
//  (Pew Research); сама система AIKS это авторское, без ссылок.
// =============================================================

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${siteConfig.url}/${l}/knowledge-system`;
  }

  const title =
    lang === "ru"
      ? "AIKS (AI Knowledge System): саморазвивающаяся система знаний, AI Answers Rank"
      : "AIKS (AI Knowledge System): a self-developing knowledge system, AI Answers Rank";
  const description =
    lang === "ru"
      ? "AIKS (AI Knowledge System), саморазвивающаяся система знаний о закономерностях выбора информационных источников искусственным интеллектом при формировании ответов и рекомендаций."
      : "AIKS (AI Knowledge System) is a self-developing knowledge system about the patterns by which AI selects information sources when forming answers and recommendations.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/knowledge-system`,
      languages,
    },
  };
}

// Дата публикации (фиксированная). Дата обновления авто при сборке.
const PUBLISHED = "2026-07-12";

type Block = { h?: string; p: string; highlight?: string; formula?: { title: string; body: string } };
const copy: Record<
  Lang,
  {
    title: string;
    lead: string;
    published: string;
    updated: string;
    blocks: Block[];
    sourcesLabel: string;
    sources: { label: string; url: string }[];
    ctaIntro: string;
  }
> = {
  ru: {
    title:
      "AIKS (AI Knowledge System): саморазвивающаяся система знаний о закономерностях выбора источников искусственным интеллектом",
    lead: "Появление искусственного интеллекта изменило не только способ поиска информации, но и сам принцип ее получения. Если раньше пользователь самостоятельно выбирал сайт из списка поисковой выдачи, то сегодня все чаще он получает готовый ответ или рекомендацию, сформированные искусственным интеллектом.",
    published: "Опубликовано",
    updated: "Обновлено",
    blocks: [
      {
        p: "При этом пользователь нередко даже не открывает сайты, на основании которых был сформирован ответ. Это подтверждают данные. По исследованию Pew Research Center (данные о просмотрах 900 взрослых в США, 68 879 поисков), при наличии сводки ИИ пользователи переходили по ссылке-результату лишь в 8 процентах поисков против 15 процентов без сводки, а по ссылкам внутри самой сводки лишь в 1 проценте случаев.\n\nЭто означает, что ключевым становится уже не ранжирование страниц в поисковой системе, а другой процесс: выбор информационных источников, которые искусственный интеллект использует при формировании своих ответов и рекомендаций. Показательно, что подавляющее большинство сводок ИИ, 88 процентов по тем же данным Pew, ссылаются на три и более источника. Искусственный интеллект отбирает несколько источников из множества, и попадание в этот отбор становится новой задачей.\n\nИменно этот процесс является предметом исследования AIKS.",
      },
      {
        h: "Что такое AIKS",
        highlight:
          "В отличие от большинства методик, AIKS изучает не сайты, а закономерности, по которым искусственный интеллект выбирает сайты.",
        p: "AIKS (AI Knowledge System) это саморазвивающаяся система знаний о закономерностях выбора искусственным интеллектом информационных источников для формирования ответов и рекомендаций.\n\nГлавная задача AIKS состоит не в разработке отдельных рекомендаций или выпуске очередного инструмента проверки сайтов. Ее задача значительно шире: выявлять, систематизировать и постоянно уточнять закономерности, по которым искусственный интеллект принимает решение использовать одни информационные источники и не использовать другие.\n\nОбъектом исследования AIKS являются не алгоритмы конкретной модели и не поисковые системы. Объект исследования это устойчивые закономерности выбора информационных источников, проявляющиеся при формировании ответов и рекомендаций искусственным интеллектом. Именно эти закономерности становятся знаниями, затем превращаются в методику и реализуются в инструменте.",
      },
      {
        h: "Цикл, лежащий в основе системы",
        formula: {
          title: "Принцип саморазвития AIKS",
          body: "Знания → Метод → Инструмент → Новые знания",
        },
        p: "В основе AIKS лежит простой, но принципиально важный цикл. Сначала исследуются реальные закономерности выбора информационных источников искусственным интеллектом. На основе выявленных закономерностей создается методика, описывающая эти процессы в формализованном виде. Затем методика реализуется в программном инструменте, который способен анализировать большое количество сайтов по единым критериям.\n\nОднако именно здесь начинается главное отличие AIKS от большинства существующих методик. Программный инструмент не завершает работу системы. Напротив, он становится источником новых знаний. Каждый анализируемый сайт, каждая обнаруженная закономерность, каждая повторяющаяся ошибка и каждый успешный пример позволяют получать новую информацию о том, как искусственный интеллект оценивает информационные источники и почему одни из них используются при формировании ответов, а другие остаются незамеченными.\n\nПолученные знания снова анализируются. Если выявляются новые устойчивые закономерности, они становятся частью методики. Обновленная методика используется для совершенствования программного инструмента, после чего начинается следующий цикл исследований.\n\nТаким образом знания превращаются в метод. Метод превращается в инструмент. Инструмент создает новые знания. Каждый новый цикл повышает точность всей системы.",
      },
      {
        h: "Почему это саморазвивающаяся система",
        p: "Именно поэтому AIKS является саморазвивающейся системой знаний. В отличие от статичных методик, опубликованных один раз и практически не изменяющихся, AIKS развивается вместе с изменением искусственного интеллекта. Чем больше практических данных получает система, тем точнее становятся выявляемые закономерности, тем совершеннее становится методика и тем эффективнее работает инструмент.",
      },
      {
        h: "Методика и инструмент внутри системы",
        p: "Формализованное ядро AIKS это методика AIRS (AI Ready Score), которая описывает выявленные закономерности в виде измеримой оценки готовности сайта. Практической реализацией методики является AI Answers Score.\n\nЭтот инструмент позволяет не только оценить готовность конкретного сайта к использованию искусственным интеллектом, но и служит исследовательским механизмом развития всей системы знаний. Благодаря анализу большого количества реальных сайтов AIKS непрерывно получает новые данные, которые невозможно получить исключительно теоретическим путем.\n\nПоэтому AI Answers Score является не просто сервисом проверки сайтов. Он представляет собой исследовательский инструмент, обеспечивающий развитие самой AIKS.\n\nТак формируется непрерывный цикл развития, в котором знания совершенствуют методику, методика совершенствует инструмент, а инструмент создает новые знания. Именно этот цикл делает AIKS не набором правил, а постоянно развивающейся исследовательской системой, изучающей закономерности выбора информационных источников искусственным интеллектом при формировании ответов и рекомендаций.",
      },
    ],
    sourcesLabel: "Источник",
    sources: [
      {
        label:
          "Pew Research Center: пользователи Google реже переходят по ссылкам при наличии сводки ИИ (данные о просмотрах 900 взрослых в США, 68 879 поисков, март 2025)",
        url: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
      },
    ],
    ctaIntro:
      "Практическая реализация системы это инструмент AI Answers Score. Проверьте свой сайт и посмотрите, как формализованная методика AIRS работает на реальном примере.",
  },
  en: {
    title:
      "AIKS (AI Knowledge System): a self-developing knowledge system about how AI selects sources",
    lead: "The arrival of artificial intelligence changed not only how information is searched for, but the very principle of how it is obtained. Where a user once chose a site from a list of search results, today they increasingly receive a ready answer or recommendation formed by artificial intelligence.",
    published: "Published",
    updated: "Updated",
    blocks: [
      {
        p: "In doing so, the user often does not even open the sites on which the answer was based. The data confirms this. According to Pew Research Center (browsing data of 900 US adults, 68,879 searches), when an AI summary was present users clicked a result link in only 8 percent of searches versus 15 percent without a summary, and clicked a link inside the summary itself in only 1 percent of cases.\n\nThis means the key process is no longer the ranking of pages in a search engine, but a different one: the selection of the information sources that artificial intelligence uses when forming its answers and recommendations. Tellingly, the vast majority of AI summaries, 88 percent by the same Pew data, cite three or more sources. Artificial intelligence selects several sources out of many, and getting into that selection becomes the new task.\n\nThis very process is the subject of AIKS research.",
      },
      {
        h: "What AIKS is",
        highlight:
          "Unlike most methodologies, AIKS studies not sites, but the patterns by which artificial intelligence chooses sites.",
        p: "AIKS (AI Knowledge System) is a self-developing knowledge system about the patterns by which artificial intelligence selects information sources to form answers and recommendations.\n\nThe main task of AIKS is not to produce isolated recommendations or release yet another site-checking tool. Its task is far broader: to identify, systematize and continuously refine the patterns by which artificial intelligence decides to use some information sources and not others.\n\nThe object of AIKS research is not the algorithms of a particular model, nor search engines. The object of research is the stable patterns of information-source selection that appear when artificial intelligence forms answers and recommendations. It is these patterns that become knowledge, then turn into a methodology, and are implemented in a tool.",
      },
      {
        h: "The cycle at the core of the system",
        formula: {
          title: "The AIKS self-development principle",
          body: "Knowledge → Method → Tool → New knowledge",
        },
        p: "At the core of AIKS lies a simple but fundamentally important cycle. First, the real patterns of how artificial intelligence selects information sources are studied. On the basis of the patterns found, a methodology is created that describes these processes in a formalized form. The methodology is then implemented in a software tool capable of analyzing a large number of sites by uniform criteria.\n\nBut this is exactly where the main difference between AIKS and most existing methodologies begins. The software tool does not conclude the work of the system. On the contrary, it becomes a source of new knowledge. Every analyzed site, every pattern found, every recurring mistake and every successful example yields new information about how artificial intelligence evaluates information sources and why some of them are used when forming answers while others go unnoticed.\n\nThe knowledge obtained is analyzed again. If new stable patterns emerge, they become part of the methodology. The updated methodology is used to improve the software tool, after which the next cycle of research begins.\n\nThus knowledge turns into method. Method turns into tool. The tool creates new knowledge. Each new cycle raises the precision of the whole system.",
      },
      {
        h: "Why it is a self-developing system",
        p: "This is precisely why AIKS is a self-developing knowledge system. Unlike static methodologies, published once and barely changing thereafter, AIKS develops alongside the changes in artificial intelligence. The more practical data the system receives, the more precise the patterns it identifies become, the more refined the methodology becomes, and the more effectively the tool works.",
      },
      {
        h: "The methodology and tool inside the system",
        p: "The formalized core of AIKS is the AIRS (AI Ready Score) methodology, which describes the patterns found as a measurable readiness score for a site. The practical implementation of the methodology is AI Answers Score.\n\nThis tool not only lets you assess how ready a given site is for use by artificial intelligence, but also serves as the research mechanism for developing the whole knowledge system. By analyzing a large number of real sites, AIKS continuously receives new data that cannot be obtained by theory alone.\n\nThat is why AI Answers Score is not merely a site-checking service. It is a research instrument that drives the development of AIKS itself.\n\nThis is how a continuous development cycle forms, in which knowledge improves the methodology, the methodology improves the tool, and the tool creates new knowledge. It is this cycle that makes AIKS not a set of rules but a continuously developing research system that studies the patterns by which artificial intelligence selects information sources when forming answers and recommendations.",
      },
    ],
    sourcesLabel: "Source",
    sources: [
      {
        label:
          "Pew Research Center: Google users are less likely to click on links when an AI summary appears (browsing data of 900 US adults, 68,879 searches, March 2025)",
        url: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
      },
    ],
    ctaIntro:
      "The practical implementation of the system is the AI Answers Score tool. Check your own site and see how the formalized AIRS methodology works on a real example.",
  },
};

export default function KnowledgeSystemPage({
  params,
}: {
  params: { lang: string };
}) {
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

  // JSON-LD: научная статья (ScholarlyArticle), автор организация.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${siteConfig.url}/${lang}/knowledge-system#article`,
    headline: c.title,
    description:
      lang === "ru"
        ? "AIKS (AI Knowledge System): саморазвивающаяся система знаний о закономерностях выбора искусственным интеллектом информационных источников для формирования ответов и рекомендаций."
        : "AIKS (AI Knowledge System): a self-developing knowledge system about how AI selects information sources.",
    inLanguage: lang,
    datePublished: PUBLISHED,
    dateModified,
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: `${siteConfig.url}/${lang}/knowledge-system`,
    citation: c.sources.map((s) => s.url),
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
          { name: "AIKS", href: `/${lang}/knowledge-system` },
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

      {/* Вводный абзац (lead) */}
      <p className="mt-5 text-lg text-neutral-800 leading-relaxed">{c.lead}</p>

      {/* Блоки */}
      <div className="mt-10 space-y-8">
        {c.blocks.map((b, i) => (
          <section key={i}>
            {b.h && (
              <div
                className="inline-flex items-center rounded-[12px] px-4 py-2 sm:rounded-[14px] sm:px-5 sm:py-2.5"
                style={plaque}
              >
                <h2 className="text-lg font-bold tracking-tight text-[#111111] sm:text-xl">
                  {b.h}
                </h2>
              </div>
            )}
            <div
              className={
                (b.h ? "mt-4" : "") +
                " space-y-4 text-neutral-700 leading-relaxed"
              }
            >
              {b.p.split(/\n{2,}/).map((par, k) => (
                <p key={k}>{par.trim()}</p>
              ))}
            </div>
            {b.highlight && (
              <div
                className="mt-5 rounded-[14px] border-l-4 px-5 py-4"
                style={{
                  borderColor: "#7C3AED",
                  backgroundColor: "rgba(139,92,246,0.10)",
                }}
              >
                <p className="text-base font-semibold leading-relaxed text-[#4C1D95] sm:text-lg">
                  {b.highlight}
                </p>
              </div>
            )}
            {b.formula && (
              <div
                className="mt-5 rounded-[14px] px-5 py-4 text-center"
                style={plaque}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[#5B21B6]">
                  {b.formula.title}
                </p>
                <p className="mt-2 overflow-x-auto whitespace-nowrap font-mono text-sm font-bold tracking-tight text-[#111111] sm:text-base">
                  {b.formula.body}
                </p>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Источники */}
      <section className="mt-12">
        <div
          className="inline-flex items-center rounded-[12px] px-4 py-2 sm:rounded-[14px] sm:px-5 sm:py-2.5"
          style={plaque}
        >
          <h2 className="text-lg font-bold tracking-tight text-[#111111] sm:text-xl">
            {c.sourcesLabel}
          </h2>
        </div>
        <ul className="mt-4 space-y-2.5">
          {c.sources.map((s, i) => (
            <li key={i} className="text-sm leading-relaxed text-neutral-700">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5B21B6] underline underline-offset-2 hover:text-[#4C1D95]"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

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
