"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_SHORT, type Lang } from "@/locales/config";

export function LangSwitcher({ current }: { current: Lang }) {
  const pathname = usePathname();

  // Меняем языковой префикс в текущем пути: /ru/foo -> /en/foo
  const swapLang = (target: Lang) => {
    const parts = (pathname || `/${current}`).split("/");
    // parts[0] = "", parts[1] = текущий язык
    parts[1] = target;
    return parts.join("/") || `/${target}`;
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex rounded-md overflow-hidden border border-neutral-200 text-sm font-medium">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={swapLang(l)}
          className={[
            "px-3 py-1 transition-colors",
            current === l
              ? "bg-neutral-900 text-white"
              : "bg-white text-neutral-500 hover:bg-neutral-100",
          ].join(" ")}
        >
          {LOCALE_SHORT[l]}
        </Link>
      ))}
    </div>
  );
}
