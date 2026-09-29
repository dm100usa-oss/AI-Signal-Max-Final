import Link from "next/link";

export type Crumb = { name: string; href: string };

export function Breadcrumbs({
  items,
  baseUrl,
}: {
  items: Crumb[];
  baseUrl: string;
}) {
  // JSON-LD для поисковиков и ИИ (BreadcrumbList)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={item.href}
              className={
                last
                  ? "flex min-w-0 items-center gap-1.5"
                  : "flex items-center gap-1.5"
              }
            >
              {last ? (
                <span className="text-neutral-500 [overflow-wrap:anywhere]">{item.name}</span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="hover:text-neutral-800 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <span className="text-neutral-300">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
