"use client";

import { useEffect, useState } from "react";
import Donut from "../../../components/Donut";
import PartScores, { AiScores } from "../../../components/PartScores";
import { useLang } from "@/hooks/useTranslation";
import en from "@/locales/en";
import ru from "@/locales/ru";

type Mode = "quick" | "pro";

interface Factor {
  key: string;
  name: string;
  desc: string;
  status: "Good" | "Moderate" | "Poor";
}

interface CheckItem {
  key: string;
  name?: string;
  value?: string;
}

export default function SuccessPage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode as Mode;
  const interfaceLang = useLang();
  const [pageLang, setPageLang] = useState<"ru" | "en" | null>(null);
  const lang = pageLang || interfaceLang;
  const t = lang === "ru" ? ru.success : en.success;
  const tf = lang === "ru" ? ru.footer : en.footer;

  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [aiScores, setAiScores] = useState<AiScores | null>(null);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [items, setItems] = useState<CheckItem[]>([]);
  const [allItems, setAllItems] = useState<CheckItem[]>([]);
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = currentUrl.searchParams.get("url") || "";
        setUrl(targetUrl);

        const res = await fetch(`/api/result?url=${encodeURIComponent(targetUrl)}&mode=${mode}`);
        const data = await res.json();

        if (!data || !data.score) throw new Error("No valid data");
        // общий скор = новый aiScores.overall (старый data.score как запасной)
        const overallScore = data.aiScores?.overall ?? data.score;
        setScore(overallScore);
        if (data.aiScores) setAiScores(data.aiScores);
        if (data.items) setItems(data.items);
        if (data.allItems) setAllItems(data.allItems);

        // язык отчёта = язык проверенной страницы
        const resultLang: "ru" | "en" = data.pageLang === "ru" ? "ru" : "en";
        setPageLang(resultLang);
        const langT = resultLang === "ru" ? ru.success : en.success;

        const allFactors = langT.factors;

        const scoreStatus: "Good" | "Moderate" | "Poor" =
          overallScore >= 75 ? "Good" : overallScore >= 40 ? "Moderate" : "Poor";

        const mappedFactors = allFactors.map((f) => ({
          ...f,
          status: f.key === "score"
            ? scoreStatus
            : data.results[f.key] || "Moderate",
        }));

        const QUICK_FACTOR_KEYS = [
          "robots_txt", "meta_description", "title_tag", "h2_present",
          "sitemap_xml", "https", "page_speed", "structured_data", "open_graph", "score",
        ];
        const quickFactors = mappedFactors.filter(f => QUICK_FACTOR_KEYS.includes(f.key));
        setFactors(mode === "quick" ? quickFactors : mappedFactors);

        const s = t.summaries;
        if (overallScore >= 75) {
          setSummary(mode === "pro" ? s.highPro : s.highQuick);
        } else if (overallScore >= 40) {
          setSummary(mode === "pro" ? s.mediumPro : s.mediumQuick);
        } else {
          setSummary(mode === "pro" ? s.lowPro : s.lowQuick);
        }
      } catch (err) {
        console.error("Failed to load analysis:", err);
      } finally {
        setLoading(false);
        setTimeout(() => setShowSummary(true), 2000);
      }
    };

    fetchData();
  }, [mode, lang]);

  const date = new Date().toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        {mode === "quick" ? t.quickTitle : t.proTitle}
      </h1>

      {url && (
        <div className="mb-6 text-center text-sm text-neutral-600">
          {t.siteLabel}: {url} &nbsp; | &nbsp; {t.dateLabel}: {date}
        </div>
      )}

      <div className="flex justify-center mb-6">
        <Donut score={score} />
      </div>

      <div
        className="max-w-xl mx-auto rounded-2xl p-6 mb-10 bg-white/60 backdrop-blur-sm shadow-md border border-gray-100 text-justify transition-all duration-1000 ease-in-out"
        style={{ minHeight: "180px", opacity: showSummary ? 1 : 0 }}
      >
        {showSummary && (
          <>
            <p className="text-lg font-semibold text-gray-800 mb-2 text-center">
              {score >= 75 ? t.highReadiness : score >= 35 ? t.mediumReadiness : t.lowReadiness}
            </p>
            <p
              className="text-base text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </>
        )}
      </div>

      {aiScores && showSummary && (
        <PartScores scores={aiScores} t={t.aiScores} />
      )}

      <h2 className="text-lg font-semibold text-gray-800 text-center mt-8 mb-4">
        {t.materialsTitle}
      </h2>

      <MaterialsBlock url={url} mode={mode} items={items} allItems={allItems} lang={lang} />

      <h2 className="text-lg font-semibold text-gray-800 text-center mt-8 mb-6">
        {t.factorsTitle}
      </h2>

      <div className="space-y-4">
        {factors.map((f, i) => (
          <FactorItem key={i} factor={f} lang={lang} />
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center space-y-3">
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full max-w-xs px-6 py-3 rounded-2xl text-white font-medium text-base"
          style={{
            background: mode === "quick"
              ? "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)"
              : "linear-gradient(90deg, #059669 0%, #10b981 100%)",
          }}
        >
          {t.backHome}
        </button>

        <button
          onClick={() => (window.location.href = "/reviews?add=true")}
          className="w-full max-w-xs px-6 py-3 rounded-2xl text-gray-800 font-medium text-base bg-yellow-100 border border-yellow-400 hover:bg-yellow-200 transition-colors flex items-center justify-center space-x-2"
        >
          <span style={{ color: "#facc15", WebkitTextStroke: "0.8px #eab308", fontSize: "20px", lineHeight: "20px" }}>★</span>
          <span>{t.leaveReview}</span>
        </button>
      </div>

      {mode === "pro" && (
        <p className="text-sm text-gray-600 text-center mt-4">{t.pdfSent}</p>
      )}

      <footer className="mt-12 text-center text-xs text-neutral-500 leading-relaxed">
        <p>{tf.copyright}</p>
        <p className="opacity-60">{tf.disclaimer}</p>
      </footer>
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
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm flex items-center">
      <div className="flex items-start space-x-4 flex-1">
        <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 ${borderColors[factor.status]}`} />
        <div>
          <p className="font-semibold">{factor.name}</p>
          <p className="text-sm text-gray-600">{factor.desc}</p>
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
    <div className="flex items-baseline gap-0 min-w-0">
      <span className="text-gray-400 shrink-0" style={{ width: "8rem" }}>{label}:</span>
      <span className="text-gray-800 min-w-0 break-words">{display}</span>
    </div>
  );
}

function MaterialsBlock({ url, mode, items, allItems, lang }: { url: string; mode: Mode; items: CheckItem[]; allItems: CheckItem[]; lang: string }) {
  const t = lang === "ru" ? ru.success : en.success;
  const primaryKeys = mode === "pro" ? PRIMARY_PRO_KEYS : PRIMARY_QUICK_KEYS;

  const lookup = new Map<string, string>();
  for (const item of [...items, ...allItems]) {
    if (item.value) lookup.set(item.key, item.value);
  }

  let hostname = "";
  try { hostname = new URL(url).hostname; } catch {}

  const siteLabel = lang === "ru" ? "Сайт" : "Site";

  return (
    <div className="max-w-xl mx-auto rounded-xl border border-gray-200 bg-gray-50 px-4 sm:px-6 py-4 mb-10 text-xs sm:text-sm text-gray-700 leading-relaxed">
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
      <div className="mt-2 text-gray-400 text-xs">{t.andMore}</div>
    </div>
  );
}
