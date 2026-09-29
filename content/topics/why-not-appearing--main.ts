import type { Topic } from "./types";

// =============================================================
//  ОБРАЗЦОВАЯ ТЕМА (Шаг Б, усиленная по эталону roofreplacementchicago)
//  Раздел: why-not-appearing
//  Все числа проверены веб-поиском (см. sources). Год: 2026.
//  Принцип: каждый блок - готовый к цитированию ответ с конкретикой.
// =============================================================

const topic: Topic = {
  slug: "why-not-appearing-in-ai-answers",
  section: "why-not-appearing",
  status: "published",
  accent: "rgba(16,185,129,0.185)",
  datePublished: "2026-06-11",
  sources: [
    {
      label: "Vercel & MERJ - The rise of the AI crawler",
      url: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      label: "Lantern - AI Crawlers Do Not Render JavaScript (June 2026)",
      url: "https://www.asklantern.com/blogs/ai-crawlers-do-not-render-javascript",
    },
    {
      label: "Coronium - The Closing Web in 2026 (Cloudflare, GPTBot blocking)",
      url: "https://www.coronium.io/blog/closing-web-ai-crawler-blocking-pay-per-crawl-2026",
    },
    {
      label: "DigitalApplied - AI Crawler Access Control 2026 (training vs search bots)",
      url: "https://www.digitalapplied.com/blog/ai-crawler-access-control-2026-robots-llms-txt-decision-matrix",
    },
    {
      label: "Wellows - Why Websites Are Ignored by AI Search (2026)",
      url: "https://wellows.com/blog/why-websites-are-ignored-by-ai-search/",
    },
    {
      label: "Методика AIRS (AI Ready Score) - AI Answers Rank",
      url: "/method",
    },
    {
      label:
        "AI Answers Rank - Что такое GEO и как она помогает сайту попадать в ответы ИИ",
      url: "/why-it-matters/what-is-geo",
    },
  ],

  content: {
    en: {
      h1: "Why doesn't my site appear in AI answers?",
      crumb: "Not appearing in AI answers",
      directAnswer:
        "In most cases a site is missing from AI answers for one of four reasons: AI crawlers cannot read it, something is blocking them, the content cannot be extracted as a clean answer, or the site lacks trust signals. A high Google ranking does not fix this - AI assistants choose sources by trust and clarity, not by search position.",

      keyFacts: [
        "Ranking on Google does not guarantee appearing in AI answers - Google indexing only confirms a page exists, while AI systems separately decide whether to trust it.",
        "As of June 2026, none of the major AI crawlers run JavaScript - including GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot - so script-loaded content can be invisible to them.",
        "A Vercel and MERJ analysis of over 500 million GPTBot fetches found zero evidence of JavaScript execution; GPTBot downloads script files about 11.5% of the time but never runs them.",
        "Quick test: if your browser's 'View Source' does not show your text, AI assistants most likely cannot see it either.",
        "A common 2026 mistake is a CDN such as Cloudflare blocking AI crawlers by default - GPTBot is blocked by roughly 19% of sites, sometimes without the owner deciding it.",
        "Training crawlers and search crawlers are separate (GPTBot is not OAI-SearchBot), so blocking one does not block the other.",
        "Answers buried inside long paragraphs are often skipped; AI prefers a short direct answer or a clearly labelled FAQ block it can lift cleanly.",
        "Getting this right matters: AI-referred visitors have been reported to convert far better than standard search clicks (one 2026 dataset reported 14.2% vs 2.8%).",
      ],

      body: [
        {
          heading: "Why does a high Google ranking not help?",
          text: "AI assistants do not simply reuse Google's ranking. Indexing in Google only confirms that a page exists, while AI systems decide separately whether a page is reliable and clear enough to use in an answer. This is why a site can sit on the first page of Google and still get zero mentions in AI answers - the two systems judge sources differently.",
        },
        {
          heading: "Can AI assistants actually read your site?",
          text: "This is the most common technical barrier. As of June 2026, the major AI crawlers - GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and others - do not execute JavaScript. A Vercel and MERJ study of more than 500 million GPTBot fetches found no JavaScript execution at all. If your content only appears after scripts run, those crawlers see an almost empty page. Content delivered as plain HTML is read reliably. A quick check: open 'View Source' in your browser - if your main text is not there, AI likely cannot see it.",
        },
        {
          heading: "Is something blocking the AI crawlers?",
          text: "Even a well-written site is invisible if its server or CDN refuses AI crawlers. In 2026 a frequent cause is a CDN such as Cloudflare blocking AI bots by default, so the block happens without a deliberate decision - GPTBot alone is blocked by roughly 19% of sites. One nuance: training crawlers and search crawlers are now separate (GPTBot is not OAI-SearchBot), so it is possible to block training while still allowing the bots that feed AI answers.",
        },
        {
          heading: "Can AI extract a clean answer from the page?",
          text: "AI assistants prefer content they can lift without rewriting. When the actual answer is buried inside long paragraphs, the system often skips to a page that states the answer plainly - a short direct answer at the top, or a clearly labelled FAQ block. A long, thorough article can still be passed over simply because nothing on it is shaped as an extractable answer.",
        },
        {
          heading: "Does the site look trustworthy to AI?",
          text: "AI systems avoid sources they cannot place. Weak trust signals - no clear statement of who you are, inconsistent naming across the web, no references - make a site easy to leave out. A clear identity, consistent naming, real sources, and a small cluster of related pages on the same topic all tell AI assistants the site genuinely covers its subject.",
        },
      ],

      actions: [
        "Open 'View Source' on your key pages - if the main text is not in the raw HTML, move that content out of JavaScript so crawlers can read it.",
        "Check your CDN or hosting (for example Cloudflare bot settings) and make sure AI crawlers are not blocked by default.",
        "If you want to block AI training but stay in AI answers, allow the search crawlers (such as OAI-SearchBot) while restricting the training ones (such as GPTBot).",
        "Put a short, direct answer in the first sentence of each important page, and add a clearly labelled FAQ block.",
        "Strengthen trust: state clearly who you are, keep your name consistent everywhere, and cite real sources.",
        "Build a small cluster of three to five linked pages on the same topic instead of one isolated page.",
      ],

      faq: [
        {
          question: "Do I need a high Google ranking before I can appear in AI answers?",
          answer:
            "No. AI assistants select sources by trust and clarity rather than by Google position. Google indexing only confirms a page exists, while AI systems separately decide whether a page is reliable enough to reuse. A site can be cited in AI answers without ranking first in Google - and a top Google result can be ignored by AI entirely.",
        },
        {
          question: "Could my website builder or platform be the reason I'm invisible?",
          answer:
            "It can be. If your builder shows content only after JavaScript runs, AI crawlers that do not execute scripts may see an almost empty page. As of 2026 none of the major AI crawlers render JavaScript. The safe test is to open 'View Source' in your browser: if your main text is missing there, AI likely cannot see it, and the content should be delivered as plain HTML.",
        },
        {
          question: "How do I check whether AI assistants recommend my competitors instead of me?",
          answer:
            "Ask an AI assistant directly about your service in your area - for example, 'Who are the best [your service] providers in [your city]?' - and note which sites it names. Try the same question across a few assistants. If competitors appear and you do not, the cause is usually structural or trust-related, not the quality of your work.",
        },
        {
          question: "If I block AI bots, do I disappear from AI answers?",
          answer:
            "It depends which bots you block. Training crawlers and search crawlers are now separate - for example GPTBot (training) is not the same as OAI-SearchBot (search). Blocking the training crawler protects your content from model training but does not remove you from AI answers, while blocking the search crawler can remove you from them. Review your robots.txt and CDN settings so the block is deliberate.",
        },
      ],

      nextStepLabel: "How to check if your site is ready for AI",
      nextHref: "/check-readiness/technical-geo-checklist",
    },

    ru: {
      h1: "Почему мой сайт не появляется в ответах ИИ?",
      crumb: "Сайт не появляется в ответах ИИ",
      directAnswer:
        "Чаще всего сайт отсутствует в ответах ИИ по одной из четырех причин: ИИ-краулеры не могут его прочитать, что-то их блокирует, контент нельзя извлечь как готовый ответ, или сайту не хватает сигналов доверия. Высокая позиция в Google это не решает - ИИ выбирают источники по доверию и ясности, а не по позиции в поиске.",

      keyFacts: [
        "Высокий ранг в Google не гарантирует появление в ответах ИИ - индексация в Google лишь подтверждает, что страница существует, а ИИ отдельно решают, доверять ли ей.",
        "По состоянию на июнь 2026 ни один из крупных ИИ-краулеров не выполняет JavaScript - включая GPTBot, OAI-SearchBot, ClaudeBot и PerplexityBot - поэтому контент, загружаемый скриптами, может быть для них невидим.",
        "Анализ Vercel и MERJ более 500 млн обращений GPTBot не нашел ни одного случая выполнения JavaScript: GPTBot скачивает файлы скриптов примерно в 11,5% случаев, но никогда их не запускает.",
        "Быстрая проверка: если в браузере «Просмотр кода страницы» не показывает ваш текст, ИИ, скорее всего, его тоже не видит.",
        "Частая ошибка 2026 года - когда CDN, например Cloudflare, блокирует ИИ-краулеров по умолчанию; GPTBot заблокирован примерно на 19% сайтов, иногда без ведома владельца.",
        "Краулеры для обучения и для поиска - разные (GPTBot ≠ OAI-SearchBot), поэтому заблокировать один не значит заблокировать другой.",
        "Ответы, спрятанные внутри длинных абзацев, часто пропускаются; ИИ предпочитает короткий прямой ответ или четко размеченный блок FAQ, который можно взять целиком.",
        "Это важно: трафик из ИИ, по имеющимся данным, конвертируется заметно лучше обычных переходов из поиска (в одном наборе данных 2026 года - 14,2% против 2,8%).",
      ],

      body: [
        {
          heading: "Почему высокая позиция в Google не помогает?",
          text: "ИИ-ассистенты не используют ранжирование Google напрямую. Индексация в Google лишь подтверждает, что страница существует, а ИИ отдельно решают, достаточно ли она надежна и понятна, чтобы взять ее в ответ. Поэтому сайт может быть на первой странице Google и при этом не упоминаться в ответах ИИ - эти две системы оценивают источники по-разному.",
        },
        {
          heading: "Могут ли ИИ вообще прочитать ваш сайт?",
          text: "Это самый частый технический барьер. По состоянию на июнь 2026 крупные ИИ-краулеры - GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot и другие - не выполняют JavaScript. Исследование Vercel и MERJ на более чем 500 млн обращений GPTBot не нашло ни одного случая выполнения скриптов. Если ваш контент появляется только после работы скриптов, краулеры видят почти пустую страницу. Контент в виде обычного HTML читается надежно. Быстрая проверка: откройте в браузере «Просмотр кода страницы» - если основного текста там нет, ИИ, скорее всего, его не видит.",
        },
        {
          heading: "Не блокирует ли что-то ИИ-краулеров?",
          text: "Даже хорошо написанный сайт невидим, если сервер или CDN отклоняет ИИ-краулеров. В 2026 году частая причина - CDN вроде Cloudflare, блокирующий ИИ-ботов по умолчанию, так что блокировка происходит без осознанного решения; один только GPTBot заблокирован примерно на 19% сайтов. Нюанс: краулеры для обучения и для поиска теперь разделены (GPTBot ≠ OAI-SearchBot), поэтому можно закрыть обучение, но оставить ботов, которые формируют ответы ИИ.",
        },
        {
          heading: "Может ли ИИ извлечь со страницы готовый ответ?",
          text: "ИИ-ассистенты предпочитают контент, который можно взять без переписывания. Когда сам ответ спрятан внутри длинных абзацев, система часто переходит к странице, где ответ подан прямо - короткий прямой ответ вверху или четко размеченный блок FAQ. Длинная подробная статья может быть пропущена просто потому, что на ней ничто не оформлено как извлекаемый ответ.",
        },
        {
          heading: "Выглядит ли сайт надежным для ИИ?",
          text: "ИИ избегают источников, которые не могут опознать. Слабые сигналы доверия - нет ясного описания, кто вы, разные написания названия в сети, нет ссылок - делают сайт легким для исключения. Ясная идентичность, единообразные названия, реальные источники и небольшая группа связанных страниц по одной теме говорят ИИ, что сайт действительно разбирается в своем предмете.",
        },
      ],

      actions: [
        "Откройте «Просмотр кода страницы» на ключевых страницах - если основного текста нет в исходном HTML, выведите этот контент из JavaScript, чтобы краулеры его читали.",
        "Проверьте CDN или хостинг (например, настройки ботов в Cloudflare) и убедитесь, что ИИ-краулеры не заблокированы по умолчанию.",
        "Если хотите закрыть обучение ИИ, но остаться в ответах - разрешите поисковых краулеров (например, OAI-SearchBot) и ограничьте обучающих (например, GPTBot).",
        "Поместите короткий прямой ответ в первое предложение каждой важной страницы и добавьте четко размеченный блок FAQ.",
        "Усильте доверие: ясно укажите, кто вы, держите название единообразным везде и ссылайтесь на реальные источники.",
        "Соберите небольшую группу из трех–пяти связанных страниц по одной теме вместо одной изолированной страницы.",
      ],

      faq: [
        {
          question: "Нужна ли сначала высокая позиция в Google, чтобы попасть в ответы ИИ?",
          answer:
            "Нет. ИИ-ассистенты выбирают источники по доверию и ясности, а не по позиции в Google. Индексация в Google лишь подтверждает, что страница существует, а ИИ отдельно решают, достаточно ли она надежна. Сайт может цитироваться в ответах ИИ и без первого места в Google - а топовый результат Google ИИ может вовсе проигнорировать.",
        },
        {
          question: "Может ли причина невидимости быть в самом конструкторе или платформе сайта?",
          answer:
            "Может. Если конструктор показывает контент только после выполнения JavaScript, ИИ-краулеры, не запускающие скрипты, увидят почти пустую страницу. По состоянию на 2026 год ни один крупный ИИ-краулер не отображает JavaScript. Надежная проверка - открыть в браузере «Просмотр кода страницы»: если основного текста там нет, ИИ его, скорее всего, не видит, и контент нужно отдавать обычным HTML.",
        },
        {
          question: "Как проверить, рекомендуют ли ИИ конкурентов вместо меня?",
          answer:
            "Спросите ИИ-ассистента напрямую о вашей услуге в вашем регионе - например, «Кто лучшие [ваша услуга] в [ваш город]?» - и отметьте, какие сайты он называет. Задайте тот же вопрос в нескольких ассистентах. Если конкуренты есть, а вас нет - причина обычно в структуре или доверии, а не в качестве вашей работы.",
        },
        {
          question: "Если я заблокирую ИИ-ботов, исчезну ли я из ответов ИИ?",
          answer:
            "Зависит от того, каких ботов блокировать. Краулеры для обучения и для поиска теперь разделены - например, GPTBot (обучение) не то же самое, что OAI-SearchBot (поиск). Блокировка обучающего краулера защищает контент от обучения моделей, но не убирает вас из ответов ИИ, тогда как блокировка поискового краулера может убрать. Проверьте robots.txt и настройки CDN, чтобы блокировка была осознанной.",
        },
      ],

      nextStepLabel: "Как проверить готовность сайта к ИИ",
      nextHref: "/check-readiness/technical-geo-checklist",
    },
  },
};

export default topic;
