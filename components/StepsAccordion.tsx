"use client";

import { useState, type ReactNode } from "react";
import ScoreRing from "@/components/ScoreRing";
import WorkBars from "@/components/WorkBars";
import { siteConfig } from "@/config/site";

type Block = {
  heading: string;     // заголовок (может быть в 2 строки)
  lead?: string;       // строка под заголовком (размер как у заголовка раньше)
  timing?: string;     // строка под заголовком ("Занимает всего 30 секунд")
  subnote?: string;    // доп. строка под timing ("Даёт два важных документа")
  intro?: string;      // вводная жирная строка перед списком, без маркера
  items: string[];     // плюсы (глагол в начале)
  notes?: string[];    // примечания под плюсами (про 75% и т.п.), каждая — отдельная строка
  price?: string;      // строка цены под пунктами ("Всего $19.99"); рядом рисуется 4 + стаканчик кофе
};

type StepsAccordionCopy = {
  lead: string;            // "Рост продаж начинается с Готовности сайта"
  flow: string;            // цепочка со стрелками
  stepsIntro: string;      // "Логично сделать 3 простых шага"
  steps: string[];         // 3 коротких шага (формат "Шаг N.|текст")
  methodProof: string;     // "Эта методика доказала эффективность на практике"
  blocks: Block[];         // подробные блоки (1, 2)
  quickCheck?: {           // поле быстрой проверки в конце блока 1
    title: string;
    subtitleLeft: string;
    subtitleRight: string;
    placeholder: string;
    button: string;
    errorInvalidUrl: string;
    errorCannotCheck: string;
  };
  proCheck?: {             // поле детальной проверки в конце блока 2
    title: string;
    placeholder: string;
    button: string;
    errorInvalidUrl: string;
    errorCannotCheck: string;
  };
};

const ACCENTS = ["#0D5BFF", "#16A34A", "#0EA5A5"]; // синий, зелёный, морская волна

function BlockIcon({ index }: { index: number }) {
  if (index === 0)
    return (
      <span className="block">
        <ScoreRing score={82} size={120} />
      </span>
    );
  if (index === 1)
    return (
      <span className="-mt-7 block">
        <WorkBars size={120} />
      </span>
    );
  return null;
}

function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-bold">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

function renderTiming(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <span key={i}>
        <br className="sm:hidden" />
        <strong className="whitespace-nowrap font-bold">
          {part.slice(2, -2)}
        </strong>
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const normalizeUrl = (v: string) =>
  v.replace(/^\s*checked\s+website:\s*/i, "").trim();

const isValidUrl = (u: string): boolean => {
  try {
    const url = new URL(u.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const hostname = url.hostname.toLowerCase();
    if (!hostname.includes(".")) return false;
    if (hostname === "localhost") return false;
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return false;
    const parts = hostname.split(".");
    const tld = parts[parts.length - 1];
    if (!/^[a-z]{2,}$/.test(tld)) return false;
    if (parts.some((p) => p.length === 0)) return false;
    return true;
  } catch {
    return false;
  }
};

const BLOCKED_DOMAINS = [
  "example.com", "example.org", "example.net",
  "test.com", "test.org", "127.0.0.1", "0.0.0.0",
  "dummy.com", "invalid", "example.local", "test.local",
];

type QuickCopy = NonNullable<StepsAccordionCopy["quickCheck"]>;
type ProCopy = NonNullable<StepsAccordionCopy["proCheck"]>;

function CheckField({
  copy,
  variant,
}: {
  copy: QuickCopy | ProCopy;
  variant: "quick" | "pro";
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const go = () => {
    let u = normalizeUrl(url);
    if (!u.startsWith("http://") && !u.startsWith("https://")) {
      u = "https://" + u;
    }
    if (!isValidUrl(u)) {
      setError(copy.errorInvalidUrl);
      return;
    }
    const hostname = new URL(u).hostname.toLowerCase();
    if (BLOCKED_DOMAINS.includes(hostname)) {
      setError(copy.errorCannotCheck);
      return;
    }
    setError(null);
    const base = siteConfig.funnel.aiSignalMax.url.replace(/\/+$/, "");
    const path = variant === "pro" ? "preview/pro" : "preview/quick";
    const q = new URLSearchParams({ url: u, status: "ok" }).toString();
    window.location.href = `${base}/${path}?${q}`;
  };

  const focusRing =
    variant === "pro" ? "focus:ring-green-500" : "focus:ring-blue-500";
  const buttonColor =
    variant === "pro"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="mt-5">
      <h4 className="whitespace-pre-line text-center text-lg font-bold leading-tight text-[#111111] sm:text-xl lg:text-lg">
        {copy.title}
      </h4>
      {variant === "quick" && "subtitleLeft" in copy && (
        <p className="mt-1 flex items-center justify-center gap-2 text-lg font-normal leading-snug text-[#4A4A4A] sm:text-xl lg:text-base">
          <span>{copy.subtitleLeft}</span>
          <span className="inline-block h-[0.45em] w-[0.45em] shrink-0 rounded-full bg-blue-600" />
          <span>{copy.subtitleRight}</span>
        </p>
      )}
      <input
        type="url"
        inputMode="url"
        placeholder={copy.placeholder}
        value={url}
        onChange={(e) => {
          setUrl(normalizeUrl(e.target.value));
          if (error) setError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") go();
        }}
        className={`mt-3 h-14 w-full rounded-[12px] border px-4 text-lg outline-none transition-colors sm:text-xl lg:h-12 lg:text-base ${
          error
            ? "border-rose-400 focus:ring-2 focus:ring-rose-300"
            : `border-neutral-300 focus:ring-2 ${focusRing}`
        }`}
      />
      {error && <p className="mt-2 text-base text-rose-600">{error}</p>}
      <button
        type="button"
        onClick={go}
        className={`mt-3 flex h-14 w-full items-center justify-center rounded-[12px] px-4 text-lg font-semibold text-white transition-all duration-200 ease-out active:scale-[0.98] sm:text-xl lg:h-12 lg:text-base ${buttonColor}`}
      >
        {copy.button}
      </button>
    </div>
  );
}

export default function StepsAccordion({
  label,
  copy,
}: {
  label: ReactNode;
  copy: StepsAccordionCopy;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Кнопка-заголовок — вид идентичен оригинальной кнопке subhead1 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          backgroundColor: "rgba(59,130,246,0.185)",
          ["--press-bg" as string]: "rgba(50,110,209,0.42)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 6px 16px rgba(30,40,60,0.12)",
        }}
        className="btn-press relative flex w-full items-center justify-center rounded-[14px] px-12 py-3 text-center text-lg font-semibold leading-none text-[#111111] transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] sm:rounded-[22px] sm:text-2xl md:rounded-[16px] md:text-lg md:ring-1 md:ring-black/5"
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

      {/* Раскрытая плашка — тот же материал, что у кнопок */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          open
            ? "mt-2.5 grid-rows-[1fr] opacity-100 sm:mt-[14px]"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-6 py-1 text-left">
            {/* Плашка 1 — вступление */}
            <div className="rounded-[14px] bg-white px-3 py-5 shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:rounded-[22px] sm:px-5 sm:py-6 md:shadow-[0_10px_30px_rgba(13,91,255,0.16),0_2px_8px_rgba(0,0,0,0.08)] md:ring-1 md:ring-black/5">
            {/* Лид + цепочка */}
            <div>
              <p className="text-center text-2xl font-semibold leading-tight text-[#111111] sm:text-3xl lg:text-2xl">
                {copy.lead}
              </p>
            </div>
            <p className="mt-4 whitespace-pre-line text-center text-xl font-bold leading-snug text-[#0940B3] sm:text-2xl lg:text-lg">
              {copy.flow}
            </p>

            {/* Вступление к шагам */}
            <p className="mt-6 text-center text-xl font-semibold leading-snug text-[#111111] sm:text-2xl lg:text-lg">
              {copy.stepsIntro}
            </p>
            <div className="mt-6 space-y-2.5">
              {copy.steps.map((s, i) => {
                const [label, rest] = s.split("|");
                return (
                  <p key={i} className="text-lg leading-relaxed text-neutral-700 sm:text-xl lg:text-base">
                    <span className="mr-2 inline-block rounded-md bg-[#EAF0F7] px-2 py-0.5 text-base font-semibold text-[#0940B3] sm:text-lg lg:text-sm">
                      {label}
                    </span>
                    {rest}
                  </p>
                );
              })}
            </div>

            {/* Доказательство методики */}
            <div className="mt-5 rounded-[14px] bg-gradient-to-b from-[#FBFCFE] to-[#EEF1F6] py-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_4px_12px_rgba(0,0,0,0.06)] sm:rounded-[18px] sm:py-5">
              <p className="whitespace-pre-line text-center text-xl font-bold leading-snug text-[#111111] sm:text-2xl lg:text-lg">
                {copy.methodProof}
              </p>
            </div>
            </div>
            {/* конец плашки 1 (вступление) */}

            {/* Плашки блоков 1 / 2 */}
            {copy.blocks.map((block, i) => (
              <div
                key={i}
                className={`rounded-[14px] bg-white px-3 py-5 shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:rounded-[22px] sm:px-5 sm:py-6 md:shadow-[0_10px_30px_rgba(13,91,255,0.16),0_2px_8px_rgba(0,0,0,0.08)] md:ring-1 md:ring-black/5 ${
                  i === 1 ? "mt-[88px]" : ""
                }`}
              >
                  {/* Заголовок на всю ширину (размер как methodProof) + строка lead под ним */}
                  <h3 className="whitespace-pre-line text-center text-2xl font-bold leading-tight text-[#111111] sm:text-3xl lg:text-xl">
                    {block.heading}
                  </h3>
                  {block.lead && (
                    <p className="mt-2 text-center text-[19px] font-normal leading-snug text-[#4A4A4A] sm:text-2xl lg:text-xl">
                      {block.lead}
                    </p>
                  )}
                  {block.timing && (
                    <p className="mt-1 text-center font-normal leading-snug text-[#4A4A4A] text-lg sm:text-xl lg:text-base">
                      {renderTiming(block.timing)}
                    </p>
                  )}

                  {/* плюсы */}
                  {block.intro && (
                    <p
                      className={`mt-4 font-bold leading-snug text-[#111111] ${
                        i === 0 ? "text-lg sm:text-xl lg:text-base" : "text-base sm:text-lg lg:text-base"
                      }`}
                    >
                      {block.intro}
                    </p>
                  )}
                  <ul className="mt-4 space-y-2">
                    {block.items.map((it, j) => (
                      <li
                        key={j}
                        className={`flex gap-3 leading-relaxed text-neutral-800 ${
                          i === 0 ? "text-lg sm:text-xl lg:text-base" : "text-base sm:text-lg lg:text-base"
                        }`}
                      >
                        <span
                          className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                          style={{ backgroundColor: ACCENTS[i] }}
                        />
                        <span>{renderBold(it)}</span>
                      </li>
                    ))}
                  </ul>

                  {/* примечания про проценты + круг справа */}
                  {block.notes && block.notes.length > 0 && (
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1.5">
                      {block.notes.map((n, k) => {
                        const segs = n.split("80%");
                        const color = k === 0 ? "#107536" : "#B33333";
                        return (
                          <p
                            key={k}
                            className={`leading-relaxed text-neutral-700 ${
                              i === 0 ? "text-lg sm:text-xl lg:text-base" : "text-base sm:text-lg lg:text-base"
                            }`}
                          >
                            {segs.map((seg, s) => (
                              <span key={s}>
                                {renderBold(seg)}
                                {s < segs.length - 1 && (
                                  <span
                                    className="mx-0.5 align-baseline text-[1.15em] font-bold"
                                    style={{ color }}
                                  >
                                    80%
                                  </span>
                                )}
                              </span>
                            ))}
                          </p>
                        );
                      })}
                      </div>
                      <div className="shrink-0 self-center">
                        <BlockIcon index={i} />
                      </div>
                    </div>
                  )}

                  {/* цена + образ "4 × кофе" — отдельной строкой под пунктами */}
                  {block.price && (
                    <div className="mt-3 pl-[26px]">
                      <p className="flex items-center gap-2 text-xl font-bold leading-none text-[#111111] sm:text-2xl">
                        <span>{block.price}</span>
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

                  {/* поле детальной проверки — только в блоке 2 */}
                  {i === 1 && copy.proCheck && (
                    <CheckField copy={copy.proCheck} variant="pro" />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
