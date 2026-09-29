"use client";

import { useState } from "react";

// Блок «Последние обновления контента» на главной.
// Белая кнопка с видимыми границами, стрелка сбоку (анимация + поворот),
// список обновлений раскрывается по нажатию. Виден для ИИ через JSON-LD в page.tsx.

type UpdateItem = { href: string; title: string; date: string };

export function HomeUpdates({
  title,
  emptyLabel,
  items,
}: {
  title: string;
  emptyLabel: string;
  items: UpdateItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-16 scroll-mt-6">
      <div
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)",
        }}
        className="overflow-hidden rounded-[14px] ring-1 ring-black/10 sm:rounded-[22px]"
      >
        {/* белая кнопка-заголовок */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          style={{
            backgroundColor: "#F9F3E0",
            ["--press-bg" as string]: "rgba(232,220,190,0.8)",
          }}
          className="btn-press relative flex w-full items-center justify-center pl-6 pr-9 py-4 text-center text-lg font-bold leading-snug text-[#111111] transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] sm:text-xl"
        >
          <span>{title}</span>
          <span
            className={`pointer-events-none absolute right-3 top-0 bottom-0 flex items-center text-[32px] font-light text-[#0D5BFF] transition-transform duration-300 ${
              open ? "rotate-90" : "chevron-pulse"
            }`}
          >
            ›
          </span>
        </button>

        {/* раскрывающийся список */}
        <div
          className={`grid transition-all duration-300 ease-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          style={{ backgroundColor: "#F9F3E0" }}
        >
          <div className="overflow-hidden">
            <div className="border-t border-black/10 px-5 py-6 sm:px-8">
              {items.length === 0 ? (
                <p className="text-sm text-neutral-400">{emptyLabel}</p>
              ) : (
                <ul className="space-y-2.5">
                  {items.map((it, i) => (
                    <li
                      key={i}
                      className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                    >
                      <a
                        href={it.href}
                        className="text-neutral-800 hover:text-blue-700 transition-colors"
                      >
                        {it.title}
                      </a>
                      <span className="text-sm text-neutral-400">{it.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
