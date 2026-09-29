import type { Topic } from "./types";

// =============================================================
//  ТЕХНИЧЕСКАЯ СТАТЬЯ: Технический чек-лист GEO
//  Раздел: check-readiness (order 3)
//  Глубокая, плотная статья для разработчиков и техмаркетологов.
//  Факты проверены веб-поиском (июнь–июль 2026): офиц. документации
//  OpenAI, Anthropic, Apple; анализ 500+ млн запросов GPTBot; см. sources.
//  Экспертный слой: методика AIRS, наш кейс (кровельный сайт без домена).
//  Фирменный термин: видимость в ответах ИИ (AI Answer Visibility).
//  Правило: длинных тире нет.
// =============================================================

const topic: Topic = {
  slug: "technical-geo-checklist",
  section: "check-readiness",
  status: "published",
  accent: "rgba(14,165,233,0.185)",
  datePublished: "2026-07-03",
  sources: [
    {
      label:
        "OpenAI - Overview of OpenAI Crawlers (GPTBot, OAI-SearchBot, ChatGPT-User)",
      url: "https://developers.openai.com/api/docs/bots",
    },
    {
      label:
        "Anthropic - Does Anthropic crawl data from the web, and how can site owners block the crawler",
      url: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler",
    },
    {
      label: "Apple - About Applebot (Applebot, Applebot-Extended)",
      url: "https://support.apple.com/en-us/119829",
    },
    {
      label:
        "Vercel - The Rise of the AI Crawler (анализ рендеринга JavaScript ИИ-ботами)",
      url: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      label:
        "Методика AIRS (AI Ready Score) - AI Answers Rank",
      url: "/method",
    },
    {
      label:
        "AI Answers Rank - Что такое генеративная оптимизация (GEO)",
      url: "/why-it-matters/what-is-geo",
    },
    {
      label:
        "AI Answers Rank - Почему мой сайт не появляется в ответах ИИ",
      url: "/why-not-appearing/why-not-appearing-in-ai-answers",
    },
  ],

  content: {
    en: {
      h1: "How do you configure a site's code so AI crawlers can read it?",
      crumb: "Technical GEO checklist",
      directAnswer:
        "To be readable by AI, a site must do three technical things: open its pages to AI crawlers in robots.txt, deliver its main content as server-rendered HTML rather than client-side JavaScript, and return that HTML fast enough that the crawler does not time out. The single most decisive factor is rendering. An analysis of more than 500 million GPTBot fetches found zero cases of JavaScript execution, so any text that appears only after JavaScript runs is invisible to the AI. Fix these three layers and your content becomes eligible for citation; miss any one of them and even excellent writing never reaches the model.",

      keyFacts: [
        "As of mid-2026, none of the major AI crawlers execute JavaScript: GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot and PerplexityBot all read only the raw HTML (Vercel and Lantern analyses of 500M+ GPTBot fetches).",
        "The one real exception is Google Gemini, which uses Googlebot's rendering infrastructure and can run JavaScript; Applebot also renders JavaScript on a WebKit engine.",
        "OpenAI runs three separate crawlers: GPTBot (training), OAI-SearchBot (ChatGPT search index) and ChatGPT-User (user-initiated fetch). Each is controlled independently in robots.txt.",
        "Anthropic runs three: ClaudeBot (training), Claude-SearchBot (search index) and Claude-User (user-initiated fetch). The old Claude-Web and anthropic-ai tokens are deprecated.",
        "Blocking a training bot does not block the matching search bot. Blocking GPTBot alone still leaves OAI-SearchBot free, and blocking ClaudeBot alone still leaves Claude-SearchBot free.",
        "AI crawlers apply short timeouts of roughly 1 to 5 seconds and do not make a second attempt, so a slow first byte means the page is simply skipped.",
        "A practical Time to First Byte target for AI crawlers is under 200 ms as excellent and under 500 ms as acceptable, stricter than the classic SEO guideline for Google.",
        "Around 27% of sites unintentionally block AI crawlers through robots.txt, a WAF or a CDN rule, so the block is often accidental rather than deliberate.",
      ],

      body: [
        {
          heading: "How are AI crawlers different from Googlebot?",
          text: "The core difference is rendering. Googlebot runs a headless Chrome engine: it downloads a page, executes the JavaScript, waits for content to appear and then indexes the result. AI crawlers do not do this. When GPTBot or ClaudeBot requests a page, it takes the raw HTML the server returns and moves on, without running a single line of JavaScript. In March 2026 Google even removed its long-standing JavaScript SEO warning because Googlebot's rendering had matured, but that progress does not transfer to AI crawlers. A site that has been carefully tuned for Google can still be completely blank to the systems behind ChatGPT, Claude and Perplexity. Treating the two as the same problem is the most common and most expensive mistake in technical GEO.",
        },
        {
          heading: "How do GPTBot, ClaudeBot and Applebot actually behave?",
          text: "Each major AI vendor now splits its work across several bots with distinct jobs, and the practical rule is that a training bot and a search bot are controlled separately. Blocking one does not block the other. For visibility in AI answers the bots that matter most are the search and user bots, not the training bots. The table below lists the bots that decide whether your content can appear in an AI answer, along with whether each one runs JavaScript.",
          table: {
            headers: ["Bot", "Vendor", "Job", "Runs JavaScript"],
            rows: [
              ["GPTBot", "OpenAI", "Training", "No"],
              ["OAI-SearchBot", "OpenAI", "ChatGPT search index", "No"],
              ["ChatGPT-User", "OpenAI", "User-initiated fetch", "No"],
              ["ClaudeBot", "Anthropic", "Training", "No"],
              ["Claude-SearchBot", "Anthropic", "Search index", "No"],
              ["PerplexityBot", "Perplexity", "Search index", "No"],
              ["Applebot", "Apple", "Siri, Spotlight, Safari", "Yes"],
            ],
            caption: "The AI crawlers that determine whether your content can appear in an AI answer, and which of them render JavaScript. Only Applebot renders it; the rest read raw HTML only. Use this to decide what must be server-rendered.",
          },
        },
        {
          heading: "How do you configure robots.txt without harming security?",
          text: "The goal is to open your public pages to AI crawlers while keeping private areas closed, and to avoid the accidental blanket block that catches roughly a quarter of sites. Never disallow everything with a wildcard in the belief that it only stops AI, because the same rule removes you from Google and Bing as well. Instead, allow the search and user bots explicitly, keep training bots as a separate decision, and disallow only the directories that should never be public such as admin panels, account areas and internal tools. A workable starting point looks like this:",
          table: {
            headers: ["Directive", "Effect"],
            rows: [
              ["User-agent: OAI-SearchBot / Allow: /", "ChatGPT search can index public pages"],
              ["User-agent: Claude-SearchBot / Allow: /", "Claude search can index public pages"],
              ["User-agent: PerplexityBot / Allow: /", "Perplexity can index public pages"],
              ["User-agent: * / Disallow: /admin/ /account/", "Private areas stay closed to every bot"],
            ],
            caption: "A safe robots.txt starting point: open the AI search bots to public content while keeping private directories closed. Training bots (GPTBot, ClaudeBot) are a separate opt-in or opt-out decision that does not affect search visibility.",
          },
        },
        {
          heading: "Why can't AI assistants see your text when it is built with JavaScript?",
          text: "Because they never run the JavaScript that builds it. A single-page application in React, Vue or Angular that renders on the client sends the crawler an almost empty shell: a root element and a script tag, with the real content assembled only after the browser executes the code. A human sees a full page; GPTBot sees the shell and nothing else. There is no partial credit here. The page either has its content in the initial HTML response or it does not. The fix is server-side rendering (SSR) or static generation (SSG), where the server sends complete HTML that already contains the headings, body text, links and structured data. Frameworks like Next.js, Nuxt and Astro make this the default, but the choice is in your hands: a Next.js page that fetches its data inside a client effect will still arrive empty. The reliable test takes one minute. Open the page, view its raw source, and search for a sentence of your own body text. If it is not there, the AI cannot see it either.",
        },
        {
          heading: "Why does server speed decide whether you appear in answers?",
          text: "Because AI crawlers are impatient in a way Googlebot is not. They apply timeouts of roughly one to five seconds and, critically, they do not come back for a second try. If your Time to First Byte is slow because of an overloaded server or a heavy database query, the crawler abandons the request before your content loads, and the page silently never enters the model's knowledge. There are no error pages and no drop in human analytics, which is why this failure is so easy to miss. A useful target is a TTFB under 200 milliseconds, with anything past 600 milliseconds worth urgent investigation. The most effective single fix is aggressive server-side caching: for pages that rarely change, cache the rendered HTML and serve it instantly instead of rebuilding it on every request, and put it behind a content delivery network so the crawler hits an edge server rather than your origin. This alone can cut a 1200-millisecond first byte to under 100.",
        },
        {
          heading: "What does the technical layer not fix? The honest limits",
          text: "Technical correctness is a gate, not an engine. Passing it makes your content eligible to be cited; it does not make the content worth citing. In our own work we saw both sides of this. We built a site in a narrow niche, an informational resource about roof replacement in one American city, strictly on these rules: clean server-rendered HTML, open crawler access, fast response, structured data. Within twenty days it became the number one source across ChatGPT, Perplexity, Copilot and Google's overviews for its key queries, with zero external links. But the technique alone did not do that. It removed the obstacles so the substance could be seen. A fast, open, perfectly rendered page with nothing useful on it still gets ignored. This is the same honesty AI rewards: fix the code so the model can read you, then give it something worth reading. Our AIRS methodology treats the technical layer as one of four dimensions for exactly this reason, alongside content, authority and structure.",
        },
      ],

      actions: [
        "View the raw HTML source of your key pages (not the rendered DOM) and confirm your main body text is present without JavaScript. If it is missing, move to SSR or SSG.",
        "Check robots.txt for an accidental blanket Disallow, and make sure OAI-SearchBot, Claude-SearchBot and PerplexityBot are allowed on public pages.",
        "Treat training bots (GPTBot, ClaudeBot, Applebot-Extended) as a separate opt-in or opt-out decision that does not affect search visibility.",
        "Measure Time to First Byte on your main templates and target under 200 ms; investigate anything above 600 ms.",
        "Add server-side caching for pages that rarely change and serve them through a CDN to cut first-byte time and survive crawler timeouts.",
        "Audit your WAF and CDN rules for rate limits or challenges that return 429 or 403 to verified AI crawler traffic, a frequent cause of accidental blocking.",
        "Keep the essential text and Schema.org markup in the initial HTML response, and reserve JavaScript for interactive extras only.",
      ],

      faq: [
        {
          question: "Do AI crawlers render JavaScript in 2026?",
          answer:
            "Almost none of them do. As of mid-2026 GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot and PerplexityBot all read only the raw HTML and do not execute JavaScript, confirmed by an analysis of more than 500 million GPTBot fetches. The main exceptions are Google Gemini, which uses Googlebot's rendering, and Applebot, which renders on a WebKit engine. For everything else, content that appears only after JavaScript runs is invisible.",
        },
        {
          question: "Does blocking GPTBot remove me from ChatGPT answers?",
          answer:
            "Not by itself. GPTBot is OpenAI's training crawler, while ChatGPT search visibility depends on OAI-SearchBot. They are controlled by separate robots.txt directives, so you can block training while staying visible in ChatGPT search, or the reverse. The same split applies to Anthropic, where ClaudeBot handles training and Claude-SearchBot handles search.",
        },
        {
          question: "Is a fast Google PageSpeed score enough for AI crawlers?",
          answer:
            "Not necessarily. Google renders JavaScript and will wait and retry, so a client-rendered page can still score well and rank. AI crawlers do neither: they read raw HTML once and apply a one to five second timeout with no second attempt. A page that satisfies Google can still be invisible to AI if its content depends on JavaScript or its first byte is slow.",
        },
        {
          question: "Will fixing the code guarantee that AI cites my site?",
          answer:
            "No. A correct technical setup makes your content eligible to be cited, but it does not make it citable on its own. The code layer removes the obstacles; the content still has to answer the question clearly, specifically and with authority. Technical work and content quality are separate requirements, and both are needed.",
        },
      ],

      nextStepLabel: "What a site needs: Schema.org markup",
      nextHref: "/what-site-needs/schema-org-for-ai",
    },

    ru: {
      h1: "Как настроить код сайта, чтобы ИИ-краулеры могли его прочитать?",
      crumb: "Технический чек-лист GEO",
      directAnswer:
        "Чтобы сайт был читаем для ИИ, код должен решать три задачи: открывать страницы ИИ-краулерам в robots.txt, отдавать основной контент готовым HTML с сервера, а не собирать его JavaScript в браузере, и делать это достаточно быстро, чтобы бот не отвалился по таймауту. Самый решающий фактор это рендеринг. Анализ более 500 миллионов запросов GPTBot не выявил ни одного случая исполнения JavaScript, поэтому любой текст, который появляется только после работы скриптов, для ИИ невидим. Настройте эти три слоя, и контент станет пригодным для цитирования. Пропустите хоть один, и даже отличный текст до модели не дойдет.",

      keyFacts: [
        "На середину 2026 года ни один крупный ИИ-краулер не исполняет JavaScript: GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot и PerplexityBot читают только исходный HTML (анализ Vercel и Lantern на 500+ млн запросов GPTBot).",
        "Единственное реальное исключение это Google Gemini, использующий инфраструктуру рендеринга Googlebot; Applebot также рендерит JavaScript на движке WebKit.",
        "У OpenAI три отдельных краулера: GPTBot (обучение), OAI-SearchBot (поисковый индекс ChatGPT) и ChatGPT-User (переход по запросу пользователя). Каждый управляется в robots.txt независимо.",
        "У Anthropic тоже три: ClaudeBot (обучение), Claude-SearchBot (поисковый индекс) и Claude-User (переход по запросу). Старые токены Claude-Web и anthropic-ai устарели.",
        "Блокировка обучающего бота не блокирует поисковый. Заблокировав только GPTBot, вы оставляете свободным OAI-SearchBot, а заблокировав только ClaudeBot, оставляете свободным Claude-SearchBot.",
        "ИИ-краулеры используют короткие таймауты примерно от 1 до 5 секунд и не делают повторной попытки, поэтому медленный первый байт означает, что страницу просто пропустят.",
        "Практический ориентир по времени до первого байта (TTFB) для ИИ-краулеров: до 200 мс это отлично, до 500 мс приемлемо. Это строже, чем классическая норма SEO для Google.",
        "Около 27% сайтов случайно блокируют ИИ-краулеров через robots.txt, файрвол (WAF) или CDN, то есть блокировка чаще случайная, чем намеренная.",
      ],

      body: [
        {
          heading: "Чем ИИ-краулеры отличаются от Googlebot?",
          text: "Главное отличие в рендеринге. Googlebot работает на движке headless Chrome: скачивает страницу, исполняет JavaScript, дожидается появления контента и только потом индексирует результат. ИИ-краулеры так не делают. Когда GPTBot или ClaudeBot запрашивает страницу, он берет исходный HTML, который вернул сервер, и уходит дальше, не выполнив ни строчки JavaScript. В марте 2026 года Google даже убрал свое давнее предупреждение о JavaScript для SEO, потому что рендеринг Googlebot дозрел. Но этот прогресс на ИИ-краулеров не распространяется. Сайт, аккуратно настроенный под Google, для систем ChatGPT, Claude и Perplexity может оказаться полностью пустым. Считать эти две задачи одной и той же это самая частая и самая дорогая ошибка в технической части GEO.",
        },
        {
          heading: "Как на самом деле ведут себя GPTBot, ClaudeBot и Applebot?",
          text: "Каждый крупный поставщик ИИ теперь делит работу между несколькими ботами с разными задачами, и практическое правило такое: обучающий и поисковый боты управляются раздельно. Блокировка одного не блокирует другой. Для видимости в ответах ИИ важнее всего поисковые и пользовательские боты, а не обучающие. В таблице ниже собраны боты, которые решают, может ли ваш контент попасть в ответ ИИ, и указано, исполняет ли каждый из них JavaScript.",
          table: {
            headers: ["Бот", "Поставщик", "Задача", "Исполняет JavaScript"],
            rows: [
              ["GPTBot", "OpenAI", "Обучение", "Нет"],
              ["OAI-SearchBot", "OpenAI", "Поисковый индекс ChatGPT", "Нет"],
              ["ChatGPT-User", "OpenAI", "Переход по запросу", "Нет"],
              ["ClaudeBot", "Anthropic", "Обучение", "Нет"],
              ["Claude-SearchBot", "Anthropic", "Поисковый индекс", "Нет"],
              ["PerplexityBot", "Perplexity", "Поисковый индекс", "Нет"],
              ["Applebot", "Apple", "Siri, Spotlight, Safari", "Да"],
            ],
            caption: "ИИ-краулеры, от которых зависит, попадет ли ваш контент в ответ ИИ, и кто из них рендерит JavaScript. Рендерит только Applebot, остальные читают лишь исходный HTML. По этой таблице решают, что обязательно отдавать с сервера.",
          },
        },
        {
          heading: "Как настроить robots.txt без ущерба для безопасности?",
          text: "Задача в том, чтобы открыть публичные страницы ИИ-краулерам, оставив закрытыми приватные разделы, и не попасть в случайную сплошную блокировку, которая ловит примерно четверть сайтов. Никогда не запрещайте все подряд общей маской в расчете, что так вы остановите только ИИ: то же правило уберет вас из Google и Bing. Вместо этого явно разрешите поисковые и пользовательские боты, обучающие оставьте отдельным решением, а запрещайте только те каталоги, которые не должны быть публичными: админ-панели, личные кабинеты, внутренние инструменты. Рабочая отправная точка выглядит так:",
          table: {
            headers: ["Директива", "Что делает"],
            rows: [
              ["User-agent: OAI-SearchBot / Allow: /", "Поиск ChatGPT индексирует публичные страницы"],
              ["User-agent: Claude-SearchBot / Allow: /", "Поиск Claude индексирует публичные страницы"],
              ["User-agent: PerplexityBot / Allow: /", "Perplexity индексирует публичные страницы"],
              ["User-agent: * / Disallow: /admin/ /account/", "Приватные разделы закрыты для всех ботов"],
            ],
            caption: "Безопасная отправная точка robots.txt: открыть поисковые боты ИИ к публичному контенту и закрыть приватные каталоги. Обучающие боты (GPTBot, ClaudeBot) это отдельное решение, которое на поисковую видимость не влияет.",
          },
        },
        {
          heading: "Почему ИИ-ассистенты не видят ваш текст, если он собран на JavaScript?",
          text: "Потому что они не запускают JavaScript, который его собирает. Одностраничное приложение на React, Vue или Angular, отрисованное на клиенте, отдает краулеру почти пустую оболочку: корневой элемент и тег скрипта, а настоящий контент собирается только после того, как браузер выполнит код. Человек видит полную страницу, а GPTBot видит оболочку и больше ничего. Промежуточного варианта здесь нет. Либо контент есть в исходном HTML-ответе, либо его нет. Решение это рендеринг на сервере (SSR) или статическая генерация (SSG), когда сервер отдает готовый HTML, где уже есть заголовки, текст, ссылки и структурированные данные. Фреймворки вроде Next.js, Nuxt и Astro делают это поведением по умолчанию, но выбор остается за вами: страница на Next.js, которая грузит данные внутри клиентского эффекта, все равно придет пустой. Надежная проверка занимает минуту. Откройте страницу, посмотрите ее исходный код и найдите предложение из вашего текста. Если его там нет, значит, и ИИ его не видит.",
        },
        {
          heading: "Почему скорость сервера решает, попадете ли вы в ответы?",
          text: "Потому что ИИ-краулеры нетерпеливы так, как Googlebot не бывает. Они применяют таймауты примерно от одной до пяти секунд и, что важнее всего, не возвращаются за второй попыткой. Если время до первого байта велико из-за перегруженного сервера или тяжелого запроса к базе, краулер бросает запрос еще до загрузки контента, и страница тихо не попадает в знание модели. При этом нет ни страниц ошибок, ни просадки в аналитике по людям, поэтому такой сбой так легко упустить. Полезный ориентир это TTFB меньше 200 миллисекунд, а все, что выше 600, требует срочной проверки. Самое эффективное одиночное решение это агрессивное кэширование на сервере: для редко меняющихся страниц кэшируйте готовый HTML и отдавайте его мгновенно, а не пересобирайте на каждый запрос, и поставьте перед ним сеть доставки контента (CDN), чтобы краулер попадал на ближайший сервер, а не на ваш источник. Только это способно сократить первый байт с 1200 миллисекунд до менее чем 100.",
        },
        {
          heading: "Чего технический слой не решает? Честные границы",
          text: "Техническая корректность это пропускной пункт, а не двигатель. Пройдя его, ваш контент становится пригодным для цитирования, но пригодным для цитирования его делает не это. В своей работе мы видели обе стороны. Мы построили сайт в узкой нише, информационный ресурс по замене кровли в одном американском городе, строго по этим правилам: чистый HTML с сервера, открытый доступ для краулеров, быстрый ответ, структурированные данные. За двадцать дней он стал источником номер один в ChatGPT, Perplexity, Copilot и обзорах Google по ключевым запросам своей темы, и без единой внешней ссылки. Но сделала это не одна техника. Она убрала препятствия, чтобы стало видно суть. Быстрая, открытая, идеально отрисованная страница, на которой нет ничего полезного, все равно останется без внимания. Это та же честность, которую ИИ вознаграждает: сначала почините код, чтобы модель могла вас прочитать, а затем дайте ей то, что стоит читать. Наша методика AIRS не случайно считает технический слой лишь одним из четырех направлений оценки, наряду с контентом, авторитетом и структурой.",
        },
      ],

      actions: [
        "Посмотрите исходный HTML-код ключевых страниц (не отрисованный DOM) и убедитесь, что основной текст присутствует без JavaScript. Если его нет, переходите на SSR или SSG.",
        "Проверьте robots.txt на случайный сплошной Disallow и убедитесь, что OAI-SearchBot, Claude-SearchBot и PerplexityBot разрешены на публичных страницах.",
        "Относитесь к обучающим ботам (GPTBot, ClaudeBot, Applebot-Extended) как к отдельному решению, которое не влияет на поисковую видимость.",
        "Измерьте время до первого байта на основных шаблонах и целитесь ниже 200 мс, а все выше 600 мс расследуйте.",
        "Добавьте кэширование на сервере для редко меняющихся страниц и отдавайте их через CDN, чтобы сократить первый байт и пережить таймауты краулеров.",
        "Проверьте правила файрвола (WAF) и CDN на лимиты и проверки, которые отдают 429 или 403 в ответ на проверенный трафик ИИ-краулеров, это частая причина случайной блокировки.",
        "Держите основной текст и разметку Schema.org в исходном HTML-ответе, а JavaScript оставьте только для интерактивных дополнений.",
      ],

      faq: [
        {
          question: "Рендерят ли ИИ-краулеры JavaScript в 2026 году?",
          answer:
            "Почти никто из них. На середину 2026 года GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot и PerplexityBot читают только исходный HTML и не исполняют JavaScript, что подтверждено анализом более 500 миллионов запросов GPTBot. Основные исключения это Google Gemini, использующий рендеринг Googlebot, и Applebot, который рендерит на движке WebKit. Для всего остального контент, появляющийся только после работы скриптов, невидим.",
        },
        {
          question: "Если заблокировать GPTBot, пропаду ли я из ответов ChatGPT?",
          answer:
            "Сам по себе нет. GPTBot это обучающий краулер OpenAI, а видимость в поиске ChatGPT зависит от OAI-SearchBot. Они управляются разными директивами robots.txt, поэтому можно закрыть обучение и остаться видимым в поиске ChatGPT, или наоборот. У Anthropic то же разделение: ClaudeBot отвечает за обучение, а Claude-SearchBot за поиск.",
        },
        {
          question: "Достаточно ли высокой оценки Google PageSpeed для ИИ-краулеров?",
          answer:
            "Не обязательно. Google рендерит JavaScript, умеет ждать и делать повторную попытку, поэтому страница на клиентском рендеринге может показывать хорошую оценку и хорошо ранжироваться. ИИ-краулеры не делают ни того, ни другого: они читают исходный HTML один раз и применяют таймаут от одной до пяти секунд без второй попытки. Страница, которая устраивает Google, для ИИ может остаться невидимой, если ее контент зависит от JavaScript или первый байт приходит медленно.",
        },
        {
          question: "Гарантирует ли исправление кода, что ИИ процитирует мой сайт?",
          answer:
            "Нет. Правильная техническая настройка делает контент пригодным для цитирования, но сама по себе цитируемым его не делает. Слой кода убирает препятствия, а текст все равно должен отвечать на вопрос ясно, конкретно и с авторитетом. Техническая работа и качество контента это отдельные требования, и нужны оба.",
        },
      ],

      nextStepLabel: "Что должно быть на сайте: разметка Schema.org",
      nextHref: "/what-site-needs/schema-org-for-ai",
    },
  },
};

export default topic;
