import type { Topic } from "./types";

// =============================================================
//  ГЛАВНАЯ ОБУЧАЮЩАЯ СТАТЬЯ: Что такое GEO
//  Раздел: why-it-matters (корневой, order 0)
//  Материнская статья центра знаний - формирует тематический
//  авторитет AI Answers Rank. Не продающая.
//  Цифры проверены веб-поиском (SparkToro/Similarweb, 2026), см. sources.
//  Фирменный термин: AI Answer Visibility (видимость в ответах ИИ).
// =============================================================

const topic: Topic = {
  slug: "what-is-geo",
  section: "why-it-matters",
  status: "published",
  accent: "rgba(59,130,246,0.185)",
  datePublished: "2026-07-02",
  sources: [
    {
      label:
        "SparkToro - In 2026, Less than One Third of Google Searches Still Send a Click",
      url: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/",
    },
    {
      label:
        "Onely - Zero-Click Search Is Evolving Into Zero-Search Discovery",
      url: "https://www.onely.com/blog/zero-click-search-is-evolving-into-zero-search-discovery/",
    },
    {
      label:
        "Search Engine Land - Zero-click searches up, organic clicks down",
      url: "https://searchengineland.com/zero-click-searches-up-organic-clicks-down-456660",
    },
    {
      label: "Методика AIRS (AI Ready Score) - AI Answers Rank",
      url: "/method",
    },
    {
      label:
        "AI Answers Rank - Почему мой сайт не появляется в ответах ИИ",
      url: "/why-not-appearing/why-not-appearing-in-ai-answers",
    },
  ],

  content: {
    en: {
      h1: "What is GEO and how does it help a site appear in AI answers?",
      crumb: "What is GEO",
      directAnswer:
        "GEO (Generative Engine Optimization) is the practice of making a website clear, trustworthy and easy for AI systems to use, so they cite it when they build an answer. If classic SEO helps a site rank higher in search, GEO raises its AI Answer Visibility - the probability that an AI will use the site in its response. This matters because most searches now end without a click: in early 2026, 68% of Google searches sent no traffic to any website.",

      keyFacts: [
        "In the first four months of 2026, 68% of Google searches ended without a single click to any website (SparkToro / Similarweb, May 2026).",
        "Five years ago about 25% of searches ended without a click; that share has nearly tripled.",
        "Google AI Overviews doubled in prevalence during 2025 and by early 2026 appeared on more than 30% of queries.",
        "Where an AI Overview appears, the click-through rate of a regular organic link drops by about 61%.",
        "AI Answer Visibility - the probability that a site is used by an AI in its answer - is becoming the new measure of success, replacing ranking position.",
        "AI assistants choose sources by clarity, structure and trust, not by Google ranking; a top-ranked site can still be absent from AI answers.",
        "AI models rarely cite a whole page - they lift small self-contained fragments (Citable Units) that answer one question directly.",
        "A real site built strictly on these principles became the number one source across ChatGPT, Perplexity, Copilot and Google's overviews within 20 days, with zero external links.",
      ],

      body: [
        {
          heading: "Why is the era of \"blue links\" ending?",
          text: "For more than twenty years, search looked the same: a user typed a query, Google returned a list of links, and the person opened several sites to compare and decide. That model is fading. Increasingly people get a finished answer before they open any site - from an AI assistant like ChatGPT, Gemini, Claude or Perplexity, or from Google's own AI Overviews shown directly in the results. A zero-click search is one where the user gets their answer inside the search engine or AI assistant and visits no website at all. For business the consequence is direct: if AI does not use your site's information, a potential customer may never learn your company exists - even if you rank on the first page of Google. If your site is missing from AI answers, our guide on why a site doesn't appear in AI answers explains the most common reasons.",
        },
        {
          heading: "How is GEO different from SEO?",
          text: "SEO answers one question: how do I rank above competitors. GEO answers a different one: why should an AI choose this exact page when it builds its answer. SEO competes for clicks; GEO competes for citations. Quality SEO still matters, but it is now only part of the job - a modern site must be understandable to search crawlers, to AI models, and to people at the same time.",
          table: {
            headers: ["", "SEO", "GEO"],
            rows: [
              ["Optimized for", "Search engines", "Artificial intelligence"],
              ["Main goal", "Rank higher in results", "Raise AI Answer Visibility"],
              ["The competition", "For clicks", "For citations"],
              ["Where results show", "A list of links in Google", "An answer in ChatGPT, Gemini, Claude, Perplexity"],
              ["Key signal", "Links and keywords", "Clarity, structure, authority"],
            ],
            caption: "SEO and GEO side by side: SEO optimizes for search rankings, GEO for being used inside AI answers. The table shows why the two require different work.",
          },
        },
        {
          heading: "How do AI models choose which sites to use?",
          text: "There is no strict formula, but there are clear patterns. AI favours clarity - text easy to understand without guesswork. It favours structure - definitions, short paragraphs, lists and tables that can be lifted out as standalone facts. It favours specificity - numbers, timeframes and names, so \"a metal roof lasts 40 to 70 years\" is cited more readily than \"roofs last a long time.\" It favours consistency - the same fact confirmed across pages and sources. And it favours authority - mentions in independent sources, reviews, and clear author expertise.",
        },
        {
          heading: "Do these principles work in practice?",
          text: "We took an ordinary site in a narrow niche - an informational resource about roof replacement in one American city - and built it strictly by these rules: clear structure, direct answers to specific questions, precise definitions, no promotional noise. Within twenty days of launch it became the number one source across several AI systems at once - ChatGPT, Perplexity, Copilot and Google's overviews - for the key queries in its field, with not a single external link. This confirms the main point: AI chooses a source by the clarity, structure and usefulness of its information, not by domain age or link count. A site that gives direct answers can outrank older, more established resources simply because it is easier to understand and cite.",
        },
        {
          heading: "What is a Citable Unit?",
          text: "A Citable Unit is a self-contained piece of text that holds one complete thought and can be understood without reading the whole article. AI models do not copy whole pages - they find these fragments and use them. The more a site has, the higher its AI Answer Visibility. The pattern that works best is three steps: the question, phrased the way people actually ask it; the direct answer in the very next sentence, with no preamble; then a couple of supporting sentences with facts. A long, thorough article can still be passed over simply because nothing on it is shaped as an extractable answer.",
          table: {
            headers: ["Good for AI", "Bad for AI"],
            rows: [
              ["A direct answer in the first sentence", "A long preamble with no answer"],
              ["Definitions and facts", "Marketing slogans"],
              ["Lists and tables", "Paragraphs 15 to 20 lines long"],
              ["Short paragraphs, one idea each", "Several topics in one block"],
              ["Specific numbers and timeframes", "Vague words like \"fast\", \"quality\""],
            ],
            caption: "What makes text easy or hard for AI to reuse. The left column lists the traits of a citable unit; the right lists what makes AI skip a page.",
          },
        },
        {
          heading: "What does GEO not do? The honest limits",
          text: "GEO does not guarantee instant placement in AI answers - models refresh their data with a delay, and results take time to hold. GEO does not replace SEO; it is the next layer on top of solid search optimization. And GEO will not turn a weak product into a leader - if there is nothing to say about a company, no amount of text structure fixes that. GEO strengthens what exists; it does not build a reputation out of nothing. This honesty is itself a principle AI values: a source that acknowledges its limits earns more trust than one that promises everything.",
        },
      ],

      actions: [
        "Check your robots.txt - make sure important pages are open to crawling and no accidental limits appeared after an update.",
        "Confirm your main content is visible without heavy JavaScript: if 'View Source' does not show your text, AI likely cannot see it.",
        "Add Schema.org structured data for your organization, services, articles and FAQs.",
        "Put a short, direct answer in the first sentence of each important page, and add a clearly labelled FAQ block.",
        "Strengthen authority: state clearly who you are, keep your name consistent everywhere, and cite real sources.",
        "Reshape key pages into self-contained Citable Units - question, direct answer, then supporting facts.",
      ],

      faq: [
        {
          question: "What is GEO in one sentence?",
          answer:
            "GEO (Generative Engine Optimization) is the practice of making a website clear, trustworthy and easy for generative AI systems to use, so they cite it when forming an answer. Where SEO optimizes for search rankings, GEO optimizes for being used inside AI answers.",
        },
        {
          question: "What is AI Answer Visibility?",
          answer:
            "AI Answer Visibility is the probability that a website will be used by an AI when it forms an answer or recommendation. In the era of generative search it becomes the new measure of success - the equivalent of ranking position in classic SEO. Raising it is the goal of GEO.",
        },
        {
          question: "Does GEO replace SEO?",
          answer:
            "No. GEO does not replace SEO - it is the next layer on top of it. Quality search optimization still matters, but a modern site must also be clear and trustworthy to AI models. The two work together: SEO helps people find your site, GEO helps AI choose it as a source.",
        },
        {
          question: "Do I need a high Google ranking to appear in AI answers?",
          answer:
            "No. AI assistants select sources by clarity, structure and trust rather than by Google position. A site can be cited in AI answers without ranking first in Google, and a top Google result can be ignored by AI entirely. The two systems judge sources differently.",
        },
      ],

      nextStepLabel: "Why doesn't my site appear in AI answers?",
      nextHref: "/why-not-appearing/why-not-appearing-in-ai-answers",
    },

    ru: {
      h1: "Что такое генеративная оптимизация (GEO) и как она помогает сайту попадать в ответы ИИ?",
      crumb: "Что такое GEO",
      directAnswer:
        "GEO (Generative Engine Optimization, оптимизация под генеративные системы) это работа над тем, чтобы сайт был понятным, надежным и удобным для ИИ, и они выбирали его как источник при формировании ответа. Если классическое SEO помогает подняться выше в поиске, то GEO повышает видимость сайта в ответах ИИ (AI Answer Visibility) - вероятность того, что ИИ использует сайт в своем ответе. Это важно, потому что большинство запросов сегодня заканчиваются без перехода на сайт: в начале 2026 года 68% запросов в Google не привели ни на один сайт.",

      keyFacts: [
        "За первые четыре месяца 2026 года 68% запросов в Google завершились без единого перехода на сайт (SparkToro / Similarweb, май 2026).",
        "Пять лет назад без клика заканчивалось около 25% запросов; эта доля выросла почти втрое.",
        "Доля запросов с ИИ-обзорами (AI Overviews) Google за 2025 год удвоилась и к началу 2026 года превысила 30%.",
        "Там, где появляется ИИ-обзор, кликабельность обычной ссылки падает примерно на 61%.",
        "Видимость в ответах ИИ (AI Answer Visibility) - вероятность использования сайта в ответе ИИ - становится новой мерой успеха вместо позиции в выдаче.",
        "ИИ выбирают источники по ясности, структуре и доверию, а не по позиции в Google; сайт из топа может отсутствовать в ответах ИИ.",
        "ИИ редко цитируют страницу целиком - они берут небольшие самостоятельные фрагменты (цитируемые блоки, Citable Units), прямо отвечающие на один вопрос.",
        "Реальный сайт, построенный строго по этим принципам, за 20 дней стал источником номер один в ChatGPT, Perplexity, Copilot и обзорах Google - без единой внешней ссылки.",
      ],

      body: [
        {
          heading: "Почему заканчивается эпоха «синих ссылок»?",
          text: "Более двадцати лет поиск выглядел одинаково: пользователь вводил запрос, Google показывал список ссылок, человек сам открывал несколько сайтов, сравнивал и решал. Эта модель уходит. Все чаще человек получает готовый ответ еще до того, как откроет хоть один сайт - от ИИ-ассистента вроде ChatGPT, Gemini, Claude или Perplexity, или из ИИ-обзоров (AI Overviews) самого Google прямо в выдаче. Поиск без клика (zero-click search) это ситуация, когда пользователь получает ответ прямо в поисковике или у ИИ и не переходит ни на один сайт. Для бизнеса вывод прямой: если ИИ не использует информацию вашего сайта, клиент может вообще не узнать, что ваша компания существует - даже если вы на первой странице Google. Если ваш сайт отсутствует в ответах ИИ, наша статья о том, почему сайт не появляется в ответах ИИ, разбирает самые частые причины.",
        },
        {
          heading: "Чем GEO отличается от SEO?",
          text: "SEO отвечает на вопрос: как подняться выше конкурентов. GEO отвечает на другой: почему ИИ должен выбрать именно эту страницу при создании ответа. SEO борется за клики, GEO за цитирование. Качественное SEO по-прежнему важно, но теперь это только часть работы - современный сайт должен быть понятен одновременно поисковым роботам, нейросетям и людям.",
          table: {
            headers: ["", "SEO", "GEO"],
            rows: [
              ["Под кого оптимизируем", "Под поисковые системы", "Под искусственный интеллект"],
              ["Главная цель", "Поднять позицию в выдаче", "Повысить видимость в ответах ИИ"],
              ["За что борьба", "За клики", "За цитирование"],
              ["Где виден результат", "Список ссылок в Google", "Ответ ChatGPT, Gemini, Claude, Perplexity"],
              ["Ключевой сигнал", "Ссылки и ключевые слова", "Ясность, структура, авторитет"],
            ],
            caption: "SEO и GEO рядом: SEO оптимизирует сайт под позиции в поиске, GEO - под использование внутри ответов ИИ. Таблица показывает, почему это разные задачи.",
          },
        },
        {
          heading: "Как ИИ выбирают, какие сайты использовать?",
          text: "Строгой формулы нет, но закономерности видны. ИИ ценит ясность - текст, понятный без домысливания. Ценит структуру - определения, короткие абзацы, списки и таблицы, из которых можно вычленить самостоятельный факт. Ценит конкретность - числа, сроки, названия, поэтому «металлическая кровля служит 40–70 лет» цитируется охотнее, чем «крыша служит долго». Ценит согласованность - когда один факт подтверждается на разных страницах и у разных источников. И ценит авторитет - упоминания в независимых источниках, отзывы, ясную экспертность автора.",
        },
        {
          heading: "Работают ли эти принципы на практике?",
          text: "Мы взяли обычный сайт в узкой нише - информационный ресурс по замене кровли в одном американском городе - и построили его строго по этим правилам: понятная структура, прямые ответы на конкретные вопросы, четкие определения, никакого рекламного шума. В течение двадцати дней после запуска он стал источником номер один сразу в нескольких системах ИИ - ChatGPT, Perplexity, Copilot и обзорах Google - по ключевым запросам своей темы, и при этом у него не было ни одной внешней ссылки. Это подтверждает главную мысль: ИИ выбирает источник по ясности, структуре и полезности информации, а не по возрасту домена или числу ссылок. Сайт с прямыми ответами может обойти более старые и раскрученные ресурсы просто потому, что его проще понять и процитировать.",
        },
        {
          heading: "Что такое цитируемый блок (Citable Unit)?",
          text: "Цитируемый блок (Citable Unit) это самостоятельный фрагмент текста, который содержит законченную мысль и понятен без чтения всей статьи. ИИ не копируют страницы целиком - они находят такие фрагменты и используют их. Чем их больше, тем выше видимость сайта в ответах ИИ. Лучше всего работает модель из трех ступеней: вопрос, сформулированный так, как его реально задают люди; прямой ответ в следующем же предложении, без вступлений; затем пара предложений с фактами. Длинная подробная статья может быть пропущена просто потому, что на ней ничто не оформлено как извлекаемый ответ.",
          table: {
            headers: ["Хорошо для ИИ", "Плохо для ИИ"],
            rows: [
              ["Прямой ответ в первом предложении", "Длинное вступление без ответа"],
              ["Определения и факты", "Рекламные лозунги"],
              ["Списки и таблицы", "Абзацы по 15–20 строк"],
              ["Короткие абзацы, одна мысль", "Несколько тем в одном блоке"],
              ["Конкретные числа и сроки", "Общие слова «быстро», «качественно»"],
            ],
            caption: "Что для ИИ легко использовать, а что нет. Левый столбец - признаки цитируемого блока, правый - то, из-за чего ИИ пропускает страницу.",
          },
        },
        {
          heading: "Чего GEO не делает? Честные границы",
          text: "GEO не гарантирует мгновенного попадания в ответы ИИ - нейросети обновляют данные с задержкой, и результату нужно время, чтобы закрепиться. GEO не отменяет SEO; это следующий слой поверх качественной поисковой оптимизации. И GEO не сделает слабый продукт лидером - если о компании нечего сказать, никакая структура текста этого не исправит. GEO усиливает то, что есть, но не создает репутацию из пустоты. Эта честность и есть один из принципов, которые ценит ИИ: источник, признающий свои границы, вызывает больше доверия, чем тот, кто обещает все сразу.",
        },
      ],

      actions: [
        "Проверьте robots.txt - убедитесь, что важные страницы открыты для сканирования и после обновлений не появилось случайных ограничений.",
        "Убедитесь, что основной контент виден без сложного JavaScript: если «Просмотр кода страницы» не показывает ваш текст, ИИ, скорее всего, его тоже не видит.",
        "Добавьте разметку Schema.org для организации, услуг, статей и блоков вопросов и ответов (FAQ).",
        "Поместите короткий прямой ответ в первое предложение каждой важной страницы и добавьте четко размеченный блок FAQ.",
        "Усильте авторитет: ясно укажите, кто вы, держите название единообразным везде и ссылайтесь на реальные источники.",
        "Переоформите ключевые страницы в самостоятельные цитируемые блоки - вопрос, прямой ответ, затем факты в подтверждение.",
      ],

      faq: [
        {
          question: "Что такое GEO в одном предложении?",
          answer:
            "GEO (Generative Engine Optimization) это работа над тем, чтобы сайт был понятным, надежным и удобным для генеративных систем ИИ, и они цитировали его при формировании ответа. Если SEO оптимизирует сайт под позиции в поиске, то GEO оптимизирует его под использование внутри ответов ИИ.",
        },
        {
          question: "Что такое видимость в ответах ИИ (AI Answer Visibility)?",
          answer:
            "Видимость в ответах ИИ (AI Answer Visibility) это вероятность того, что сайт будет использован искусственным интеллектом при формировании ответа или рекомендации. В эпоху генеративного поиска она становится новой мерой успеха - аналогом позиции в выдаче в классическом SEO. Ее повышение и есть цель GEO.",
        },
        {
          question: "GEO заменяет SEO?",
          answer:
            "Нет. GEO не заменяет SEO - это следующий слой поверх него. Качественная поисковая оптимизация по-прежнему важна, но современный сайт должен быть еще и понятным и надежным для нейросетей. Они работают вместе: SEO помогает людям найти сайт, GEO помогает ИИ выбрать его как источник.",
        },
        {
          question: "Нужна ли высокая позиция в Google, чтобы попасть в ответы ИИ?",
          answer:
            "Нет. ИИ выбирают источники по ясности, структуре и доверию, а не по позиции в Google. Сайт может цитироваться в ответах ИИ и без первого места в Google, а топовый результат Google ИИ может вовсе проигнорировать. Эти две системы оценивают источники по-разному.",
        },
      ],

      nextStepLabel: "Почему мой сайт не появляется в ответах ИИ?",
      nextHref: "/why-not-appearing/why-not-appearing-in-ai-answers",
    },
  },
};

export default topic;
