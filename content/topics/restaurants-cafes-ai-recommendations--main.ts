import type { Topic } from "./types";

// =============================================================
//  ИССЛЕДОВАНИЕ: Роль сайта заведения общепита (ресторан, кафе,
//  бар, кофейня) в рекомендациях ИИ.
//  Раздел: how-ai-chooses (order 2). Первый материал серии из 10
//  нишевых исследований (общепит, строители, юристы, стоматологи...).
//  Тип: прикладное аналитическое исследование, НЕ продающее.
//  Основа: кросс-модельный анализ (4 ИИ-системы) + наши замеры
//  50+ сайтов ресторанов и кафе в Нью-Йорке и Майами по AIRS
//  (в среднем 58-64%, редко до 72%) + верификация фактов
//  веб-поиском (июль 2026): Joe's Stone Crab (1913, сезон краба
//  15 окт - 1 мая, James Beard 1998, теперь бронь через OpenTable);
//  Versailles (1971, Little Havana, James Beard 2001, бронь для
//  групп 15+). См. sources.
//  Экспертный слой: методика AIRS (4 направления = 4 вывода
//  исследования), наш кейс (кровля, 24 дня, без ссылок).
//  Инструмент проверки: AI Answers Score.
//  Точное число параметров НЕ раскрываем (28 - ноу-хау не пишем).
//  Фирменный термин: видимость в ответах ИИ (AI Answer Visibility).
//  Правила: длинных тире нет; "е" вместо "ё".
// =============================================================

const topic: Topic = {
  slug: "restaurants-cafes-ai-recommendations",
  section: "how-ai-chooses",
  kind: "research",
  status: "published",
  accent: "rgba(234,88,12,0.185)",
  datePublished: "2026-07-10",
  sources: [
    {
      label:
        "Joe's Stone Crab - официальный сайт (основан в 1913; сезон каменного краба)",
      url: "https://www.joesstonecrab.com/",
    },
    {
      label:
        "Joe's Stone Crab - OpenTable (заведение теперь принимает бронирование, до 14 дней вперед)",
      url: "https://www.opentable.com/r/joes-stone-crab-miami-beach",
    },
    {
      label:
        "Versailles Restaurant - Wikipedia (основан в 1971, Little Havana; James Beard America's Classic 2001)",
      url: "https://en.wikipedia.org/wiki/Versailles_(restaurant)",
    },
    {
      label:
        "MICHELIN Guide - Joe's Stone Crab, Miami Beach (статус в гиде; открыт круглый год)",
      url: "https://guide.michelin.com/us/en/florida/miami-beach/restaurant/joe-s-stone-crab",
    },
    {
      label: "Методика AIRS (AI Ready Score) - AI Answers Rank",
      url: "/method",
    },
    {
      label:
        "AI Answers Rank - Как разметка Schema.org помогает ИИ понять бизнес",
      url: "/what-site-needs/schema-org-for-ai",
    },
    {
      label:
        "AI Answers Rank - Как писать контент, который цитируют ИИ",
      url: "/content-ai-uses/writing-citable-content",
    },
  ],

  content: {
    en: {
      h1: "Why does AI recommend one restaurant and overlook another?",
      subtitle: "Restaurants · cafes · bars · coffee shops · bakeries",
      methodology:
        "A cross-model study: we put the same question to four leading AI systems and had each analyse well-known venues in New York and Miami. Findings shared by all four are treated as stable. Company facts were verified against open sources (July 2026). Analysis framework: the AIRS (AI Ready Score) method.",
      crumb: "Restaurants and cafes in AI answers",
      directAnswer:
        "Yes, but not for the reason most owners expect. External reputation (reviews, press, guides) decides whether AI considers a venue at all. The venue's own website decides how precisely, how confidently, and for which occasion AI recommends it. A weak site rarely removes a well-known place from broad lists, but it quietly drops it from the narrow, high-converting queries that bring a real guest tonight: open now, gluten-free menu, terrace with a view, table for twelve. We checked more than 50 restaurant and cafe websites in New York and Miami with the AIRS method: most score 58 to 64 percent, rarely 72. They cover the gap with external authority. The site is the one dimension where there is still open room to grow.",

      keyFacts: [
        "External reputation answers whether to recommend a venue; the website answers what to say and for which occasion. These are different jobs and rarely substitute for each other.",
        "The website is the only source a venue fully controls. Everything else is a third party's interpretation.",
        "For a well-known venue the site rarely creates the recommendation, but it sets how confident and detailed that recommendation is, which decides its position inside the answer.",
        "The relative weight of the site is inverse to fame: the less known the venue, the more the site carries. Owners with a strong site and thin press underestimate their advantage.",
        "A weak site does not erase a venue from general lists, it drops it from the narrow queries that convert best (open now, dietary options, patio, private group).",
        "Across 50+ restaurant and cafe sites in New York and Miami the pattern held: 58 to 64 percent AIRS readiness, rarely up to 72. The rest is carried by external authority.",
        "For AI, a plain text description of a dish and its ingredients matters more than a high-resolution photo, because text models work with meaning, not visual aesthetics.",
        "The four findings of this study map one to one onto the four directions of the AIRS method: Homepage, Technical, Content, Authority.",
        "For a new venue with little history, AI visibility is the lowest-cost channel: it rewards site structure, which takes weeks, not the years external reputation needs.",
      ],

      body: [
        {
          heading: "What does AI take from the site, and what from outside?",
          text: "The two are a clean division of labour. From external sources, reviews, ratings, guides, press, social mentions, maps, AI learns whether a venue is worth recommending at all: its authority and social proof. From the site AI takes the facts a third party carries poorly or lets go stale: the current menu and prices, hours including holidays and seasonality, cuisine and concept in the venue's own words, format details like reservations, dress code, patio, kids menu, parking, and the history or chef profile that signal authenticity. The site is the only source the venue controls in full, so it is where AI resolves ambiguity when outside data conflicts. That is why a strong external layer plus a weak site produces a cautious, generic recommendation, while a strong site turns the same reputation into a precise one.",
        },
        {
          heading: "Why does a weak site still hurt a famous venue?",
          text: "A weak site damages not the fact of the mention but its quality. A famous venue with thousands of reviews will still appear for the broad query best restaurants in Miami. But AI splits real questions into narrow ones, and the narrow ones are where money is: open right now, gluten-free options, terrace with a view, table for a group of twelve, business lunch near a district. For each of these AI needs a verified fact, and if the site does not state it clearly, AI either adds a hedge (check the hours) or prefers a lesser-known competitor whose site does. Worse, a weak site often produces not a missing recommendation but a wrong one: AI names the venue and misstates its format, location, price level or the occasion it fits. The narrow queries are exactly the ones that bring a guest tonight, so the loss is concentrated where it matters most.",
          table: {
            headers: ["Query type", "What decides it", "Where a weak site loses"],
            rows: [
              ["Broad (best restaurants in Miami)", "External authority: press, reviews, lists", "Rarely loses: fame carries it"],
              ["Narrow (open now, gluten-free, patio, group of 12)", "Verified facts on the site", "Loses often: no fact to confirm, AI hedges or picks a rival"],
              ["Occasion (date night, business lunch, family)", "Explicit occasion pages and format signals", "Loses: marketing text does not classify the venue"],
            ],
            caption: "The narrow and occasion queries convert best and are exactly where site facts, not fame, decide the outcome.",
          },
        },
        {
          heading: "How do real restaurants show up in AI answers: two examples",
          text: "Two verified Miami cases illustrate the pattern. Joe's Stone Crab (founded 1913, a James Beard America's Classic) has a dense external layer: the recommendation would exist without a site. Here the site's job is disambiguation, stone crab season runs 15 October to 1 May, plus hours and visiting rules. A telling detail: the venue was famous for taking no reservations, yet by 2026 it accepts them through OpenTable. An outside fact went stale, and only the official channel confirms the current rule, which is exactly why AI must lean on the site as the source of truth. Versailles (founded 1971 in Little Havana, a James Beard America's Classic) shows the opposite pressure: external sources carry the atmosphere but blur the facts, and the name is ambiguous (a palace, a city, other venues), so the site must hard-bind the entity: Versailles Restaurant, Cuban, Miami, Calle Ocho, a specific address and history. In both, the site does not persuade; it removes ambiguity.",
        },
        {
          heading: "What does AI actually evaluate on a restaurant website?",
          text: "AI evaluates a restaurant website across four directions, and our AIRS (AI Ready Score) method measures each one. Whether AI understands the venue from the first screen, its type, cuisine, location, is the Homepage direction. Whether AI can read the site at all, no PDF-only menus, no content hidden behind JavaScript, is the Technical direction. Whether the pages carry direct answers, described menus and citable blocks is the Content direction. Whether the data is consistent and the venue looks like a trustworthy, verified entity is the Authority direction. The AIRS method grew from a large body of experiments, real queries to leading AI assistants and a reference site tuned close to full compliance with how AI selects sources, so this restaurant study is one confirmation of it, not a stand-alone claim. Diagnosis and remedy come from the same authors: the study names the problem, the method measures it, and the AI Answers Score tool checks a site automatically.",
        },
        {
          heading: "How can a small or new restaurant get into AI recommendations?",
          text: "Our field numbers point to an opening. Across 50+ restaurant and cafe sites in New York and Miami, AIRS readiness sat at 58 to 64 percent, rarely 72. These venues close the gap with external authority built over years. But authority is slow to build, while the site, the one dimension still under 65 percent for almost everyone, can be brought up in weeks. Whoever fixes the site first can compete with names that today ride reputation alone. This matters most for new venues with little history. Traditional channels reward age and budget; AI visibility rewards structure and facts, which a young venue can put in order fast. Our own roofing case reached the top of every major AI assistant in 24 days with no external links, proof that structure, not history, drives AI citation. For a new restaurant or cafe, AI visibility is today the lowest-cost way to be recommended, and the only channel where lack of history is not a disadvantage.",
        },
      ],

      actions: [
        "Run the seven-question test: can AI tell from your site alone what the venue is, where it is, the cuisine, what makes it different, which occasions it fits, why to trust it, and how to book?",
        "Move every menu from PDF or an external widget to plain HTML text, with described dishes (spicy, gluten-free, vegetarian), not just names.",
        "State hours explicitly, including holidays and seasonality, and make sure they match every external platform.",
        "Add Schema.org markup: Restaurant, Menu, OpeningHours, geo, so AI reads machine-readable facts instead of guessing.",
        "Create occasion pages: private dining, group reservations, business lunch, celebrations, and explicit format signals (patio, dress code, parking, kids menu).",
        "Write a plain FAQ from real guest questions (parking, dietary options, groups, dress code); AI cites ready question-answer pairs.",
        "Bind the entity on the homepage in one line: type, cuisine, neighbourhood, and the detail that sets you apart.",
      ],

      faq: [
        {
          question: "We are famous locally. Do we really need a strong website for AI?",
          answer:
            "For broad queries, fame carries you. But AI splits questions into narrow ones (open now, gluten-free, patio, group of twelve), and those decide who gets the guest tonight. For each, AI needs a verified fact on your site; without it, it hedges or names a competitor. Fame keeps you on general lists; the site keeps you in the narrow queries that convert.",
        },
        {
          question: "Can a good website make up for weak reviews and press?",
          answer:
            "Partly, and more so for lesser-known venues. A clear, well-structured site helps AI understand and correctly classify a new place and include it in narrow queries. But the site gives precision, external sources give authority, and one does not replace the other. For best or most-recommended queries, independent confirmation still decides.",
        },
        {
          question: "Is a PDF menu really a problem?",
          answer:
            "Yes. AI reads text, not the styled image of a menu, and a PDF or an external-only widget connects poorly to the rest of the site. Plain HTML text lets AI understand the cuisine structure, price range and dietary options, and match your dishes to what a user asks for. The menu is also proof of specialisation: it confirms the cuisine you claim.",
        },
        {
          question: "We are a new cafe with little history. Is this worth it?",
          answer:
            "It is where you have the most to gain. Traditional channels reward age and budget; AI visibility rewards site structure, which you can fix in weeks. Our roofing case reached the top of every major AI assistant in 24 days with no external links. For a new venue, AI visibility is the lowest-cost channel and the only one where lack of history is not a disadvantage.",
        },
      ],

      nextStepLabel: "How Schema.org markup helps AI understand your business",
      nextHref: "/what-site-needs/schema-org-for-ai",
    },

    ru: {
      h1: "Почему ИИ рекомендует один ресторан и не замечает другой?",
      subtitle: "Рестораны · кафе · бары · кофейни · пекарни",
      methodology:
        "Кросс-модельное исследование: мы задали один и тот же вопрос четырем ведущим ИИ-системам и попросили каждую разобрать известные заведения Нью-Йорка и Майами. Выводы, совпавшие у всех четырех, приняты как устойчивые. Факты о компаниях проверены по открытым источникам (июль 2026). Аналитическая основа: методика AIRS (AI Ready Score).",
      crumb: "Рестораны и кафе в ответах ИИ",
      directAnswer:
        "Да, но не по той причине, которую ждет большинство владельцев. Внешняя репутация (отзывы, пресса, гиды) решает, попадет ли заведение в круг кандидатов вообще. А собственный сайт заведения решает, насколько точно, уверенно и по какому поводу ИИ его порекомендует. Слабый сайт редко убирает известное место из общих списков, но тихо выбивает его из узких, самых конверсионных запросов, которые приводят гостя сегодня вечером: открыто сейчас, безглютеновое меню, веранда с видом, стол на 12 человек. Мы проверили более 50 сайтов ресторанов и кафе в Нью-Йорке и Майами по методике AIRS: большинство набирает 58-64%, редко 72%. Разрыв они закрывают внешней авторитетностью. Сайт это единственное направление, где еще есть незанятое пространство роста.",

      keyFacts: [
        "Внешняя репутация отвечает на вопрос, стоит ли рекомендовать заведение; сайт отвечает, что именно сказать и по какому поводу. Это разные задачи, и они почти не заменяют друг друга.",
        "Сайт это единственный источник, который заведение контролирует полностью. Все остальное это интерпретация третьих лиц.",
        "Для известного заведения сайт редко создает рекомендацию, но задает, насколько уверенно и детально она звучит, а это определяет позицию внутри ответа.",
        "Относительный вес сайта обратно пропорционален известности: чем менее известно заведение, тем больше несет сайт. Владельцы с сильным сайтом и слабой прессой недооценивают свое преимущество.",
        "Слабый сайт не стирает заведение из общих списков, он выбивает его из узких запросов, которые конвертируются лучше всего (открыто сейчас, диетические опции, веранда, группа).",
        "На более чем 50 сайтах ресторанов и кафе в Нью-Йорке и Майами картина устойчива: 58-64% готовности по AIRS, редко до 72%. Остальное закрывается внешней авторитетностью.",
        "Для ИИ текстовое описание блюда и его состава важнее, чем фотография высокого разрешения, потому что текстовые модели работают со смыслом, а не с визуальной эстетикой.",
        "Четыре вывода этого исследования один в один ложатся на четыре направления методики AIRS: Главная страница, Технические факторы, Контент, Авторитетность.",
        "Для нового заведения с недолгой историей видимость в ответах ИИ это самый низкозатратный канал: он вознаграждает структуру сайта, а это недели, а не годы, которые нужны внешней репутации.",
      ],

      body: [
        {
          heading: "Что ИИ берет с сайта, а что из внешних источников?",
          text: "Это чистое разделение труда. Из внешних источников, отзывов, рейтингов, гидов, прессы, упоминаний в соцсетях, карт, ИИ узнает, стоит ли вообще рекомендовать заведение: его авторитет и социальное доказательство. С сайта ИИ берет факты, которые третьи лица передают плохо или дают устареть: актуальное меню и цены, часы работы, включая праздники и сезонность, кухню и концепцию словами самого заведения, детали формата, бронирование, дресс-код, веранду, детское меню, парковку, а также историю или профиль шефа, которые служат сигналом подлинности. Сайт это единственный источник, который заведение контролирует полностью, поэтому именно на нем ИИ разрешает неоднозначность, когда внешние данные противоречат друг другу. Вот почему сильный внешний слой при слабом сайте дает осторожную, обобщенную рекомендацию, а сильный сайт превращает ту же репутацию в точную.",
        },
        {
          heading: "Почему слабый сайт вредит даже известному заведению?",
          text: "Слабый сайт бьет не по факту упоминания, а по его качеству. Известное заведение с тысячами отзывов все равно появится в широком запросе лучшие рестораны Майами. Но ИИ дробит реальные вопросы на узкие, а деньги именно в узких: открыто прямо сейчас, безглютеновые опции, веранда с видом, стол на группу из двенадцати, деловой обед рядом с районом. Для каждого из них ИИ нужен подтвержденный факт, и если сайт его ясно не указывает, ИИ либо добавляет оговорку (уточните часы), либо предпочитает менее известного конкурента, у которого факт указан. Хуже того, слабый сайт часто дает не отсутствие рекомендации, а неправильную: ИИ называет заведение, но ошибается в его формате, локации, ценовом уровне или подходящем поводе. Именно узкие запросы приводят гостя сегодня вечером, поэтому потеря концентрируется там, где она важнее всего.",
          table: {
            headers: ["Тип запроса", "Что его решает", "Где проигрывает слабый сайт"],
            rows: [
              ["Широкий (лучшие рестораны Майами)", "Внешняя авторитетность: пресса, отзывы, списки", "Редко проигрывает: вывозит известность"],
              ["Узкий (открыто сейчас, безглютеновое, веранда, группа 12)", "Подтвержденные факты на сайте", "Проигрывает часто: факта нет, ИИ осторожничает или берет конкурента"],
              ["Повод (свидание, деловой обед, семья)", "Явные страницы под повод и сигналы формата", "Проигрывает: маркетинговый текст не классифицирует заведение"],
            ],
            caption: "Узкие и поводные запросы конвертируются лучше всего и именно там исход решают факты на сайте, а не известность.",
          },
        },
        {
          heading: "Как реальные рестораны попадают в ответы ИИ: два примера",
          text: "Два проверенных кейса из Майами иллюстрируют закономерность. У Joe's Stone Crab (основан в 1913 году, обладатель James Beard America's Classic) плотный внешний слой: рекомендация существовала бы и без сайта. Здесь задача сайта это устранение неоднозначности, сезон каменного краба идет с 15 октября по 1 мая, плюс часы и правила посещения. Показательная деталь: заведение славилось тем, что не принимало бронь, однако к 2026 году оно принимает ее через OpenTable. Внешний факт устарел, и актуальное правило подтверждает только официальный канал, а это ровно та причина, по которой ИИ должен опираться на сайт как на источник истины. Versailles (основан в 1971 году в Little Havana, тоже James Beard America's Classic) показывает обратное давление: внешние источники передают атмосферу, но размывают факты, а имя неоднозначно (дворец, город, другие заведения), поэтому сайту важно жестко связать сущность: Versailles Restaurant, кубинский, Miami, Calle Ocho, конкретный адрес и история. В обоих случаях сайт не убеждает, он снимает неоднозначность.",
        },
        {
          heading: "Что именно ИИ оценивает на сайте ресторана?",
          text: "ИИ оценивает сайт ресторана по четырем направлениям, и наша методика AIRS (AI Ready Score) измеряет каждое. Понимает ли ИИ заведение с первого экрана, его тип, кухню, локацию, это направление Главная страница. Может ли ИИ вообще прочитать сайт, без меню только в PDF, без контента, спрятанного за JavaScript, это направление Технические факторы. Есть ли на страницах прямые ответы, описанные меню и цитируемые блоки это направление Контент. Единообразны ли данные и выглядит ли заведение надежной, подтвержденной сущностью это направление Авторитетность. Диагноз и лекарство от одних авторов: исследование ставит проблему, методика ее измеряет, а инструмент AI Answers Score проверяет сайт автоматически.",
        },
        {
          heading: "Как небольшому или новому ресторану попасть в рекомендации ИИ?",
          text: "Наши полевые цифры указывают на окно возможности. На более чем 50 сайтах ресторанов и кафе в Нью-Йорке и Майами готовность по AIRS держалась на 58-64%, редко 72%. Эти заведения закрывают разрыв внешней авторитетностью, накопленной за годы. Но авторитет строится медленно, а сайт, единственное направление, которое почти у всех ниже 65%, можно подтянуть за недели. Кто первым приведет сайт в порядок, сможет конкурировать с именами, которые сегодня держатся на одной репутации. Особенно это важно для новых заведений с недолгой историей. Традиционные каналы вознаграждают возраст и бюджет; видимость в ответах ИИ вознаграждает структуру и факты, а их молодое заведение может привести в порядок быстро. Наш собственный кейс по кровле вышел в топ всех ведущих ИИ-ассистентов за 24 дня без единой внешней ссылки, доказательство того, что цитируемость в ИИ определяет структура, а не история. Для нового ресторана или кафе видимость в ответах ИИ это сегодня самый низкозатратный способ быть рекомендованным и единственный канал, где отсутствие истории не помеха.",
        },
      ],

      actions: [
        "Пройдите тест семи вопросов: может ли ИИ понять только по вашему сайту, что это за заведение, где оно, какая кухня, чем отличается, для каких случаев подходит, почему ему доверять и как забронировать?",
        "Переведите каждое меню из PDF или внешнего виджета в обычный HTML-текст, с описанием блюд (острое, безглютеновое, вегетарианское), а не только названиями.",
        "Укажите часы работы явно, включая праздники и сезонность, и убедитесь, что они совпадают на всех внешних площадках.",
        "Добавьте разметку Schema.org: Restaurant, Menu, OpeningHours, geo, чтобы ИИ читал машиночитаемые факты, а не догадывался.",
        "Создайте страницы под поводы: частные мероприятия, брони для групп, деловой обед, празднования, и явные сигналы формата (веранда, дресс-код, парковка, детское меню).",
        "Напишите простой FAQ по реальным вопросам гостей (парковка, диетические опции, группы, дресс-код); ИИ цитирует готовые пары вопрос-ответ.",
        "Свяжите сущность на главной в одну строку: тип, кухня, район и деталь, которая вас отличает.",
      ],

      faq: [
        {
          question: "Мы известны локально. Нам правда нужен сильный сайт для ИИ?",
          answer:
            "В широких запросах известность вывозит. Но ИИ дробит вопросы на узкие (открыто сейчас, безглютеновое, веранда, группа на двенадцать), и именно они решают, кто получит гостя сегодня вечером. Для каждого ИИ нужен подтвержденный факт на вашем сайте; без него он осторожничает или называет конкурента. Известность держит вас в общих списках; сайт держит вас в узких запросах, которые конвертируются.",
        },
        {
          question: "Может ли хороший сайт компенсировать слабые отзывы и прессу?",
          answer:
            "Частично, и сильнее для менее известных заведений. Ясный, хорошо структурированный сайт помогает ИИ понять и правильно классифицировать новое место и включить его в узкие запросы. Но сайт дает точность, внешние источники дают авторитет, и одно не заменяет другое. В запросах лучший или самый рекомендуемый решает независимое подтверждение.",
        },
        {
          question: "Меню в PDF это правда проблема?",
          answer:
            "Да. ИИ читает текст, а не оформленную картинку меню, а PDF или только внешний виджет плохо связывается с остальным сайтом. Обычный HTML-текст позволяет ИИ понять структуру кухни, ценовой диапазон и диетические опции и сопоставить ваши блюда с тем, что спрашивает пользователь. Меню это еще и доказательство специализации: оно подтверждает заявленную кухню.",
        },
        {
          question: "Мы новое кафе с недолгой историей. Это того стоит?",
          answer:
            "Именно здесь у вас больше всего выигрыша. Традиционные каналы вознаграждают возраст и бюджет; видимость в ответах ИИ вознаграждает структуру сайта, а ее можно привести в порядок за недели. Наш кейс по кровле вышел в топ всех ведущих ИИ-ассистентов за 24 дня без единой внешней ссылки. Для нового заведения видимость в ответах ИИ это самый низкозатратный канал и единственный, где отсутствие истории не помеха.",
        },
      ],

      nextStepLabel: "Как разметка Schema.org помогает ИИ понять бизнес",
      nextHref: "/what-site-needs/schema-org-for-ai",
    },
  },
};

export default topic;
