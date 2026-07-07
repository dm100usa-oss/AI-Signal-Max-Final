import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OrderForm } from "@/components/OrderForm";
import { BackLink } from "@/components/BackLink";

// =============================================================
//  /[lang]/order — страница заказа доработки сайта.
//  Двуязычная. Разметка WebPage. Форма заявки пока
//  открывает письмо на контактный email (вариант B).
//  Реальный приём заявок (форма/CRM) — настроить позже.
// =============================================================

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${siteConfig.url}/${l}/order`;
  }

  const title =
    lang === "ru"
      ? "Заказать доработку сайта — AI Answers Rank"
      : "Order website improvement — AI Answers Rank";
  const description =
    lang === "ru"
      ? "Закажите доработку сайта, чтобы он появлялся в ответах и рекомендациях ИИ-ассистентов. Мы внедрим рекомендации и устраним проблемы."
      : "Order website improvement so your site appears in AI assistant answers and recommendations. We implement the recommendations and fix the problems.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${lang}/order`,
      languages,
    },
  };
}

type Copy = {
  title: string;
  intro: string;
  blocks: { h: string; p?: string; items?: string[] }[];
  formTitle: string;
  labels: {
    name: string;
    email: string;
    site: string;
    message: string;
    submit: string;
    emailSubject: string;
    selectedServicesLabel: string;
  };
  navLabel: string;
};

const copy: Record<Lang, Copy> = {
  en: {
    title: "Order website improvement",
    intro:
      "We will help your website appear in the answers and recommendations of AI assistants. We implement the recommendations, improve the site, and fix the problems found — so you don't have to deal with the technical details yourself.",
    blocks: [
      {
        h: "What's included",
        items: [
          "Implementing the recommendations from the extended check",
          "Technical improvements so AI assistants can read and trust your site",
          "Adding the structure and signals needed to be cited",
          "A final check to confirm the site is ready",
        ],
      },
      {
        h: "How it works",
        items: [
          "You send a request with your website address",
          "We review the site and agree on the scope and price",
          "We carry out the work within a reasonable time",
          "You get a site prepared to appear in AI answers and recommendations",
        ],
      },
    ],
    formTitle: "Send a request",
    labels: {
      name: "Name",
      email: "Email",
      site: "Website address",
      message: "Message",
      submit: "Send",
      emailSubject: "Website improvement request — AI Answers Rank",
      selectedServicesLabel: "Selected services",
    },
    navLabel: "Order improvement",
  },
  ru: {
    title: "Заказать доработку сайта",
    intro:
      "Мы поможем вашему сайту появляться в ответах и рекомендациях ИИ-ассистентов. Внедрим рекомендации, доработаем сайт и устраним обнаруженные проблемы — вам не придётся самостоятельно разбираться в технических деталях.",
    blocks: [
      {
        h: "Что входит в работу",
        items: [
          "Внедрение рекомендаций по результатам расширенной проверки",
          "Технические доработки, чтобы ИИ-ассистенты могли читать сайт и доверять ему",
          "Добавление структуры и сигналов, необходимых для цитирования",
          "Финальная проверка готовности сайта",
        ],
      },
      {
        h: "Как это происходит",
        items: [
          "Вы оставляете заявку с адресом сайта",
          "Мы изучаем сайт и согласуем объём работ и стоимость",
          "Выполняем работу в разумные сроки",
          "Вы получаете сайт, подготовленный к появлению в ответах и рекомендациях ИИ",
        ],
      },
    ],
    formTitle: "Оставить заявку",
    labels: {
      name: "Имя",
      email: "Email",
      site: "Адрес сайта",
      message: "Сообщение",
      submit: "Отправить",
      emailSubject: "Заявка на доработку сайта — AI Answers Rank",
      selectedServicesLabel: "Выбранные услуги",
    },
    navLabel: "Заказать доработку",
  },
};

const jsonLd = (lang: Lang, c: Copy) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: c.title,
  description:
    lang === "ru"
      ? "Заказ доработки сайта для появления в ответах и рекомендациях ИИ."
      : "Order website improvement to appear in AI answers and recommendations.",
  url: `${siteConfig.url}/${lang}/order`,
  inLanguage: lang,
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
});

export default function OrderPage({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const c = copy[lang];

  return (
    <main className="mx-auto max-w-2xl px-6 pt-8 pb-8 text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang, c)) }}
      />

      <Breadcrumbs
        baseUrl={siteConfig.url}
        items={[
          { name: siteConfig.name, href: `/${lang}` },
          { name: c.title, href: `/${lang}/order` },
        ]}
      />

      <div className="mt-2">
        <BackLink label={lang === "ru" ? "Назад" : "Back"} />
      </div>

      <section className="mt-6">
        <OrderForm labels={c.labels} />
      </section>
    </main>
  );
}
