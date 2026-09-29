import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/locales";
import { getSection } from "@/content/sections";
import { topics, getTopic } from "@/content/topics";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TopicSchema } from "@/components/TopicSchema";
import { FloatingBack } from "@/components/FloatingBack";
import ArticleCheck from "@/components/ArticleCheck";

// Генерируем страницы тем для каждого языка
export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    topics.map((t) => ({ lang, section: t.section, topic: t.slug }))
  );
}

export function generateMetadata({
  params,
}: {
  params: { lang: string; section: string; topic: string };
}) {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  const topic = getTopic(params.section, params.topic);
  if (!topic) return {};
  const c = topic.content[lang];

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${siteConfig.url}/${l}/${topic.section}/${topic.slug}`;
  }

  return {
    title: c.h1,
    description: c.directAnswer,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/${topic.section}/${topic.slug}`,
      languages,
    },
    // Черновики не индексируем (C.6)
    robots: topic.status === "draft" ? { index: false, follow: false } : undefined,
  };
}

export default function TopicPage({
  params,
}: {
  params: { lang: string; section: string; topic: string };
}) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;

  const section = getSection(params.section);
  const topic = getTopic(params.section, params.topic);
  if (!section || !topic) notFound();

  const t = getDictionary(lang);
  const c = topic.content[lang];

  // Цвет статьи — один и тот же везде (плашки, кружки).
  // plaqueBg — полупрозрачный фон плашки; dotColor — плотный цвет кружка.
  const plaqueBg = topic.accent ?? "rgba(139,92,246,0.185)";
  const dotColor = (topic.accent ?? "rgba(139,92,246,0.185)")
    .replace(/,[^,]*\)$/, ",1)");

  const url = `${siteConfig.url}/${lang}/${topic.section}/${topic.slug}`;
  const now = new Date();
  const dateModified = now.toISOString().slice(0, 10);
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <main className="mx-auto max-w-3xl px-6 pt-8 pb-8 text-justify">
      <TopicSchema topic={topic} lang={lang} url={url} dateModified={dateModified} />

      <Breadcrumbs
        baseUrl={siteConfig.url}
        items={[
          { name: siteConfig.name, href: `/${lang}` },
          topic.kind === "research"
            ? {
                name: lang === "ru" ? "Исследования" : "Research",
                href: `/${lang}/research`,
              }
            : {
                name: lang === "ru" ? "Статьи" : "Articles",
                href: `/${lang}/articles`,
              },
          {
            name: c.crumb ?? c.h1,
            href: `/${lang}/${section.slug}/${topic.slug}`,
          },
        ]}
      />

      {/* 1. H1-вопрос — в цветной плашке (цвет статьи, как в списке) */}
      <div
        className="mt-6 flex items-center justify-center rounded-[16px] px-4 py-3.5 sm:rounded-[18px] sm:px-5 sm:py-4"
        style={{
          backgroundColor: plaqueBg,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
        }}
      >
        <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-[#111111] sm:text-2xl">
          {topic.slug === "what-is-geo" && lang === "ru" ? (
            <>
              Что такое генеративная оптимизация (GEO) и как она помогает сайту
              <br className="sm:hidden" /> попадать в ответы ИИ?
            </>
          ) : (
            c.h1
          )}
        </h1>
      </div>

      {/* обе даты: публикация (из файла) + обновление (авто) */}
      <p className="mt-3 text-center text-xs text-neutral-400">
        {t.footer.published}: {fmt(topic.datePublished)} · {t.footer.updated}: {fmt(dateModified)}
      </p>

      {/* подзаголовок: раскрытие направлений ниши */}
      {c.subtitle && (
        <p className="mt-4 text-center text-sm text-neutral-500 leading-relaxed sm:text-base">
          {c.subtitle}
        </p>
      )}

      {/* 2. Короткий прямой ответ */}
      <p className="mt-5 text-lg text-neutral-800 leading-relaxed">
        {c.directAnswer}
      </p>

      {/* блок методологии: задает статус «исследование» */}
      {c.methodology && (
        <div
          className="mt-6 rounded-[14px] border-l-4 bg-neutral-50 px-4 py-3.5 sm:px-5 sm:py-4"
          style={{ borderColor: dotColor }}
        >
          <p className="text-sm font-semibold tracking-tight text-neutral-800">
            {lang === "ru" ? "Как проводилось исследование" : "How this study was done"}
          </p>
          <p className="mt-1.5 text-sm text-neutral-600 leading-relaxed">
            {c.methodology}
          </p>
        </div>
      )}

      {/* 3. Key Facts */}
      <section className="mt-10">
        <div
          className="inline-flex items-center rounded-[12px] px-4 py-2 sm:rounded-[14px] sm:px-5 sm:py-2.5"
          style={{
            backgroundColor: plaqueBg,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
          }}
        >
          <h2 className="text-lg font-bold tracking-tight text-[#111111] sm:text-xl">
            {t.topic.keyFacts}
          </h2>
        </div>
        <ul className="mt-5 space-y-2.5">
          {c.keyFacts.map((fact, i) => (
            <li key={i} className="flex gap-3 text-neutral-700 leading-relaxed">
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: dotColor,
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.45), 0 1px 2px rgba(60,40,110,0.55)",
                }}
              />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Подробное объяснение */}
      <section className="mt-10 space-y-8">
        {c.body.map((blk, i) => (
          <div key={i}>
            <div
              className="inline-flex items-center rounded-[12px] px-4 py-2 sm:rounded-[14px] sm:px-5 sm:py-2.5"
              style={{
                backgroundColor: plaqueBg,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
              }}
            >
              <h2 className="text-lg font-bold tracking-tight text-[#111111] sm:text-xl">
                {blk.heading}
              </h2>
            </div>
            <p className="mt-4 text-neutral-700 leading-relaxed">{blk.text}</p>
            {blk.table && (
              <figure className="mt-5">
                <div className="overflow-x-auto rounded-[14px] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_3px_0_rgba(150,165,190,0.4),0_8px_14px_rgba(30,50,90,0.14)] sm:p-5">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-300">
                        {blk.table.headers.map((h, hi) => (
                          <th
                            key={hi}
                            className="py-2 pr-4 font-semibold text-neutral-900 align-top"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {blk.table.rows.map((row, ri) => (
                        <tr key={ri} className="border-b border-neutral-200 last:border-0">
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className="py-2 pr-4 text-neutral-700 leading-relaxed align-top"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {blk.table.caption && (
                  <figcaption className="mt-2.5 text-sm italic text-neutral-500 leading-relaxed">
                    {blk.table.caption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        ))}
      </section>

      {/* 5. Практические действия */}
      <section className="mt-10">
        <div
          className="inline-flex items-center rounded-[12px] px-4 py-2 sm:rounded-[14px] sm:px-5 sm:py-2.5"
          style={{
            backgroundColor: plaqueBg,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
          }}
        >
          <h2 className="text-lg font-bold tracking-tight text-[#111111] sm:text-xl">
            {t.topic.actions}
          </h2>
        </div>
        <ol className="mt-5 space-y-2 list-decimal pl-5">
          {c.actions.map((a, i) => (
            <li key={i} className="text-neutral-700 leading-relaxed pl-1">
              {a}
            </li>
          ))}
        </ol>
      </section>

      {/* 6. FAQ */}
      <section className="mt-10">
        <div
          className="inline-flex items-center rounded-[12px] px-4 py-2 sm:rounded-[14px] sm:px-5 sm:py-2.5"
          style={{
            backgroundColor: plaqueBg,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
          }}
        >
          <h2 className="text-lg font-bold tracking-tight text-[#111111] sm:text-xl">
            {t.topic.faq}
          </h2>
        </div>
        <div className="mt-5 space-y-5">
          {c.faq.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-neutral-900">{f.question}</h3>
              <p className="mt-1.5 text-neutral-700 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Подпись автора со ссылкой на «О нас» */}
      <section className="mt-10 border-t border-neutral-200 pt-5">
        <p className="text-sm text-neutral-500 leading-relaxed">
          {lang === "ru" ? "Автор: " : "Author: "}
          <a
            href={`/${lang}/about`}
            className="font-medium text-[#0d3a6b] hover:underline"
          >
            {lang === "ru"
              ? "Команда AI Answers Rank"
              : "The AI Answers Rank team"}
          </a>
          {lang === "ru"
            ? " - аналитики, разработчики и практики с опытом управления бизнесом"
            : " - analysts, developers and business practitioners"}
        </p>
      </section>

      {/* источники (E-E-A-T) */}
      {topic.sources && topic.sources.length > 0 && (
        <section className="mt-10">
          <h2 className="text-base font-semibold tracking-tight">{t.topic.sources}</h2>
          <ul className="mt-3 space-y-1.5">
            {topic.sources.map((s, i) => {
              const isInternal = s.url.startsWith("/");
              const href = isInternal ? `/${lang}${s.url}` : s.url;
              return (
                <li key={i} className="text-sm">
                  <a
                    href={href}
                    target={isInternal ? undefined : "_blank"}
                    rel={isInternal ? undefined : "noopener noreferrer"}
                    className="text-blue-600 hover:underline"
                  >
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* 8. Блок быстрой проверки (как в аккордеоне) + следующий шаг под ним */}
      <section className="mt-12 space-y-5">
        <ArticleCheck
          placeholder={t.topic.checkPlaceholder}
          button={t.topic.checkButton}
          subnoteA={t.topic.checkSubnoteA}
          subnoteB={t.topic.checkSubnoteB}
          errorInvalidUrl={t.topic.checkErrorInvalid}
          errorCannotCheck={t.topic.checkErrorBlocked}
        />
        <a
          href={c.nextHref ? `/${lang}${c.nextHref}` : `/${lang}/${section.slug}`}
          className="block text-base text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          {t.topic.nextStep}: {c.nextStepLabel} →
        </a>
      </section>

      <FloatingBack label={t.common.back} />
    </main>
  );
}
