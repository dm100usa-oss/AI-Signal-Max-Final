"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Donut from "../../../components/Donut";
import PartScores, { AiScores } from "../../../components/PartScores";
import QuickBars from "../../../components/QuickBars";
import { paramShare, shareToStatus } from "@/lib/paramMapping";
import type { FactorKey } from "@/lib/partScores";
import { useLang } from "@/hooks/useTranslation";
import en from "@/locales/en";
import ru from "@/locales/ru";

type Mode = "quick" | "express" | "pro";

interface Factor {
  key: string;
  name?: string;
  desc?: string;
  status: "Good" | "Moderate" | "Poor";
}

interface CheckItem {
  key: string;
  name?: string;
  value?: string;
}

// пороги: сильная сторона >= 75, слабая < 50
const STRONG = 75;
const WEAK = 50;
// сколько сильных/слабых сторон показываем по уровню [сильных, слабых]
function sideCounts(score: number): [number, number] {
  if (score >= 85) return [5, 2];
  if (score >= 75) return [5, 2];
  if (score >= 61) return [4, 3];
  if (score >= 41) return [3, 3];
  if (score >= 21) return [2, 4];
  return [2, 5];
}
// порядок важности параметров для отбора сторон
const PARAM_PRIORITY = [
  "robots_txt", "meta_description", "theme", "title_tag", "structured_data",
  "sitemap_xml", "h2_present", "page_speed", "https", "meta_robots",
  "canonical", "mobile_friendly", "alt_attributes", "page_404",
];

// временные/тестовые адреса, которые ИИ почти не рекомендует
function isTempDomain(rawUrl: string): boolean {
  let host = "";
  try { host = new URL(rawUrl).hostname.toLowerCase(); } catch { return false; }
  const TEMP = [
    ".vercel.app", ".netlify.app", ".github.io", ".pages.dev",
    ".web.app", ".firebaseapp.com", ".onrender.com", ".herokuapp.com",
    ".surge.sh", ".repl.co", ".glitch.me", ".webflow.io", ".wixsite.com",
  ];
  return TEMP.some((suf) => host.endsWith(suf));
}

export default function SuccessPage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode as Mode;
  const isQuick = mode === "quick";
  const router = useRouter();
  const interfaceLang = useLang();
  const lang = interfaceLang;
  const t = lang === "ru" ? ru.success : en.success;
  const tf = lang === "ru" ? ru.footer : en.footer;

  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [aiScores, setAiScores] = useState<AiScores | null>(null);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [items, setItems] = useState<CheckItem[]>([]);
  const [allItems, setAllItems] = useState<CheckItem[]>([]);
  const [url, setUrl] = useState("");
  const [detailUrl, setDetailUrl] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [showParams, setShowParams] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = currentUrl.searchParams.get("url") || "";
        setUrl(targetUrl);
        setDetailUrl(targetUrl);

        const res = await fetch(`/api/result?url=${encodeURIComponent(targetUrl)}&mode=${mode}`);
        const data = await res.json();

        if (!data || !data.aiScores?.overall) throw new Error("No valid data");
        const overallScore = data.aiScores.overall;
        setScore(overallScore);
        if (data.aiScores) setAiScores(data.aiScores);
        if (data.items) setItems(data.items);
        if (data.allItems) setAllItems(data.allItems);

        // сохраняем только ключ и статус; названия берём из текущего языка при отрисовке
        const allFactors = (interfaceLang === "ru" ? ru.success : en.success).factors;
        const scoreStatus: "Good" | "Moderate" | "Poor" =
          overallScore >= 75 ? "Good" : overallScore >= 40 ? "Moderate" : "Poor";

        // Источник статуса — новая система (AI Scores). Названия параметров не меняются.
        const fScores = (data.factorScores || {}) as Partial<Record<FactorKey, number>>;
        const naSet = new Set<FactorKey>((data.notApplicable || []) as FactorKey[]);
        const mappedFactors = allFactors.map((f) => {
          if (f.key === "score") return { key: f.key, status: scoreStatus };
          const share = paramShare(f.key, fScores, naSet);
          // если параметр не сопоставлен с новой системой — оставляем старый статус как запас
          const status = share === null
            ? ((data.results[f.key] || "Moderate") as "Good" | "Moderate" | "Poor")
            : shareToStatus(share);
          return { key: f.key, status };
        });

        const QUICK_FACTOR_KEYS = [
          "robots_txt", "meta_description", "title_tag", "h2_present",
          "sitemap_xml", "https", "page_speed", "structured_data", "open_graph", "score",
        ];
        // Пока показываем полный набор факторов во всех режимах (как на детальной).
        // Завтра уберём лишнее для quick/express.
        setFactors(mappedFactors);
      } catch (err) {
        console.error("Failed to load analysis:", err);
        router.push("/scan-failed");
        return;
      } finally {
        setLoading(false);
        setTimeout(() => setShowSummary(true), 1500);
      }
    };
    fetchData();
  }, [mode, lang]);

  const date = new Date().toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  // выбор уровня по баллу (6 уровней)
  const level =
    score >= 85 ? t.levels.excellent
    : score >= 75 ? t.levels.veryGood
    : score >= 61 ? t.levels.good
    : score >= 41 ? t.levels.medium
    : score >= 21 ? t.levels.low
    : t.levels.veryLow;

  // сильные и слабые стороны из проверенных параметров (по статусу)
  const [nStrong, nWeak] = sideCounts(score);
  const statusByKey = new Map(factors.map((f) => [f.key, f.status]));

  // сортируем ключи по важности
  const orderedKeys = PARAM_PRIORITY.filter((k) => statusByKey.has(k));

  const strongList = orderedKeys
    .filter((k) => statusByKey.get(k) === "Good")
    .map((k) => (t.paramStrengths as Record<string, string>)[k])
    .filter(Boolean);

  const weakList = orderedKeys
    .filter((k) => statusByKey.get(k) === "Poor")
    .map((k) => (t.paramWeaknesses as Record<string, string>)[k])
    .filter(Boolean);

  // добираем слабыми "Moderate", если явных Poor не хватает до нужного числа
  if (weakList.length < nWeak) {
    const extra = orderedKeys
      .filter((k) => statusByKey.get(k) === "Moderate")
      .map((k) => (t.paramWeaknesses as Record<string, string>)[k])
      .filter(Boolean);
    for (const w of extra) {
      if (weakList.length >= nWeak) break;
      weakList.push(w);
    }
  }

  const strengths = strongList.slice(0, nStrong);
  const weaknesses = weakList.slice(0, nWeak);

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center text-gray-600">
        <p>{t.loading}</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold text-center mb-2">
        {mode === "pro" ? t.proTitle : t.quickTitle}
      </h1>

      {url && (
        <div className="mb-4 text-center text-sm text-neutral-600">
          {t.siteLabel}: {url} &nbsp; | &nbsp; {t.dateLabel}: {date}
        </div>
      )}

      <div className="flex justify-center mb-8">
        <Donut score={score} />
      </div>

      <div
        className="max-w-xl mx-auto rounded-2xl p-2.5 sm:p-6 mb-8 bg-white/60 backdrop-blur-sm shadow-md border border-gray-100 transition-all duration-1000 ease-in-out"
        style={{ opacity: showSummary ? 1 : 0 }}
      >
        {showSummary && (() => {
          const dotIdx = level.title.indexOf(".");
          const firstPart = dotIdx > -1 ? level.title.slice(0, dotIdx) : level.title;
          const restPart = dotIdx > -1 ? level.title.slice(dotIdx + 1).trim() : "";
          return (
            <>
              <p className="mb-3 text-center">
                <span className="block sm:inline text-2xl sm:text-lg font-bold text-gray-800">
                  {firstPart}<span className="hidden sm:inline">{restPart ? "." : ""}</span>
                </span>
                {restPart && (
                  <span className="block sm:inline text-lg font-semibold text-gray-800 sm:ml-1">
                    {restPart}
                  </span>
                )}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed text-justify">{level.text}</p>
              <p className="mt-8 mb-1 text-xl font-semibold text-gray-800 text-center">{t.whyResultTitle}</p>
              <p className="text-lg text-gray-700 leading-relaxed text-justify">{level.why}</p>
            </>
          );
        })()}
      </div>

      {/* QUICK: полосы по 4 направлениям без цифр */}
      {showSummary && isQuick && aiScores && (
        <QuickBars
          scores={aiScores}
          title={t.quickBarsTitle}
          labels={{
            home: t.aiScores.home,
            content: t.aiScores.content,
            tech: t.aiScores.tech,
            authority: t.aiScores.authority,
          }}
          statusText={{
            good: t.statusGood,
            moderate: t.statusModerate,
            poor: t.statusPoor,
          }}
        />
      )}

      {/* Предупреждение о временном домене */}
      {showSummary && url && isTempDomain(url) && (
        <div className="max-w-xl mx-auto mb-6 rounded-xl px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm text-center">
          {t.tempDomainWarning}
        </div>
      )}

      {/* Четыре направления (AI Scores) — не показываем в quick */}
      {showSummary && !isQuick && aiScores && (
        <PartScores scores={aiScores} t={t.aiScores} />
      )}

      {/* Сильные и слабые стороны — не в quick */}
      {showSummary && !isQuick && (strengths.length > 0 || weaknesses.length > 0) && (
        <div className="max-w-xl mx-auto mb-8 space-y-8 mt-10">
          {strengths.length > 0 && (
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                {t.strengthsTitle}
                <span className="ml-2 inline-block w-0 h-0" style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "10px solid #16a34a" }} />
              </p>
              <ul className="space-y-2">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-4 h-4 flex-shrink-0 rounded-full border-2 border-green-500" />
                    <span className="text-lg text-gray-700">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {weaknesses.length > 0 && (
            <div className="mt-8">
              <p className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                {t.weaknessesTitle}
                <span className="ml-2 inline-block w-0 h-0" style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "10px solid #dc2626" }} />
              </p>
              <ul className="space-y-2">
                {weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-4 h-4 flex-shrink-0 rounded-full border-2 border-red-500" />
                    <span className="text-lg text-gray-700">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Блок ChatGPT — не в quick */}
      {showSummary && !isQuick && (
        <div className="max-w-xl mx-auto mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <p className="text-lg text-gray-600 mb-1">{t.chatgpt.lead}</p>
          <p className="text-lg font-medium text-gray-800 mb-4">«{t.chatgpt.question}»</p>
          <p className="text-lg font-semibold text-gray-800 mb-2">{t.chatgpt.answerTitle}</p>
          <ol className="list-decimal list-inside space-y-1 mb-4 text-lg text-gray-700">
            {t.chatgpt.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ol>
          <p className="text-lg font-semibold text-gray-800 mb-1">{t.chatgpt.explanationTitle}</p>
          <p className="text-lg text-gray-700 text-justify">{t.chatgpt.explanation}</p>
        </div>
      )}

      {/* Что это значит — не в quick */}
      {showSummary && !isQuick && (
        <div className="max-w-xl mx-auto mb-8">
          <p className="text-lg font-semibold text-gray-800 mb-2">{t.meaningTitle}</p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
            {score >= 85 ? t.meaningIntro.excellent
              : score >= 75 ? t.meaningIntro.veryGood
              : score >= 61 ? t.meaningIntro.good
              : score >= 41 ? t.meaningIntro.medium
              : score >= 21 ? t.meaningIntro.low
              : t.meaningIntro.veryLow}
          </p>
          {t.meaningBody.map((para, i) => (
            <p
              key={i}
              className="text-lg text-gray-700 leading-relaxed mb-4 text-justify"
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}
        </div>
      )}

      {/* Разворачиваемые параметры — не в quick */}
      {showSummary && !isQuick && (
        <div className="max-w-xl mx-auto mb-8">
          <button
            onClick={() => setShowParams((v) => !v)}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-teal-300 font-medium text-teal-900 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] md:ring-1 md:ring-black/5"
            style={{ backgroundColor: "#CCF2EC", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.12), 0 6px 16px rgba(30,40,60,0.16)" }}
          >
            <span>{t.paramsToggle}</span>
            <span
              className="inline-block w-0 h-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                ...(showParams
                  ? { borderBottom: "9px solid #0F766E" }
                  : { borderTop: "9px solid #0F766E" }),
              }}
            />
          </button>
          {showParams && (
            <div className="mt-4 space-y-3">
              <MaterialsBlock url={url} mode={mode} items={items} allItems={allItems} lang={lang} />
              {factors.map((f, i) => (
                <FactorItem key={i} factor={f} lang={lang} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* QUICK: блок «Быстрая проверка завершена» + переход к детальной */}
      {showSummary && isQuick && (
        <div className="max-w-xl mx-auto mb-6 rounded-2xl p-4 sm:p-6 bg-white/60 backdrop-blur-sm shadow-md border border-gray-100">
          <p className="text-xl font-semibold text-gray-800 text-center mb-4">{t.quickDoneTitle}</p>

          <ul className="space-y-2 mb-5">
            {[t.quickDoneItem1, t.quickDoneItem2, t.quickDoneItem3].map((it, i) => (
              <li key={i} className="flex gap-3 leading-relaxed">
                <span
                  className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                  style={{ backgroundColor: "#2563EB" }}
                />
                <span className="text-lg text-gray-700">{it}</span>
              </li>
            ))}
          </ul>

          <p className="text-xl font-semibold text-gray-800 text-center mb-2">{t.quickObjectTitle}</p>
          <div className="mb-5">
            <MaterialsBlock url={url} mode={mode} items={items} allItems={allItems} lang={lang} />
          </div>

          <p className="text-xl font-semibold text-gray-800 text-center mb-2">{t.quickDetailLead}</p>
          <ul className="space-y-2 mb-3">
            {[t.quickDetailItem1, t.quickDetailItem2, t.quickDetailItem3].map((it, i) => (
              <li key={i} className="flex gap-3 leading-relaxed">
                <span
                  className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                  style={{ backgroundColor: "#16a34a" }}
                />
                <span className="text-lg text-gray-700">{it}</span>
              </li>
            ))}
          </ul>
          <p
            className="text-xl text-gray-700 leading-relaxed mb-4 text-justify"
            dangerouslySetInnerHTML={{ __html: t.quickDetailAfter }}
          />

          <p
            className="text-lg text-gray-700 leading-relaxed mb-2 text-justify"
            dangerouslySetInnerHTML={{ __html: t.quickDoneP4 }}
          />
          <div className="flex items-baseline justify-center gap-2.5 mb-5">
            <span className="text-xl font-bold text-amber-600">{t.quickPriceNew}</span>
            <span className="text-xl text-gray-400 line-through decoration-red-500">{t.quickPriceOld}</span>
          </div>

          <button
            onClick={() => {
              const target = (detailUrl || url).trim();
              window.location.href = `/preview/pro?url=${encodeURIComponent(target)}&status=ok`;
            }}
            className="w-full px-6 py-3 rounded-2xl text-white font-semibold text-base transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] md:ring-1 md:ring-black/5"
            style={{ backgroundImage: "linear-gradient(180deg, #22c55e 0%, #16a34a 55%, #12813c 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.12), 0 6px 16px rgba(30,40,60,0.16)" }}
          >
            {t.quickDoneButton}
          </button>
        </div>
      )}

      {/* Кнопка заявки — не в quick */}
      {showSummary && !isQuick && (
        <div className="max-w-xl mx-auto mb-6">
          <p className="text-lg text-gray-600 text-center mb-3">{t.requestLead}</p>
          <button
            onClick={() => (window.location.href = `https://ai-answers-rank.vercel.app/${lang}/services`)}
            className="w-full px-6 py-3 rounded-2xl text-white font-semibold text-base transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] md:ring-1 md:ring-black/5"
            style={{ backgroundImage: "linear-gradient(180deg, #2E6AA6 0%, #1a4a7a 55%, #143a61 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.12), 0 6px 16px rgba(30,40,60,0.16)" }}
          >
            {t.requestButton}
          </button>
        </div>
      )}

      {showSummary && (
        <div className="max-w-xl mx-auto mb-6 mt-20">
          <button
            onClick={() => (window.location.href = "/reviews?add=true")}
            style={{ backgroundImage: "linear-gradient(180deg, #fef9c3 0%, #fde68a 55%, #fcd34d 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 6px rgba(30,40,60,0.12), 0 6px 16px rgba(30,40,60,0.16)" }}
            className="w-full px-6 py-3 rounded-2xl text-gray-800 font-medium text-base border border-yellow-400 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] md:ring-1 md:ring-black/5 flex items-center justify-center space-x-2"
          >
            <span style={{ color: "#facc15", WebkitTextStroke: "0.8px #eab308", fontSize: "20px", lineHeight: "20px" }}>★</span>
            <span>{t.leaveReview}</span>
          </button>
        </div>
      )}

      {showSummary && (
        <div className="max-w-xl mx-auto mb-6">
          <button
            onClick={() => (window.location.href = "/")}
            style={{ backgroundImage: "linear-gradient(180deg, #2E6AA6 0%, #1a4a7a 55%, #143a61 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.12), 0 6px 16px rgba(30,40,60,0.16)" }}
            className="w-full px-6 py-3 rounded-2xl text-white font-semibold text-base transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] md:ring-1 md:ring-black/5"
          >
            {t.backHome}
          </button>
        </div>
      )}

      {showSummary && (
        <footer className="mt-12 text-center text-xs text-neutral-500 leading-relaxed">
          <p>{tf.copyright}</p>
          <p className="opacity-60">{tf.disclaimer}</p>
        </footer>
      )}
    </main>
  );
}

function StatusText({ status, lang }: { status: Factor["status"]; lang: string }) {
  const t = lang === "ru" ? ru.success : en.success;
  const colors = { Good: "text-green-600", Moderate: "text-yellow-600", Poor: "text-red-600" };
  return (
    <span className={`text-base font-semibold ${colors[status]}`}>
      {status === "Good" ? t.statusGood : status === "Moderate" ? t.statusModerate : t.statusPoor}
    </span>
  );
}

function FactorItem({ factor, lang }: { factor: Factor; lang: string }) {
  const borderColors = { Good: "border-green-500", Moderate: "border-yellow-500", Poor: "border-red-500" };
  const t = lang === "ru" ? ru.success : en.success;
  const def = t.factors.find((f) => f.key === factor.key);
  const name = def?.name ?? factor.name ?? "";
  const desc = def?.desc ?? factor.desc ?? "";
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm flex items-center">
      <div className="flex items-start space-x-4 flex-1">
        <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 ${borderColors[factor.status]}`} />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-600">{desc}</p>
        </div>
      </div>
      <div className="w-24 text-right">
        <StatusText status={factor.status} lang={lang} />
      </div>
    </div>
  );
}

const PRIMARY_QUICK_KEYS = ["title_tag", "h1_present", "meta_description"];
const PRIMARY_PRO_KEYS = ["title_tag", "meta_description", "h2_present", "site_language", "mobile_friendly", "robots_txt"];

const RAW_VALUE_KEYS = new Set([
  "https", "page_speed", "robots_txt", "sitemap_xml", "sitemap_lastmod",
  "structured_data", "open_graph", "canonical", "contacts",
  "site_language", "mobile_friendly", "x_robots_tag", "meta_robots", "alt_attributes", "page_404",
]);

function quoted(value: string, lang: string): string {
  const missing = ["Not found", "Not detected", "Не найден", "Не найдено", "Не обнаружен"];
  if (!value || missing.includes(value)) return value;
  return lang === "ru" ? `«${value}»` : `"${value}"`;
}

function MaterialRow({ label, value, withQuotes, lang }: { label: string; value: string; withQuotes: boolean; lang: string }) {
  const display = withQuotes ? quoted(value, lang) : value;
  return (
    <div className="flex items-baseline gap-2 min-w-0">
      <span className="text-gray-400 shrink-0 basis-1/3 break-words">{label}:</span>
      <span className="text-gray-800 min-w-0 basis-2/3 break-words">{display}</span>
    </div>
  );
}

function MaterialsBlock({ url, mode, items, allItems, lang }: { url: string; mode: Mode; items: CheckItem[]; allItems: CheckItem[]; lang: string }) {
  const t = lang === "ru" ? ru.success : en.success;
  // Пока во всех режимах — полный набор (как на детальной). Завтра уберём лишнее.
  const primaryKeys = PRIMARY_PRO_KEYS;

  const lookup = new Map<string, string>();
  for (const item of [...items, ...allItems]) {
    if (item.value) lookup.set(item.key, item.value);
  }

  let hostname = "";
  try { hostname = new URL(url).hostname; } catch {}

  const siteLabel = lang === "ru" ? "Сайт" : "Site";

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 sm:px-6 py-4 text-sm sm:text-base text-gray-700 leading-relaxed">
      <MaterialRow label={siteLabel} value={hostname} withQuotes={false} lang={lang} />
      {primaryKeys.map((key) => {
        const value = lookup.get(key);
        if (!value) return null;
        const label = (t.labels as Record<string, string>)[key] || key;
        const withQuotes = !RAW_VALUE_KEYS.has(key);
        return (
          <div className="mt-1" key={key}>
            <MaterialRow label={label} value={value} withQuotes={withQuotes} lang={lang} />
          </div>
        );
      })}
      <div className="mt-2 text-gray-400 text-sm">{t.andMore}</div>
    </div>
  );
}
