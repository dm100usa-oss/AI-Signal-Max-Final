import "../globals.css";
import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/locales/config";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Генерируем статические страницы для каждого языка при сборке
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

// hreflang + canonical для корня каждого языка
export function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${siteConfig.url}/${l}`;
  }
  return {
    alternates: {
      canonical: `${siteConfig.url}/${lang}`,
      languages,
    },
  };
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;

  return (
    <html lang={lang}>
      <body
        className="text-neutral-900 font-sans antialiased"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #FEFEFF 0%, #F9FAFB 100%)",
          backgroundAttachment: "fixed",
        }}
      >
        <Header lang={lang} />
        {children}
        <Footer lang={lang} />
      </body>
    </html>
  );
}
