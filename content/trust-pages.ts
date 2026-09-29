import type { Lang } from "@/locales/config";

// =============================================================
//  Страницы доверия (about, methodology, editorial-policy,
//  sources, disclosure, contacts, privacy, terms).
//  Каждая — самостоятельный авторитет. Двуязычно (en/ru).
//  ЧЕРНОВИК: где нет реальных данных — пометка [ЧЕРНОВИК].
//  Рендерятся общим шаблоном app/[lang]/[trust]/page.tsx.
// =============================================================

// Курируемая ссылка на первоисточник. note — короткое пояснение, что это
// за источник и почему он авторитетен (усиливает E-E-A-T и понимание для ИИ).
export type TrustLink = {
  label: string;
  url: string;
  note?: string;
};

export type TrustBlock = {
  h?: string;
  p?: string;
  // Помечает авторский термин/методику/инструмент — рисует плашку «Авторский термин».
  our?: boolean;
  items?: string[];
  // Список кликабельных первоисточников (для страницы «Источники»).
  links?: TrustLink[];
  // Таблица сравнения: заголовки колонок и строки (каждая строка — массив ячеек).
  table?: { headers: string[]; rows: string[][] };
};

export type TrustPage = {
  slug: string;
  schemaType: "AboutPage" | "WebPage" | "ContactPage";
  isFaq?: boolean;
  // порядок в подвале (после разделов знаний)
  order: number;
  content: Record<Lang, {
    title: string;
    description: string;
    navLabel: string; // короткая подпись для ссылки в подвале
    intro?: string;
    blocks: TrustBlock[];
  }>;
};

export const trustPages: TrustPage[] = [
  // --- Образовательные разделы ---
  {
    slug: "faq",
    schemaType: "WebPage",
    order: 0,
    isFaq: true,
    content: {
      en: {
        title: "FAQ",
        description: "Frequently asked questions about appearing in AI answers.",
        navLabel: "FAQ",
        intro: "Short, direct answers to the most common questions.",
        blocks: [
          {
            h: "What does it mean to appear in AI answers?",
            p: "It means that when someone asks an AI assistant like ChatGPT, Gemini, Perplexity or Claude for a recommendation, your website is named or cited as a source. This is different from ranking in Google: AI assistants read and trust sources differently, so a site can rank well in search yet be absent from AI answers.",
          },
          {
            h: "Why doesn't my website appear in AI answers?",
            p: "The most common reasons are that AI crawlers cannot read your content (for example, it is rendered only by JavaScript), the pages have no direct, self-contained answers to cite, or the site lacks structured data and trust signals. Each of these can keep a site invisible to AI even when it works fine for human visitors.",
          },
          {
            h: "Is appearing in AI answers different from SEO?",
            p: "Yes. Traditional SEO optimizes for ranking links in a search results page. Appearing in AI answers means being readable, quotable and trustworthy to an AI assistant that synthesizes one answer from several sources. The two overlap but are not the same.",
          },
        ],
      },
      ru: {
        title: "Частые вопросы",
        description: "Частые вопросы о появлении в ответах ИИ.",
        navLabel: "Частые вопросы",
        intro: "Короткие прямые ответы на самые частые вопросы.",
        blocks: [
          {
            h: "Что значит «появляться в ответах ИИ»?",
            p: "Это значит, что когда человек спрашивает у ИИ-ассистента (ChatGPT, Gemini, Perplexity, Claude) совет или рекомендацию, ваш сайт назван или процитирован как источник. Это не то же самое, что место в Google: ИИ-ассистенты читают и оценивают источники иначе, поэтому сайт может хорошо ранжироваться в поиске, но отсутствовать в ответах ИИ.",
          },
          {
            h: "Почему мой сайт не появляется в ответах ИИ?",
            p: "Чаще всего причина в том, что ИИ-краулеры не могут прочитать контент (например, он отрисовывается только через JavaScript), на страницах нет прямых самодостаточных ответов для цитирования, либо отсутствуют структурированные данные и сигналы доверия. Любая из этих причин может оставить сайт невидимым для ИИ, даже если для людей он работает нормально.",
          },
          {
            h: "Чем это отличается от обычного SEO?",
            p: "Обычное SEO оптимизирует сайт под место ссылки в выдаче поисковика. Появление в ответах ИИ — это про то, чтобы быть читаемым, цитируемым и заслуживающим доверия для ИИ-ассистента, который собирает один ответ из нескольких источников. Эти задачи пересекаются, но не совпадают.",
          },
        ],
      },
    },
  },
  // --- Образовательные разделы (каркасы «в работе») ---
  {
    slug: "glossary",
    schemaType: "WebPage",
    order: 0,
    content: {
      en: {
        title: "Glossary",
        description: "Key terms about appearing in AI answers, and how the AIRS methodology treats each one.",
        navLabel: "Glossary",
        intro: "These are the key terms behind visibility in AI answers. Some are widely used across the industry; for each, this glossary adds why it matters for getting into AI answers and how the AIRS (AI Ready Score) methodology accounts for it. Others are marked as author's term: part of a conceptual framework developed by AI Answers Rank from hands-on research and practice, namely AI Answers Rank, AIRS, AI Answers Score, Visibility in AI answers, the four directions of AIRS, and HAR, ASA and ACU.",
        blocks: [
          { h: "GEO (Generative Engine Optimization)", p: "Preparing a site so that generative AI systems (ChatGPT, Perplexity, Gemini, Claude) name and cite it as a source in their answers. Unlike classic SEO, where the goal is a spot in a list of links, GEO aims to be one of the 2 to 7 sources an AI weaves into a single answer.\n\nWhy it matters: a Princeton study (KDD 2024) found GEO techniques lift AI citation rates by up to 40%, and only about 10% of what AI cites comes from Google's top ten, so there is room even without top rankings.\n\nHow AIRS sees it: the check evaluates a site by GEO logic rather than classic SEO, measuring how readable and citable it is to a language model. See also the FAQ and articles." },
          { h: "AEO (Answer Engine Optimization)", p: "A close relative of GEO: preparing content for systems that return a finished answer instead of a list of links. Often used as a synonym for GEO, with emphasis on direct, self-contained answers.\n\nHow AIRS sees it: in the content direction we check whether pages carry direct answers an AI can quote in full." },
          { h: "AI Answers Rank", our: true, p: "The expert knowledge center and brand behind this project: research, educational materials, the AIRS methodology and services around one topic, how a website appears in the answers and recommendations of AI assistants. AI Answers Rank is the author of the AIRS method and the AI Answers Score tool.\n\nThe chain is: AI Answers Rank is the brand and expert resource, AIRS is the methodology, AI Answers Score is the tool that applies it." },
          { h: "Visibility in AI answers", our: true, p: "How likely an AI is to name or cite your site when a user asks for advice or a recommendation. It is not a search position and not traffic; it is presence inside the assistant's answer itself.\n\nHow AIRS sees it: the final readiness percentage is precisely a measure of this visibility, scored across 28 parameters in four directions." },
          { h: "AIRS (AI Ready Score)", our: true, p: "An author's methodology that evaluates a site not by classic SEO rules but by the logic of AI assistants. It scores a site across 28 parameters grouped into four directions: homepage, technical factors, content, and authority signals. Based on weights it produces a final readiness percentage and shows what to fix first.\n\nHow it differs: a regular SEO audit looks at search positions; AIRS looks at how clear and useful a site is to a language model, that is, how likely an AI is to read the content and recommend it. See the AIRS method page." },
          { h: "AI Answers Score", our: true, p: "The tool that runs an automatic site check using the AIRS methodology. It reads what an AI sees in a site's raw code, scores the four directions, produces the overall readiness percentage and shows what to fix first.\n\nIn short: AI Answers Score applies the AIRS (AI Ready Score) method, so the diagnosis and the remedy come from the same authors — the resource that studies the problem also measures it." },
          { h: "Four directions of AIRS (homepage, technical, content, authority)", p: "The four axes AIRS scores a site on. Homepage: whether an AI understands what the site is about from the first screen. Technical: whether an AI can read the site at all, no content locked in JavaScript or images. Content: whether pages carry direct, citable answers. Authority: whether the data is consistent and the site looks like a trusted, verified entity.\n\nWhy it matters: a site can be strong on one axis and invisible because another is weak, so a single overall number hides where the real problem is.\n\nHow AIRS sees it: the overall readiness percentage is built from all four together, and a weak direction points straight to the service that fixes it." },
          { h: "Homepage AI Readiness (HAR)", our: true, p: "How well the homepage helps AI assistants correctly grasp the site's specialization, topic, value and purpose, so they can use it when forming answers and recommendations. It is the first thing an AI reads: if the homepage does not state clearly what the company does, for whom and when to recommend it, the AI has to guess.\n\nHow AIRS sees it: HAR is the homepage direction of the method, the first of the three-step chain HAR then ASA then ACU." },
          { h: "AI Site Accessibility (ASA)", our: true, p: "The degree of technical accessibility of a site to AI assistants: whether they can freely fetch, read, parse and use its content when forming answers and recommendations. It covers open access for AI crawlers, content that is not locked behind JavaScript or images, and fast, reliable responses.\n\nHow AIRS sees it: ASA is the technical direction of the method, the second step after HAR, an AI must be able to reach the site before it can judge it." },
          { h: "AI Content Understanding (ACU)", our: true, p: "The ability of modern AI assistants to judge a site's content on their own, determining its specialization, usefulness, professional level and topical value from the site itself, complementing but no longer depending only on external sources. As models grow stronger, this self-assessment grows with them: a genuinely useful site can be recognized directly, even with a thin external footprint.\n\nHow AIRS sees it: ACU is why the method scores the site as an AI reads it, the third step after HAR and ASA, once an AI understands and can reach a site, it evaluates the substance itself." },
          { h: "llms.txt (a guide file for AI)", p: "A text file at the site root that points AI systems to the most valuable content. If robots.txt decides whether bots get in, llms.txt is a map for those already let in.\n\nAn honest note for 2026: the standard is still young. Per SE Ranking (early 2026, about 300,000 domains) roughly 10% of sites have adopted it, and an Ahrefs study (June 2026, 137,000 domains) found that 97% of llms.txt files received zero requests from AI crawlers in May 2026, while Google has stated on the record that it does not support the standard. So it is a low-cost signal for the future, not a working lever today.\n\nHow AIRS sees it: we count the presence of llms.txt as one technical signal, but honestly rate it as supporting rather than decisive." },
          { h: "GPTBot (OpenAI's crawler)", p: "OpenAI's bot that gathers data from the web.\n\nAn important distinction: GPTBot trains the model, while ChatGPT-User visits a page when a user personally asks ChatGPT to read it.\n\nWhy it matters: as of 2026 GPTBot is one of the most active AI crawlers, and when ChatGPT cites your content it includes a clickable link back to the site, so fully blocking access can cost you citations.\n\nHow AIRS sees it: in technical factors we check that a site has not accidentally blocked the AI bots it needs." },
          { h: "Structured data", p: "Special markup that tells AI and search engines exactly what is on a page: where the question is, where the answer is, where the organization is, where the author is. It helps a machine understand meaning, not just text.\n\nWhy it matters: markup is one of the signals a system uses to decide whether a source is trustworthy and convenient to cite.\n\nHow AIRS sees it: the presence and correctness of markup feeds into the technical factors and authority signals." },
          { h: "Schema.org (the markup vocabulary)", p: "The common vocabulary for structured data used by Google, Bing, and AI systems. It is the basis for marking up questions and answers (FAQPage), organizations, articles, and authors.\n\nHow AIRS sees it: we check whether the site's key entities are marked up per Schema.org, because that is a direct signal of machine-readability." },
          { h: "E-E-A-T (experience, expertise, authoritativeness, trust)", p: "A set of signals by which both Google and AI judge whether a source can be trusted: real experience, author expertise, resource authority, overall reliability.\n\nWhy it matters: in 2026 E-E-A-T influences both search positions and AI citations; thin, surface-level content loses in both places.\n\nHow AIRS sees it: an entire direction of the methodology, authority signals, is built around checking these traits." },
        ],
      },
      ru: {
        title: "Глоссарий",
        description: "Ключевые термины о появлении в ответах ИИ и о том, как каждый из них учитывает методика AIRS.",
        navLabel: "Глоссарий",
        intro: "Здесь собраны ключевые понятия о видимости сайта в ответах ИИ. Часть терминов общепринятые; к каждому дано пояснение, почему это важно для попадания в ответы ИИ и как это учитывает методика AIRS (AI Ready Score). Другие помечены как авторский термин: это часть понятийного аппарата, разработанного AI Answers Rank на основе собственных исследований и практики, а именно AI Answers Rank, AIRS, AI Answers Score, Видимость в ответах ИИ, четыре направления AIRS, а также HAR, ASA и ACU.",
        blocks: [
          { h: "GEO (Generative Engine Optimization, оптимизация под генеративные движки)", p: "Подготовка сайта так, чтобы генеративные ИИ (ChatGPT, Perplexity, Gemini, Claude) называли и цитировали его как источник в своих ответах. В отличие от классического SEO, где цель это место в списке ссылок, у GEO цель это попасть в те 2–7 источников, из которых ИИ собирает один ответ.\n\nПочему это важно: исследование Принстонского университета (Princeton, KDD 2024) показало, что приемы GEO поднимают частоту цитирования ИИ до 40 процентов, а из первой десятки Google берется лишь около 10 процентов того, что цитирует ИИ, поэтому шанс есть даже без топовых позиций.\n\nКак это видит AIRS: проверка оценивает сайт по логике GEO, а не классического SEO, то есть насколько он понятен и цитируем для языковой модели. Смотрите также вопросы и ответы и статьи." },
          { h: "AEO (Answer Engine Optimization, оптимизация под движки-ответы)", p: "Близкий к GEO термин: подготовка контента под системы, которые дают готовый ответ, а не список ссылок. Часто используется как синоним GEO, но с акцентом на прямые, самодостаточные ответы.\n\nКак это видит AIRS: в направлении «контент» мы проверяем, есть ли на страницах прямые ответы, которые ИИ может процитировать целиком." },
          { h: "AI Answers Rank", our: true, p: "Экспертный центр знаний и бренд, стоящий за этим проектом: исследования, образовательные материалы, методика AIRS и сервисы по одной теме, как сайт появляется в ответах и рекомендациях ИИ-ассистентов. AI Answers Rank является автором методики AIRS и инструмента AI Answers Score.\n\nСвязка такая: AI Answers Rank это бренд и экспертный ресурс, AIRS это методика, AI Answers Score это инструмент, который ее применяет." },
          { h: "Видимость в ответах ИИ", our: true, p: "Насколько вероятно, что ИИ назовет или процитирует ваш сайт, когда пользователь спросит совет или рекомендацию. Это не позиция в поиске и не трафик, это присутствие в самом ответе ассистента.\n\nКак это видит AIRS: итоговый процент готовности сайта и есть оценка этой видимости по 28 параметрам в четырех направлениях." },
          { h: "AIRS (AI Ready Score, оценка готовности к ИИ)", our: true, p: "Авторская методика оценки сайта не по правилам классического SEO, а по логике ИИ-ассистентов. Оценивает сайт по 28 параметрам, объединенным в четыре направления: главная страница, технические факторы, контент, сигналы авторитетности. На основе весов выводит итоговый процент готовности и показывает, что исправить в первую очередь.\n\nЧем отличается: обычный SEO-аудит смотрит на позиции в поиске, а AIRS смотрит на то, насколько сайт понятен и полезен языковой модели, то есть насколько вероятно, что ИИ прочитает контент и порекомендует его. Подробнее на странице метода AIRS." },
          { h: "AI Answers Score", our: true, p: "Инструмент, который выполняет автоматическую проверку сайта по методике AIRS. Он читает то, что видит ИИ в исходном коде сайта, оценивает четыре направления, выводит общий процент готовности и показывает, что исправить в первую очередь.\n\nКоротко: AI Answers Score применяет методику AIRS (AI Ready Score), поэтому диагноз и лекарство исходят от одних авторов, ресурс, который изучает проблему, сам же ее и измеряет." },
          { h: "Четыре направления AIRS (главная, технические, контент, авторитет)", p: "Четыре оси, по которым AIRS оценивает сайт. Главная страница: понимает ли ИИ с первого экрана, о чем сайт. Технические факторы: может ли ИИ вообще прочитать сайт, без контента, запертого в JavaScript или картинках. Контент: есть ли на страницах прямые, цитируемые ответы. Авторитетность: единообразны ли данные и выглядит ли сайт надежной, подтвержденной сущностью.\n\nПочему это важно: сайт может быть силен по одной оси и невидим из-за слабости другой, поэтому один общий балл скрывает, где настоящая проблема.\n\nКак это видит AIRS: общий процент готовности собирается из всех четырех сразу, а слабое направление прямо указывает на услугу, которая его закрывает." },
          { h: "Homepage AI Readiness (HAR)", our: true, p: "Показатель того, насколько главная страница помогает ИИ-ассистентам правильно понять специализацию, тематику, ценность и назначение сайта, чтобы использовать его при формировании ответов и рекомендаций. Это первое, что читает ИИ: если на главной не сказано ясно, чем занимается компания, для кого и когда ее рекомендовать, ИИ вынужден догадываться.\n\nКак это видит AIRS: HAR это направление главной страницы в методике, первый шаг в цепочке HAR, затем ASA, затем ACU." },
          { h: "AI Site Accessibility (ASA)", our: true, p: "Степень технической доступности сайта для ИИ-ассистентов: могут ли они свободно получать, читать, анализировать и использовать его содержимое при формировании ответов и рекомендаций. Сюда входят открытый доступ для ИИ-краулеров, контент, не запертый в JavaScript или картинках, и быстрый, надежный ответ сервера.\n\nКак это видит AIRS: ASA это техническое направление методики, второй шаг после HAR, ИИ должен суметь добраться до сайта, прежде чем сможет его оценить." },
          { h: "AI Content Understanding (ACU)", our: true, p: "Способность современных ИИ-ассистентов самостоятельно анализировать содержание сайта, определять его специализацию, полезность, профессиональный уровень и тематическую ценность на основе самого сайта, дополняя, но не ограничиваясь внешними источниками. Чем мощнее модели, тем сильнее проявляется эта самостоятельная оценка: по-настоящему полезный сайт может быть распознан напрямую, даже при слабом внешнем следе.\n\nКак это видит AIRS: ACU это причина, по которой методика оценивает сайт так, как его читает ИИ, третий шаг после HAR и ASA, когда ИИ понял сайт и смог до него добраться, он оценивает саму суть содержания." },
          { h: "llms.txt (файл-путеводитель для ИИ)", p: "Текстовый файл в корне сайта, который указывает ИИ-системам на самый ценный контент. Если robots.txt решает, пускать ли ботов, то llms.txt это карта для тех, кого пустили.\n\nЧестный факт на 2026 год: стандарт пока молодой. По данным SE Ranking (начало 2026, около 300 000 доменов), его установили примерно 10 процентов сайтов, а исследование Ahrefs (июнь 2026, 137 000 доменов) показало, что 97 процентов файлов llms.txt за май 2026 не получили ни одного обращения от ИИ-краулеров, при этом Google официально заявил, что не поддерживает этот стандарт. То есть это низкозатратный сигнал на будущее, а не готовый рычаг сегодня.\n\nКак это видит AIRS: мы учитываем наличие llms.txt как один из технических сигналов, но честно оцениваем его как поддерживающий, а не решающий." },
          { h: "GPTBot (краулер OpenAI)", p: "Бот компании OpenAI, который собирает данные из интернета.\n\nВажно различать: GPTBot обучает модель, а ChatGPT-User заходит на страницу, когда пользователь сам попросил ChatGPT ее прочитать.\n\nПочему это важно: по данным на 2026 год, GPTBot один из самых активных ИИ-краулеров, и когда ChatGPT цитирует ваш контент, он дает кликабельную ссылку на сайт, поэтому если закрыть доступ полностью, можно потерять цитируемость.\n\nКак это видит AIRS: в технических факторах мы проверяем, не закрыт ли сайт случайно от нужных ИИ-ботов." },
          { h: "Структурированные данные (structured data)", p: "Специальная разметка, которая объясняет ИИ и поисковикам, что именно на странице: где вопрос, где ответ, где организация, где автор. Помогает машине понять смысл, а не только текст.\n\nПочему это важно: разметка это один из сигналов, по которым система решает, можно ли доверять источнику и удобно ли его цитировать.\n\nКак это видит AIRS: наличие и корректность разметки входит в технические факторы и сигналы авторитетности." },
          { h: "Schema.org (словарь разметки)", p: "Общепринятый словарь для структурированных данных, которым пользуются Google, Bing и ИИ-системы. Именно на его основе размечают вопросы и ответы (FAQPage), организации, статьи, авторов.\n\nКак это видит AIRS: мы проверяем, размечены ли ключевые сущности сайта по Schema.org, потому что это прямой сигнал понятности для машины." },
          { h: "E-E-A-T (опыт, экспертность, авторитетность, доверие)", p: "Набор сигналов, по которым и Google, и ИИ оценивают, можно ли доверять источнику: реальный опыт, экспертиза автора, авторитет ресурса, общая надежность.\n\nПочему это важно: в 2026 году E-E-A-T влияет и на позиции в поиске, и на цитируемость ИИ, а тонкий, поверхностный контент проигрывает и там, и там.\n\nКак это видит AIRS: целое направление методики, «сигналы авторитетности», построено вокруг проверки этих признаков." },
        ],
      },
    },
  },
  {
    slug: "comparisons",
    schemaType: "WebPage",
    order: 0,
    content: {
      en: {
        title: "Comparisons",
        description: "Side-by-side comparisons relevant to appearing in AI answers, with our take through the AIRS methodology.",
        navLabel: "Comparisons",
        intro: "Direct comparisons that AI finds easy to cite. We present them the way our AIRS (AI Ready Score) methodology sees them: not what is better in general, but what raises the odds of getting into AI answers.",
        blocks: [
          {
            h: "GEO vs classic SEO",
            table: {
              headers: ["Aspect", "Classic SEO", "GEO (optimization for AI)"],
              rows: [
                ["Goal", "A spot in Google's list of links", "Being one of the sources an AI cites in its answer"],
                ["What is measured", "Position and clicks", "Citation and mention frequency in AI answers"],
                ["Main signal", "Links, keywords", "Structure, facts, authority, markup"],
                ["Speed of results", "Usually 3 to 6 months", "Often 2 to 8 weeks"],
                ["Who gets cited", "The top of search results", "Even sites outside the top: fewer than 10% of AI citations come from Google's top ten"],
              ],
            },
            p: "Classic SEO and GEO are not rivals: AI draws most of its sources from the indexed web, so an SEO foundation is still needed. But per an Ahrefs study (2026, 15,000 queries), only about 12% of the links AI cites sit in Google's top 10. That means even a site without top rankings can make it into an answer if it is clear and citable to the model. That is exactly what AIRS (AI Ready Score) evaluates: not search position, but readiness to be cited.",
          },
          {
            h: "Structured data vs none",
            table: {
              headers: ["Aspect", "Without structured data", "With structured data (Schema.org)"],
              rows: [
                ["Clarity for AI", "AI guesses meaning from the text", "AI reads a ready structure: question, answer, author, organization"],
                ["Accuracy of AI answers", "Lower", "Markedly higher: in one study, a model's accuracy rose from 16% to 54% on structured content"],
                ["Chance of entering an AI answer", "Ordinary", "Higher: pages with markup are selected into answers more often"],
                ["What a human sees", "The same", "The same (markup is invisible to the eye)"],
              ],
            },
            p: "Markup is invisible to a visitor, but it is exactly what tells the machine what is on the page. As of 2026, structured content sharply raises the accuracy of AI answers and the chance of being cited. That is why in the AIRS (AI Ready Score) methodology the presence and correctness of Schema.org markup feeds into both technical factors and authority signals.",
          },
        ],
      },
      ru: {
        title: "Сравнения",
        description: "Прямые сравнения по теме появления в ответах ИИ, с нашим взглядом через методику AIRS.",
        navLabel: "Сравнения",
        intro: "Прямые сравнения, которые ИИ удобно цитировать. Мы приводим их так, как видит наша методика AIRS (AI Ready Score): не «что лучше вообще», а что именно повышает вероятность попасть в ответы ИИ.",
        blocks: [
          {
            h: "GEO против классического SEO",
            table: {
              headers: ["Признак", "Классическое SEO", "GEO (оптимизация под ИИ)"],
              rows: [
                ["Цель", "Место в списке ссылок Google", "Попасть в источники, которые ИИ цитирует в ответе"],
                ["Что измеряют", "Позиция и клики", "Частота цитирования и упоминаний в ответах ИИ"],
                ["Главный сигнал", "Ссылки, ключевые слова", "Структура, факты, авторитет, разметка"],
                ["Скорость результата", "Обычно 3–6 месяцев", "Часто 2–8 недель"],
                ["Кого цитируют", "Топ выдачи", "Даже сайты вне топа: из первой десятки Google берется менее 10 процентов цитат ИИ"],
              ],
            },
            p: "Классическое SEO и GEO не соперники: ИИ берет большинство источников из проиндексированного веба, поэтому база SEO нужна. Но по данным исследования Ahrefs (2026, 15 000 запросов), только около 12 процентов ссылок, которые цитирует ИИ, стоят в топ-10 Google. Это значит, что даже сайт без топовых позиций может попасть в ответ, если он понятен и цитируем для модели. Именно это и оценивает AIRS (AI Ready Score): не позицию в поиске, а готовность к цитированию.",
          },
          {
            h: "Со структурированными данными против без них",
            table: {
              headers: ["Признак", "Без структурированных данных", "Со структурированными данными (Schema.org)"],
              rows: [
                ["Понятность для ИИ", "ИИ угадывает смысл из текста", "ИИ читает готовую структуру: вопрос, ответ, автор, организация"],
                ["Точность ответов ИИ", "Ниже", "Заметно выше: в исследовании точность ответов модели выросла с 16 до 54 процентов на структурированном контенте"],
                ["Шанс попасть в ответ ИИ", "Обычный", "Выше: страницы с разметкой чаще отбираются в ответы"],
                ["Что видит человек", "То же", "То же (разметка невидима для глаза)"],
              ],
            },
            p: "Разметка не видна посетителю, но именно она объясняет машине, что на странице. По данным 2026 года, структурированный контент резко повышает точность ответов ИИ и шанс на цитирование. Поэтому в методике AIRS (AI Ready Score) наличие и корректность разметки Schema.org входит и в технические факторы, и в сигналы авторитетности.",
          },
        ],
      },
    },
  },
  {
    slug: "about",
    schemaType: "AboutPage",
    order: 1,
    content: {
      en: {
        title: "About AI Answers Rank",
        description:
          "Who stands behind AI Answers Rank and why this resource exists.",
        navLabel: "About",
        intro:
          "AI Answers Rank is an expert knowledge center on website visibility in AI answers and recommendations: how a small or medium business website can appear in AI assistant answers. Our recommendations are independent: they are not sold and do not depend on any third party.",
        blocks: [
          {
            h: "Why this resource exists",
            p: "Search is rapidly moving from traditional search engines into AI assistants. When a user asks an AI assistant for a recommendation, it names a few sources — and most businesses are not among them. We built this resource to explain, in plain terms, why that happens and what to change.",
          },
          {
            h: "What we believe",
            p: "A website should not just exist online — it should be readable, quotable and trusted by AI assistants. The same principles we teach are applied to this site itself, so it works as a live example of the method.",
          },
          {
            h: "Who this is for",
            p: "Owners of small and medium businesses, local service providers, online stores and anyone whose customers increasingly start their search by asking an AI assistant.",
          },
        ],
      },
      ru: {
        title: "О проекте AI Answers Rank",
        description:
          "Кто стоит за AI Answers Rank и зачем создан этот ресурс.",
        navLabel: "О проекте",
        intro:
          "AI Answers Rank: экспертный центр знаний по видимости сайтов в ответах и рекомендациях ИИ: как сайту малого или среднего бизнеса появляться в ответах ИИ-ассистентов. Наши рекомендации независимы: они не продаются и не зависят от третьих лиц.",
        blocks: [
          {
            h: "Зачем нужен этот ресурс",
            p: "Поиск стремительно уходит из обычных поисковиков в ИИ-ассистентов. Когда человек спрашивает у ИИ совет, тот называет несколько источников — и большинства бизнесов среди них нет. Мы сделали этот ресурс, чтобы простым языком объяснить, почему так происходит и что изменить.",
          },
          {
            h: "Во что мы верим",
            p: "Сайт должен не просто существовать в интернете — он должен быть читаемым, цитируемым и заслуживающим доверия для ИИ. Те же принципы, которым мы учим, применены к самому этому сайту, поэтому он работает как живой пример метода.",
          },
          {
            h: "Для кого это",
            p: "Владельцы малого и среднего бизнеса, локальные компании, интернет-магазины и все, чьи клиенты все чаще начинают поиск с вопроса ИИ-ассистенту.",
          },
        ],
      },
    },
  },
  // ---------------------------------------------------------
  {
    slug: "editorial-policy",
    schemaType: "AboutPage",
    order: 3,
    content: {
      en: {
        title: "Editorial Policy",
        description:
          "How content on AI Answers Rank is fact-checked, sourced and updated.",
        navLabel: "Editorial Policy",
        intro:
          "This page describes the editorial standards behind every page on this resource.",
        blocks: [
          {
            h: "Fact-checking",
            p: "Specific figures, platform capabilities, crawler lists and legal points are verified in open sources before publication, not written from memory. Sources are cited so readers can check them.",
          },
          {
            h: "Updates",
            p: "Because the topic changes quickly, pages carry a visible update date and are revisited regularly. Outdated figures are replaced as new data appears.",
          },
          {
            h: "Corrections",
            p: "If something is found to be inaccurate, it is corrected promptly. We prefer to remove an uncertain claim rather than leave it standing.",
          },
          {
            h: "Independence of content",
            p: "Educational content is written to be accurate, not to favor any provider. See our Disclosure page for how the resource is funded.",
          },
        ],
      },
      ru: {
        title: "Редакционная политика",
        description:
          "Как контент AI Answers Rank проверяется, снабжается источниками и обновляется.",
        navLabel: "Редакционная политика",
        intro:
          "Эта страница описывает редакционные стандарты, по которым делается каждая страница ресурса.",
        blocks: [
          {
            h: "Факт-чек",
            p: "Конкретные цифры, возможности платформ, списки краулеров и юридические моменты проверяются по открытым источникам до публикации, а не пишутся по памяти. Источники указываются, чтобы читатель мог их проверить.",
          },
          {
            h: "Обновления",
            p: "Поскольку тема меняется быстро, у страниц есть видимая дата обновления, и они регулярно пересматриваются. Устаревшие цифры заменяются по мере появления новых данных.",
          },
          {
            h: "Исправления",
            p: "Если обнаруживается неточность, она оперативно исправляется. Мы скорее уберем сомнительное утверждение, чем оставим его.",
          },
          {
            h: "Независимость контента",
            p: "Образовательный контент пишется ради точности, а не в пользу какого-либо поставщика. О том, как финансируется ресурс, рассказано на странице «Прозрачность деятельности».",
          },
        ],
      },
    },
  },
  // ---------------------------------------------------------
  {
    slug: "sources",
    schemaType: "WebPage",
    order: 4,
    content: {
      en: {
        title: "Sources",
        description:
          "The primary sources behind AI Answers Rank: official AI-platform documentation, web standards, independent research and verified company facts.",
        navLabel: "Sources",
        intro:
          "We prefer original, primary sources over aggregators. Below is the curated list of sources our content is built on, grouped by type. Where a claim rests on our own measurements, we label it as our own.",
        blocks: [
          {
            h: "How we choose sources",
            items: [
              "Primary sources first: official documentation from the AI companies themselves, web-standards bodies and named research over second-hand summaries.",
              "Verifiable facts: company details are checked against official sites and independent references before we publish.",
              "Our own work is labeled: where a claim comes from our own measurements or case, we say so and do not present it as external authority.",
            ],
          },
          {
            h: "Official documentation from AI companies",
            p: "Guidance published by the companies that build the AI assistants. These are the primary sources on how each system crawls the web and decides what to cite.",
            links: [
              {
                label: "OpenAI - Overview of OpenAI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User)",
                url: "https://developers.openai.com/api/docs/bots",
                note: "How ChatGPT search, training and user-triggered fetches are controlled separately.",
              },
              {
                label: "Anthropic - How Claude crawls the web and how site owners can control it",
                url: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler",
                note: "The three Claude bots: ClaudeBot, Claude-User, Claude-SearchBot.",
              },
              {
                label: "Google Search Central - AI features and your website (AI Overviews, AI Mode)",
                url: "https://developers.google.com/search/docs/appearance/ai-features",
                note: "Google's own statement on what makes a page eligible for AI Overviews.",
              },
              {
                label: "Perplexity - Perplexity crawlers (PerplexityBot, Perplexity-User)",
                url: "https://docs.perplexity.ai/docs/resources/perplexity-crawlers",
                note: "How Perplexity indexes and fetches pages for cited answers.",
              },
              {
                label: "Apple - About Applebot (Applebot, Applebot-Extended)",
                url: "https://support.apple.com/en-us/119829",
                note: "Apple's crawler behind Siri and Spotlight suggestions.",
              },
            ],
          },
          {
            h: "Web standards and structured data",
            p: "The reference definitions we follow when we talk about markup and machine-readable facts.",
            links: [
              {
                label: "Schema.org - Organization type and properties",
                url: "https://schema.org/Organization",
                note: "The vocabulary that lets AI read your business as a defined entity.",
              },
              {
                label: "Google Search Central - Intro to structured data markup (JSON-LD)",
                url: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
              },
              {
                label: "Google Search Central - FAQ (FAQPage) structured data",
                url: "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
                note: "Includes the May 2026 note that FAQ rich results were retired.",
              },
            ],
          },
          {
            h: "Independent research and analytics",
            p: "Named studies with real sample sizes that we cite for figures on AI search behavior. We paraphrase and attribute rather than quote.",
            links: [
              {
                label: "Ahrefs - 38% of AI Overview citations pull from the top 10",
                url: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
                note: "863k queries; overlap with the classic top 10 fell from 76% to 38%.",
              },
              {
                label: "Ahrefs - Short vs. long content in AI Overviews",
                url: "https://ahrefs.com/blog/short-vs-long-content-in-ai-overviews/",
                note: "174,048 pages; length correlates weakly with citation.",
              },
              {
                label: "Vercel - The rise of the AI crawler",
                url: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
                note: "How AI bots handle (and mostly do not render) JavaScript.",
              },
              {
                label: "SparkToro - In 2026, less than a third of Google searches still send a click",
                url: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/",
              },
              {
                label: "Digital Applied - 1000 AI Overviews analyzed: citation pattern study",
                url: "https://www.digitalapplied.com/blog/we-analyzed-1000-ai-overviews-citation-pattern-study",
              },
              {
                label: "Search Engine Land - Zero-click searches up, organic clicks down",
                url: "https://searchengineland.com/zero-click-searches-up-organic-clicks-down-456660",
              },
              {
                label: "Pew Research Center - Google users are less likely to click on links when an AI summary appears",
                url: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
                note: "Browsing data of 900 US adults, 68,879 searches: with an AI summary, users clicked a result link in 8% of searches versus 15% without; only 1% clicked a link inside the summary; 88% of summaries cited three or more sources.",
              },
            ],
          },
          {
            h: "Verified company facts (case examples)",
            p: "When an article names a real business, we verify its facts against official and independent sources. Examples from published studies:",
            links: [
              {
                label: "Joe's Stone Crab - official site (founded 1913; stone crab season)",
                url: "https://www.joesstonecrab.com/",
              },
              {
                label: "Versailles Restaurant - Wikipedia (1971, Little Havana; James Beard America's Classic)",
                url: "https://en.wikipedia.org/wiki/Versailles_(restaurant)",
              },
              {
                label: "Roto-Rooter - official site (plumbing professionals since 1935)",
                url: "https://www.rotorooter.com/about-us/",
              },
              {
                label: "Dr. Dennis Gross - board-certified dermatologist (practice on 5th Avenue since 1990)",
                url: "https://www.dennisgrossmd.com/meet-dr-dennis-gross-board-certified-dermatologist/",
              },
            ],
          },
          {
            h: "Our own work",
            p: "Some claims rest on our own methodology and measurements. We label these clearly and never present them as third-party authority.",
            links: [
              {
                label: "AIRS (AI Ready Score) - our methodology",
                url: "/method",
                note: "The four-direction framework behind our analysis and our checking tool.",
              },
            ],
          },
        ],
      },
      ru: {
        title: "Источники",
        description:
          "Первоисточники, на которые опирается AI Answers Rank: официальная документация платформ ИИ, стандарты веба, независимые исследования и проверенные факты о компаниях.",
        navLabel: "Источники",
        intro:
          "Мы предпочитаем оригинальные первоисточники агрегаторам. Ниже курируемый список источников, на которых построен наш контент, сгруппированный по типу. Там, где вывод опирается на наши собственные замеры, мы помечаем это как собственные данные.",
        blocks: [
          {
            h: "Как мы отбираем источники",
            items: [
              "Первоисточники в приоритете: официальная документация самих компаний-разработчиков ИИ, органы веб-стандартов и именные исследования важнее пересказов из вторых рук.",
              "Проверяемые факты: сведения о компаниях сверяются с официальными сайтами и независимыми справочниками до публикации.",
              "Собственные материалы помечены: там, где вывод опирается на наши замеры или кейс, мы прямо говорим об этом и не выдаем это за внешний авторитет.",
            ],
          },
          {
            h: "Официальная документация компаний-разработчиков ИИ",
            p: "Материалы, опубликованные самими компаниями, которые создают ИИ-ассистентов. Это первоисточники о том, как каждая система обходит веб и решает, что цитировать.",
            links: [
              {
                label: "OpenAI - обзор краулеров OpenAI (GPTBot, OAI-SearchBot, ChatGPT-User)",
                url: "https://developers.openai.com/api/docs/bots",
                note: "Как раздельно управлять поиском ChatGPT, обучением и запросами пользователя.",
              },
              {
                label: "Anthropic - как Claude обходит веб и как владельцу сайта этим управлять",
                url: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler",
                note: "Три бота Claude: ClaudeBot, Claude-User, Claude-SearchBot.",
              },
              {
                label: "Google Search Central - AI-функции и ваш сайт (AI Overviews, AI Mode)",
                url: "https://developers.google.com/search/docs/appearance/ai-features",
                note: "Прямое заявление Google о том, что делает страницу пригодной для AI Overviews.",
              },
              {
                label: "Perplexity - краулеры Perplexity (PerplexityBot, Perplexity-User)",
                url: "https://docs.perplexity.ai/docs/resources/perplexity-crawlers",
                note: "Как Perplexity индексирует и загружает страницы для ответов со ссылками.",
              },
              {
                label: "Apple - о боте Applebot (Applebot, Applebot-Extended)",
                url: "https://support.apple.com/en-us/119829",
                note: "Краулер Apple за подсказками Siri и Spotlight.",
              },
            ],
          },
          {
            h: "Стандарты веба и структурированные данные",
            p: "Справочные определения, которым мы следуем, когда говорим о разметке и машиночитаемых фактах.",
            links: [
              {
                label: "Schema.org - тип Organization и его свойства",
                url: "https://schema.org/Organization",
                note: "Словарь, который позволяет ИИ прочитать бизнес как определенную сущность.",
              },
              {
                label: "Google Search Central - введение в разметку структурированных данных (JSON-LD)",
                url: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
              },
              {
                label: "Google Search Central - разметка FAQ (FAQPage)",
                url: "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
                note: "Включает примечание от мая 2026 о снятии FAQ-rich-результатов.",
              },
            ],
          },
          {
            h: "Независимые исследования и аналитика",
            p: "Именные исследования с реальными объемами выборки, на которые мы ссылаемся ради цифр о поведении ИИ-поиска. Мы пересказываем и атрибутируем, а не цитируем дословно.",
            links: [
              {
                label: "Ahrefs - 38% цитат в AI Overviews берутся из топ-10",
                url: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
                note: "863 тыс. запросов; совпадение с классическим топ-10 упало с 76% до 38%.",
              },
              {
                label: "Ahrefs - короткий против длинного контента в AI Overviews",
                url: "https://ahrefs.com/blog/short-vs-long-content-in-ai-overviews/",
                note: "174 048 страниц; длина слабо коррелирует с цитируемостью.",
              },
              {
                label: "Vercel - подъем ИИ-краулеров",
                url: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
                note: "Как ИИ-боты обрабатывают (и в основном не рендерят) JavaScript.",
              },
              {
                label: "SparkToro - в 2026 менее трети поисков Google все еще дают клик",
                url: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/",
              },
              {
                label: "Digital Applied - разбор 1000 AI Overviews: исследование паттернов цитирования",
                url: "https://www.digitalapplied.com/blog/we-analyzed-1000-ai-overviews-citation-pattern-study",
              },
              {
                label: "Search Engine Land - рост zero-click, спад органических кликов",
                url: "https://searchengineland.com/zero-click-searches-up-organic-clicks-down-456660",
              },
              {
                label: "Pew Research Center - пользователи Google реже переходят по ссылкам при наличии сводки ИИ",
                url: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
                note: "Данные о просмотрах 900 взрослых в США, 68 879 поисков: при наличии сводки ИИ по ссылке-результату кликали в 8% поисков против 15% без нее; по ссылке внутри сводки только в 1%; 88% сводок ссылались на три и более источника.",
              },
            ],
          },
          {
            h: "Проверенные факты о компаниях (примеры из кейсов)",
            p: "Когда статья называет реальный бизнес, мы сверяем факты с официальными и независимыми источниками. Примеры из опубликованных исследований:",
            links: [
              {
                label: "Joe's Stone Crab - официальный сайт (основан в 1913; сезон каменного краба)",
                url: "https://www.joesstonecrab.com/",
              },
              {
                label: "Versailles Restaurant - Wikipedia (1971, Little Havana; James Beard America's Classic)",
                url: "https://en.wikipedia.org/wiki/Versailles_(restaurant)",
              },
              {
                label: "Roto-Rooter - официальный сайт (профессионалы сантехники с 1935 года)",
                url: "https://www.rotorooter.com/about-us/",
              },
              {
                label: "Dr. Dennis Gross - сертифицированный дерматолог (практика на 5th Avenue с 1990 года)",
                url: "https://www.dennisgrossmd.com/meet-dr-dennis-gross-board-certified-dermatologist/",
              },
            ],
          },
          {
            h: "Наши собственные материалы",
            p: "Часть выводов опирается на нашу методику и замеры. Мы помечаем их явно и никогда не выдаем за сторонний авторитет.",
            links: [
              {
                label: "AIRS (AI Ready Score) - наша методика",
                url: "/method",
                note: "Модель из четырех направлений, лежащая в основе анализа и инструмента проверки.",
              },
            ],
          },
        ],
      },
    },
  },
  // ---------------------------------------------------------
  {
    slug: "disclosure",
    schemaType: "WebPage",
    order: 5,
    content: {
      en: {
        title: "Disclosure",
        description:
          "How AI Answers Rank earns money and whether it affects our content.",
        navLabel: "Disclosure",
        intro:
          "We believe in being transparent about how this resource is funded.",
        blocks: [
          {
            h: "How we earn",
            p: "Our main offering is a paid service that improves websites so AI assistants can understand, trust and recommend them. The knowledge center is free.",
          },
          {
            h: "Does payment affect our content?",
            p: "No. Educational content is written to be accurate. Recommendations and explanations are not sold, and no provider can pay to change what we teach.",
          },
          {
            h: "The diagnostic tool",
            p: "We point readers to an external readiness scanner, AI Answers Score, as a diagnostic step. It is a tool to reveal problems, not a paid placement.",
          },
          {
            h: "Independence",
            p: "We run an expert knowledge center and offer a paid service in the same field. Our recommendations in articles are independent: they are not sold, and no provider can pay to change what we teach.",
          },
        ],
      },
      ru: {
        title: "Прозрачность деятельности",
        description:
          "Как AI Answers Rank зарабатывает и влияет ли это на контент.",
        navLabel: "Прозрачность деятельности",
        intro:
          "Мы считаем правильным открыто говорить о том, как финансируется ресурс.",
        blocks: [
          {
            h: "Как мы зарабатываем",
            p: "Основной продукт — платная услуга доработки сайтов, чтобы ИИ-ассистенты могли их понимать, доверять им и рекомендовать. Центр знаний бесплатный.",
          },
          {
            h: "Влияет ли оплата на контент?",
            p: "Нет. Образовательный контент пишется ради точности. Рекомендации и объяснения не продаются, и ни один поставщик не может оплатой изменить то, чему мы учим.",
          },
          {
            h: "Инструмент диагностики",
            p: "Мы направляем читателей к внешнему сканеру готовности AI Answers Score как к шагу диагностики. Это инструмент, чтобы выявить проблемы, а не платное размещение.",
          },
          {
            h: "Независимость",
            p: "Мы ведем экспертный центр знаний и оказываем платную услугу в той же нише. Наши рекомендации в статьях независимы: они не продаются, и ни один поставщик не может оплатой изменить то, чему мы учим.",
          },
        ],
      },
    },
  },
  // ---------------------------------------------------------
  {
    slug: "contacts",
    schemaType: "ContactPage",
    order: 6,
    content: {
      en: {
        title: "Contact",
        description: "How to reach AI Answers Rank.",
        navLabel: "Contact",
        intro: "Questions about your website or our service? Get in touch.",
        blocks: [
          {
            h: "Email",
            p: "info@aianswersrank.com [ЧЕРНОВИК — временный адрес, заменить на реальный]",
          },
          {
            h: "Location",
            p: "USA",
          },
          {
            h: "Service requests",
            p: "[ЧЕРНОВИК — способ заказа услуги не выбран: email / форма / мессенджер. Пока — по email выше.]",
          },
        ],
      },
      ru: {
        title: "Контакты",
        description: "Как связаться с AI Answers Rank.",
        navLabel: "Контакты",
        intro: "Вопросы о вашем сайте или нашей услуге? Напишите нам.",
        blocks: [
          {
            h: "Email",
            p: "info@aianswersrank.com [ЧЕРНОВИК — временный адрес, заменить на реальный]",
          },
          {
            h: "Локация",
            p: "США",
          },
          {
            h: "Заказ услуги",
            p: "[ЧЕРНОВИК — способ заказа услуги не выбран: email / форма / мессенджер. Пока — по email выше.]",
          },
        ],
      },
    },
  },
  // ---------------------------------------------------------
  {
    slug: "privacy",
    schemaType: "WebPage",
    order: 7,
    content: {
      en: {
        title: "Privacy Policy",
        description: "How AI Answers Rank handles data: we collect the minimum and never sell or share it.",
        navLabel: "Privacy Policy",
        intro:
          "We respect your privacy and collect as little data as possible. This page explains what we collect and why. It is general information, not legal advice.",
        blocks: [
          {
            h: "What we collect",
            p: "When you pay for a detailed check, the payment is processed by Stripe, and we receive your email address. We use it to send you the result of the check and to inform you about site updates and new features.",
          },
          {
            h: "Payments",
            p: "Payments and payment details are handled by Stripe on its side under its own privacy policy. We do not receive or store your bank card details.",
          },
          {
            h: "Check data",
            p: "We do not store the data from website checks.",
          },
          {
            h: "Third parties",
            p: "We do not sell or share your data with third parties.",
          },
          {
            h: "Your choices",
            p: "You can ask to unsubscribe from our emails or to delete your address from our records at any time by writing to the contact address listed on the site.",
          },
        ],
      },
      ru: {
        title: "Политика конфиденциальности",
        description: "Как AI Answers Rank обращается с данными: мы собираем минимум и никому их не передаем.",
        navLabel: "Конфиденциальность",
        intro:
          "Мы уважаем вашу конфиденциальность и собираем минимум данных. На этой странице описано, что мы собираем и зачем. Это общая информация, а не юридическая консультация.",
        blocks: [
          {
            h: "Что мы собираем",
            p: "Когда вы оплачиваете детальную проверку, оплату обрабатывает платежный сервис Stripe, и мы получаем ваш адрес электронной почты. Мы используем его, чтобы прислать вам результат проверки, а также чтобы информировать вас об изменениях на сайте и новых возможностях.",
          },
          {
            h: "Оплата",
            p: "Оплату и платежные данные обрабатывает Stripe на своей стороне по своим правилам конфиденциальности. Мы не получаем и не храним данные вашей банковской карты.",
          },
          {
            h: "Данные проверок",
            p: "Данные проверок сайтов мы не храним.",
          },
          {
            h: "Третьи стороны",
            p: "Мы не продаем и не передаем ваши данные третьим лицам.",
          },
          {
            h: "Ваши права",
            p: "Вы можете в любой момент попросить отписаться от рассылки или удалить ваш адрес из нашей базы, написав нам по контактному адресу, указанному на сайте.",
          },
        ],
      },
    },
  },
  // ---------------------------------------------------------
  {
    slug: "terms",
    schemaType: "WebPage",
    order: 8,
    content: {
      en: {
        title: "Terms of Use",
        description: "Terms for using AI Answers Rank, plus our disclaimer. General information, not legal advice.",
        navLabel: "Terms of Use",
        intro:
          "By using this site you accept these terms. If you do not agree with them, please do not use the site. This is general information, not legal advice.",
        blocks: [
          {
            h: "Informational purpose",
            p: "Content on this site is provided for general informational and educational purposes and is not a guarantee of any result. It does not constitute professional, legal, or other advice.",
          },
          {
            h: "AI-assisted content",
            p: "Some materials may be prepared with the help of AI. We review such content, but we recommend verifying important facts yourself, as the topic of appearing in AI answers changes quickly.",
          },
          {
            h: "No warranty",
            p: "The site is provided \"as is\". We make no warranties as to the completeness, accuracy, or availability of the materials, and we may change, add, or remove content at any time without notice.",
          },
          {
            h: "Limitation of liability",
            p: "Any decisions and actions based on information from the site are taken at your own risk. We are not liable for possible losses or damages connected with use of the site.",
          },
          {
            h: "External links",
            p: "The site contains links to external resources (including the external diagnostic tool). We are not responsible for their content, and a link does not imply our endorsement.",
          },
          {
            h: "The service",
            p: "Our main offering is a paid website improvement service. The terms of a specific service are agreed separately.",
          },
          {
            h: "Changes",
            p: "These terms may be updated from time to time; changes are posted on this page.",
          },
        ],
      },
      ru: {
        title: "Условия использования",
        description: "Условия использования AI Answers Rank и наш дисклеймер. Общая информация, а не юридическая консультация.",
        navLabel: "Условия использования",
        intro:
          "Пользуясь этим сайтом, вы принимаете настоящие условия. Если вы с ними не согласны, пожалуйста, не используйте сайт. Это общая информация, а не юридическая консультация.",
        blocks: [
          {
            h: "Информационное назначение",
            p: "Контент сайта предоставляется в общих информационных и образовательных целях и не является гарантией какого-либо результата. Он не является профессиональной, юридической или иной консультацией.",
          },
          {
            h: "Материалы, подготовленные с помощью ИИ",
            p: "Часть материалов может быть подготовлена с помощью ИИ. Мы проверяем такой контент, но рекомендуем самостоятельно перепроверять важные факты, так как тема появления сайтов в ответах ИИ меняется быстро.",
          },
          {
            h: "Без гарантий",
            p: "Сайт предоставляется «как есть». Мы не даем гарантий полноты, точности и доступности материалов и можем изменять, дополнять или удалять контент в любое время без предупреждения.",
          },
          {
            h: "Ограничение ответственности",
            p: "Любые решения и действия на основе информации с сайта вы принимаете на свой риск. Мы не несем ответственности за возможные потери или убытки, связанные с использованием сайта.",
          },
          {
            h: "Внешние ссылки",
            p: "Сайт содержит ссылки на внешние ресурсы (включая внешний инструмент диагностики). Мы не отвечаем за их содержание, и наличие ссылки не означает нашего одобрения.",
          },
          {
            h: "Услуга",
            p: "Основной продукт это платная услуга доработки сайтов. Условия конкретной услуги согласуются отдельно.",
          },
          {
            h: "Изменения",
            p: "Настоящие условия могут время от времени обновляться, изменения публикуются на этой странице.",
          },
        ],
      },
    },
  },
];

export const trustSlugs = trustPages.map((p) => p.slug);

export function getTrustPage(slug: string): TrustPage | undefined {
  return trustPages.find((p) => p.slug === slug);
}
