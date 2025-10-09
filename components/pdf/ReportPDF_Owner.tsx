// components/pdf/ReportPDF_Owner.tsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
} from "@react-pdf/renderer";
import DonutPDF from "./DonutPDF";

// Styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    color: "#1f2937",
    lineHeight: 1.6,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 10,
  },
  donutWrapper: {
    alignItems: "center",
    marginVertical: 10,
  },
  section: {
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
    textDecoration: "underline",
  },
  paragraph: {
    marginBottom: 10,
  },
  factorItem: {
    marginBottom: 10,
  },
  factorName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  factorDesc: {
    fontSize: 11,
    color: "#1f2937",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#6b7280",
  },
  divider: {
    marginVertical: 10,
    height: 1,
    backgroundColor: "#d1d5db",
  },
});

// Embedded Logo
const Logo = () => (
  <Svg style={styles.logo} width="48" height="48" viewBox="0 0 64 64">
    <Path
      d="M32 6C28 14 20 22 16 34c4 2 8 4 16 4s12-2 16-4c-4-12-12-20-16-28z"
      fill="#10b981"
    />
    <Path
      d="M32 10c-2 6-6 12-8 20 2 1 4 2 8 2s6-1 8-2c-2-8-6-14-8-20z"
      fill="#059669"
    />
    <Path
      d="M32 2C30 10 22 18 18 28c4 2 8 4 14 4s10-2 14-4C42 18 34 10 32 2z"
      fill="#047857"
    />
  </Svg>
);

interface ReportPDFProps {
  url: string;
  score: number;
  date: string;
}

const ReportPDF_Owner: React.FC<ReportPDFProps> = ({ url, score, date }) => {
  const visibilityLevel =
    score >= 80
      ? "High Visibility (≥80%)"
      : score >= 40
      ? "Moderate Visibility (40–79%)"
      : "Low Visibility (<40%)";

  const visibilityText =
    score >= 80
      ? `Your website is already well-prepared for AI platforms. Most of the key parameters are configured correctly, which ensures a high probability of appearing in results from ChatGPT, Copilot, Gemini, and other tools. This means that search and AI systems recognize your site as a reliable and user-friendly source of information.
However, even with high visibility, certain technical details require regular monitoring. Small errors or outdated settings can gradually reduce your performance. That is why it is important to continue periodic checks—at least every few months—to preserve and strengthen your results.`
      : score >= 40
      ? `Your website is generally visible to AI platforms, but some important parameters are misconfigured or require improvement. In its current state, the site may appear in AI results, but with limited trust and often ranked below competitors. This reduces the number of visitors and lowers your share of visibility.
This situation is not critical. By carefully following the recommendations, visibility can be significantly improved. Many companies achieve their strongest growth in traffic and inquiries precisely at this stage, once corrections are made.`
      : `At present, your website has serious visibility limitations for AI platforms. Several critical parameters are misconfigured or missing entirely. This means your site remains invisible to ChatGPT, Copilot, Gemini, and other systems—potential customers simply do not find you where they are searching.
A low visibility score indicates systemic issues. Fixing them requires a comprehensive approach, but it also unlocks new opportunities to reach audiences and position your business in the digital environment. Without addressing these problems, your site will continue to lose ground to competitors.`;

  const factors = [
    ["robots.txt", "This file determines whether AI systems can access your website. If it is misconfigured or blocks access, your entire site may disappear from AI-driven results. Even small mistakes can create major visibility issues. When the file is properly set up, unnecessary sections remain hidden while valuable pages stay accessible. If not, potential customers will never find you in AI or search results."],
    ["sitemap.xml", "A sitemap tells AI which pages exist on your website and which are most important for indexing. Without it—or if it is incomplete or broken—large parts of your site may remain invisible. This means customers may never discover your key products, services, or categories. A properly structured sitemap helps AI understand your site, ensure full coverage, and highlight what matters most."],
    ["X-Robots-Tag", "These server-side headers signal whether AI can display your pages. If directives like noindex or nofollow are applied incorrectly, important sections of your site will not appear in search or AI results. The danger is that even if your content is high-quality, AI systems will treat it as off-limits."],
    ["Meta Robots", "This is a meta tag placed in the page’s HTML that also controls whether AI can index it. If misconfigured (for example, noindex applied unintentionally), valuable pages will be excluded. When Meta Robots conflicts with X-Robots-Tag, search engines and AI often choose the most restrictive instruction, hiding your content from visibility."],
    ["Canonical Tags", "A canonical tag tells AI which version of a page is the “master” copy. Without it, duplicate pages compete against each other, and AI may show the wrong version. As a result, customers may land on outdated or less relevant pages instead of the main one. This wastes traffic and reduces conversions."],
    ["Title Tags", "The page title is the first element both customers and AI systems see. It strongly influences whether users choose your site or a competitor’s. If a title is missing, duplicated, or too generic, AI may pull random text instead. This confuses customers—they don’t understand what they will find, and often leave for competitors."],
    ["Meta Descriptions", "A meta description provides a short preview of your page content beneath the title in results. When missing, duplicated, or too vague, AI generates random snippets that often don’t represent your brand. Instead of compelling visitors to click, it creates confusion and pushes them toward competitors. Strong, unique descriptions increase click-through rates and visibility."],
    ["Open Graph Tags", "These tags control how your links appear in social media, messengers, and AI-generated answers. Without proper Open Graph settings, users see broken text, cropped or missing images, or irrelevant previews. This reduces trust, discourages clicks, and weakens your presence when shared across platforms. Correct Open Graph tags make your site look professional and appealing wherever it is displayed."],
    ["H1 Headings", "The H1 tag is the main headline of a page. It communicates the core topic to both AI and customers. If H1 headings are missing, duplicated, or poorly written, AI cannot clearly identify what the page is about. This reduces visibility and frustrates users who don’t find the answers they expect. Clear, unique H1 headings strengthen both trust and rankings."],
    ["Structured Data (Schema Markup)", "Structured data markup helps AI understand exactly what is on your site—whether it’s a product, service, article, or company profile. With correct schema, your site can appear in rich results such as product cards, ratings, or schedules. Without it, AI has to guess the content type, and your visibility suffers. Misconfigured or missing schema leads to lost opportunities for higher placement and more traffic."],
    ["Mobile-Friendliness", "Today, most visitors access websites from mobile devices. If your site is not mobile-friendly—small text, buttons that don’t work, layouts that break—AI systems consider it unreliable and show it less frequently. Poor mobile usability directly translates into fewer clicks, less trust, and lower rankings. Optimized mobile design is now a critical requirement for visibility."],
    ["HTTPS Security", "A secure HTTPS connection is a basic trust signal. AI platforms and browsers both treat non-HTTPS sites as unsafe. If your site does not use HTTPS, it is flagged as insecure and visibility drops dramatically. Even customers who do arrive may leave immediately due to browser warnings. Installing and maintaining SSL certificates is essential for trust and search performance."],
    ["Alt Texts for Images", "Alt texts are descriptions of images that allow AI systems to “see” visual content. Without them, your images remain invisible, and AI ignores important parts of your site. Products, services, or illustrations lose their value if they aren’t described. Meaningful, concise alt texts ensure that both AI and visually impaired users understand your content."],
    ["Favicon", "The favicon is the small icon displayed in browsers and results. While it may seem minor, for AI it is a signal of completeness and credibility. Without it, your site looks unfinished, lowering trust and reducing visibility. A professional favicon strengthens your brand presence and user recognition across all platforms."],
    ["Custom 404 Page", "A 404 error page tells AI and users that a page doesn’t exist. If it is missing or misconfigured, AI mistakes broken links for valid ones, which confuses indexing and lowers trust. Customers who hit a dead end without guidance often leave for competitors. A well-designed 404 page improves both usability and how AI perceives your site’s integrity."],
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Logo />
          <Text style={styles.title}>AI Website Visibility Report</Text>
          <Text style={styles.subtitle}>AI Signal Max</Text>
          <Text style={styles.subtitle}>{url}</Text>
          <Text style={styles.subtitle}>Date: {date}</Text>
        </View>

        <View style={styles.donutWrapper}>
          <DonutPDF score={score} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conclusion</Text>
          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: "bold" }}>{visibilityLevel}</Text>
            {"\n"}
            {visibilityText}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            This report has been prepared for the website owner. It shows the
            current condition of your site in terms of visibility across AI
            platforms and explains which factors have the greatest impact. The
            results are summarized first, followed by detailed explanations and
            recommendations. The final section of this report contains a
            developer’s checklist that can be handed over directly for
            implementation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Factors Reviewed</Text>
          <Text style={styles.paragraph}>
            To calculate your site’s visibility score, we analyzed 15 key
            parameters that influence how AI platforms and search engines
            interpret your site. These range from fundamental technical settings
            to user experience details. Below, you will find the status of each
            parameter and recommendations for improvement.
          </Text>
        </View>

        {factors.map(([name, desc], i) => (
          <View key={i} style={styles.factorItem}>
            <Text style={styles.factorName}>
              {i + 1}. {name}
            </Text>
            <Text style={styles.factorDesc}>{desc}</Text>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support and Contact</Text>
          <Text>
            AI Signal Max Support{"\n"}
            If you do not currently have access to a developer, our team can
            assist in quickly improving your website’s visibility across AI
            platforms.{"\n"}
            Contact: support@aisignalmax.com
          </Text>
        </View>

        <Text style={styles.footer}>
          © 2025 AI Signal Max. All rights reserved.{"\n"}
          AI Signal Max is a product of Magic of Discoveries LLC.
        </Text>
      </Page>
    </Document>
  );
};

export default ReportPDF_Owner;
