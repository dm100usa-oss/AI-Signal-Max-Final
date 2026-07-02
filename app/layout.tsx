import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "./transition";

export const metadata: Metadata = {
  title: "AI Answers Score — AI Visibility & Website Audit",
  description:
    "AI Answers Score is a service that analyzes how AI assistants and search engines perceive your website. Check visibility in ChatGPT, Copilot, Gemini, Perplexity, Grok and other AI systems.",
  applicationName: "AI Answers Score",
  keywords: [
    "AI visibility",
    "AI search optimization",
    "website audit for AI",
    "ChatGPT visibility",
    "AI assistants SEO",
    "AI website analysis",
  ],
  authors: [{ name: "AI Answers Score" }],
  creator: "AI Answers Score",
  publisher: "AI Answers Score",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "AI Answers Score — AI Visibility & Website Audit",
    description:
      "Analyze how AI assistants see and rank your website. Visibility check for ChatGPT, Copilot, Gemini, Perplexity and more.",
    siteName: "AI Answers Score",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
