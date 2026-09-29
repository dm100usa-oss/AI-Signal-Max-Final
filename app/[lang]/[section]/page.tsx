import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/locales";
import { sections, getSection } from "@/content/sections";
import { publishedTopicsOfSection } from "@/content/topics";
import { trustPages, getTrustPage } from "@/content/trust-pages";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionCard } from "@/components/SectionCard";

// Генерируем страницы разделов знаний И страниц доверия для каждого языка
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => [
    ...sections.map((s) => ({ lang, section: s.slug })),
    ...trustPages.map((p) => ({ lang, section: p.slug })),
  ]);
}

export function generateMetadata({
  params,
}: {
  params: { lang: string; section: string };
}) {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${siteConfig.url}/${l}/${params.section}`;
  }

  // Страница доверия?
  const trust = getTrustPage(params.section);
  if (trust) {
    const tc = trust.content[lang];
    return {
      title: `${tc.title} — ${siteConfig.name}`,
      description: tc.description,
      alternates: {
        canonical: `${siteConfig.url}/${lang}/${trust.slug}`,
        languages,
      },
    };
  }

  // Иначе — раздел знаний
  const section = getSection(params.section);
  if (!section) return {};
  const c = section.content[lang];

  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/${section.slug}`,
      languages,
    },
  };
}

export default function SectionPage({
  params,
}: {
  params: { lang: string; section: string };
}) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const t = getDictionary(lang);

  // --- Страница доверия (about, methodology, ... terms) ---
  const trust = getTrustPage(params.section);
  if (trust) {
    const tc = trust.content[lang];
    const schema = trust.isFaq
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: lang,
          mainEntity: tc.blocks
            .filter((b) => b.h && b.p)
            .map((b) => ({
              "@type": "Question",
              name: b.h,
              acceptedAnswer: { "@type": "Answer", text: b.p },
            })),
        }
      : trust.slug === "comparisons"
      ? {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: tc.title,
          description: tc.description,
          url: `${siteConfig.url}/${lang}/${trust.slug}`,
          inLanguage: lang,
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          hasPart: tc.blocks
            .filter((b) => b.table)
            .map((b) => ({
              "@type": "Table",
              about: b.h,
              ...(b.p ? { description: b.p } : {}),
            })),
        }
      : trust.slug === "glossary"
      ? {
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: tc.title,
          description: tc.description,
          url: `${siteConfig.url}/${lang}/${trust.slug}`,
          inLanguage: lang,
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          hasDefinedTerm: tc.blocks
            .filter((b) => b.h && b.p)
            .map((b) => ({
              "@type": "DefinedTerm",
              name: b.h,
              description: b.p,
              inDefinedTermSet: `${siteConfig.url}/${lang}/${trust.slug}`,
            })),
        }
      : {
          "@context": "https://schema.org",
          "@type": trust.schemaType,
          name: tc.title,
          description: tc.description,
          url: `${siteConfig.url}/${lang}/${trust.slug}`,
          inLanguage: lang,
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          // Первоисточники страницы как машиночитаемые цитаты (усиливает E-E-A-T).
          ...(() => {
            const cites = tc.blocks
              .flatMap((b) => b.links ?? [])
              .filter((ln) => /^https?:\/\//.test(ln.url))
              .map((ln) => ({
                "@type": "CreativeWork",
                name: ln.label,
                url: ln.url,
              }));
            return cites.length ? { citation: cites } : {};
          })(),
        };
    return (
      <main className="mx-auto max-w-2xl px-6 pt-8 pb-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Breadcrumbs
          baseUrl={siteConfig.url}
          items={[
            { name: siteConfig.name, href: `/${lang}` },
            { name: tc.title, href: `/${lang}/${trust.slug}` },
          ]}
        />

        <h1 className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
          {tc.title}
        </h1>
        {tc.intro && (
          <p className="mt-4 text-lg text-neutral-700 leading-relaxed text-justify">
            {tc.intro}
          </p>
        )}

        {trust.slug === "glossary" ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {tc.blocks.map((b, i) => {
              const isOurTerm = !!b.our;
              const term = b.h || "";
              return (
                <section
                  key={i}
                  id={"term-" + i}
                  className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white/60 p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-semibold leading-snug tracking-tight text-neutral-900">
                      {term}
                    </h2>
                    {isOurTerm && (
                      <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-blue-700 ring-1 ring-inset ring-blue-200">
                        {lang === "ru" ? "Авторский термин" : "Our term"}
                      </span>
                    )}
                  </div>
                  {b.p && (
                    <div className="mt-2.5 space-y-2.5 text-sm leading-relaxed text-neutral-700 text-justify">
                      {b.p.split(/\n{2,}/).map((par, k) => (
                        <p key={k}>{par.trim()}</p>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <>
        {tc.blocks.map((b, i) => (
          <section key={i} className="mt-8">
            {b.h && (
              <h2 className="text-xl font-semibold tracking-tight">{b.h}</h2>
            )}
            {b.p && (
              <div className="mt-3 space-y-3 text-neutral-700 leading-relaxed text-justify">
                {b.p.split(/\n{2,}/).map((par, k) => (
                  <p key={k}>{par.trim()}</p>
                ))}
              </div>
            )}
            {b.items && (
              <ul className="mt-3 list-disc pl-5 space-y-1.5 text-neutral-700">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            )}
            {b.links && (
              <ul className="mt-3 space-y-3">
                {b.links.map((ln, j) => {
                  const external = /^https?:\/\//.test(ln.url);
                  return (
                    <li key={j} className="leading-relaxed">
                      <a
                        href={ln.url}
                        {...(external
                          ? {
                              target: "_blank",
                              rel: "nofollow noopener noreferrer",
                            }
                          : {})}
                        className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:decoration-blue-700"
                      >
                        {ln.label}
                      </a>
                      {external && (
                        <span aria-hidden className="ml-1 text-neutral-400">
                          &#8599;
                        </span>
                      )}
                      {ln.note && (
                        <span className="mt-0.5 block text-sm text-neutral-600">
                          {ln.note}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            {b.table && (
              <div className="mt-4 overflow-x-auto rounded-[14px] ring-1 ring-black/10">
                <table className="w-full border-collapse text-left text-[15px] sm:text-base">
                  <thead>
                    <tr className="bg-blue-50">
                      {b.table.headers.map((hd, hi) => (
                        <th
                          key={hi}
                          className="border-b border-black/10 px-4 py-3 font-semibold text-[#111111]"
                        >
                          {hd}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.table.rows.map((row, ri) => (
                      <tr key={ri} className="odd:bg-white even:bg-neutral-50">
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={`border-b border-black/5 px-4 py-3 align-top text-neutral-700 ${
                              ci === 0 ? "font-medium text-[#111111]" : ""
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
          </>
        )}

        {(trust.slug === "glossary" || trust.slug === "comparisons") && (
          <section className="mt-10 border-t border-neutral-200 pt-6">
            <h2 className="text-lg font-semibold tracking-tight">
              {lang === "ru" ? "Смотрите также" : "See also"}
            </h2>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={`/${lang}/method`}
                  className="text-blue-700 hover:text-blue-900 transition-colors"
                >
                  {lang === "ru"
                    ? "Методика AIRS (AI Ready Score)"
                    : "The AIRS (AI Ready Score) methodology"}
                </a>
              </li>
              {trust.slug === "comparisons" && (
                <li>
                  <a
                    href={`/${lang}/glossary`}
                    className="text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    {lang === "ru" ? "Глоссарий" : "Glossary"}
                  </a>
                </li>
              )}
              {trust.slug === "glossary" && (
                <li>
                  <a
                    href={`/${lang}/comparisons`}
                    className="text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    {lang === "ru" ? "Сравнения" : "Comparisons"}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`/${lang}/faq`}
                  className="text-blue-700 hover:text-blue-900 transition-colors"
                >
                  {lang === "ru"
                    ? "Часто задаваемые вопросы"
                    : "Frequently asked questions"}
                </a>
              </li>
              <li>
                <a
                  href={`/${lang}/articles`}
                  className="text-blue-700 hover:text-blue-900 transition-colors"
                >
                  {lang === "ru" ? "Статьи" : "Articles"}
                </a>
              </li>
            </ul>
          </section>
        )}

        <div className="mt-12">
          <a
            href={`/${lang}`}
            className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            ← {t.common.backToHome}
          </a>
        </div>
      </main>
    );
  }

  // --- Раздел знаний ---
  const section = getSection(params.section);
  if (!section) notFound();
  const c = section.content[lang];

  return (
    <main className="mx-auto max-w-2xl px-6 pt-8 pb-8">
      <Breadcrumbs
        baseUrl={siteConfig.url}
        items={[
          { name: siteConfig.name, href: `/${lang}` },
          { name: c.title, href: `/${lang}/${section.slug}` },
        ]}
      />

      <h1 className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
        {c.title}
      </h1>
      <p className="mt-4 text-lg text-neutral-700 leading-relaxed">
        {c.description}
      </p>

      {/* Список тем раздела */}
      {(() => {
        const topics = publishedTopicsOfSection(section.slug);
        if (topics.length === 0) {
          return <p className="mt-10 text-sm text-neutral-400">Coming next.</p>;
        }
        return (
          <div className="mt-8 grid grid-cols-1 gap-3">
            {topics.map((tp) => (
              <SectionCard
                key={tp.slug}
                href={`/${lang}/${section.slug}/${tp.slug}`}
                title={tp.content[lang].h1}
                description={tp.content[lang].directAnswer}
              />
            ))}
          </div>
        );
      })()}

      <div className="mt-12">
        <a
          href={`/${lang}`}
          className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          ← {t.common.backToHome}
        </a>
      </div>
    </main>
  );
}
