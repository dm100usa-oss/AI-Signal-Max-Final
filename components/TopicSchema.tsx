import { siteConfig } from "@/config/site";
import type { Topic } from "@/content/topics/types";
import type { Lang } from "@/locales/config";

export function TopicSchema({
  topic,
  lang,
  url,
  dateModified,
}: {
  topic: Topic;
  lang: Lang;
  url: string;
  dateModified: string;
}) {
  const c = topic.content[lang];

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: c.h1,
        description: c.directAnswer,
        inLanguage: lang,
        datePublished: topic.datePublished,
        dateModified,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: siteConfig.name },
        publisher: { "@type": "Organization", name: siteConfig.name },
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
