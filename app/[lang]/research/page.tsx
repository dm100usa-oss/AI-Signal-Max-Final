import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/locales";
import { allPublishedResearch } from "@/content/topics";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FloatingBack } from "@/components/FloatingBack";

// =============================================================
//  /[lang]/research — витрина исследований.
//  Список заголовков всех исследований (kind: "research").
//  Каждый заголовок — плашка-кнопка (свой accent, эффект нажатия),
//  ведёт на отдельную страницу конкретного исследования,
//  чтобы не плодить огромные файлы. Серия по нишам:
//  общепит, строители, юристы и т.д.
// =============================================================

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;

  const title = lang === "ru" ? "Исследования" : "Research";
  const description =
    lang === "ru"
      ? "Наши исследования о том, как ИИ выбирает и рекомендует сайты бизнеса в разных нишах, на основе реальных запросов и методики AIRS."
      : "Our studies on how AI chooses and recommends business websites across niches, based on real queries and the AIRS method.";

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${siteConfig.url}/${l}/research`;
  }

  return {
    title: `${title} — ${siteConfig.name}`,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/research`,
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

export default function ResearchPage({
  params,
}: {
  params: { lang: string };
}) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const t = getDictionary(lang);

  const items = allPublishedResearch();
  const title = lang === "ru" ? "Исследования" : "Research";
  const intro =
    lang === "ru"
      ? "Разборы того, как ИИ выбирает и рекомендует сайты бизнеса в разных нишах. На основе реальных запросов к ИИ-ассистентам и методики AIRS."
      : "Studies of how AI chooses and recommends business websites across niches. Based on real queries to AI assistants and the AIRS method.";

  return (
    <main className="mx-auto max-w-3xl px-6 pt-8 pb-12 text-left">
      <Breadcrumbs
        baseUrl={siteConfig.url}
        items={[
          { name: siteConfig.name, href: `/${lang}` },
          { name: title, href: `/${lang}/research` },
        ]}
      />

      {/* Заголовок «Исследования» — цветная плашка */}
      <div className="mt-6 flex justify-center">
        <div
          className="inline-flex items-center justify-center rounded-[14px] px-6 py-3 sm:rounded-[16px] sm:px-8 sm:py-3.5"
          style={{
            backgroundColor: "rgba(234,88,12,0.185)",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
          }}
        >
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-[#111111] sm:text-2xl">
            {title}
          </h1>
        </div>
      </div>

      {/* Подзаголовок-объяснение раздела */}
      <p className="mt-5 text-center text-sm text-neutral-500 leading-relaxed sm:text-base">
        {intro}
      </p>

      {/* Список исследований — плашки-кнопки */}
      {items.length === 0 ? (
        <p className="mt-12 text-center text-sm text-neutral-400">
          {lang === "ru" ? "Скоро." : "Coming next."}
        </p>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-4">
          {items.map((tp, i) => {
            const bg =
              tp.accent ?? RESEARCH_ACCENTS[i % RESEARCH_ACCENTS.length].bg;
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
                className="btn-press flex w-full flex-col items-center justify-center rounded-[16px] px-3 py-4 text-center transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] sm:rounded-[22px] sm:px-4 sm:py-5 md:ring-1 md:ring-black/5"
              >
                <span className="text-base font-bold leading-snug tracking-tight text-[#111111] sm:text-lg">
                  {c.h1}
                </span>
                {c.subtitle && (
                  <span className="mt-1.5 block text-xs font-medium leading-snug text-[#111111]/70 sm:text-sm">
                    {c.subtitle}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}

      <FloatingBack label={t.common.back} />
    </main>
  );
}

// Цвета плашек-исследований — тёплые тона под тему исследований
const RESEARCH_ACCENTS = [
  { bg: "rgba(234,88,12,0.185)" },
  { bg: "rgba(202,138,4,0.185)" },
  { bg: "rgba(13,148,136,0.185)" },
  { bg: "rgba(79,70,229,0.185)" },
  { bg: "rgba(219,39,119,0.185)" },
  { bg: "rgba(37,99,235,0.185)" },
];
