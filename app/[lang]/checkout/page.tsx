import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { CheckoutPrototype } from "@/components/CheckoutPrototype";

// ПРОТОТИП оплаты/записи. ?service=consultation|layout&price=...
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const metadata = {
  robots: { index: false, follow: false },
};

const TEXTS: Record<Lang, {
  back: string; payTitleConsult: string; payTitleLayout: string;
  pickDate: string; pickTime: string; duration: string; pay: string;
  stubNote: string; calendarStub: string;
}> = {
  ru: {
    back: "Назад",
    payTitleConsult: "Запись на консультацию",
    payTitleLayout: "Покупка макета страницы",
    pickDate: "Выберите дату",
    pickTime: "Выберите время",
    duration: "Длительность: 1 час",
    pay: "Перейти к оплате",
    stubNote: "Прототип: здесь будет оплата через Stripe (пока заглушка).",
    calendarStub: "Здесь будет календарь со свободными датами (Calendly).",
  },
  en: {
    back: "Back",
    payTitleConsult: "Book a consultation",
    payTitleLayout: "Buy page layout",
    pickDate: "Pick a date",
    pickTime: "Pick a time",
    duration: "Duration: 1 hour",
    pay: "Proceed to payment",
    stubNote: "Prototype: Stripe payment will be here (stub for now).",
    calendarStub: "A calendar with available dates will be here (Calendly).",
  },
};

export default function CheckoutPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { service?: string; price?: string };
}) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const service = searchParams.service ?? "layout";
  const price = searchParams.price ?? "";

  return (
    <CheckoutPrototype service={service} price={price} texts={TEXTS[lang]} />
  );
}
