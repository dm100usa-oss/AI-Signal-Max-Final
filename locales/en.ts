const en = {
  footer: {
    copyright: "© 2025 AI Answers Score. All rights reserved.",
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
      "Can AI see your site name",
      "Does AI understand your site's category",
      "Is your site structure clear to AI",
      "Does AI consider your site safe",
      "Is your site fast enough for AI",
      "Can AI see your site's data markup",
      "Can AI read your pages",
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
      "Can AI see your site name",
      "Can AI navigate the page",
      "Is your site structure clear to AI",
      "Does AI consider your site safe",
      "Is your site fast enough for AI",
      "Can AI see your site's data markup",
      "Does AI understand your site's category",
      "Can AI read your pages",
      "Does your site work correctly for AI",
      "Does AI understand page priority",
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
        name: "Can AI see your site name",
        desc: "Checks the presence and correctness of the Title tag.",
      },
      {
        key: "h2_present",
        name: "Can AI navigate the page",
        desc: "Checks for H2 subheadings that help AI navigate the page content.",
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
        name: "Can AI see your site's data markup",
        desc: "Checks for JSON-LD structured data that helps AI understand your content.",
      },
      {
        key: "theme",
        name: "Does AI understand your site's category",
        desc: "Determines whether your site's category is clear to AI from the title, description and markup.",
      },
      {
        key: "meta_robots",
        name: "Can AI read your pages",
        desc: "Checks for restrictions on reading pages — in the page code (meta robots) and in the server response (x-robots-tag).",
      },
      {
        key: "page_404",
        name: "Does your site work correctly for AI",
        desc: "Checks error handling — your site should correctly report missing pages.",
      },
      {
        key: "canonical",
        name: "Does AI understand page priority",
        desc: "Checks canonical links so AI understands which pages take priority.",
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
      highQuick: `Your website is well prepared for AI recommendations. <strong>It can already appear in AI answers and attract visitors</strong> thanks to its correct structure and settings.<br/><br/>In this quick check we show the <strong>key parameters</strong> that are already working correctly and supporting your readiness.<br/><br/>Best regards, the AI Answers Score team.`,
      highPro: `Your website is well prepared for AI recommendations. <strong>It can already appear in AI answers and attract visitors</strong> thanks to its correct structure and settings.<br/><br/>The main parameters are configured correctly and AI systems see your site as a clear and reliable source. <strong>Further targeted improvements will strengthen your position and increase inquiries.</strong><br/><br/>We sent you two PDF files by email: <strong>a detailed report with explanations for the owner and a technical brief for your developer</strong>. This will help you lock in results and improve your site's performance.<br/><br/>Best regards, the AI Answers Score team.`,
      mediumQuick: `Your website is partially ready for AI recommendations. <strong>You're close to a good result</strong> — a few fixes will make your structure clearer to AI. Then your site will appear in answers more often and bring more visitors.<br/><br/>In this quick check we show the <strong>main parameters</strong> that need attention.<br/><br/>Best regards, the AI Answers Score team.`,
      mediumPro: `Your website is partially ready for AI recommendations. <strong>You're close to a good result</strong> — a few fixes will make your structure clearer to AI. Then your site will appear in answers more often and bring more visitors.<br/><br/>Some parameters are not fully configured, which is why your site doesn't always appear in AI answers. <strong>Targeted fixes will increase your readiness and help you show up more often.</strong><br/><br/>We sent you two PDF files by email: <strong>a detailed report with explanations for the owner and a technical brief for your developer</strong>. It's a ready action plan you can hand off immediately and check the results later.<br/><br/>Best regards, the AI Answers Score team.`,
      lowQuick: `Your website is not yet ready for AI recommendations. <strong>In its current state it does not appear in AI answers</strong>, which means you are missing potential visitors and inquiries.<br/><br/>In this quick check we show the <strong>main parameters</strong> that need urgent attention.<br/><br/>Best regards, the AI Answers Score team.`,
      lowPro: `Your website is not yet ready for AI recommendations. <strong>In its current state it does not appear in AI answers</strong>, which means you are missing potential visitors and inquiries.<br/><br/>Critically important parameters are misconfigured or missing. <strong>Without fixing them, your site will not be recommended by AI systems.</strong><br/><br/>We sent you two PDF files by email: <strong>a detailed report with explanations for the owner and a technical brief for your developer</strong>. It's a step-by-step plan to fix the issues and prepare your site for AI traffic.<br/><br/>Best regards, the AI Answers Score team.`,
    },
    // --- Five result levels (detailed check) ---
    levels: {
      veryLow: {
        title: "Right now your site is nearly invisible to AI, but that's fixable",
        text: "For now it's hard for AI to understand what your site does, so it rarely recommends it to users. It's best to start with the basic improvements.",
      },
      low: {
        title: "Your site is taking its first steps toward AI recommendations",
        text: "AI already sees part of the information about your site, but doesn't yet fully understand it. Right now it's important to strengthen the basic elements so your site becomes much clearer to AI.",
      },
      medium: {
        title: "Good progress. Your site is already halfway ready for AI recommendations",
        text: "Your site already has a solid foundation. Many important elements are present, but some signals are still not strong enough. After improvements, your site can significantly raise its chances of appearing in AI recommendations.",
      },
      good: {
        title: "Good result. Your site is confidently moving toward AI recommendations",
        text: "Your site already has a good foundation, and many important elements work correctly. After improving a few factors, your site can significantly strengthen its position and appear in AI recommendations more often.",
      },
      veryGood: {
        title: "Very good result. Your site is already very close to AI recommendations",
        text: "Your site already has a strong foundation and confidently competes for a place in AI recommendations. A few important elements remain to be strengthened, which will help AI choose your site even more often.",
      },
      excellent: {
        title: "Excellent result. Your site is well prepared for AI recommendations",
        text: "Your site already meets most of the factors modern AI uses when choosing sources of information. This is a high level of readiness. Small targeted improvements will help you keep your competitive edge as AI evolves.",
      },
    },
    strengthsTitle: "Strengths",
    weaknessesTitle: "Weaknesses",
    paramStrengths: {
      robots_txt: "The site is open to AI — platforms can read it",
      meta_description: "AI understands what your site is about",
      theme: "AI clearly understands your business category",
      title_tag: "AI clearly sees the site's name and purpose",
      structured_data: "The site has structured data AI can understand",
      sitemap_xml: "AI sees the full structure of your site",
      h2_present: "AI navigates the page text easily",
      page_speed: "The site responds fast — AI has time to read it",
      https: "The site is secure and considered safe by AI",
      meta_robots: "All pages are open for AI to read",
      canonical: "AI understands which pages are the main ones",
      mobile_friendly: "The site works well on mobile — a plus for AI",
      alt_attributes: "AI understands the images on the site",
      page_404: "The site works correctly, with no errors for AI",
    },
    paramWeaknesses: {
      robots_txt: "The site is closed or partially closed to AI platforms",
      meta_description: "It's hard for AI to understand what your site is about",
      theme: "AI doesn't fully understand your business category",
      title_tag: "The site's name is unclear or missing for AI",
      structured_data: "No structured data to help AI understand the content",
      sitemap_xml: "AI doesn't see a sitemap and misses some pages",
      h2_present: "It's hard for AI to navigate the text — not enough subheadings",
      page_speed: "The site responds slowly — AI may skip it",
      https: "No secure connection — AI may treat the site with less trust",
      meta_robots: "Some pages are blocked from AI reading",
      canonical: "AI doesn't understand page priority",
      mobile_friendly: "The site is not mobile-friendly",
      alt_attributes: "AI doesn't understand the images — no captions",
      page_404: "There are errors in the site's operation that hinder AI",
    },
    strengths: {
      home: "AI clearly understands what you do and who you help",
      tech: "Your site is easy for AI to read and analyze",
      content: "Your site has content AI can cite in an answer",
      authority: "AI sees signals of trust and reliability in your company",
      overall: "Your site already has a foundation to compete for a place in AI recommendations",
    },
    weaknesses: {
      home: "From the first screen AI doesn't fully understand what you do and in which region",
      tech: "AI still can't read everything on your site",
      content: "Your site lacks content that AI could cite",
      authority: "AI sees few proofs of your company's expertise and reliability",
      overall: "Your site still trails category leaders on several important indicators",
    },
    chatgpt: {
      lead: "For example, here's what ChatGPT currently recommends for the query",
      question: "What's a good Italian restaurant you'd recommend in Miami?",
      answerTitle: "ChatGPT's answer",
      items: [
        "Carbone — South Beach",
        "Boia De — Little Haiti",
        "Macchialina — South Beach",
      ],
      explanationTitle: "Explanation",
      explanation: "I recommend these because I consider them the most reliable and useful for the user. Their sites better confirm expertise, reputation, and relevance to this query.",
      note: "The check evaluates only the site itself. Brand fame, press coverage, and other external signals are not part of the score. So a well-known company may already be recommended by AI thanks to its reputation, even if its site is only mediocre.",
    },
    paramsToggle: "Main check parameters",
    meaningTitle: "What this means",
    meaningIntro: {
      excellent: "You've done excellent work. The check shows that most of the important signals are already present on your site. We carefully reviewed the remaining growth points and prepared recommendations that will help your site maintain its high level of readiness in the future.",
      veryGood: "You've already done a lot of work. Right now your site is very close to an excellent result. We've identified a few elements that are still slightly holding back growth and prepared recommendations that will help take your site to the next level.",
      good: "You've already built a good foundation. Now it's important to consistently strengthen the missing elements so AI understands your site better and recommends it to users more confidently. Our main recommendations focus exactly on these improvements.",
      medium: "You've already taken an important step forward. The main task now is to consistently strengthen the missing elements that help AI understand your site's topic, level of trust, and value of information for users.",
      low: "The good news is that the foundation is already there. Now it's important to gradually strengthen the key signals that help AI understand what the company does and why it can be recommended to users. We've already identified where it's best to start.",
      veryLow: "This is a normal starting point for many sites. The most important thing now is to make the site clearer to AI and strengthen the core signals it uses to determine your topic, services, and level of trust. We've already found the main reasons and prepared a step-by-step improvement plan.",
    },
    meaningBody: "We've already identified all the needed improvements and sent you two PDF documents by email. They'll help you improve the site step by step without unnecessary changes. The documents are structured so you can make some changes yourself and hand the ready technical brief straight to a developer, saving time. If you'd like to review all 15 check parameters and see the result for each, open the \"Main parameters\" section below.",
    requestLead: "If you don't have a developer or don't know who to assign this to — we can help. Leave a request and we'll get in touch.",
    requestButton: "Leave a request",
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
