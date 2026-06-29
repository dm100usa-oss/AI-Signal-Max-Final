const en = {
  footer: {
    copyright: "© 2025 AI Signal Max. All rights reserved.",
    disclaimer:
      "Visibility scores are estimated and based on publicly available data. Not legal advice.",
  },

  home: {
    tagline: "the new competitive edge",
    description:
      "Check how ready your website is to appear in AI assistant recommendations: ChatGPT · Copilot · Gemini · Claude · Perplexity · Grok and more",
    placeholder: "https://example.com",
    errorInvalidUrl: "Please enter a valid URL including https://",
    errorCannotCheck: "We can't analyze this website. Please try a different one.",
    errorNotAccessible:
      "We can't reach this website. Make sure it's publicly accessible.",
    quickButton: "Quick Check $5.99",
    quickChecking: "Checking",
    quickDesc:
      "Your site's readiness score, 10 key factors, and quick recommendations on screen",
    proButton: "Full Audit $19.99",
    proChecking: "Checking",
    proDesc:
      "15 factors, results on screen and by email, detailed recommendations for the owner and a ready-to-use brief for your developer",
  },

  quickPreview: {
    dateLabel: "Date",
    started: "We started checking",
    factors: [
      "Is your site open to AI",
      "Does AI understand what your site is about",
      "Can AI see your page titles",
      "Does AI understand your site's category",
      "Is your site structure clear to AI",
      "Does AI consider your site safe",
      "Is your site fast enough for AI",
      "Can AI see your page markup",
      "Does your link include a title, description, and image",
      "Will AI recommend your site",
    ],
    analyzing: "Analyzing 10 key factors",
    timerText: (sec: number) => `Check completes in ${sec} sec`,
    checkComplete: "Check complete",
    getResult: "Get your result",
    limitTitle: "Daily limit reached",
    limitText: "You've used your 3 free quick checks for today. Please try again tomorrow.",
    backHome: "Back to home",
  },

  proPreview: {
    dateLabel: "Date",
    started: "We started the full audit",
    factors: [
      "Is your site open to AI",
      "Does AI understand what your site is about",
      "Can AI see your page titles",
      "Does AI understand your site's category",
      "Is your site structure clear to AI",
      "Does AI consider your site safe",
      "Is your site fast enough for AI",
      "Can AI see your page markup",
      "Does your link include a title, description, and image",
      "Are your pages allowed to be indexed",
      "Does AI consider your site high quality",
      "Is your main page properly set",
      "Is your site mobile-friendly",
      "Can AI understand images on your site",
      "Will AI recommend your site",
    ],
    auditLabel: "Auditing 15 key factors",
    ownerReport: "Building owner report",
    devReport: "Creating developer brief",
    finalReport: "Owner report • Developer brief",
    auditDone: "Audit complete",
    reportsDone: "Reports ready",
    timerText: (sec: number) => `Full audit completes in ${sec} sec`,
    getResult: "Get your result",
  },

  preview: {
    resultReady: "Your result is ready",
    websiteLabel: "Website",
    dateLabel: "Date",
    quickFactorsIntro:
      "We checked 5 key factors for your website's AI visibility:",
    proFactorsIntro:
      "We checked all 15 key factors for your website's visibility in AI results:",
    emailLabel: "Your email to receive the PDF after payment",
    emailPlaceholder: "you@example.com",
    emailError: "Please enter a valid email.",
    getResultsButton: "Get Results",
    getFullReportButton: "Get Full Report",
    paidQuick:
      "Payment confirmed. Thank you for checking your website's AI visibility with us.",
    paidPro:
      "Payment confirmed. Your PDF report will be sent to your email.",
    factorsQuick: [
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
    factorsPro: [
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
        text: "The main heading of a page tells AI and visitors what it's about. If missing or duplicated, AI cannot clearly understand the content.",
      },
      {
        name: "Structured Data (Schema Markup)",
        text: "Special markup (JSON-LD) that explains what's on your site: product, service, article, or company. Without it, AI doesn't fully understand your content.",
      },
      {
        name: "Mobile Friendly",
        text: "If the design breaks on mobile or buttons don't work, AI considers it inconvenient.",
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
        text: "An error page that tells AI a resource doesn't exist. If misconfigured, AI may treat broken links as valid.",
      },
    ],
  },

  success: {
    quickTitle: "Quick Check Results",
    proTitle: "Full Audit Results",
    siteLabel: "Website",
    dateLabel: "Date",
    loading: "Loading results...",
    highReadiness: "High AI Readiness",
    mediumReadiness: "Medium AI Readiness",
    lowReadiness: "Low AI Readiness",
    materialsTitle: "Check Details",
    factorsTitle: "Checked Parameters",
    backHome: "Back to Home",
    leaveReview: "Leave a Review",
    pdfSent:
      "Full owner report and developer brief have been sent to your email.",
    andMore: "and more...",
    statusGood: "Good",
    statusModerate: "Average",
    statusPoor: "Poor",
    aiScores: {
      explainTitle: "What makes a site appear in AI answers",
      explainIntro:
        "For AI to find, understand and recommend your site, four things matter. Below is how your site scores on each of them.",
      partsTitle: "Score across four areas",
      home: "Homepage",
      tech: "Technical",
      content: "Content",
      authority: "Authority signals",
      homeHint: "Does AI understand who you are and how you help",
      techHint: "Can AI read your site",
      contentHint: "Is there anything to cite on your site",
      authorityHint: "Does AI see signals of trust in your site",
      weakNote: "This area is worth strengthening first.",
    },
    labels: {
      title_tag: "Title",
      h1_present: "H1",
      h2_present: "Currently on site",
      meta_description: "Description",
      site_language: "Language",
      mobile_friendly: "Mobile version",
      contacts: "Contact",
      robots_txt: "AI access",
      sitemap_xml: "Pages",
      sitemap_lastmod: "Updated",
      https: "Protocol",
      page_speed: "Response",
      structured_data: "JSON-LD",
      open_graph: "Open Graph",
      canonical: "Canonical",
      x_robots_tag: "X-Robots",
      meta_robots: "Meta robots",
      alt_attributes: "ALT attributes",
      page_404: "404 page",
    },
    factors: [
      {
        key: "robots_txt",
        name: "Is your site open to AI",
        desc: "Checks whether AI platforms are allowed to access your site.",
      },
      {
        key: "meta_description",
        name: "Does AI understand what your site is about",
        desc: "Checks the meta description that helps AI understand your site's topic and content.",
      },
      {
        key: "title_tag",
        name: "Can AI see your page titles",
        desc: "Checks the presence and correctness of the Title tag.",
      },
      {
        key: "h2_present",
        name: "Does AI understand your site's category",
        desc: "Checks for H2 subheadings that help AI determine the category and structure of content.",
      },
      {
        key: "sitemap_xml",
        name: "Is your site structure clear to AI",
        desc: "Checks for a sitemap.xml so AI knows all your pages.",
      },
      {
        key: "https",
        name: "Does AI consider your site safe",
        desc: "Checks whether a secure HTTPS connection is used.",
      },
      {
        key: "page_speed",
        name: "Is your site fast enough for AI",
        desc: "Checks server response time — a slow site may be skipped by AI crawlers.",
      },
      {
        key: "structured_data",
        name: "Can AI see your page markup",
        desc: "Checks for JSON-LD structured data that helps AI understand your content.",
      },
      {
        key: "open_graph",
        name: "Does your link include a title, description, and image",
        desc: "Checks Open Graph settings that affect how your site looks when shared.",
      },
      {
        key: "meta_robots",
        name: "Are your pages allowed to be indexed",
        desc: "Checks meta tags and server headers for AI indexing restrictions.",
      },
      {
        key: "page_404",
        name: "Does AI consider your site high quality",
        desc: "Checks error handling — your site should correctly report missing pages.",
      },
      {
        key: "canonical",
        name: "Is your main page properly set",
        desc: "Checks canonical links so AI doesn't get confused by duplicate pages.",
      },
      {
        key: "mobile_friendly",
        name: "Is your site mobile-friendly",
        desc: "Checks for the viewport meta tag for correct display on mobile devices.",
      },
      {
        key: "alt_attributes",
        name: "Can AI understand images on your site",
        desc: "Checks for alt attributes on images.",
      },
      {
        key: "score",
        name: "Will AI recommend your site",
        desc: "Overall readiness score for AI system recommendations.",
      },
    ],
    summaries: {
      highQuick: `Your website is well prepared for AI recommendations. <strong>It can already appear in AI answers and attract visitors</strong> thanks to its correct structure and settings.<br/><br/>In this quick check we show the <strong>key parameters</strong> that are already working correctly and supporting your readiness.<br/><br/>Best regards, the AI Signal Max team.`,
      highPro: `Your website is well prepared for AI recommendations. <strong>It can already appear in AI answers and attract visitors</strong> thanks to its correct structure and settings.<br/><br/>The main parameters are configured correctly and AI systems see your site as a clear and reliable source. <strong>Further targeted improvements will strengthen your position and increase inquiries.</strong><br/><br/>We sent you two PDF files by email: <strong>a detailed report with explanations for the owner and a technical brief for your developer</strong>. This will help you lock in results and improve your site's performance.<br/><br/>Best regards, the AI Signal Max team.`,
      mediumQuick: `Your website is partially ready for AI recommendations. <strong>You're close to a good result</strong> — a few fixes will make your structure clearer to AI. Then your site will appear in answers more often and bring more visitors.<br/><br/>In this quick check we show the <strong>main parameters</strong> that need attention.<br/><br/>Best regards, the AI Signal Max team.`,
      mediumPro: `Your website is partially ready for AI recommendations. <strong>You're close to a good result</strong> — a few fixes will make your structure clearer to AI. Then your site will appear in answers more often and bring more visitors.<br/><br/>Some parameters are not fully configured, which is why your site doesn't always appear in AI answers. <strong>Targeted fixes will increase your readiness and help you show up more often.</strong><br/><br/>We sent you two PDF files by email: <strong>a detailed report with explanations for the owner and a technical brief for your developer</strong>. It's a ready action plan you can hand off immediately and check the results later.<br/><br/>Best regards, the AI Signal Max team.`,
      lowQuick: `Your website is not yet ready for AI recommendations. <strong>In its current state it does not appear in AI answers</strong>, which means you are missing potential visitors and inquiries.<br/><br/>In this quick check we show the <strong>main parameters</strong> that need urgent attention.<br/><br/>Best regards, the AI Signal Max team.`,
      lowPro: `Your website is not yet ready for AI recommendations. <strong>In its current state it does not appear in AI answers</strong>, which means you are missing potential visitors and inquiries.<br/><br/>Critically important parameters are misconfigured or missing. <strong>Without fixing them, your site will not be recommended by AI systems.</strong><br/><br/>We sent you two PDF files by email: <strong>a detailed report with explanations for the owner and a technical brief for your developer</strong>. It's a step-by-step plan to fix the issues and prepare your site for AI traffic.<br/><br/>Best regards, the AI Signal Max team.`,
    },
  },

  scanFailed: {
    message:
      "We couldn't complete the scan for this website. Please check the address and try again.",
    backButton: "Back to Home",
  },

  notFound: {
    title: "Website not found",
    message:
      "We couldn't scan this website. Please check the address and try again.",
    backButton: "Back to Home",
  },

  reviews: {
    whatUsersNote: "what users highlight",
    tags: [
      "useful",
      "easy to understand",
      "convenient",
      "saves time and money",
      "shareable with developer",
      "great for everyday use",
    ],
    namePlaceholder: "Your name",
    ratingLabel: "Your rating:",
    reviewPlaceholder: "Your review...",
    submitButton: "Submit",
    submitting: "Submitting",
    successMessage: "Thank you! Your review has been submitted for moderation.",
    errorMessage: "Something went wrong. Please try again.",
    shareText:
      "Share your experience, tell us about yourself or your company — your story will be seen by thousands of users worldwide",
    backHome: "Home",
  },

  addReview: {
    title: "Leave a Review",
    namePlaceholder: "Your name",
    reviewPlaceholder: "Your review...",
    submitButton: "Submit",
    submitting: "Submitting...",
    successTitle: "Thank you!",
    successMessage: "Your review has been submitted for moderation.",
    errorMessage: "Something went wrong. Please try again.",
  },

  quickPreviewV2: {
    steps: [
      "Is your site open to AI",
      "Does AI understand what your site is about",
      "Can AI read your page content",
      "Can AI see your titles and descriptions",
      "Does AI understand your site structure",
      "Can AI see images on your site",
      "Does AI consider your site safe and trustworthy",
      "Does AI include your site in search results",
      "Can AI find your site among competitors",
      "How does AI rate your site",
    ],
    timerText: (sec: number) => `Check completes in ${sec} sec`,
    checkComplete: "Check complete",
    getResult: "Get your result",
  },

  quickPreviewV3: {
    steps: [
      "Is your site open to AI",
      "Does AI understand what your site is about",
      "Can AI read your page content",
      "Can AI see your titles and descriptions",
      "Does AI understand your site structure",
      "Can AI see images on your site",
      "Does AI consider your site safe and trustworthy",
      "Does AI include your site in search results",
      "Can AI find your site among competitors",
      "How does AI rate your site",
    ],
    timerText: (sec: number) => `Check completes in ${sec} sec`,
    checkComplete: "Check complete",
    getResult: "Get your result",
  },
};

export default en;
