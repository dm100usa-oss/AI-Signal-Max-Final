"use client";

import { useState } from "react";

// Карточки «Важные вопросы» на главной.
// Вид кнопки-аккордеона повторяет блоки под логотипом:
// полупрозрачная плашка, стрелка сбоку (анимация + поворот при открытии),
// смена цвета при нажатии. Ответ раскрывается снизу на белом фоне.
// Цвета плашек чередуются: голубой / зелёный.

type FaqItem = { q: string; a: string };

// два чередующихся цвета — как у карточек услуг (голубой, зелёный)
const COLOR_A = {
  bg: "rgba(59,130,246,0.185)",
  press: "rgba(50,110,209,0.42)",
  arrow: "#0D5BFF",
};
const COLOR_B = {
  bg: "rgba(16,185,129,0.185)",
  press: "rgba(14,157,110,0.42)",
  arrow: "#0EA05E",
};

// «|» в тексте вопроса — принудительный перенос на телефоне, пробел на десктопе
function renderQuestion(q: string) {
  const parts = q.split("|");
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 ? (
        <>
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
        </>
      ) : null}
    </span>
  ));
}

export function HomeFaq({
  title,
  items,
}: {
  title: string;
  items: FaqItem[];
}) {
  const [openIdxs, setOpenIdxs] = useState<number[]>([]);

  const toggleOpen = (i: number) =>
    setOpenIdxs((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  return (
    <section id="faq" className="mt-12 scroll-mt-6">
      <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>

      <div className="mt-6 space-y-3.5">
        {items.map((f, i) => {
          const open = openIdxs.includes(i);
          const c = i % 2 === 0 ? COLOR_A : COLOR_B;
          const paragraphs = f.a.split("\n\n");
          return (
            <div
              key={i}
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)",
              }}
              className="overflow-hidden rounded-[14px] sm:rounded-[22px] md:ring-1 md:ring-black/5"
            >
              {/* плашка-кнопка с вопросом */}
              <button
                type="button"
                onClick={() => toggleOpen(i)}
                aria-expanded={open}
                style={{
                  backgroundColor: c.bg,
                  ["--press-bg" as string]: c.press,
                }}
                className="btn-press relative flex w-full items-center justify-center pl-4 pr-8 py-4 text-center text-lg font-bold leading-snug text-[#111111] transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] sm:pl-8 sm:pr-11 sm:text-xl"
              >
                <span>{renderQuestion(f.q)}</span>
                <span
                  className={`pointer-events-none absolute right-3 top-0 bottom-0 flex items-center text-[32px] font-light transition-transform duration-300 ${
                    open ? "rotate-90" : "chevron-pulse"
                  }`}
                  style={{ color: c.arrow }}
                >
                  ›
                </span>
              </button>

              {/* белый низ — ответ, раскрывается снизу */}
              <div
                className={`grid bg-white transition-all duration-300 ease-out ${
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-4 px-5 pt-9 pb-8 sm:px-8 sm:pt-10 sm:pb-9">
                    {paragraphs.map((p, pi) => {
                      const isBullet = p.startsWith("- ");
                      if (isBullet) {
                        return (
                          <p
                            key={pi}
                            className="flex gap-3 text-[18px] leading-relaxed text-[#111111]"
                          >
                            <span
                              className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{
                                backgroundColor: c.arrow,
                                boxShadow:
                                  "inset 0 1px 1px rgba(255,255,255,0.45), 0 1px 2px rgba(60,40,110,0.55)",
                              }}
                            />
                            <span>{p.slice(2)}</span>
                          </p>
                        );
                      }
                      return (
                        <p
                          key={pi}
                          className="text-[18px] leading-relaxed text-[#111111] text-justify [text-align-last:left]"
                        >
                          {p}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
