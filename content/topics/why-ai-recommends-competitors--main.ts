import type { Topic } from "./types";

// =============================================================
//  СТАТЬЯ: Почему ИИ чаще рекомендуют конкурентов
//  Раздел: why-competitors (order 6)
//  Глубокая, плотная статья. НЕ продающая: диагностический разбор.
//  Факты проверены веб-поиском (июль 2026): обвал совпадения цитат
//  обзоров ИИ с топ-10 Google (76%→38%, Ahrefs 863k запросов);
//  ~91% ответов ИИ ссылаются на сторонние источники; упоминания
//  бренда сильнее ссылок (Ahrefs 75k брендов, ~0,66 vs ~0,10);
//  нестабильность ответов (SparkToro), пересечение платформ ~11%;
//  см. sources.
//  Экспертный слой: методика AIRS (4 направления), наш кейс (кровля).
//  Точное число параметров НЕ раскрываем (ноу-хау).
//  Фирменный термин: видимость в ответах ИИ (AI Answer Visibility).
//  Правило: длинных тире нет.
// =============================================================

const topic: Topic = {
  slug: "why-ai-recommends-competitors",
  section: "why-competitors",
  status: "published",
  accent: "rgba(79,70,229,0.185)",
  datePublished: "2026-07-03",
  sources: [
    {
      label:
        "Ahrefs - 38% of AI Overview Citations Pull From The Top 10 (863k запросов; совпадение упало с 76% до 38%)",
      url: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
    {
      label:
        "Ahrefs / LinkSurge - brand mentions vs backlinks as predictors of AI citations (75k брендов; ~0,66 против ~0,10)",
      url: "https://linksurge.jp/blog/en/offsite-seo-geo-2026/",
    },
    {
      label:
        "SparkToro / Position Digital - нестабильность ответов ИИ и пересечение платформ",
      url: "https://www.position.digital/blog/ai-seo-statistics/",
    },
    {
      label: "Методика AIRS (AI Ready Score) - AI Answers Rank",
      url: "/method",
    },
    {
      label:
        "AI Answers Rank - Как настроить код сайта для ИИ-краулеров",
      url: "/check-readiness/technical-geo-checklist",
    },
    {
      label:
        "AI Answers Rank - Как писать контент, который цитируют ИИ",
      url: "/content-ai-uses/writing-citable-content",
    },
    {
      label:
        "AI Answers Rank - Как разметка Schema.org помогает ИИ понять бизнес",
      url: "/what-site-needs/schema-org-for-ai",
    },
  ],

  content: {
    en: {
      h1: "Why do AI assistants recommend your competitors instead of you?",
      crumb: "Why AI recommends competitors",
      directAnswer:
        "Usually for one of three reasons: an AI crawler cannot read your site, your pages give no direct answer it can lift, or your brand is barely mentioned on the third-party sources AI leans on. The last is the biggest. Around 91% of the sources behind AI answers are third-party pages, so a business that exists only on its own website has almost nothing for the AI to cite. And ranking first no longer saves you: the overlap between Google's top ten and the pages cited in its AI Overviews fell from about 76% in mid-2025 to roughly 38% by early 2026. A top Google result can be absent from the AI answer entirely.",

      keyFacts: [
        "Around 91% of the sources behind AI answers are third-party pages; a brand's own website accounts for only about 9% of what AI cites.",
        "The overlap between Google's top ten and pages cited in AI Overviews fell from about 76% in July 2025 to roughly 38% by early 2026 (Ahrefs, 863K queries).",
        "For AI assistants the gap is wider still: only about 12% of cited URLs rank in Google's top ten, and roughly 31% rank outside the top 100 entirely.",
        "Brand mentions predict AI citation more strongly than backlinks: an Ahrefs study of 75,000 brands found mentions correlating far higher than links.",
        "AI uses query fan-out, splitting one question into sub-queries; if competitors fill positions 2 to 10 through reviews and forums, the AI sees many sources for them and few for you.",
        "AI answers are unstable: SparkToro found less than a 1 in 100 chance that asking the same question 100 times returns the same list of brands.",
        "Platforms cite different sources: domain overlap between ChatGPT and Perplexity is only around 11%, so visibility on one does not carry to another.",
        "A site can rank first in Google and still be missing from the AI answer, because ranking and AI citation are now largely separate systems.",
      ],

      body: [
        {
          heading: "What is the ghost business problem, and why does it happen?",
          text: "It is the gap between existing and being visible to AI. A real business with real customers can be effectively invisible to an assistant, because the AI is not judging whether you are good; it is judging whether it can read you, extract a clear answer from you, and confirm you against other sources. When a founder sees their site ranking first for a key term and then asks an assistant for a recommendation, the answer often names three competitors, two review sites and a video, with no mention of their company. That contradiction is not a glitch. Ranking and AI citation describe related but different systems, and the distance between them has grown fast. The rest of this article is about the three places that distance opens up, and how to close each one.",
        },
        {
          heading: "Why does ranking first in Google no longer guarantee a place in AI answers?",
          text: "Because AI does not simply reuse the top of the search results. The overlap between Google's top ten and the pages cited in its own AI Overviews fell from about 76% in July 2025 to roughly 38% by early 2026, and for third-party AI assistants only about 12% of cited pages rank in Google's top ten at all. Roughly a third of AI-cited pages rank outside the top 100. The mechanism behind this is query fan-out: the AI breaks one question into several sub-questions and gathers sources across all of them, rather than pulling the single best-ranked page. So the practical meaning is stark. Your Google position is now one input among many, not the deciding one, and a page that dominates classic search can be passed over by the AI reading the same web. This is also why the earlier layers matter: if a crawler cannot read your page at all, you are absent before this stage even begins.",
        },
        {
          heading: "Why does the AI name competitors instead of you?",
          text: "Most often because the web says more about them than about you, in the places AI trusts. Around 91% of the sources behind AI answers are third-party pages: reviews, comparison articles, forums and industry publications. A business that lives only on its own website supplies just the remaining sliver, so when the AI runs its fan-out and collects sources, it finds many mentions of a competitor across independent pages and few of you. This is why brand mentions predict AI citation more strongly than backlinks; an Ahrefs study of 75,000 brands found mentions correlating far more highly than links. The AI is, in effect, corroborating: a name that recurs across independent sources reads as established, while one that appears only on its owner's site reads as unconfirmed. Being good is not the signal. Being independently mentioned, consistently, is.",
        },
        {
          heading: "How do you check what AI says about you right now?",
          text: "Run three quick checks before changing anything. First, ask the assistants directly: pose the questions your customers would ask, such as who offers this service in your area, to ChatGPT, Perplexity and Google's AI Overviews, and note whether your brand appears at all, and whether as a cited source or only named. Second, view the raw source of your key pages, not the rendered version, and confirm your main text and prices are actually present without JavaScript. Third, do the same searches your customers do and count how often a competitor appears across the results, including third-party pages, versus how often you do. These three checks map exactly onto the three causes: readability, a clear answer on the page, and presence across the wider web. They tell you which door the problem is behind before you spend effort on the wrong one.",
        },
        {
          heading: "How do you win back visibility, and in what order?",
          text: "Work the three layers in sequence, because each depends on the one before. First, make sure AI can read you at all: open your pages to AI crawlers in robots.txt and deliver your main content as server-rendered HTML, since most AI crawlers do not run JavaScript. There is no point improving text an AI never sees. Second, fix the first screen of your key pages so each one leads with a direct, self-contained answer to a real question, in plain factual language rather than marketing phrases, because the AI lifts answers, not slogans. Third, and slowest, build honest presence beyond your own site: accurate listings, genuine reviews, and mentions on the independent sources your buyers already read, so the AI can corroborate you across the web. The first two are largely within your control and can move quickly; the third is where lasting advantage is built, and it is the layer most businesses ignore.",
        },
        {
          heading: "What will fast fixes not do? The honest limits",
          text: "Reading and answer fixes remove the obstacles, but they do not manufacture authority, and they do not act instantly. AI answers are genuinely unstable: SparkToro found less than a one in one hundred chance that the same question asked a hundred times returns the same list of brands, so a single good or bad result is not a verdict. Platforms also disagree with each other, with only around 11% domain overlap between ChatGPT and Perplexity, which means one screenshot never tells the whole story and progress has to be watched over time and across platforms. And the third layer, independent mentions, is earned slowly and largely off your own site, so no on-page change alone captures it. This is the honest shape of the work: the technical and content layers are fast and yours to fix, but durable visibility is corroboration built over time, not a switch you flip. Our AIRS methodology looks at four dimensions together, technical health, content, authority and structure, precisely because no single fix carries the whole result.",
        },
      ],

      actions: [
        "Ask ChatGPT, Perplexity and Google's AI Overviews the questions your customers ask, and record whether your brand appears and whether as a cited source or only named.",
        "View the raw HTML source of your key pages and confirm your main text and prices are present without JavaScript; if not, move to server-side rendering.",
        "Run your customers' searches and count how often competitors appear across all results, including third-party pages, versus how often you do.",
        "Rewrite the first screen of each key page to lead with a direct, self-contained answer in plain factual language, not marketing phrases.",
        "Audit your presence on the independent sources your buyers read: accurate listings, genuine reviews and mentions, and correct any inconsistent business details.",
        "Track your visibility over time and across several AI platforms rather than from a single query, since answers vary between runs and between platforms.",
        "Prioritise the layers in order: readability first, a clear on-page answer second, off-site presence third.",
      ],

      faq: [
        {
          question: "Why does AI recommend competitors when I rank first on Google?",
          answer:
            "Because ranking and AI citation are now largely separate. The overlap between Google's top ten and pages cited in AI Overviews fell from about 76% in mid-2025 to roughly 38% by early 2026, and for AI assistants only about 12% of cited pages rank in Google's top ten. AI gathers sources across sub-queries and leans heavily on third-party pages, so a top Google result can still be absent from the answer.",
        },
        {
          question: "Is it more about my website or about mentions elsewhere?",
          answer:
            "Both, but off-site presence is the larger factor for most businesses. Around 91% of the sources behind AI answers are third-party pages, and brand mentions predict AI citation more strongly than backlinks. Your own site must be readable and answer clearly, but if the wider web barely mentions you, the AI has little to corroborate and will lean toward competitors that are mentioned more.",
        },
        {
          question: "How fast can I fix this?",
          answer:
            "The first two layers, making your site readable and putting direct answers on the page, are within your control and can move relatively quickly. The third, building independent mentions across the web, is earned slowly. AI answers are also unstable between runs and differ across platforms, so expect to track progress over time rather than see an instant, fixed result.",
        },
        {
          question: "Do I need to pay an agency thousands to fix this?",
          answer:
            "Not to start. The highest-value early steps, opening your site to AI crawlers, server-rendering your content, and rewriting key pages to answer directly, are diagnosable and largely doable in-house. Measuring your site's readiness across technical, content, authority and structure dimensions shows you which of these to prioritise before committing to larger investments.",
        },
      ],

      nextStepLabel: "Why AI recommends one restaurant and overlooks another",
      nextHref: "/how-ai-chooses/restaurants-cafes-ai-recommendations",
    },

    ru: {
      h1: "Почему ИИ-ассистенты рекомендуют ваших конкурентов, а не вас?",
      crumb: "Почему ИИ рекомендует конкурентов",
      directAnswer:
        "Обычно по одной из трех причин: ИИ-краулер не может прочитать ваш сайт, ваши страницы не дают прямого ответа, который он мог бы взять, или ваш бренд почти не упоминается на сторонних источниках, на которые ИИ опирается. Последняя причина самая весомая. Около 91% источников за ответами ИИ это сторонние страницы, поэтому у бизнеса, который существует только на своем сайте, ИИ почти нечего цитировать. И первое место больше не спасает: совпадение топ-10 Google с страницами, которые цитируют обзоры ИИ (AI Overviews), упало примерно с 76% в середине 2025 года до около 38% к началу 2026 года. Топовый результат Google может вовсе отсутствовать в ответе ИИ.",

      keyFacts: [
        "Около 91% источников за ответами ИИ это сторонние страницы; собственный сайт бренда это лишь около 9% того, что цитирует ИИ.",
        "Совпадение топ-10 Google с страницами, цитируемыми в обзорах ИИ, упало примерно с 76% в июле 2025 года до около 38% к началу 2026 года (Ahrefs, 863 тыс. запросов).",
        "Для ИИ-ассистентов разрыв еще больше: только около 12% цитируемых адресов входят в топ-10 Google, а примерно 31% вообще вне топ-100.",
        "Упоминания бренда предсказывают цитируемость в ИИ сильнее, чем ссылки: исследование Ahrefs на 75 000 брендов показало у упоминаний намного более высокую корреляцию, чем у ссылок.",
        "ИИ использует веерное разложение запроса (fan-out), дробя один вопрос на подзапросы; если конкуренты занимают позиции 2–10 через отзывы и форумы, ИИ видит для них много источников, а для вас мало.",
        "Ответы ИИ нестабильны: SparkToro нашел, что при 100 повторах одного и того же вопроса шанс получить тот же список брендов меньше 1 к 100.",
        "Платформы цитируют разные источники: пересечение доменов между ChatGPT и Perplexity всего около 11%, поэтому видимость на одной не переносится на другую.",
        "Сайт может быть первым в Google и все равно отсутствовать в ответе ИИ, потому что позиция в выдаче и цитирование в ИИ теперь во многом разные системы.",
      ],

      body: [
        {
          heading: "Что такое проблема «невидимого бизнеса» и почему она возникает?",
          text: "Это разрыв между «существовать» и «быть видимым для ИИ». Реальный бизнес с реальными клиентами может быть фактически невидим для ассистента, потому что ИИ оценивает не то, хороши ли вы, а то, может ли он вас прочитать, извлечь из вас ясный ответ и подтвердить вас по другим источникам. Когда владелец видит свой сайт на первом месте по ключевому запросу, а потом спрашивает у ассистента рекомендацию, ответ часто называет трех конкурентов, два отзовика и видео, и ни разу его компанию. Это противоречие не сбой. Позиция в выдаче и цитирование в ИИ это связанные, но разные системы, и расстояние между ними выросло быстро. Дальше в статье речь о трех местах, где это расстояние возникает, и как закрыть каждое.",
        },
        {
          heading: "Почему первое место в Google больше не гарантирует место в ответах ИИ?",
          text: "Потому что ИИ не просто переиспользует верх поисковой выдачи. Совпадение топ-10 Google с страницами, которые цитируют его же обзоры ИИ, упало примерно с 76% в июле 2025 года до около 38% к началу 2026 года, а для сторонних ассистентов лишь около 12% цитируемых страниц вообще входят в топ-10 Google. Примерно треть цитируемых ИИ страниц находится вне топ-100. За этим стоит механизм веерного разложения запроса (fan-out): ИИ разбивает один вопрос на несколько подвопросов и собирает источники по всем, а не берет единственную самую высокую страницу. Практический смысл жесткий. Ваша позиция в Google теперь один из многих сигналов, а не решающий, и страница, доминирующая в классическом поиске, может быть пропущена ИИ, читающим тот же интернет. Именно поэтому важны и более ранние слои: если краулер вообще не может прочитать вашу страницу, вас нет еще до этого этапа.",
        },
        {
          heading: "Почему ИИ называет конкурентов, а не вас?",
          text: "Чаще всего потому, что интернет говорит о них больше, чем о вас, в тех местах, которым ИИ доверяет. Около 91% источников за ответами ИИ это сторонние страницы: отзывы, сравнительные статьи, форумы и отраслевые издания. Бизнес, который живет только на своем сайте, дает лишь оставшуюся малую долю, поэтому когда ИИ выполняет веерное разложение и собирает источники, он находит много упоминаний конкурента на независимых страницах и мало ваших. Вот почему упоминания бренда предсказывают цитируемость в ИИ сильнее ссылок; исследование Ahrefs на 75 000 брендов показало у упоминаний намного более высокую корреляцию, чем у ссылок. По сути ИИ подтверждает: имя, которое повторяется в независимых источниках, читается как устоявшееся, а то, что встречается только на сайте владельца, как неподтвержденное. Сигнал это не «быть хорошим». Сигнал это быть упомянутым независимо и постоянно.",
        },
        {
          heading: "Как проверить, что ИИ говорит о вас прямо сейчас?",
          text: "Прежде чем что-то менять, сделайте три быстрые проверки. Первая: спросите ассистентов напрямую. Задайте вопросы, которые задал бы ваш клиент, например кто оказывает эту услугу в вашем районе, в ChatGPT, Perplexity и обзорах ИИ Google и отметьте, появляется ли ваш бренд вообще и как, как цитируемый источник или только по названию. Вторая: посмотрите исходный код ключевых страниц, а не отрисованную версию, и убедитесь, что основной текст и цены реально присутствуют без JavaScript. Третья: сделайте те же запросы, что и ваши клиенты, и посчитайте, как часто в результатах встречается конкурент, включая сторонние страницы, против того, как часто встречаетесь вы. Эти три проверки точно ложатся на три причины: читаемость, ясный ответ на странице и присутствие в широком интернете. Они показывают, за какой из дверей проблема, прежде чем вы потратите силы не на ту.",
        },
        {
          heading: "Как вернуть видимость и в каком порядке?",
          text: "Работайте с тремя слоями по очереди, потому что каждый зависит от предыдущего. Сначала убедитесь, что ИИ вообще может вас прочитать: откройте страницы ИИ-краулерам в robots.txt и отдавайте основной контент готовым HTML с сервера, ведь большинство ИИ-краулеров не исполняют JavaScript. Нет смысла улучшать текст, который ИИ не видит. Затем поправьте первый экран ключевых страниц так, чтобы каждая начиналась с прямого самодостаточного ответа на реальный вопрос, простым фактическим языком, а не рекламными фразами, потому что ИИ берет ответы, а не лозунги. И третье, самое медленное: постройте честное присутствие за пределами своего сайта, точные карточки, настоящие отзывы и упоминания на независимых источниках, которые ваши покупатели уже читают, чтобы ИИ мог подтвердить вас по всему интернету. Первые два слоя во многом в вашей власти и двигаются быстро; третий это то, где строится устойчивое преимущество, и именно его большинство бизнесов игнорирует.",
        },
        {
          heading: "Чего быстрые правки не дадут? Честные границы",
          text: "Правки читаемости и ответов убирают препятствия, но не создают авторитет и не срабатывают мгновенно. Ответы ИИ действительно нестабильны: SparkToro нашел, что при 100 повторах одного и того же вопроса шанс получить тот же список брендов меньше одного к ста, поэтому один хороший или плохой результат это не приговор. Платформы к тому же расходятся между собой, пересечение доменов между ChatGPT и Perplexity всего около 11%, а значит, один снимок экрана никогда не отражает всю картину, и прогресс приходится отслеживать со временем и по нескольким платформам. А третий слой, независимые упоминания, зарабатывается медленно и в основном вне вашего сайта, поэтому ни одна правка на странице сама по себе его не дает. Такова честная форма работы: технический и контентный слои быстры и в вашей власти, но устойчивая видимость это подтверждение, выстроенное со временем, а не переключатель. Наша методика AIRS смотрит на четыре направления вместе, техническое состояние, контент, авторитет и структуру, именно потому что ни одна отдельная правка не дает всего результата.",
        },
      ],

      actions: [
        "Задайте в ChatGPT, Perplexity и обзорах ИИ Google вопросы, которые задают ваши клиенты, и зафиксируйте, появляется ли ваш бренд и как, как цитируемый источник или только по названию.",
        "Посмотрите исходный HTML-код ключевых страниц и убедитесь, что основной текст и цены присутствуют без JavaScript; если нет, переходите на рендеринг с сервера.",
        "Сделайте запросы ваших клиентов и посчитайте, как часто в результатах встречаются конкуренты, включая сторонние страницы, против того, как часто встречаетесь вы.",
        "Перепишите первый экран каждой ключевой страницы так, чтобы он начинался с прямого самодостаточного ответа простым фактическим языком, а не с рекламных фраз.",
        "Проверьте свое присутствие на независимых источниках, которые читают ваши покупатели: точные карточки, настоящие отзывы и упоминания, и исправьте расхождения в данных о бизнесе.",
        "Отслеживайте видимость со временем и на нескольких платформах ИИ, а не по одному запросу, так как ответы меняются между повторами и между платформами.",
        "Соблюдайте порядок слоев: сначала читаемость, затем ясный ответ на странице, затем присутствие вне сайта.",
      ],

      faq: [
        {
          question: "Почему ИИ рекомендует конкурентов, если я первый в Google?",
          answer:
            "Потому что позиция и цитирование в ИИ теперь во многом разные вещи. Совпадение топ-10 Google с страницами, цитируемыми в обзорах ИИ, упало примерно с 76% в середине 2025 года до около 38% к началу 2026 года, а для ИИ-ассистентов лишь около 12% цитируемых страниц входят в топ-10 Google. ИИ собирает источники по подзапросам и сильно опирается на сторонние страницы, поэтому топовый результат Google все равно может отсутствовать в ответе.",
        },
        {
          question: "Дело больше в моем сайте или в упоминаниях в других местах?",
          answer:
            "И в том, и в другом, но для большинства бизнесов присутствие вне сайта весит больше. Около 91% источников за ответами ИИ это сторонние страницы, и упоминания бренда предсказывают цитируемость сильнее ссылок. Ваш сайт должен быть читаем и ясно отвечать, но если широкий интернет почти вас не упоминает, ИИ нечего подтверждать, и он склонится к конкурентам, которых упоминают чаще.",
        },
        {
          question: "Как быстро это можно исправить?",
          answer:
            "Первые два слоя, сделать сайт читаемым и поставить прямые ответы на страницу, в вашей власти и двигаются относительно быстро. Третий, построить независимые упоминания в интернете, зарабатывается медленно. Ответы ИИ к тому же нестабильны между повторами и различаются по платформам, поэтому ждите отслеживания прогресса со временем, а не мгновенного фиксированного результата.",
        },
        {
          question: "Нужно ли платить агентству тысячи долларов, чтобы это исправить?",
          answer:
            "Чтобы начать, нет. Самые ценные первые шаги, открыть сайт ИИ-краулерам, отдавать контент с сервера и переписать ключевые страницы под прямой ответ, диагностируются и во многом выполнимы своими силами. Измерение готовности сайта по направлениям техники, контента, авторитета и структуры показывает, что из этого приоритетно, прежде чем вкладываться в более крупные работы.",
        },
      ],

      nextStepLabel: "Почему ИИ рекомендует один ресторан, а другой нет",
      nextHref: "/how-ai-chooses/restaurants-cafes-ai-recommendations",
    },
  },
};

export default topic;
