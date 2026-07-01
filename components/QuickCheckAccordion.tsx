"use client";

import { useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { prepareUrl } from "@/lib/urlCheck";

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
  bold: string[];
  intro: string;
  bullets: string[];
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
    const base = siteConfig.funnel.aiSignalMax.url.replace(/\/+$/, "");
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
            {copy.price && (
              <div className="mb-5 flex items-center justify-center">
                <p className="flex items-center gap-2 text-xl font-bold leading-none text-[#111111] sm:text-2xl">
                  <span>{copy.price}</span>
                  <span className="text-neutral-400">≈</span>
                  <span>4</span>
                  <span className="text-neutral-400">×</span>
                  <img
                    src="/coffee-cup.png"
                    alt="кофе"
                    className="inline-block h-[52px] w-auto shrink-0 align-middle"
                  />
                </p>
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
                className={`mt-3 flex h-14 w-full items-center justify-center rounded-[12px] px-4 text-lg font-semibold text-white transition-all duration-200 ease-out active:scale-[0.98] sm:text-xl lg:h-12 lg:text-base ${
                  variant === "pro"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {copy.button}
              </button>

              {copy.subnote && (
                <p className="mt-3 text-center text-base text-[#515967] lg:text-sm">
                  {copy.subnote}
                </p>
              )}
            </div>

            <div className="mt-6 lg:mt-5">
              {copy.bold.map((p, i) => (
                <p
                  key={i}
                  className="mb-3 text-center text-xl font-bold leading-snug text-[#111111] lg:mb-2 lg:text-[18px]"
                >
                  {p}
                </p>
              ))}

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

            {copy.footnote && (
              <p className="mt-5 whitespace-pre-line text-justify text-lg leading-relaxed text-[#1F2937] lg:mt-4 lg:text-base">
                {copy.footnote}
              </p>
            )}

            {copy.tailIntro && (
              <div className="mt-6 lg:mt-5">
                <p className="text-lg font-bold text-[#1F2937] lg:text-base">
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
                  <p className="mt-4 text-center font-bold leading-snug text-[#111111]">
                    <span className="text-lg lg:text-base">{copy.tailOutro} </span>
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
