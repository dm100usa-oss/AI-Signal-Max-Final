import { getDictionary, fill } from "@/locales";
import { siteConfig } from "@/config/site";
import type { Lang } from "@/locales/config";
import { trustPages } from "@/content/trust-pages";

export function Footer({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const now = new Date();
  const year = now.getFullYear();

  const updated = now.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Подвал без дубля «Статей»: разделы знаний убраны (они полностью
  // повторяют страницу articles), остаются все страницы доверия и авторитета.
  // Первой идёт витрина «Исследования» (серия нишевых исследований).
  const links = [
    {
      href: `/${lang}/tool`,
      label: lang === "ru" ? "Инструмент AI Answers Score" : "AI Answers Score tool",
    },
    {
      href: `/${lang}/knowledge-system`,
      label: lang === "ru" ? "AIKS: система знаний" : "AIKS: knowledge system",
    },
    {
      href: `/${lang}/why-not-in-ai-answers`,
      label:
        lang === "ru"
          ? "Почему моего сайта нет в ответах ИИ"
          : "Why my site is not in AI answers",
    },
    {
      href: `/${lang}/research`,
      label: lang === "ru" ? "Исследования" : "Research",
    },
    ...trustPages
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((p) => ({
        href: `/${lang}/${p.slug}`,
        label: p.content[lang].navLabel,
      })),
  ];

  return (
    <footer className="mt-20 bg-blue-700 text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Лента ссылок */}
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Разделитель */}
        <div className="my-8 h-px bg-white/15" />

        {/* Дисклеймер и независимость */}
        <p className="text-xs leading-relaxed text-white/70">
          {t.footer.disclaimer}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-white/60">
          {t.footer.legalNote}
        </p>

        {/* Копирайт + дата + контакт */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 text-xs text-white/60">
          <span>{fill(t.footer.copyright, { year })}</span>
          <span>
            {t.footer.updated}: {updated}
          </span>
        </div>
        <div className="mt-1 text-xs text-white/60">
          {siteConfig.contacts.email}
        </div>
      </div>
    </footer>
  );
}
