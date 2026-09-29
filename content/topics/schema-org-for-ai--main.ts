import type { Topic } from "./types";

// =============================================================
//  СТАТЬЯ: Семантическая разметка Schema.org для ИИ
//  Раздел: what-site-needs (order 4)
//  Глубокая, плотная статья для разработчиков и техмаркетологов.
//  Факты проверены веб-поиском (июль 2026): свойства Schema.org,
//  роль sameAs/about/mentions/areaServed, изменение Google по FAQ
//  (7 мая 2026 rich-результаты убраны, тип FAQPage валиден); см. sources.
//  Экспертный слой: методика AIRS, наш кейс (кровельный сайт без домена).
//  Фирменный термин: видимость в ответах ИИ (AI Answer Visibility).
//  Правило: длинных тире нет.
// =============================================================

const topic: Topic = {
  slug: "schema-org-for-ai",
  section: "what-site-needs",
  status: "published",
  accent: "rgba(139,92,246,0.185)",
  datePublished: "2026-07-03",
  sources: [
    {
      label: "Schema.org - Organization (типы и свойства)",
      url: "https://schema.org/Organization",
    },
    {
      label:
        "Google Search Central - Intro to structured data markup (JSON-LD)",
      url: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
    },
    {
      label:
        "Google Search Central - FAQ (FAQPage) structured data (примечание о снятии rich-результатов, 7 мая 2026)",
      url: "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
    },
    {
      label: "Методика AIRS (AI Ready Score) - AI Answers Rank",
      url: "/method",
    },
    {
      label:
        "AI Answers Rank - Что такое генеративная оптимизация (GEO)",
      url: "/why-it-matters/what-is-geo",
    },
    {
      label:
        "AI Answers Rank - Как настроить код сайта для ИИ-краулеров",
      url: "/check-readiness/technical-geo-checklist",
    },
  ],

  content: {
    en: {
      h1: "How does Schema.org markup help AI assistants understand your business?",
      crumb: "Schema.org for AI",
      directAnswer:
        "Schema.org markup in JSON-LD is a machine-readable layer of facts placed alongside your text, and it lets an AI read your business as declared data rather than guess it from prose. The single most important property for this is sameAs, which links your site to your official profiles so the AI knows your website, your social accounts and your external listings all describe one entity. Markup will not force an AI to cite you, but missing or wrong markup can make it cite you under the wrong name or with the wrong description. It is cheap insurance against ambiguity, and it works only when it matches the visible content on the page.",

      keyFacts: [
        "JSON-LD is the format Google recommends for structured data; browsers ignore it, while search engines and AI systems parse it explicitly (Google Search Central).",
        "The sameAs property, an array of your official profile URLs, is widely regarded as the single most important field for entity disambiguation.",
        "AI systems pull structured facts such as founding date, location, product category and price preferentially from JSON-LD rather than inferring them from prose.",
        "Specificity is rewarded: a precise type like LocalBusiness or a narrower subtype is read more confidently than a generic Organization, because it matches a query category.",
        "A fact present in visible text but absent from the schema can be missed; for example, a service area belongs in areaServed, not only in a sentence.",
        "On May 7, 2026 Google removed FAQ rich results from Search, but the FAQPage type itself is not deprecated and remains valid, parseable markup (Google Search Central).",
        "Google's own guidance is that no special markup is required for AI answers and that any structured data must match the page's visible content.",
        "The value is asymmetric: correct markup is a modest help, but wrong markup that contradicts your text or describes content that is not on the page actively harms trust.",
      ],

      body: [
        {
          heading: "Why does an AI understand the world through entities, not just words?",
          text: "A human reader can glance at a page and infer that a company is called one thing, that a price belongs to a particular product, and that a named person wrote the article, even when those facts are scattered across headings, body copy and the footer. A machine is less forgiving. When meaning is implied rather than declared, extraction gets weaker and attribution gets messier. An entity is a distinct thing the AI can name and connect: a company, a person, a product, a place. Structured data lets you declare those things and the relationships between them instead of hoping the model guesses correctly. This is why the word Apple is a useful test. In plain text it could be the company, the fruit or the album. In JSON-LD you state, without ambiguity, which entity the page is about, and the AI binds your domain to the right one in its internal map.",
        },
        {
          heading: "What does Organization markup give you, and why is sameAs so important?",
          text: "Organization schema is the block that tells an AI who you are: your name, your site, your logo, your contact point and, above all, your sameAs links. Those links point to your official profiles, for example your LinkedIn page, your verified social accounts and any authoritative listing, and they let the AI merge information from several sources into a single confident entity record. Without them, the model has to infer your identity from text patterns, which is where similarly named businesses get confused with each other. The rule that matters most in practice is consistency. The same name, URL and description must appear identically everywhere, because drift between pages is the leading cause of entity confusion. Keep this block on your homepage and About page, and give it a stable @id so other blocks, such as your articles and your author, can reference the same organization.",
          table: {
            headers: ["Property", "What it declares"],
            rows: [
              ["name / url / logo", "The core identity of the brand"],
              ["sameAs", "Official profiles that prove this is one entity"],
              ["contactPoint", "How to reach the business"],
              ["@id", "A stable handle so other schema can link to it"],
              ["knowsAbout", "The topics the organization is authoritative on"],
            ],
            caption: "The Organization properties that matter most for AI entity recognition. sameAs is the key field: it binds your website, social profiles and listings into a single entity the AI can identify with confidence.",
          },
        },
        {
          heading: "How do you mark up commercial pages with Product and Service?",
          text: "On pages that sell something, the goal is to hand the AI the specifics it would otherwise have to guess: what the thing is, what it costs, where you offer it and what people think of it. Product schema carries the name, description, price through an offer, and aggregate rating where real reviews exist. Service schema does the same for work you perform rather than an item you ship, and it pairs naturally with areaServed to state your geography. This last point is easy to underrate. If your page says in prose that you serve a particular region but that fact never appears in areaServed, an AI filtering businesses by location may simply skip you. Two cautions hold everything together. Never publish an aggregate rating without real reviews behind it, and never state a price in schema that differs from the price on the page. Both are guideline violations, and a contradiction between markup and visible text costs you more trust than the markup was ever going to earn.",
        },
        {
          heading: "How do the about and mentions properties control context?",
          text: "Two properties let you tell the AI what a page is actually about. The about property names the primary subject, the one thing the page is centred on, while mentions names secondary entities that appear but are not the focus. Declaring about is how you remove the last of the ambiguity: a page can be filled with related terms, yet about states plainly that this page is centred on, say, roof replacement rather than roofing materials in general. For a local business, the same logic connects you to a place. Naming your city and region as entities, and stating your service area explicitly, helps an AI answer a location-specific question with your business in it. The principle throughout is the same one that governs all of this: you are replacing inference with declaration, so the model spends less effort guessing and makes fewer mistakes about you.",
        },
        {
          heading: "What happened to FAQ markup in 2026, and should you still use it?",
          text: "This is where a recent change matters, and getting it wrong means acting on stale advice. On May 7, 2026 Google removed FAQ rich results from Search, so the expandable question-and-answer dropdowns that once enlarged a listing no longer appear. The important distinction is that the SERP feature was retired, not the schema type. FAQPage remains a valid Schema.org type, it does not need to be removed, and it is still parsed by Bing, Perplexity and the retrieval crawlers behind AI answers. The correct posture now is simple. Use FAQPage only where genuine question-and-answer content is visible on the page, never to chase a display feature that no longer exists and never to mark up questions a reader cannot see. This mirrors Google's broader position: no special markup is required for AI answers, and any structured data you add must match the visible content. The schema describes the content; it was never a substitute for it.",
        },
        {
          heading: "What does markup not do? The honest limits",
          text: "Markup is a translator, not a source of authority. It states your facts clearly so a machine reads them correctly, but it cannot make a weak page worth citing, and it cannot invent a reputation you have not earned. It also cannot lie for you. Schema that contradicts the visible text, or describes things that are not on the page, is a guideline violation that erodes trust rather than building it, and AI extractors discount marketing language inside schema anyway. On our own reference site, an informational resource about roof replacement in one American city, we used a connected set of Organization, Article, FAQPage and BreadcrumbList markup, with an author declared as a real person. It helped, but it was not the reason the site became a top source across ChatGPT, Perplexity, Copilot and Google's overviews within twenty days. The markup made the facts legible; the content made them worth reading. Our AIRS methodology treats structured data as part of the structure dimension for exactly this reason, alongside technical health, content and authority, because no single layer carries the whole load.",
        },
      ],

      actions: [
        "Add an Organization block with a stable @id, a complete sameAs array of your official profiles, and identical name, url and description across every page.",
        "Give your key entities their own @id and link them: article to author, author to organization, organization to website, so they form a connected graph.",
        "Choose the most specific type available (for example LocalBusiness or a narrower subtype) rather than a generic Organization, so it matches a query category.",
        "For local or service businesses, state your geography explicitly in areaServed, not only in prose.",
        "On commercial pages, mark up Product or Service with price via offer, and only include an aggregate rating where real reviews exist.",
        "Use about to name each page's primary subject and mentions for secondary entities, removing ambiguity about what the page covers.",
        "Keep FAQPage only where visible question-and-answer content exists on the page, and confirm every schema fact matches the visible text.",
      ],

      faq: [
        {
          question: "Do AI assistants read my JSON-LD directly?",
          answer:
            "Sometimes directly and often indirectly. Some AI systems parse JSON-LD when they retrieve a page, and others rely on search indexes that use your structured data to classify the page. Either way, clean markup makes your facts easier to extract correctly. The format Google recommends is JSON-LD, and it is the easiest for machines to lift.",
        },
        {
          question: "Is FAQ schema dead after Google's 2026 change?",
          answer:
            "No. On May 7, 2026 Google removed the FAQ rich result, the visual dropdown in Search, but the FAQPage schema type is not deprecated and stays valid. It is still parsed by Bing, Perplexity and AI retrieval crawlers. Keep it where real, visible question-and-answer content exists, and stop using it only as a way to win a display feature that no longer appears.",
        },
        {
          question: "What is the single most important property for AI visibility?",
          answer:
            "For most sites it is sameAs on the Organization entity. It links your site to your official profiles and lets an AI confidently resolve that all of them describe one business. If you implement only one thing, a complete Organization block with sameAs links on your homepage tends to give the highest return for the effort.",
        },
        {
          question: "Will adding schema guarantee that AI cites my site?",
          answer:
            "No. Markup makes your facts legible and removes ambiguity, but it does not make a page worth citing and cannot manufacture authority. It also must match your visible content: schema that contradicts the page or describes content that is not there harms trust. Structured data and strong content are separate requirements, and both are needed.",
        },
      ],

      nextStepLabel: "How to write content that AI assistants cite",
      nextHref: "/content-ai-uses/writing-citable-content",
    },

    ru: {
      h1: "Как разметка Schema.org помогает ИИ-ассистентам понять ваш бизнес?",
      crumb: "Разметка Schema.org для ИИ",
      directAnswer:
        "Разметка Schema.org в формате JSON-LD это машиночитаемый слой фактов рядом с вашим текстом, и он позволяет ИИ читать ваш бизнес как объявленные данные, а не угадывать его из прозы. Самое важное свойство здесь это sameAs: оно связывает ваш сайт с официальными профилями, чтобы ИИ понимал, что сайт, соцсети и внешние карточки описывают одну и ту же сущность. Разметка не заставит ИИ вас процитировать, но ее отсутствие или ошибки в ней могут привести к цитированию с неверным именем или описанием. Это дешевая страховка от двусмысленности, и работает она только тогда, когда совпадает с видимым содержанием страницы.",

      keyFacts: [
        "JSON-LD это формат, который Google рекомендует для структурированных данных; браузеры его игнорируют, а поисковики и ИИ разбирают явно (Google Search Central).",
        "Свойство sameAs, массив ссылок на ваши официальные профили, широко считается важнейшим полем для распознавания сущности.",
        "ИИ берет структурные факты (дату основания, местоположение, категорию товара, цену) в первую очередь из JSON-LD, а не выводит их из прозы.",
        "Конкретность вознаграждается: точный тип вроде LocalBusiness или более узкий подтип читается увереннее, чем общий Organization, потому что совпадает с категорией запроса.",
        "Факт, который есть в видимом тексте, но отсутствует в разметке, может быть пропущен; например, регион работы должен стоять в areaServed, а не только в предложении.",
        "7 мая 2026 года Google убрал FAQ-rich-результаты из поиска, но сам тип FAQPage не устарел и остается валидной, читаемой разметкой (Google Search Central).",
        "Позиция самого Google: для ответов ИИ никакой особой разметки не требуется, а любые структурированные данные должны совпадать с видимым содержанием страницы.",
        "Ценность асимметрична: правильная разметка помогает умеренно, но неверная разметка, противоречащая тексту или описывающая то, чего на странице нет, активно вредит доверию.",
      ],

      body: [
        {
          heading: "Почему ИИ понимает мир через сущности, а не только через слова?",
          text: "Человек может окинуть страницу взглядом и понять, что компания называется так-то, что цена относится к конкретному товару, а статью написал названный человек, даже если эти факты разбросаны по заголовкам, тексту и подвалу. Машина менее снисходительна. Когда смысл подразумевается, а не объявлен, извлечение слабеет, а атрибуция путается. Сущность это отдельный объект, который ИИ может назвать и связать: компания, человек, товар, место. Структурированные данные позволяют объявить эти объекты и связи между ними, а не надеяться, что модель угадает верно. Хорошая проверка это слово «Apple». В обычном тексте это может быть компания, фрукт или альбом. В JSON-LD вы без двусмысленности указываете, о какой сущности страница, и ИИ привязывает ваш домен к нужной в своей внутренней карте.",
        },
        {
          heading: "Что дает разметка Organization и почему sameAs так важен?",
          text: "Разметка Organization это блок, который сообщает ИИ, кто вы: название, сайт, логотип, контакт и, самое главное, ссылки sameAs. Эти ссылки ведут на ваши официальные профили, например на страницу в LinkedIn, подтвержденные аккаунты в соцсетях и любые авторитетные карточки, и позволяют ИИ свести информацию из нескольких источников в одну уверенную запись о сущности. Без них модель вынуждена выводить вашу личность из текстовых закономерностей, и именно здесь похоже названные бизнесы путают друг с другом. Правило, которое важнее всего на практике, это согласованность. Одинаковые название, адрес сайта и описание должны стоять везде идентично, потому что расхождение между страницами это главная причина путаницы с сущностью. Держите этот блок на главной и на странице «О компании» и дайте ему устойчивый @id, чтобы другие блоки, например ваши статьи и автор, могли ссылаться на ту же организацию.",
          table: {
            headers: ["Свойство", "Что объявляет"],
            rows: [
              ["name / url / logo", "Основная идентичность бренда"],
              ["sameAs", "Официальные профили, подтверждающие единую сущность"],
              ["contactPoint", "Как связаться с бизнесом"],
              ["@id", "Устойчивая метка, чтобы на нее ссылалась другая разметка"],
              ["knowsAbout", "Темы, в которых организация авторитетна"],
            ],
            caption: "Свойства Organization, которые важнее всего для распознавания сущности ИИ. sameAs это ключевое поле: оно связывает сайт, профили в соцсетях и карточки в одну сущность, которую ИИ уверенно опознает.",
          },
        },
        {
          heading: "Как размечать коммерческие страницы через Product и Service?",
          text: "На страницах, где что-то продается, задача в том, чтобы отдать ИИ конкретику, которую иначе ему пришлось бы угадывать: что это, сколько стоит, где вы это предлагаете и что о вас думают. Разметка Product несет название, описание, цену через offer и агрегированный рейтинг там, где есть реальные отзывы. Разметка Service делает то же для услуги, которую вы оказываете, а не товара, который отгружаете, и естественно сочетается с areaServed, где указывается ваша география. Этот момент легко недооценить. Если на странице в прозе сказано, что вы работаете в конкретном регионе, но этот факт нигде не стоит в areaServed, ИИ, отбирающий бизнесы по местоположению, может вас просто пропустить. Все держится на двух предостережениях. Никогда не публикуйте агрегированный рейтинг без реальных отзывов за ним и никогда не указывайте в разметке цену, отличную от цены на странице. И то и другое нарушает правила, а противоречие между разметкой и видимым текстом стоит вам больше доверия, чем разметка вообще могла принести.",
        },
        {
          heading: "Как свойства about и mentions управляют контекстом?",
          text: "Два свойства позволяют сказать ИИ, о чем страница на самом деле. Свойство about называет главный предмет, то единственное, вокруг чего построена страница, а mentions называет второстепенные сущности, которые встречаются, но не в фокусе. Объявление about это способ убрать остатки двусмысленности: страница может быть полна смежных терминов, но about прямо указывает, что она посвящена, скажем, замене кровли, а не кровельным материалам вообще. Для локального бизнеса та же логика связывает вас с местом. Указание города и региона как сущностей и явное объявление зоны обслуживания помогают ИИ ответить на вопрос с привязкой к месту, назвав именно ваш бизнес. Принцип везде один и тот же: вы заменяете догадку объявлением, поэтому модель меньше угадывает и реже ошибается на ваш счет.",
        },
        {
          heading: "Что стало с FAQ-разметкой в 2026 году и стоит ли ее ставить?",
          text: "Здесь важно свежее изменение, и ошибиться означает действовать по устаревшему совету. 7 мая 2026 года Google убрал FAQ-rich-результаты из поиска, поэтому раскрывающиеся блоки вопросов и ответов, которые раньше увеличивали строку выдачи, больше не показываются. Важно различать: убрали функцию в выдаче, а не тип разметки. FAQPage остается валидным типом Schema.org, удалять его не нужно, и его по-прежнему разбирают Bing, Perplexity и краулеры, стоящие за ответами ИИ. Правильная позиция сейчас проста. Ставьте FAQPage только там, где на странице виден настоящий блок вопросов и ответов, никогда ради исчезнувшей функции показа и никогда для разметки вопросов, которых читатель не видит. Это совпадает с общей позицией Google: для ответов ИИ особой разметки не требуется, а любые структурированные данные должны совпадать с видимым содержанием. Разметка описывает контент, но никогда не была его заменой.",
        },
        {
          heading: "Чего разметка не делает? Честные границы",
          text: "Разметка это переводчик, а не источник авторитета. Она ясно излагает ваши факты, чтобы машина прочитала их верно, но она не сделает слабую страницу достойной цитирования и не придумает репутацию, которую вы не заработали. Врать за вас она тоже не умеет. Разметка, противоречащая видимому тексту или описывающая то, чего на странице нет, это нарушение правил, которое подрывает доверие, а не строит его, и ИИ в любом случае обесценивает рекламные формулировки внутри разметки. На нашем референсном сайте, информационном ресурсе по замене кровли в одном американском городе, мы использовали связанный набор разметки Organization, Article, FAQPage и BreadcrumbList, с автором, объявленным как реальный человек. Это помогло, но не было причиной того, что сайт за двадцать дней стал ведущим источником в ChatGPT, Perplexity, Copilot и обзорах Google. Разметка сделала факты читаемыми, а достойным чтения контент сделала не она. Наша методика AIRS не случайно относит структурированные данные к направлению структуры, наряду с техническим состоянием, контентом и авторитетом, потому что ни один слой не тянет всю нагрузку в одиночку.",
        },
      ],

      actions: [
        "Добавьте блок Organization с устойчивым @id, полным массивом sameAs из ваших официальных профилей и идентичными name, url и description на каждой странице.",
        "Дайте ключевым сущностям собственный @id и свяжите их: статью с автором, автора с организацией, организацию с сайтом, чтобы они образовали связанный граф.",
        "Выбирайте самый конкретный доступный тип (например LocalBusiness или более узкий подтип), а не общий Organization, чтобы он совпадал с категорией запроса.",
        "Для локального бизнеса и услуг указывайте географию явно в areaServed, а не только в прозе.",
        "На коммерческих страницах размечайте Product или Service с ценой через offer и добавляйте агрегированный рейтинг только там, где есть реальные отзывы.",
        "Через about называйте главный предмет каждой страницы, а через mentions второстепенные сущности, убирая двусмысленность о теме страницы.",
        "Оставляйте FAQPage только там, где на странице виден блок вопросов и ответов, и убедитесь, что каждый факт в разметке совпадает с видимым текстом.",
      ],

      faq: [
        {
          question: "ИИ-ассистенты читают мой JSON-LD напрямую?",
          answer:
            "Иногда напрямую, а часто косвенно. Часть систем ИИ разбирает JSON-LD при обращении к странице, а другие опираются на поисковые индексы, которые используют вашу разметку для классификации страницы. В любом случае чистая разметка помогает верно извлечь ваши факты. Рекомендованный Google формат это JSON-LD, и его машине проще всего считывать.",
        },
        {
          question: "Умерла ли FAQ-разметка после изменения Google в 2026 году?",
          answer:
            "Нет. 7 мая 2026 года Google убрал FAQ-rich-результат, визуальный раскрывающийся блок в поиске, но сам тип разметки FAQPage не устарел и остается валидным. Его по-прежнему разбирают Bing, Perplexity и краулеры ИИ. Оставляйте его там, где на странице есть настоящий видимый блок вопросов и ответов, и перестаньте использовать его только ради исчезнувшей функции показа.",
        },
        {
          question: "Какое свойство важнее всего для видимости в ИИ?",
          answer:
            "Для большинства сайтов это sameAs на сущности Organization. Оно связывает ваш сайт с официальными профилями и позволяет ИИ уверенно понять, что все они описывают один бизнес. Если внедрять что-то одно, то полный блок Organization со ссылками sameAs на главной обычно дает наибольшую отдачу на затраченные усилия.",
        },
        {
          question: "Гарантирует ли разметка, что ИИ процитирует мой сайт?",
          answer:
            "Нет. Разметка делает факты читаемыми и убирает двусмысленность, но не делает страницу достойной цитирования и не создает авторитет. Она также должна совпадать с видимым содержанием: разметка, противоречащая странице или описывающая то, чего на ней нет, вредит доверию. Структурированные данные и сильный контент это отдельные требования, и нужны оба.",
        },
      ],

      nextStepLabel: "Как писать контент, который цитируют ИИ",
      nextHref: "/content-ai-uses/writing-citable-content",
    },
  },
};

export default topic;
