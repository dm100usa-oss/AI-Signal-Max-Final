import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/locales";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServicesSelector } from "@/components/ServicesSelector";
import { FloatingBack } from "@/components/FloatingBack";

// =============================================================
//  /[lang]/services — страница услуг.
//  Двуязычная. Карточки услуг с выбором; выбранное передаётся
//  в форму заявки (/order?services=...).
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
    languages[l] = `${siteConfig.url}/${l}/services`;
  }

  const title = `${t.services.title} — ${siteConfig.name}`;
  const description = t.services.introLine3;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/services`,
      languages,
    },
  };
}

export default function ServicesPage({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const t = getDictionary(lang);
  const s = t.services;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: s.title,
    url: `${siteConfig.url}/${lang}/services`,
    inLanguage: lang,
    itemListElement: s.items.map((it, i) => ({
      "@type": "Offer",
      position: i + 1,
      name: it.title,
      description: it.summary,
      price: it.price.replace(/[^0-9]/g, ""),
      priceCurrency: "USD",
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pt-8 pb-8 text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        baseUrl={siteConfig.url}
        items={[
          { name: siteConfig.name, href: `/${lang}` },
          { name: s.title, href: `/${lang}/services` },
        ]}
      />

      <div
        className="mt-8 rounded-[14px] px-5 py-4 sm:rounded-[22px] sm:px-6 sm:py-5"
        style={{
          backgroundColor: "rgba(59,130,246,0.24)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)",
        }}
      >
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight text-center">
          {s.title}
        </h1>
      </div>

      <div className="mt-5 space-y-2 text-center">
        <p className="text-[19px] font-normal leading-snug text-neutral-700 sm:text-[21px]">
          {s.introLine2}
        </p>
        <p className="text-[19px] font-bold leading-snug text-[#111111] sm:text-xl">
          {s.introLine2b}
        </p>
      </div>

      <section className="mt-10">
        <ServicesSelector
          items={s.items}
          lang={lang}
          labels={{
            selectedLabel: s.selectedLabel,
            moreLabel: s.moreLabel,
            lessLabel: s.lessLabel,
            chooseLabel: s.chooseLabel,
            chosenLabel: s.chosenLabel,
            buyLayoutLabel: s.buyLayoutLabel,
            buyConsultLabel: s.buyConsultLabel,
            cta: s.cta,
            ctaDisabledHint: s.ctaDisabledHint,
          }}
          orderHref={`/${lang}/order`}
        />
      </section>

      <FloatingBack label={t.common.back} />
    </main>
  );
}
