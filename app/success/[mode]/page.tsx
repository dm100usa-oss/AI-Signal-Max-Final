"use client";

import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = currentUrl.searchParams.get("url") || "";
        setUrl(targetUrl);

        const res = await fetch(`/api/result?url=${encodeURIComponent(targetUrl)}`);
        const data = await res.json();

        if (!data || !data.score) throw new Error("No valid data");

        setScore(data.score);

        const allFactors = [
          { key: "robots_txt", name: "Robots.txt", desc: "Controls whether AI platforms can see your site." },
          { key: "sitemap_xml", name: "Sitemap.xml", desc: "Tells AI which pages exist and should be indexed." },
          { key: "x_robots_tag", name: "X-Robots-Tag", desc: "Server setting that tells AI whether your pages can appear in results." },
          { key: "meta_robots", name: "Meta Robots", desc: "Tag that controls whether AI can display the page." },
          { key: "canonical", name: "Canonical", desc: "Tells AI which page is the main version." },
          { key: "title_tag", name: "Title Tag", desc: "Defines the title users see in search or AI results." },
          { key: "meta_description", name: "Meta Description", desc: "Short description that AI shows under the title." },
          { key: "open_graph", name: "Open Graph", desc: "Makes your links look good in AI results and social previews." },
          { key: "h1_present", name: "H1 Heading", desc: "Main heading that tells AI what the page is about." },
          { key: "structured_data", name: "Structured Data", desc: "JSON-LD markup that helps AI understand the page content." },
          { key: "mobile_friendly", name: "Mobile Friendly", desc: "Ensures usability on phones and tablets." },
          { key: "https", name: "HTTPS", desc: "Secure connection protocol improving trust and ranking." },
          { key: "alt_attributes", name: "Alt Texts", desc: "Captions for images that help AI interpret visuals." },
          { key: "favicon", name: "Favicon", desc: "Small icon that completes your site's visual identity." },
          { key: "page_404", name: "404 Page", desc: "Tells AI that a resource doesn’t exist properly." },
        ];

        const mappedFactors = allFactors.map((f) => ({
          ...f,
          status: data.results[f.key] || "Moderate",
        }));

        setFactors(mode === "quick" ? mappedFactors.slice(0, 5) : mappedFactors);

        if (data.score >= 80) {
          setSummary("Your site is well visible for AI platforms. Most parameters are configured correctly.");
        } else if (data.score >= 40) {
          setSummary("Your site is partially visible for AI platforms. Some parameters require improvement.");
        } else {
          setSummary("Your site is poorly visible for AI platforms. Most parameters are misconfigured, which limits visibility.");
        }
      } catch (err) {
        console.error("Failed to load analysis:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mode]);

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center text-gray-600">
        <p>Loading results...</p>
      </main>
    );
  }

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
        {factors.map((f, i) => (
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
