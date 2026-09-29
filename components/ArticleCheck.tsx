"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { prepareUrl } from "@/lib/urlCheck";

// =============================================================
//  ArticleCheck — блок быстрой проверки в конце статьи.
//  Механика повторяет QuickCheckAccordion (variant "quick"):
//  поле для адреса → кнопка → переход на бесплатный
//  предпросмотр preview/quick с подставленным адресом.
//  Платного раздела не касается. Тексты приходят параметрами
//  (RU/EN подставляются на странице статьи).
// =============================================================

export default function ArticleCheck({
  placeholder,
  button,
  subnoteA,
  subnoteB,
  errorInvalidUrl,
  errorCannotCheck,
}: {
  placeholder: string;
  button: string;
  subnoteA: string;
  subnoteB: string;
  errorInvalidUrl: string;
  errorCannotCheck: string;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const go = () => {
    const res = prepareUrl(url);
    if (!res.ok) {
      setError(res.reason === "blocked" ? errorCannotCheck : errorInvalidUrl);
      return;
    }
    setError(null);
    const base = ""; // экраны проверки теперь внутри этого сайта
    const q = new URLSearchParams({ url: res.url, status: "ok" }).toString();
    window.location.href = `${base}/preview/quick?${q}`;
  };

  return (
    <div className="rounded-[16px] bg-white px-4 py-6 shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:rounded-[22px] sm:px-6 sm:py-7 md:shadow-[0_10px_30px_rgba(13,91,255,0.16),0_2px_8px_rgba(0,0,0,0.08)] md:ring-1 md:ring-black/5">
      <div className="relative">
        <input
          type="url"
          inputMode="url"
          placeholder={placeholder}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") go();
          }}
          className={`h-14 w-full rounded-[12px] border pl-4 pr-12 text-lg outline-none transition-colors sm:text-xl ${
            error
              ? "border-rose-400 focus:ring-2 focus:ring-rose-300"
              : "border-neutral-300 focus:ring-2 focus:ring-blue-500"
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
            "linear-gradient(180deg, #3B82F6 0%, #2563EB 55%, #1D4ED8 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.12), 0 6px 16px rgba(30,40,60,0.16)",
          ["--press-bg" as string]: "rgba(22,70,180,1)",
        }}
        className="btn-press btn-press-grad mt-3 flex h-14 w-full items-center justify-center whitespace-nowrap rounded-[12px] px-4 text-lg font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.98] sm:rounded-[14px] sm:text-xl md:ring-1 md:ring-black/5"
      >
        {button}
      </button>

      <div className="mt-3 flex items-center justify-center gap-2 text-base text-[#515967]">
        <span>{subnoteA}</span>
        <span className="inline-block h-[0.45em] w-[0.45em] shrink-0 rounded-full bg-blue-600" />
        <span>{subnoteB}</span>
      </div>
    </div>
  );
}
