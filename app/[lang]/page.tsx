import { getDictionary } from "@/locales";
import Image from "next/image";
import { isLang, LOCALES, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/Button";
import { CountUp } from "@/components/CountUp";
import { VisitorCounter } from "@/components/VisitorCounter";
import ScoreRing from "@/components/ScoreRing";
import WorkBars from "@/components/WorkBars";
import BasketFill from "@/components/BasketFill";
import { HomeFaq } from "@/components/HomeFaq";
import { HomeUpdates } from "@/components/HomeUpdates";
import StepsAccordion from "@/components/StepsAccordion";
import QuickCheckAccordion from "@/components/QuickCheckAccordion";
import { allPublishedTopics } from "@/content/topics";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function renderWithAccents(text: string, phrases: string[]) {
  const present = phrases.filter((p) => text.includes(p));
  if (present.length === 0) return text;

  // Разбиваем текст по найденным фразам, сохраняя их
  const pattern = present
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const parts = text.split(new RegExp(`(${pattern})`, "g"));

  return (
    <>
      {parts.map((part, i) =>
        present.includes(part) ? (
          <span key={i} className="relative top-[0.04em] mx-[0.04em] inline-block whitespace-nowrap align-baseline text-[1.3em] font-extrabold leading-none text-[#0D5BFF]">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const BUILD_DATE = new Date();

function formatDate(lang: Lang, d: Date): string {
  return d.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  const t = getDictionary(lang);

  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${siteConfig.url}/${l}`;

  return {
    title: `${siteConfig.name} — ${t.home.h1}`,
    description: t.home.directAnswer,
    alternates: { canonical: `${siteConfig.url}/${lang}`, languages },
  };
}

export default function HomePage({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const t = getDictionary(lang);

  const latest = [...allPublishedTopics()]
    .sort(
      (a, b) =>
        new Date(b.datePublished).getTime() -
        new Date(a.datePublished).getTime()
    )
    .slice(0, 5);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/hero-logo.png`,
    description: siteConfig.description,
  };

  const siteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: lang,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.home.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const updatesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.home.updatesTitle,
    itemListElement: latest.map((tp, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/${lang}/${tp.section}/${tp.slug}`,
      name: tp.content[lang].h1,
    })),
  };

  return (
    <main className="mx-auto max-w-5xl px-3 pt-3 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-6 sm:pb-8 md:max-w-4xl md:px-8 lg:max-w-7xl lg:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(updatesSchema) }} />

      {/* Верхняя строка: счётчик + рейтинг + переключатель языка */}
      <div className="grid grid-cols-[1.9fr_0.9fr_1.2fr] gap-2.5 sm:gap-4">
        <div className="flex h-[42px] flex-col items-center justify-center rounded-[14px] bg-white px-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_6px_rgba(30,40,60,0.10),0_6px_16px_rgba(30,40,60,0.12)] sm:h-[83px] sm:rounded-[22px] sm:px-5 md:h-[58px] md:rounded-[16px] tablet:h-[42px] tablet:flex-row tablet:gap-2 lg:h-[54px]">
          <span className="text-sm font-semibold leading-tight text-[#111111] sm:text-2xl md:text-lg tablet:text-sm">
            <VisitorCounter
              className="text-base font-extrabold text-[#0D5BFF] sm:text-3xl md:text-2xl tablet:text-base"
              labels={t.home.visitorsLabel}
            />
          </span>
          <span className="text-xs font-semibold leading-tight text-[#111111] sm:text-lg md:text-sm tablet:text-xs">
            {t.home.visitorsPeriod}
          </span>
        </div>

        <div className="flex h-[42px] items-center justify-center rounded-[14px] bg-white px-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_6px_rgba(30,40,60,0.10),0_6px_16px_rgba(30,40,60,0.12)] sm:h-[83px] sm:rounded-[22px] md:h-[58px] md:rounded-[16px] tablet:h-[42px] lg:h-[54px]">
          <span className="inline-flex items-center gap-1.5 sm:gap-2">
            <svg viewBox="0 0 24 24" className="h-[23px] w-[23px] shrink-0 sm:h-8 sm:w-8 md:h-6 md:w-6" aria-hidden="true">
              <path
                d="M12 2.4l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.45 6.09 20.56l1.13-6.57L2.45 9.34l6.6-.96L12 2.4z"
                fill="#FFC400"
                stroke="#E0A200"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-lg font-medium leading-none text-[#111111] sm:text-2xl md:text-xl">
              {siteConfig.reviews.rating}
            </span>
          </span>
        </div>

        <div className="flex h-[42px] items-center justify-center overflow-hidden rounded-[14px] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_6px_rgba(30,40,60,0.10),0_6px_16px_rgba(30,40,60,0.12)] sm:h-[83px] sm:rounded-[22px] md:h-[58px] md:rounded-[16px] tablet:h-[42px] lg:h-[54px]">
          <div className="flex h-full w-full text-sm font-semibold sm:text-xl md:text-base">
            <a
              href="/en"
              className={`flex flex-1 items-center justify-center transition-colors ${
                lang === "en"
                  ? "bg-[#0B4DD9]/70 text-white"
                  : "bg-white text-[#0D5BFF] hover:bg-blue-50"
              }`}
            >
              EN
            </a>
            <a
              href="/ru"
              className={`flex flex-1 items-center justify-center transition-colors ${
                lang === "ru"
                  ? "bg-[#0B4DD9]/70 text-white"
                  : "bg-white text-[#0D5BFF] hover:bg-blue-50"
              }`}
            >
              RU
            </a>
          </div>
        </div>
      </div>

      {/* Логотип с колонками кнопок по бокам */}
      <section className="mt-4 sm:mt-8 tabletp:mt-16">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-5 [&>div:first-child]:min-w-0 [&>div:last-child]:min-w-0">
          {/* Левая колонка */}
          <div className="flex flex-col items-start gap-2.5 sm:items-start sm:gap-[14px] md:gap-3">
            <NavButton href={`/${lang}/about`} label={t.home.nav.about} color="rgba(59,130,246,0.185)" shadowColor="rgba(70,110,170,0.55)" icon="about" />
            <NavButton href={`/${lang}/services`} label={t.home.nav.services} color="rgba(16,185,129,0.185)" shadowColor="rgba(40,140,110,0.55)" icon="services" />
            <NavButton href={`/${lang}/order`} label={t.home.nav.contacts} color="rgba(245,180,60,0.21)" shadowColor="rgba(180,140,60,0.55)" icon="contacts" />
          </div>

          {/* Логотип-пузырь */}
          <div className="flex w-[136px] flex-col items-center justify-center sm:w-auto">
            <Image
              src="/bubble.png"
              alt={siteConfig.name}
              width={628}
              height={652}
              priority
              className="block h-auto w-[136px] object-contain sm:w-[220px] md:w-[190px] tablet:w-[209px] lg:w-[180px]"
            />
          </div>

          {/* Правая колонка */}
          <div className="flex flex-col items-end gap-2.5 sm:items-end sm:gap-[14px] md:gap-3">
            <NavButton href={`/${lang}/articles`} label={t.home.nav.articles} color="rgba(139,92,246,0.185)" shadowColor="rgba(110,80,170,0.55)" icon="articles" align="right" />
            <NavButton href={`/${lang}/method`} label={t.home.nav.method} color="rgba(251,146,60,0.185)" shadowColor="rgba(190,110,60,0.55)" icon="method" align="right" />
            <NavButton href={`/${lang}/faq`} label={t.home.nav.faq} color="rgba(250,204,21,0.21)" shadowColor="rgba(180,150,40,0.55)" icon="faq" align="right" />
          </div>
        </div>

        {/* Надпись бренда под логотипом и кнопками */}
        <div className="mt-6 text-center sm:mt-6 tablet:mt-2 lg:mt-2">
          <span className="text-2xl text-[#0D5BFF] sm:text-4xl md:text-3xl">
            <span className="font-extrabold tracking-[0.15em]">AI</span>
            <span className="mx-3 text-xl font-medium tracking-[0.3em] sm:mx-4 sm:text-3xl md:text-2xl">ANSWERS</span>
            <span className="font-extrabold tracking-[0.15em] -mr-[0.15em]">RANK</span>
          </span>
        </div>

        {/* H1 — главный элемент экрана, мягкое белое свечение, растворяется в подложку */}
        <div
          className="-mt-2 px-5 pt-4 pb-8 sm:mt-0.5 sm:px-8 sm:py-10 md:py-8 tabletp:mt-12 tablet:-mt-2 tablet:py-4 lg:mt-0 lg:pb-8"
          style={{
            background:
              "radial-gradient(ellipse 75% 90% at 50% 50%, #FFFFFF 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0) 100%)",
          }}
        >
          <h1 className="text-center text-3xl font-extrabold leading-[1.12] tracking-tight text-[#111111] sm:text-[44px] md:text-[34px]">
            {t.home.h1}
          </h1>
          <p className="mt-3 text-center text-xl leading-snug text-[#4A4A4A] sm:mt-4 sm:text-[26px] md:text-[19px]">
            {t.home.heroLead}
          </p>
        </div>

        {/* Подзаголовки — карточки-кнопки (скругление и тень как у боковых кнопок логотипа) */}
        <div className="mt-0.5 w-full min-w-0 max-w-full overflow-x-clip space-y-2.5 sm:mt-3 sm:space-y-[14px] tabletp:space-y-10">
          {/* 1 — всего 3 простых шага → раскрывающийся блок под кнопкой */}
          <StepsAccordion
            label={
              <span className="block">
                <span className="block leading-snug">{renderWithAccents(t.home.subhead1, ["3"])}</span>
                <span className="mt-1 block font-normal leading-snug text-[19px] sm:text-[25px] md:text-[19px]">{t.home.subhead1b}</span>
                <span className="mt-1 block font-normal leading-snug text-[17px] text-[#4A4A4A] sm:text-[19px] md:text-[16px]">
                  {t.home.sub1note}
                </span>
              </span>
            }
            copy={t.home.stepsAccordion}
          />

          {/* 2 — первые результаты бесплатно за 30 секунд → раскрывается с быстрой проверкой */}
          <div className="!mt-5 sm:!mt-7 tabletp:!mt-20 tablet:!mt-3 lg:!mt-5">
            <QuickCheckAccordion
              buttonColor="rgba(16,185,129,0.185)"
              shadowColor="rgba(40,140,110,0.55)"
              label={
                <span className="tablet:block tablet:whitespace-normal">
                  <span className="block whitespace-nowrap leading-snug">
                    {renderWithAccents(t.home.subhead2, ["30 секунд", "30 seconds"])}
                  </span>
                  <span className="mt-1 block font-normal leading-snug text-[19px] sm:text-[25px] md:text-[19px]">{t.home.subhead2b}</span>
                  <span className="mt-1 flex items-center justify-center gap-2 text-[17px] font-normal leading-snug text-[#4A4A4A] sm:text-[19px] md:text-[16px]">
                    {t.home.sub2note.split("|").map((part, i) => (
                      <span key={i} className="inline-flex items-center gap-2">
                        {i > 0 && (
                          <span className="inline-block h-[0.5em] w-[0.5em] shrink-0 rounded-full bg-blue-600" />
                        )}
                        {part}
                      </span>
                    ))}
                  </span>
                </span>
              }
              copy={t.home.quickCheckCard}
            />
          </div>

          {/* 3 — детальная проверка → раскрывается с полем и оплатой */}
          <div className="!mt-5 sm:!mt-7 tabletp:!mt-20 lg:!mt-5">
            <QuickCheckAccordion
              variant="pro"
              buttonColor="rgba(250,204,21,0.21)"
              shadowColor="rgba(180,150,40,0.55)"
              label={
                <span>
                  <span className="block whitespace-nowrap leading-snug">
                    {renderWithAccents(t.home.subhead3, ["3 минуты", "3 minutes"])}
                  </span>
                  <span className="mt-1 block font-normal leading-snug text-[19px] sm:text-[25px] md:text-[19px]">{t.home.subhead3b}</span>
                  <span className="mt-1 block font-normal leading-snug text-[19px] sm:text-[25px] md:text-[19px]">
                    {t.home.sub3note}
                  </span>
                </span>
              }
              copy={t.home.proCheckCard}
            />
          </div>
        </div>
      </section>

      <section id="steps" className="mt-[34px] scroll-mt-6 space-y-6 tabletp:mt-24 lg:mt-10">
        {t.home.whatToDoSteps.map((step, i) => {
          // временно скрыты старые секции 1 и 2 (оставлена только секция 3)
          if (i < 2) return null;
          return (
          <div
            key={i}
            className="rounded-[22px] bg-white p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_3px_0_rgba(150,165,190,0.55),0_10px_16px_rgba(30,50,90,0.18)] sm:p-7 md:shadow-[0_10px_30px_rgba(13,91,255,0.16),0_2px_8px_rgba(0,0,0,0.08)] md:ring-1 md:ring-black/5"
          >
            {i === 2 ? (
              <>
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  {/* мишень слева — диаметр круга равен ширине перекладины корзины */}
                  <span className="flex shrink-0 items-center justify-center overflow-visible">
                    <img
                      src="/target.png"
                      alt=""
                      aria-hidden="true"
                      className="h-[68px] w-[68px] max-w-none object-contain"
                    />
                  </span>
                  {/* «За 10 минут» — размер как у кнопок вверху (за 3 минуты) */}
                  <p className="min-w-0 flex-1 whitespace-nowrap text-center text-lg font-semibold leading-tight text-[#111111] sm:text-2xl md:text-lg">
                    {renderWithAccents(t.home.step3Time, ["10 минут", "10 minutes"])}
                  </p>
                  {/* корзина справа */}
                  <BasketFill size={102} />
                </div>
                {/* заголовок под мишенью и корзиной — на всю ширину, по центру */}
                <h3 className="mt-3 w-full whitespace-pre-line text-center text-lg font-bold leading-tight text-[#111111] sm:text-xl">
                  {step.heading}
                </h3>
              </>
            ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-[0_4px_10px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,0.35)] sm:h-12 sm:w-12 sm:text-xl"
                  style={{ backgroundColor: step.color }}
                >
                  {step.num}
                </span>
                <h3 className="whitespace-pre-line text-lg font-bold leading-tight text-[#111111] sm:text-xl">
                  {step.heading}
                </h3>
              </div>
              {i === 0 && <ScoreRing score={78} size={120} />}
              {i === 1 && <WorkBars size={120} />}
            </div>
            )}

            {i === 2 ? null : (
              <p className="mt-4 text-justify text-lg leading-relaxed text-neutral-700 sm:text-xl">
                {step.body}
              </p>
            )}

            {step.groups.map((g, gi) => (
              <div key={gi} className="mt-5">
                <p className="text-base font-bold text-neutral-900 sm:text-lg">
                  {g.title}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {g.items.map((it, ii) => (
                    <li key={ii} className="flex gap-3 leading-relaxed">
                      <span
                        className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                        style={{ backgroundColor: step.color }}
                      />
                      <span className="text-base text-neutral-700 sm:text-lg">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {step.intro2 && (
              <p className="mt-5 text-justify text-lg leading-relaxed text-neutral-700 sm:text-xl">
                {step.intro2}
              </p>
            )}

            {step.notes.map((n, ni) => (
              <p key={ni} className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
                {n}
              </p>
            ))}

            {step.closing && (
              <p className="mt-6 whitespace-pre-line text-center text-lg font-normal leading-snug text-[#111111] sm:text-xl">
                {step.closing}
              </p>
            )}

            {step.ctaText && (
              <div className="mt-6">
                {step.ctaVariant === "navy" ? (
                  <ButtonLink href={`/${lang}/services`} variant="navy">
                    {step.ctaText}
                  </ButtonLink>
                ) : (
                  <ButtonLink
                    href={siteConfig.funnel.aiAnswersScore.url}
                    variant={step.ctaVariant as "primary" | "success"}
                    external
                  >
                    {step.ctaText}
                  </ButtonLink>
                )}
              </div>
            )}
          </div>
          );
        })}
      </section>

      <section className="mt-[34px] scroll-mt-6 tabletp:mt-24 lg:mt-10">
        <div className="rounded-[22px] bg-white p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_3px_0_rgba(150,165,190,0.55),0_10px_16px_rgba(30,50,90,0.18)] sm:p-7 md:shadow-[0_10px_30px_rgba(13,91,255,0.16),0_2px_8px_rgba(0,0,0,0.08)] md:ring-1 md:ring-black/5">
          <p className="text-center text-2xl font-bold leading-snug text-[#111111] sm:text-3xl">
            {t.home.airsTool.intro}
          </p>
          <p className="mt-3 text-center text-xl font-normal leading-snug text-[#111111] sm:text-2xl">
            {Array.isArray(t.home.airsTool.description) ? t.home.airsTool.description.join(" ") : t.home.airsTool.description}
          </p>
          <p className="mt-4 text-center text-lg leading-relaxed text-neutral-700 sm:text-xl">
            {t.home.airsTool.saveHint}
          </p>

          <div className="mt-6">
            <ButtonLink
              href={siteConfig.funnel.aiAnswersScore.url}
              variant="amber"
              external
            >
              {t.home.airsTool.button}
            </ButtonLink>
          </div>

          <p className="mt-8 text-center text-xl font-normal leading-snug text-[#111111] sm:text-2xl">
            {t.home.airsTool.whyTitle}
          </p>
          <ul className="mt-4 space-y-2.5">
            {t.home.airsTool.whyItems.map((it, i) => (
              <li key={i} className="flex gap-3 leading-relaxed">
                <span
                  className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                  style={{ backgroundColor: "#D67B23" }}
                />
                <span className="text-lg text-[#111111] sm:text-xl">{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HomeFaq
        title={t.home.faqTitle}
        items={t.home.faq}
      />

      <HomeUpdates
        title={t.home.updatesTitle}
        emptyLabel={t.home.updatesEmpty}
        items={latest.map((tp) => ({
          href: `/${lang}/${tp.section}/${tp.slug}`,
          title: tp.content[lang].h1,
          date: formatDate(lang, new Date(tp.datePublished)),
        }))}
      />

      <p className="mt-12 text-sm text-neutral-400">
        {t.home.pageUpdated}: {formatDate(lang, BUILD_DATE)}
      </p>
    </main>
  );
}

type IconName = "about" | "services" | "contacts" | "articles" | "method" | "faq" | "steps" | "clock" | "wallet";

function NavIcon({ name, color = "white" }: { name: IconName; color?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] md:h-[18px] md:w-[18px]",
  };
  switch (name) {
    case "about":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      );
    case "services":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      );
    case "contacts":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "articles":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6M9 17h6" />
        </svg>
      );
    case "method":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case "faq":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 sm:h-7 sm:w-7 md:h-6 md:w-6">
          <path d="M9 8.5a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1.1-1.5 2.4" />
          <circle cx="12" cy="17.5" r="0.6" fill="white" stroke="none" />
        </svg>
      );
    case "steps":
      return (
        <svg {...common}>
          <path d="M5 21V4" />
          <path d="M5 4c3-1.6 6 1.6 9 0v7c-3 1.6-6-1.6-9 0" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...common}>
          <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M16 12h4" />
          <circle cx="16" cy="12" r="1" fill={color} stroke="none" />
        </svg>
      );
  }
}

function pressBg(rgba: string): string {
  // rgba(R,G,B,a) -> тот же тон темнее на 15% и плотнее (для эффекта нажатия)
  const m = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return rgba;
  const r = Math.round(Number(m[1]) * 0.85);
  const g = Math.round(Number(m[2]) * 0.85);
  const b = Math.round(Number(m[3]) * 0.85);
  return `rgba(${r},${g},${b},0.42)`;
}

function NavButton({
  href,
  label,
  color,
  shadowColor,
  icon,
  align = "left",
}: {
  href: string;
  label: string;
  color: string;
  shadowColor: string;
  icon: IconName;
  align?: "left" | "right";
}) {
  return (
    <a
      href={href}
      style={{
        backgroundColor: color,
        ["--press-bg" as string]: pressBg(color),
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
      }}
      className={`btn-press flex h-[42px] w-[90%] items-center justify-center gap-2 rounded-[14px] px-2 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] sm:h-[83px] sm:w-[80%] sm:gap-4 sm:rounded-[22px] sm:px-4 md:h-[58px] md:w-full md:max-w-[300px] md:gap-3 md:rounded-[16px] md:px-4 md:ring-1 md:ring-black/5 tablet:h-[42px] tablet:max-w-[240px] tablet:gap-2 tablet:px-3 lg:h-[54px] lg:max-w-[400px] ${
        align === "right" ? "md:ml-auto" : ""
      }`}
    >
      <span className={`whitespace-nowrap text-[11px] font-bold leading-tight tracking-tight text-[#111111] sm:text-sm sm:tracking-wide md:text-[13px] tablet:text-[11px]`}>
        {label}
      </span>
    </a>
  );
}
