import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/locales";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BackLink } from "@/components/BackLink";

// =============================================================
//  /[lang]/faq — расширенная страница «Часто задаваемые вопросы».
//  35 вопросов, сгруппированных по направлениям.
//  Весь текст ответов присутствует в HTML сразу (без клика),
//  чтобы ИИ-краулеры могли извлечь готовую цитату.
//  FAQPage JSON-LD охватывает все вопросы и ответы.
// =============================================================

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  const t = getDictionary(lang);
  const f = t.home.faqPage;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${siteConfig.url}/${l}/faq`;
  }

  return {
    title: `${f.metaTitle} — ${siteConfig.name}`,
    description: f.metaDescription,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/faq`,
      languages,
    },
  };
}

export default function FaqPage({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const t = getDictionary(lang);
  const f = t.home.faqPage;

  // Все вопросы одним списком для разметки FAQPage
  const allItems = f.sections.flatMap((s) => s.items);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    url: `${siteConfig.url}/${lang}/faq`,
    mainEntity: allItems.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pt-8 pb-12 text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        baseUrl={siteConfig.url}
        items={[
          { name: siteConfig.name, href: `/${lang}` },
          { name: f.title, href: `/${lang}/faq` },
        ]}
      />

      <div className="mt-2">
        <BackLink href={`/${lang}`} label={t.common.back} />
      </div>

      <div className="mt-6 flex justify-center">
        <div
          className="inline-flex items-center justify-center rounded-[14px] px-6 py-3 sm:rounded-[16px] sm:px-8 sm:py-3.5"
          style={{
            backgroundColor: "rgba(250,204,21,0.21)",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
          }}
        >
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-[#111111] sm:text-2xl">
            {f.title}
          </h1>
        </div>
      </div>
      <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-neutral-600 sm:text-xl">
        {f.intro}
      </p>

      <div className="mt-12 space-y-7">
        {f.sections.map((section, si) => {
          const accent = SECTION_ACCENTS[si % SECTION_ACCENTS.length];
          return (
            <section
              key={si}
              className="rounded-[22px] bg-white p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_3px_0_rgba(150,165,190,0.55),0_10px_16px_rgba(30,50,90,0.18)] sm:p-8 md:shadow-[0_10px_30px_rgba(13,91,255,0.16),0_2px_8px_rgba(0,0,0,0.08)] md:ring-1 md:ring-black/5"
            >
              <div
                className="flex items-center justify-center rounded-[14px] px-5 py-3 sm:rounded-[16px] sm:px-6 sm:py-3.5"
                style={{
                  backgroundColor: accent.bg,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
                }}
              >
                <h2 className="text-center text-lg font-bold leading-tight tracking-tight text-[#111111] sm:text-xl">
                  {section.heading}
                </h2>
              </div>

              <div className="mt-6 space-y-7">
                {section.items.map((item, ii) => (
                  <div key={ii} className="border-t border-neutral-100 pt-5 first:border-t-0 first:pt-0">
                    <h3 className="flex gap-2.5 text-lg font-semibold leading-snug text-[#111111] sm:text-xl">
                      <span
                        className="mt-2 h-2 w-2 shrink-0 rounded-full sm:mt-2.5"
                        style={{ backgroundColor: accent.dot }}
                      />
                      <span>{item.q}</span>
                    </h3>
                    <p className="mt-2.5 pl-[18px] text-justify text-[15px] leading-relaxed text-neutral-600 sm:text-base">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

// Акценты разделов — полупрозрачная плашка (как навигационные кнопки),
// цвет тени и цвет точки-маркера у вопросов
const SECTION_ACCENTS = [
  { bg: "rgba(59,130,246,0.185)", shadow: "rgba(70,110,170,0.55)", dot: "#2563EB" },
  { bg: "rgba(16,185,129,0.185)", shadow: "rgba(40,140,110,0.55)", dot: "#16A34A" },
  { bg: "rgba(139,92,246,0.185)", shadow: "rgba(110,80,170,0.55)", dot: "#7C3AED" },
  { bg: "rgba(214,123,35,0.185)", shadow: "rgba(180,110,50,0.55)", dot: "#D67B23" },
  { bg: "rgba(14,165,233,0.185)", shadow: "rgba(40,120,180,0.55)", dot: "#0EA5E9" },
  { bg: "rgba(13,148,136,0.185)", shadow: "rgba(30,120,110,0.55)", dot: "#0D9488" },
];
