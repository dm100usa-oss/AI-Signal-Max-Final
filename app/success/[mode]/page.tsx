"use client";

import { useSearchParams } from "next/navigation";
import Donut from "../../../components/Donut";

type Mode = "quick" | "pro";

interface Factor {
  key: string;
  name: string;
  desc: string;
  status: "Good" | "Moderate" | "Poor";
}

export default function SuccessPage({ params }: { params: { mode: Mode } }) {
  const mode = params.mode as Mode;
  const searchParams = useSearchParams();

  const score = Number(searchParams.get("score") || 0);
  const url = (searchParams.get("url") || "").trim();
  const rawResults = searchParams.get("results");
  let results: Record<string, "Good" | "Moderate" | "Poor"> = {};

  try {
    if (rawResults) results = JSON.parse(decodeURIComponent(rawResults));
  } catch {
    results = {};
  }

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const summary =
    score >= 80
      ? "Your site is well visible for AI platforms. Most parameters are configured correctly."
      : score >= 40
      ? "Your site is partially visible for AI platforms. Some parameters require improvement."
      : "Your site is poorly visible for AI platforms. Most parameters are misconfigured, which limits visibility.";

  const allFactors: Omit<Factor, "status">[] = [
    { key: "robots", name: "Robots.txt", desc: "Controls whether AI platforms can see your site. If misconfigured and blocking access, your entire website may disappear from AI answers." },
    { key: "sitemap", name: "Sitemap.xml", desc: "Tells AI which pages exist and should be indexed. If it’s missing or set up incorrectly, important parts of your site remain invisible." },
    { key: "xrobots", name: "X-Robots-Tag", desc: "A server-side setting that tells AI whether your pages can appear in results. If disallowed, those pages will not show up in AI answers." },
    { key: "metarobots", name: "Meta Robots", desc: "A tag inside the page that controls whether AI can display it. If misconfigured with a block, the page disappears from AI results." },
    { key: "canonical", name: "Canonical", desc: "Tells AI which page is the main version. Without it, duplicate pages compete, and AI may show the wrong one." },
    { key: "title", name: "Title Tag", desc: "The title is the first thing users see in results. If missing or too generic, AI may show random text." },
    { key: "metadesc", name: "Meta Description", desc: "A short description under the title that explains why users should click. If missing or vague, AI inserts random text." },
    { key: "opengraph", name: "Open Graph Tags", desc: "Special tags that make your site links look good in AI answers and social media. Without them, users see random text or cropped images." },
    { key: "h1", name: "H1 Headings", desc: "The main heading of a page tells AI and visitors what it’s about. If missing or duplicated, AI cannot clearly understand the content." },
    { key: "schema", name: "Structured Data (Schema Markup)", desc: "Special markup (JSON-LD) that explains what’s on your site: product, service, article, or company. Without it, AI doesn’t fully understand your content." },
    { key: "mobile", name: "Mobile-Friendly", desc: "If the design breaks on mobile or buttons don’t work, AI considers it inconvenient." },
    { key: "https", name: "HTTPS Security", desc: "A secure protocol that ensures safe connections. Sites without HTTPS are flagged as unsafe." },
    { key: "alt", name: "Alt Attributes", desc: "Captions for images that help AI interpret visuals. Without alt texts, images remain invisible." },
    { key: "favicon", name: "Favicon", desc: "A small site icon shown in browsers and AI previews. Without it, your site looks unfinished." },
    { key: "page404", name: "Custom 404 Page", desc: "An error page that tells AI a resource doesn’t exist. If misconfigured, AI may treat broken links as valid." },
  ];

  const keyMap: Record<string, string> = {
    robots: "robots",
    sitemap: "sitemap",
    xrobots: "x_robots_tag",
    metarobots: "meta_robots",
    canonical: "canonical",
    title: "title_tag",
    metadesc: "meta_description",
    opengraph: "open_graph",
    h1: "h1_present",
    schema: "structured_data",
    mobile: "mobile_friendly",
    https: "https",
    alt: "alt_attributes",
    favicon: "favicon",
    page404: "page_404",
  };

  const factors: Factor[] = allFactors.map((f) => {
    const key = keyMap[f.key] || f.key;
    return {
      ...f,
      status: results[key] || "Moderate",
    };
  });

  const displayFactors = mode === "quick" ? factors.slice(0, 5) : factors;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold text-center mb-2">
        {mode === "quick"
          ? "Website visibility results"
          : "Full website visibility audit"}
      </h1>

      {url && (
        <div className="mb-6 text-center text-sm text-neutral-600">
          Website: {url} &nbsp; | &nbsp; Date: {date}
        </div>
      )}

      <div className="flex justify-center mb-6">
        <Donut score={score} />
      </div>

      <div className="max-w-xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 text-center mb-10">
        <p className="text-lg font-medium text-gray-800">{summary}</p>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 text-center mt-8 mb-6">
        Parameters checked
      </h2>

      <div className="space-y-4">
        {displayFactors.map((f, i) => (
          <FactorItem key={i} factor={f} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-2 rounded-2xl text-white"
          style={{
            background:
              mode === "quick"
                ? "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)"
                : "linear-gradient(90deg, #059669 0%, #10b981 100%)",
          }}
        >
          Back to Home
        </button>
        {mode === "pro" && (
          <p className="text-sm text-gray-600 mt-3">
            We have sent the full report and developer checklist to your email.
          </p>
        )}
      </div>

      <footer className="mt-12 text-center text-xs text-neutral-500">
        © 2025 AI Signal Max. All rights reserved.
        <br />
        <span className="opacity-60">
          Visibility scores are estimated and based on publicly available data.
          Not legal advice.
        </span>
      </footer>
    </main>
  );
}

function StatusText({ status }: { status: Factor["status"] }) {
  const colors = {
    Good: "text-green-600",
    Moderate: "text-yellow-600",
    Poor: "text-red-600",
  };
  return (
    <span className={`text-base font-semibold ${colors[status]}`}>
      {status}
    </span>
  );
}

function FactorItem({ factor }: { factor: Factor }) {
  const borderColors = {
    Good: "border-green-500",
    Moderate: "border-yellow-500",
    Poor: "border-red-500",
  };
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm flex items-center">
      <div className="flex items-start space-x-4 flex-1">
        <div
          className={`w-5 h-5 flex-shrink-0 rounded-full border-2 ${borderColors[factor.status]}`}
        />
        <div>
          <p className="font-semibold">{factor.name}</p>
          <p className="text-sm text-gray-600">{factor.desc}</p>
        </div>
      </div>
      <div className="w-24 text-right">
        <StatusText status={factor.status} />
      </div>
    </div>
  );
}

