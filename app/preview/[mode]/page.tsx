"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Mode = "quick" | "pro";

function Dots() {
  return (
    <span className="ml-2 inline-flex w-[1.7ch] justify-start tabular-nums align-middle">
      <span className="dot">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
      <style jsx>{`
        .dot {
          opacity: 0.2;
          animation: aiv-dots 1200ms infinite;
        }
        .dot2 {
          animation-delay: 200ms;
        }
        .dot3 {
          animation-delay: 400ms;
        }
        @keyframes aiv-dots {
          0% {
            opacity: 0.2;
          }
          30% {
            opacity: 1;
          }
          60% {
            opacity: 0.2;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </span>
  );
}

export default function PreviewPage({
  params,
  searchParams,
}: {
  params: { mode: Mode };
  searchParams: Record<string, string | undefined>;
}) {
  const mode = (params.mode as Mode) || "quick";
  const url = (searchParams?.url || "").trim();
  const status = (searchParams?.status || "ok").toLowerCase();
  const paid = (searchParams?.paid || "") === "1";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const emailValid =
    mode === "pro"
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      : true;

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pay = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const minDuration = 2200;
    const started = Date.now();

    let json: any = null;
    try {
      const resp = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, url, email }),
      });
      json = await resp.json();
    } catch (e) {
      console.error("Payment error", e);
    }

    const left = Math.max(0, minDuration - (Date.now() - started));
    await new Promise((r) => setTimeout(r, left));

    if (json?.url) {
      window.location.href = json.url as string;
    } else {
      setLoading(false);
    }
  }, [mode, url, email, loading]);

  useEffect(() => {
    if (status === "error") {
      router.push("/scan-failed");
    }
  }, [status, router]);

  const quickItems = useMemo(
    () => [
      {
        name: "Robots.txt",
        text: "Controls whether AI platforms can see your site. If misconfigured and blocking access, your website may disappear from AI answers.",
      },
      {
        name: "Sitemap.xml",
        text: "Tells AI which pages exist and should be indexed. If missing or set up incorrectly, important parts of your site remain invisible.",
      },
      {
        name: "X-Robots-Tag",
        text: "A server-side setting that tells AI whether your pages can appear in results. If disallowed, those pages will not show up in AI answers.",
      },
      {
        name: "Meta Robots",
        text: "A tag inside the page that controls whether AI can display it. If misconfigured with a block, the page disappears from AI results.",
      },
      {
        name: "Canonical",
        text: "Tells AI which page is the main version. Without it, duplicate pages compete, and AI may show the wrong one.",
      },
    ],
    []
  );

  const proItems = useMemo(
    () => [
      {
        name: "Robots.txt",
        text: "Controls whether AI platforms can see your site. If misconfigured and blocking access, your website may disappear from AI answers.",
      },
      {
        name: "Sitemap.xml",
        text: "Tells AI which pages exist and should be indexed. If missing or set up incorrectly, important parts of your site remain invisible.",
      },
      {
        name: "X-Robots-Tag",
        text: "A server-side setting that tells AI whether your pages can appear in results. If disallowed, those pages will not show up in AI answers.",
      },
      {
        name: "Meta Robots",
        text: "A tag inside the page that controls whether AI can display it. If misconfigured with a block, the page disappears from AI results.",
      },
      {
        name: "Canonical",
        text: "Tells AI which page is the main version. Without it, duplicate pages compete, and AI may show the wrong one.",
      },
      {
        name: "Title Tag",
        text: "The title is the first thing users see in results. If missing or too generic, AI may show random text.",
      },
      {
        name: "Meta Description",
        text: "A short description under the title that explains why users should click. If missing or vague, AI inserts random text.",
      },
      {
        name: "Open Graph",
        text: "Special tags that make your site links look good in AI answers and social media. Without them, users see random text or cropped images.",
      },
      {
        name: "H1 Headings",
        text: "The main heading of a page tells AI and visitors what it’s about. If missing or duplicated, AI cannot clearly understand the content.",
      },
      {
        name: "Structured Data (Schema Markup)",
        text: "Special markup (JSON-LD) that explains what’s on your site: product, service, article, or company. Without it, AI doesn’t fully understand your content.",
      },
      {
        name: "Mobile Friendly",
        text: "If the design breaks on mobile or buttons don’t work, AI considers it inconvenient.",
      },
      {
        name: "HTTPS",
        text: "A secure protocol that ensures safe connections. Sites without HTTPS are flagged as unsafe.",
      },
      {
        name: "Alt Attributes",
        text: "Captions for images that help AI interpret visuals. Without alt texts, images remain invisible.",
      },
      {
        name: "Favicon",
        text: "A small site icon shown in browsers and AI previews. Without it, your site looks unfinished.",
      },
      {
        name: "404 Page",
        text: "An error page that tells AI a resource doesn’t exist. If misconfigured, AI may treat broken links as valid.",
      },
    ],
    []
  );

  const payButton =
    mode === "quick"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-green-600 hover:bg-green-700 text-white";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-center text-2xl font-semibold">
            Your result is ready
          </h1>

          {url && status === "ok" && (
            <div className="mb-6 text-center text-sm text-neutral-600">
              Website: {url} &nbsp; | &nbsp; Date: {date}
            </div>
          )}

          {status === "ok" && (
            <>
              <div className="mb-6 text-center text-base font-medium text-neutral-800">
                {mode === "quick"
                  ? "We checked 5 key factors for your website’s AI visibility:"
                  : "We checked all 15 key factors for your website’s visibility in AI results:"}
              </div>

              <ul className="mb-6 space-y-4">
                {(mode === "quick" ? quickItems : proItems).map((item, i) => (
                  <li key={i} className="flex items-center">
                    <span
                      className={`mr-3 inline-block size-3 flex-none rounded-full ${
                        mode === "quick" ? "bg-blue-600" : "bg-green-600"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-[15px] text-neutral-800">
                      <span className="font-semibold">{item.name}</span> —{" "}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>

              {mode === "pro" && !paid && (
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm text-neutral-700"
                  >
                    Your email to receive the PDF after payment
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={[
                      "w-full rounded-md border px-3 py-2 text-sm outline-none",
                      email || !emailValid
                        ? emailValid
                          ? "border-neutral-300 focus:ring-2 focus:ring-green-500"
                          : "border-rose-400 focus:ring-2 focus:ring-rose-300"
                        : "border-neutral-300 focus:ring-2 focus:ring-green-500",
                    ].join(" ")}
                  />
                  {!emailValid && (
                    <p className="mt-1 text-xs text-rose-600">
                      Please enter a valid email.
                    </p>
                  )}
                </div>
              )}

              {!paid ? (
                <button
                  onClick={pay}
                  disabled={!url || (mode === "pro" && !emailValid) || loading}
                  className={[
                    "w-full rounded-md px-4 py-3 text-base font-medium transition-colors disabled:opacity-60 flex items-center justify-center",
                    payButton,
                  ].join(" ")}
                >
                  {mode === "pro" ? "Get Full Report" : "Get Results"}
                  {loading && <Dots />}
                </button>
              ) : (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-800">
                  {mode === "pro"
                    ? "Payment confirmed. Your PDF report will be sent to your email."
                    : "Payment confirmed. Thank you for checking your website’s AI visibility with us."}
                </div>
              )}

              <p className="mt-6 text-center text-xs text-neutral-500">
                <span className="opacity-60">
                  Visibility scores are estimated and based on publicly
                  available data. Not legal advice.
                </span>
              </p>
            </>
          )}
        </div>

        <footer className="mt-8 text-center text-xs text-neutral-500">
          © 2025 AI Signal Max. All rights reserved.
          <br />
          <span className="opacity-60">
            Visibility scores are estimated and based on publicly available data. Not legal advice.
          </span>
        </footer>
      </div>
    </main>
  );
}
