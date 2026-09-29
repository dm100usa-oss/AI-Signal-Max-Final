import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/locales";
import { allPublishedArticles } from "@/content/topics";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FloatingBack } from "@/components/FloatingBack";

// =============================================================
//  /[lang]/articles — страница со списком всех статей.
//  Заголовок «Статьи» — в цветной плашке (как на FAQ).
//  Подзаголовок-объяснение раздела — отдельной плашкой.
//  Каждая статья — разноцветная плашка-кнопка (как NavButton
//  на главной): свой цвет по очереди, объём и эффект нажатия.
// =============================================================

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  const t = getDictionary(lang);

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${siteConfig.url}/${l}/articles`;
  }

  return {
    title: `${t.home.nav.articles} — ${siteConfig.name}`,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/articles`,
      languages,
    },
  };
}

function pressBg(rgba: string): string {
  const m = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return rgba;
  const r = Math.round(Number(m[1]) * 0.85);
  const g = Math.round(Number(m[2]) * 0.85);
  const b = Math.round(Number(m[3]) * 0.85);
  return `rgba(${r},${g},${b},0.42)`;
}

export default function ArticlesPage({
  params,
}: {
  params: { lang: string };
}) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const t = getDictionary(lang);

  const topics = allPublishedArticles();
  const title = lang === "ru" ? "Статьи" : "Articles";

  return (
    <main className="mx-auto max-w-3xl px-6 pt-8 pb-12 text-left">
      <Breadcrumbs
        baseUrl={siteConfig.url}
        items={[
          { name: siteConfig.name, href: `/${lang}` },
          { name: title, href: `/${lang}/articles` },
        ]}
      />

      {/* Заголовок «Статьи» — цветная плашка (как на FAQ) */}
      <div className="mt-6 flex justify-center">
        <div
          className="inline-flex items-center justify-center rounded-[14px] px-6 py-3 sm:rounded-[16px] sm:px-8 sm:py-3.5"
          style={{
            backgroundColor: "rgba(139,92,246,0.185)",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
          }}
        >
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-[#111111] sm:text-2xl">
            {title}
          </h1>
        </div>
      </div>

      {/* Список статей — разноцветные плашки-кнопки */}
      {topics.length === 0 ? (
        <p className="mt-12 text-center text-sm text-neutral-400">
          {lang === "ru" ? "Скоро." : "Coming next."}
        </p>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-4">
          {topics.map((tp, i) => {
            const bg = tp.accent ?? ARTICLE_ACCENTS[i % ARTICLE_ACCENTS.length].bg;
            const href = `/${lang}/${tp.section}/${tp.slug}`;
            const c = tp.content[lang];
            return (
              <a
                key={tp.slug}
                href={href}
                style={{
                  backgroundColor: bg,
                  ["--press-bg" as string]: pressBg(bg),
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
                }}
                className="btn-press flex w-full items-center justify-center rounded-[16px] px-3 py-4 text-center transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] sm:rounded-[22px] sm:px-4 sm:py-5 md:ring-1 md:ring-black/5"
              >
                <span className="text-base font-bold leading-snug tracking-tight text-[#111111] sm:text-lg">
                  {lang === "ru" && tp.slug === "what-is-geo" ? (
                    <>
                      Что такое генеративная оптимизация (GEO) и как она помогает сайту попадать
                      <br /> в ответы ИИ?
                    </>
                  ) : lang === "ru" && tp.slug === "why-not-appearing" ? (
                    <>
                      Почему мой сайт не появляется
                      <br /> в ответах ИИ?
                    </>
                  ) : (
                    c.h1
                  )}
                </span>
              </a>
            );
          })}
        </div>
      )}

      <FloatingBack label={t.common.back} />
    </main>
  );
}

// Цвета плашек-статей — те же тона, что у боковых кнопок на главной
const ARTICLE_ACCENTS = [
  { bg: "rgba(59,130,246,0.185)" },
  { bg: "rgba(16,185,129,0.185)" },
  { bg: "rgba(139,92,246,0.185)" },
  { bg: "rgba(245,180,60,0.21)" },
  { bg: "rgba(14,165,233,0.185)" },
  { bg: "rgba(13,148,136,0.185)" },
];
