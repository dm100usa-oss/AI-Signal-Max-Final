"use client";

import { useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { prepareUrl } from "@/lib/urlCheck";
import ScoreRing from "@/components/ScoreRing";

function pressBg(rgba: string): string {
  // rgba(R,G,B,a) -> тот же тон темнее на 15% и плотнее (эффект нажатия)
  const m = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return rgba;
  const r = Math.round(Number(m[1]) * 0.85);
  const g = Math.round(Number(m[2]) * 0.85);
  const b = Math.round(Number(m[3]) * 0.85);
  return `rgba(${r},${g},${b},0.42)`;
}

export type QuickCheckCardCopy = {
  headTitle?: string;
  headLead?: string;
  headNotes?: string[];
  bold: string[];
  intro: string;
  bullets: string[];
  extraTitle?: string;
  extraItems?: string[];
  advantage?: string;
  price?: string;
  fieldLabel?: string;
  placeholder: string;
  button: string;
  subnote?: string;
  footnote?: string;
  tailIntro?: string;
  tailItems?: string[];
  tailOutro?: string;
  tailBig?: string;
  errorInvalidUrl: string;
  errorCannotCheck: string;
};

export default function QuickCheckAccordion({
  label,
  copy,
  variant = "quick",
  buttonColor = "#ffffff",
  shadowColor = "rgba(150,165,190,0.4)",
}: {
  label: ReactNode;
  copy: QuickCheckCardCopy;
  variant?: "quick" | "pro";
  buttonColor?: string;
  shadowColor?: string;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const go = () => {
    const res = prepareUrl(url);
    if (!res.ok) {
      setError(res.reason === "blocked" ? copy.errorCannotCheck : copy.errorInvalidUrl);
      return;
    }
    setError(null);
    const base = ""; // экраны проверки теперь внутри этого сайта
    const path = variant === "pro" ? "preview/pro" : "preview/quick";
    const q = new URLSearchParams({ url: res.url, status: "ok" }).toString();
    window.location.href = `${base}/${path}?${q}`;
  };

  return (
    <div>
      {/* Кнопка — вид как у кнопки 2 (самая большая) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          backgroundColor: buttonColor,
          ["--press-bg" as string]: pressBg(buttonColor),
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)`,
        }}
        className="btn-press relative flex w-full items-center justify-center rounded-[14px] px-12 py-4 text-center text-lg font-semibold leading-snug text-[#111111] transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] sm:rounded-[22px] sm:text-2xl md:rounded-[16px] md:text-lg md:ring-1 md:ring-black/5"
      >
        <span>{label}</span>
        <span
          className={`pointer-events-none absolute right-4 top-0 bottom-0 flex items-center text-[34px] font-light text-[#0D5BFF] transition-transform duration-300 ${
            open ? "rotate-90" : "chevron-pulse"
          }`}
        >
          ›
        </span>
      </button>

      {/* Раскрытая плашка */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          open
            ? "mt-2.5 grid-rows-[1fr] opacity-100 sm:mt-[14px]"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="rounded-[14px] bg-white px-4 py-6 text-left shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:rounded-[22px] sm:px-6 sm:py-7 md:rounded-[16px] md:shadow-[0_10px_30px_rgba(13,91,255,0.16),0_2px_8px_rgba(0,0,0,0.08)] md:ring-1 md:ring-black/5 lg:py-5">
            {variant === "pro" && (copy.extraTitle || copy.advantage) && (
              <div className="mb-5">
                {copy.extraTitle && (
                  <p className="mb-6 text-center text-xl font-bold leading-snug text-[#111111] lg:mb-5 lg:text-[18px]">
                    {copy.extraTitle}
                  </p>
                )}

                {copy.extraItems && copy.extraItems.length > 0 && (
                  <div className="space-y-3 lg:space-y-2">
                    {copy.extraItems.map((it, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span
                          className="mt-[7px] inline-block h-[11px] w-[11px] shrink-0 rounded-full"
                          style={{ backgroundColor: "#16A34A" }}
                        />
                        <p className="text-justify text-[18px] leading-relaxed text-[#1F2937] lg:text-[16px]">
                          {it.split(/(\*\*[^*]+\*\*)/g).map((seg, k) =>
                            seg.startsWith("**") && seg.endsWith("**") ? (
                              <strong key={k} className="font-bold">
                                {seg.slice(2, -2)}
                              </strong>
                            ) : (
                              <span key={k}>{seg}</span>
                            )
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {copy.advantage && (
                  <p className="mt-5 text-center text-xl font-bold leading-snug text-[#111111] lg:mt-4 lg:text-[18px]">
                    {copy.advantage}
                  </p>
                )}
              </div>
            )}

            {copy.price && (
              <div className="mb-5 flex items-center justify-center">
                <p className="flex items-center gap-2 text-xl font-normal leading-none text-[#111111] sm:text-2xl">
                  <span>{copy.price}</span>
                  <span className="text-neutral-400">≈</span>
                  <span>6</span>
                  <span className="text-neutral-400">×</span>
                  <img
                    src="/coffee-cup.png"
                    alt="coffee cup"
                    className="inline-block h-[52px] w-auto shrink-0 align-middle"
                  />
                </p>
              </div>
            )}

            {(copy.headTitle || copy.headLead || (copy.headNotes && copy.headNotes.length > 0)) && (
              <div className="mb-5 -mx-1 sm:-mx-1">
                {copy.headTitle && (
                  <h3 className="whitespace-pre-line text-center text-xl font-bold leading-snug text-[#111111] lg:text-[18px]">
                    {copy.headTitle}
                  </h3>
                )}
                {copy.headLead && (
                  <p className="mt-4 text-center text-[19px] font-normal leading-snug text-[#4A4A4A] sm:text-2xl lg:text-xl">
                    {copy.headLead}
                  </p>
                )}
                {copy.headNotes && copy.headNotes.length > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="min-w-0 flex-1 space-y-1.5">
                    {copy.headNotes.map((n, k) => {
                      const segs = n.split("80%");
                      const color = k === 0 ? "#107536" : "#B33333";
                      return (
                        <p key={k} className="whitespace-pre-line text-lg leading-relaxed text-neutral-700 lg:text-base">
                          {segs.map((seg, s) => (
                            <span key={s}>
                              {seg.split(/(\*\*[^*]+\*\*)/g).map((part, p) =>
                                part.startsWith("**") && part.endsWith("**") ? (
                                  <strong key={p} className="font-bold">
                                    {part.slice(2, -2)}
                                  </strong>
                                ) : (
                                  <span key={p}>{part}</span>
                                )
                              )}
                              {s < segs.length - 1 && (
                                <span className="mx-0.5 align-baseline text-[1.15em] font-bold" style={{ color }}>
                                  80%
                                </span>
                              )}
                            </span>
                          ))}
                        </p>
                      );
                    })}
                    </div>
                    <div className="shrink-0 self-center -mt-2">
                      <ScoreRing score={82} size={120} />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <div className="relative">
                <input
                  type="url"
                  inputMode="url"
                  placeholder={copy.placeholder}
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") go();
                  }}
                  className={`h-14 w-full rounded-[12px] border pl-4 pr-12 text-lg outline-none transition-colors sm:text-xl lg:h-12 lg:text-base ${
                    error
                      ? "border-rose-400 focus:ring-2 focus:ring-rose-300"
                      : `border-neutral-300 focus:ring-2 ${
                          variant === "pro" ? "focus:ring-green-500" : "focus:ring-blue-500"
                        }`
                  }`}
                />
                {url && (
                  <button
                    type="button"
                    aria-label="Очистить"
                    onClick={() => {
                      setUrl("");
                      setError(null);
                    }}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-300 active:scale-95"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {error && <p className="mt-2 text-base text-rose-600">{error}</p>}
              <button
                type="button"
                onClick={go}
                style={{
                  backgroundImage:
                    variant === "pro"
                      ? "linear-gradient(180deg, #22C55E 0%, #16A34A 55%, #15803D 100%)"
                      : "linear-gradient(180deg, #3B82F6 0%, #2563EB 55%, #1D4ED8 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.12), 0 6px 16px rgba(30,40,60,0.16)",
                  ["--press-bg" as string]:
                    variant === "pro" ? "rgba(18,120,60,1)" : "rgba(22,70,180,1)",
                }}
                className="btn-press btn-press-grad mt-3 flex h-14 w-full items-center justify-center rounded-[12px] px-4 text-lg font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.98] sm:text-xl sm:rounded-[14px] md:ring-1 md:ring-black/5 lg:h-12 lg:text-base"
              >
                {copy.button}
              </button>

              {copy.subnote && (
                <p className="mt-3 text-center text-base text-[#515967] lg:text-sm">
                  {copy.subnote}
                </p>
              )}
            </div>

            {(copy.bold.length > 0 || copy.intro || copy.bullets.length > 0) && (
              <div className="mt-6 lg:mt-5">
                {copy.bold.map((p, i) => (
                  <p
                    key={i}
                    className="mb-3 text-center text-xl font-bold leading-snug text-[#111111] lg:mb-2 lg:text-[18px]"
                  >
                    {p}
                  </p>
                ))}

                {copy.intro && (
                  <p className="mt-4 mb-4 text-justify text-lg leading-relaxed text-[#1F2937] lg:mt-3 lg:mb-3 lg:text-base">
                    {copy.intro.split(/(\*\*[^*]+\*\*)/g).map((seg, k) =>
                      seg.startsWith("**") && seg.endsWith("**") ? (
                        <strong key={k} className="font-bold">
                          {seg.slice(2, -2)}
                        </strong>
                      ) : (
                        <span key={k}>{seg}</span>
                      )
                    )}
                  </p>
                )}

                <div className="space-y-3 lg:space-y-2">
                  {copy.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span
                        className="mt-[7px] inline-block h-[11px] w-[11px] shrink-0 rounded-full"
                        style={{ backgroundColor: variant === "pro" ? "#16A34A" : "#2563EB" }}
                      />
                      <p className="text-[17px] leading-relaxed text-[#1F2937] lg:text-[15px]">
                        {b}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {copy.footnote && (
              <p className="mt-5 whitespace-pre-line text-justify text-lg leading-relaxed text-[#1F2937] lg:mt-4 lg:text-base">
                {copy.footnote}
              </p>
            )}

            {copy.tailIntro && (
              <div className="mt-6 lg:mt-5">
                <p className="text-justify text-lg text-[#1F2937] lg:text-base">
                  {copy.tailIntro}
                </p>

                {copy.tailItems && copy.tailItems.length > 0 && (
                  <div className="mt-3 space-y-2.5 lg:space-y-2">
                    {copy.tailItems.map((it, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span
                          className="mt-[9px] inline-block h-[11px] w-[11px] shrink-0 rounded-full"
                          style={{ backgroundColor: variant === "pro" ? "#16A34A" : "#2563EB" }}
                        />
                        <p className="text-lg leading-relaxed text-[#1F2937] lg:text-base">
                          {it}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {copy.tailOutro && (
                  <p className="mt-5 text-center font-bold leading-snug text-[#111111]">
                    <span className="text-xl lg:text-[18px]">{copy.tailOutro} </span>
                    {copy.tailBig && (
                      <span className="text-xl lg:text-[18px]">{copy.tailBig}</span>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
