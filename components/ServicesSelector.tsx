"use client";

import { useState } from "react";

export type ServiceItem = {
  title: string;
  price: string;
  priceNote: string;
  color: string;
  buyType: string;
  summary: string;
  intro: string;
  details: string[];
  detailsTitle: string;
  result: string;
  resultTitle: string;
};

type Labels = {
  selectedLabel: string;
  moreLabel: string;
  lessLabel: string;
  chooseLabel: string;
  chosenLabel: string;
  buyLayoutLabel: string;
  buyConsultLabel: string;
  cta: string;
  ctaDisabledHint: string;
};

// затемнение фона при нажатии — тот же тон темнее (как кнопки на главной)
function pressBg(rgba: string): string {
  const m = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return rgba;
  const r = Math.round(Number(m[1]) * 0.85);
  const g = Math.round(Number(m[2]) * 0.85);
  const b = Math.round(Number(m[3]) * 0.85);
  return `rgba(${r},${g},${b},0.42)`;
}

const PRICE_COLOR = "#1a4a7a"; // как кнопка «Посмотреть наши услуги»

export function ServicesSelector({
  items,
  labels,
  orderHref,
  lang,
}: {
  items: ServiceItem[];
  labels: Labels;
  orderHref: string;
  lang: string;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [openIdxs, setOpenIdxs] = useState<number[]>([]);

  const toggleSelect = (i: number) =>
    setSelected((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  const toggleOpen = (i: number) =>
    setOpenIdxs((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  const count = selected.length;
  const hasSelection = count > 0;

  const goToOrder = () => {
    if (!hasSelection) return;
    const chosen = selected
      .sort((a, b) => a - b)
      .map((i) => `${items[i].title} (${items[i].price})`)
      .join("\n");
    window.location.href = `${orderHref}?services=${encodeURIComponent(chosen)}`;
  };

  return (
    <div>
      <div className="space-y-4">
        {items.map((it, i) => {
          const active = selected.includes(i);
          const open = openIdxs.includes(i);
          return (
            <div
              key={i}
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)",
                ...(active ? { outline: `2px solid ${PRICE_COLOR}`, outlineOffset: "0px" } : {}),
              }}
              className="overflow-hidden rounded-[18px] transition-shadow sm:rounded-[22px]"
            >
              {/* цветной верх карточки */}
              <div style={{ backgroundColor: it.color }} className="p-5">
              {/* шапка карточки: название + продающая строка на всю ширину */}
              <h3 className="text-center text-[19px] font-bold leading-snug text-[#111111] sm:text-[21px]">
                {it.title}
              </h3>
              <p className="mt-1.5 text-lg leading-relaxed text-neutral-700 text-justify sm:text-xl">
                {it.summary}
              </p>

              {/* цена — отдельной строкой под текстом */}
              <div className="mt-3 text-right">
                <span
                  className="text-xl font-extrabold sm:text-2xl"
                  style={{ color: PRICE_COLOR }}
                >
                  {it.price}
                </span>
                {it.priceNote ? (
                  <span className="ml-2 text-sm text-neutral-500">
                    {it.priceNote}
                  </span>
                ) : null}
              </div>

              {/* кнопки: Подробнее + Выбрать */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleOpen(i)}
                  aria-expanded={open}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#111111] ring-1 ring-black/5 transition-all duration-200 ease-out hover:bg-white active:scale-[0.97]"
                >
                  {open ? labels.lessLabel : labels.moreLabel}
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => toggleSelect(i)}
                  aria-pressed={active}
                  style={active ? { backgroundColor: PRICE_COLOR } : {}}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ease-out active:scale-[0.97] ${
                    active
                      ? "text-white"
                      : "bg-white/70 text-[#111111] ring-1 ring-black/5 hover:bg-white"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      active ? "border-white bg-white/20 text-white" : "border-neutral-400 text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  </span>
                  {active ? labels.chosenLabel : labels.chooseLabel}
                </button>

                {/* кнопка оплаты/записи — только для покупаемых услуг (прототип) */}
                {it.buyType ? (
                  <a
                    href={`/${lang}/checkout?service=${it.buyType}&price=${encodeURIComponent(it.price)}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1a4a7a] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-[#163f68] active:scale-[0.97]"
                  >
                    {it.buyType === "consultation"
                      ? labels.buyConsultLabel
                      : labels.buyLayoutLabel}
                  </a>
                ) : null}
              </div>
              </div>
              {/* конец цветного верха */}

              {/* белый низ карточки — раскрывается по «Подробнее» */}
              <div
                className={`grid bg-white transition-all duration-300 ease-out ${
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
                    {it.intro ? (
                      <p className="text-[17px] font-semibold leading-relaxed text-[#111111] text-justify [text-align-last:left]">
                        {it.intro}
                      </p>
                    ) : null}

                    {it.detailsTitle ? (
                      <p className="mt-4 text-sm font-bold uppercase tracking-wide text-neutral-500">
                        {it.detailsTitle}
                      </p>
                    ) : null}
                    <ul className="mt-2.5 space-y-2.5">
                      {it.details.map((d, di) => (
                        <li key={di} className="flex gap-3 leading-relaxed">
                          <span
                            className="mt-1.5 h-3 w-3 shrink-0 rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                            style={{ backgroundColor: PRICE_COLOR }}
                          />
                          <span className="text-[17px] text-neutral-700 text-justify">{d}</span>
                        </li>
                      ))}
                    </ul>

                    {it.result ? (
                      <>
                        <p className="mt-4 text-sm font-bold uppercase tracking-wide text-neutral-500">
                          {it.resultTitle}
                        </p>
                        <p className="mt-2 text-[17px] leading-relaxed text-neutral-700 text-justify">
                          {it.result}
                        </p>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* счётчик + кнопка заявки */}
      <div className="mt-7 flex flex-col items-center gap-3">
        {hasSelection && (
          <p className="text-base font-medium text-neutral-700">
            {labels.selectedLabel}: {count}
          </p>
        )}
        <button
          type="button"
          onClick={goToOrder}
          disabled={!hasSelection}
          className={`w-full max-w-md rounded-[14px] px-6 py-4 text-center text-lg font-semibold transition-all duration-200 ease-out sm:rounded-[18px] ${
            hasSelection
              ? "cursor-pointer text-white shadow-[0_8px_20px_rgba(26,74,122,0.30)] active:scale-[0.98]"
              : "cursor-not-allowed bg-neutral-200 text-neutral-400"
          }`}
          style={hasSelection ? { backgroundColor: PRICE_COLOR } : {}}
        >
          {labels.cta}
        </button>
        {!hasSelection && (
          <p className="text-sm text-neutral-400">{labels.ctaDisabledHint}</p>
        )}
      </div>
    </div>
  );
}
