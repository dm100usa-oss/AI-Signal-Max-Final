import type { Topic } from "./types";

// =============================================================
//  ИССЛЕДОВАНИЕ №2 серии: Роль сайта компании домашних услуг
//  (HVAC, сантехника, электрика, кровля, борьба с вредителями)
//  в рекомендациях ИИ.
//  Раздел: how-ai-chooses. kind: "research".
//  Основа: кросс-модельный анализ (Perplexity, GPT, Claude, Gemini)
//  + верификация фактов веб-поиском (июль 2026):
//  Roto-Rooter (1935, крупнейший в Сев. Америке, 24/7, 600+ локаций);
//  Petri Plumbing (Бруклин, с 1906, семейный, 4-5 поколений,
//  Green Plumbers USA, Bay Ridge Ave). См. sources.
//  ВАЖНО: своих замеров AIRS по этой нише НЕТ - проценты НЕ выдумываем.
//  Экспертный слой: методика AIRS (4 направления = 4 вывода),
//  наш кейс (кровля, 24 дня, без ссылок) - органично ложится,
//  тк home services включает кровлю.
//  Инструмент проверки: AI Answers Score.
//  Эксклюзивные выводы ниши: страница проблемы важнее страницы
//  услуги; границы услуг ("чего НЕ делаем") повышают доверие;
//  раздел "Вакансии" как независимое подтверждение компетенций;
//  свежесть сайта как "признак жизни"; NAP-согласованность;
//  сайт как "якорь сущности" для новых компаний.
//  Фирменный термин: видимость в ответах ИИ (AI Answer Visibility).
//  Правила: длинных тире нет; "е" вместо "ё".
// =============================================================

const topic: Topic = {
  slug: "home-services-ai-recommendations",
  section: "how-ai-chooses",
  kind: "research",
  status: "published",
  accent: "rgba(37,99,235,0.185)",
  datePublished: "2026-07-10",
  sources: [
    {
      label:
        "Roto-Rooter - Wikipedia (основан в 1935, крупнейший провайдер сантехники и прочистки в Сев. Америке; 24/7)",
      url: "https://en.wikipedia.org/wiki/Roto-Rooter",
    },
    {
      label:
        "Roto-Rooter - официальный сайт (профессионалы с 1935; выезд в тот же день и экстренный сервис 365 дней в году)",
      url: "https://www.rotorooter.com/about-us/",
    },
    {
      label:
        "Petri Plumbing, Heating, Cooling & Drain Cleaning - семейная компания в Бруклине с 1906 года; сертификат Green Plumbers USA",
      url: "https://www.petriplumbing.com/about-petri-plumbing/",
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
        "AI Answers Rank - Как настроить код сайта для ИИ-краулеров",
      url: "/check-readiness/technical-geo-checklist",
    },
    {
      label:
        "AI Answers Rank - Как писать контент, который цитируют ИИ",
      url: "/content-ai-uses/writing-citable-content",
    },
  ],

  content: {
    en: {
      h1: "What sets apart the home-services sites that AI recommends?",
      subtitle: "HVAC · roofing · plumbing · electrical · landscaping · pest control · pool services · remodeling",
      methodology:
        "A cross-model study: we put the same question to four leading AI systems and had each analyse well-known contractors in New York and Miami. Findings shared by all four are treated as stable. Company facts were verified against open sources (July 2026). Analysis framework: the AIRS (AI Ready Score) method.",
      crumb: "Home services in AI answers",
      directAnswer:
        "More than most local businesses do. For a plumber, HVAC contractor, electrician or roofer, external reputation (reviews, directories, maps) proves the company exists. But the website is where AI verifies what it actually does, where it works, and whether it fits a specific request. AI splits a real query into narrow parts (service, neighbourhood, property type, urgency, licence), and for each part it needs a fact it can confirm from a first-party source. A weak site rarely erases a famous brand from broad lists, but it drops it from the exact narrow queries that bring a paying job: replace a water heater in a Brickell condo today, licensed, works with the building manager. For a new company the site is even more decisive, because with no external history it is the only place AI can build the company as an entity at all.",

      keyFacts: [
        "External sources prove a company exists; the website proves what it does, where, and for whom. AI needs both, and the site carries the part nothing else can.",
        "AI matches a company through three jobs: identification (which business this is), classification (services, area, property types) and intent-matching (which query it fits).",
        "A weak site rarely removes a known brand from broad queries, but it drops it from the narrow, high-converting ones (urgent, specific equipment, specific district, property type).",
        "Consistency of name, address and phone across the site and external profiles matters more than volume of content: a contradiction reads to AI as a risk signal.",
        "For AI, a page describing a specific problem (leaking water heater, burst pipe) is often more useful than a general service page, because users ask in the shape of a problem.",
        "Stated limits (what the company does not do, where it does not work) paradoxically raise recommendations: they let AI include or exclude the company with confidence.",
        "Site freshness reads as a sign of life: a stale, abandoned site signals a business that may have closed, which lowers AI's willingness to recommend it.",
        "The four findings map one to one onto the four directions of the AIRS method: Homepage, Technical, Content, Authority.",
        "For a new company the site is the anchor of its entity: remove a veteran's site and AI rebuilds it from external data; remove a newcomer's site and for AI it does not exist.",
      ],

      body: [
        {
          heading: "What does AI take from the site, and what from outside?",
          text: "The split is clean. External sources, reviews, ratings, maps, directories, licence registries, give AI social proof and confirmation that the business is real and active. The site gives what nothing else carries reliably: the exact list of services and their boundaries, the service area by district and ZIP, hours, emergency availability, licence and insurance numbers, warranties, the equipment brands the company handles, and the names and qualifications of the people behind it. The site is the only place a company describes itself structurally and in the first person, so it is where AI resolves ambiguity when outside data is thin or conflicting. That is why a strong external layer plus a weak site yields a cautious, generic recommendation, while a strong site turns the same reputation into a precise one that fits a narrow request.",
        },
        {
          heading: "Why does a weak site hurt even a well-known company?",
          text: "A weak site damages the quality of the mention, not the fact of it. A famous plumbing brand will still show up for the broad query reliable plumber in New York. But AI breaks real questions into narrow parts, and the narrow parts are where the paying job is: who can replace a leaking water heater in a Brickell condo today, works with building management, and gives a materials warranty. For each of those AI needs a fact it can confirm from the site: does the company do water heaters, replacement and not only repair, serve condos, work in that district, offer same-day dispatch, hold the right licence. If the site does not state it, AI either hedges or prefers a lesser-known competitor whose site does. And a weak site often produces not a missing recommendation but a wrong one, naming the company but misstating its area, property types or price level. The narrow queries convert best, so the loss lands exactly where it hurts.",
          table: {
            headers: ["Query type", "What decides it", "Where a weak site loses"],
            rows: [
              ["Broad (reliable plumber in NYC)", "External authority: reviews, brand, directories", "Rarely loses: reputation carries it"],
              ["Narrow (water heater, Brickell condo, today, licensed)", "First-party facts on the site", "Loses often: no fact to confirm, AI hedges or picks a rival"],
              ["Problem-shaped (burst pipe, no heat, flooded basement)", "A page that answers the exact situation", "Loses: only a generic service page, nothing to lift"],
            ],
            caption: "Users ask in the shape of a problem, and narrow queries convert best; both are decided by first-party facts on the site, not by fame.",
          },
        },
        {
          heading: "How do real contractors show up in AI answers: two examples",
          text: "Two verified cases frame the range. Roto-Rooter (founded 1935, the largest plumbing and drain provider in North America, 24/7 across 600+ locations) has an enormous external footprint: the recommendation exists without deep local pages. Here the site's job is to confirm the category and add operational facts, emergency availability, service scope, upfront pricing. Its weak spot is exactly what a national brand struggles to prove: which local branch serves a given district, how fast a truck arrives, which licences apply where. Petri Plumbing (family-owned in Brooklyn since 1906, four to five generations, based on Bay Ridge Avenue, certified by Green Plumbers USA) shows the opposite: a local company where the site can outweigh the external layer through a human face and tight geographic focus. For a local firm, precise district-by-district and property-type detail (brownstones, pre-war buildings, co-ops, condos, old heating systems) is where the site wins the narrow queries a national brand cannot. In both, the site does not persuade; it removes ambiguity and proves fit.",
        },
        {
          heading: "What does AI actually evaluate on a home-services website?",
          text: "AI evaluates a home-services website across four directions, and our AIRS (AI Ready Score) method measures each one. Whether AI understands the company from the first screen, what it does, for whom, in which area, is the Homepage direction. Whether AI can read the site at all, no service details buried in JavaScript, no menus or prices locked in images, is the Technical direction. Whether the pages carry direct answers, described services, problem pages and citable blocks is the Content direction. Whether name, address, phone and licences are consistent and the company looks like a verified, live entity is the Authority direction. Diagnosis and remedy come from the same authors: the study states the problem, the method measures it, and the AI Answers Score tool checks a site automatically. Our own roofing case, roofing is a home service, reached the top of every major AI assistant in 24 days with no external links, proof that structure, not history, drives AI citation.",
        },
        {
          heading: "How can a new home-services company get into AI recommendations?",
          text: "This niche has signals a restaurant does not. A page for a specific problem (leaking water heater, burst pipe, no heat) beats a general Plumbing Services page, because users ask in the shape of a problem and AI lifts the closest self-contained answer. Stated limits raise trust: we serve houses, townhouses and small commercial; in high-rises only after clearing access with building management reads as a real operating model, not a marketing claim, and lets AI include or exclude the company with confidence. Even the Careers page is evidence: if the services say we do everything but the job posts seek only general labourers, AI lowers trust; a post requiring five years on Daikin chillers confirms real competence. And site freshness reads as a sign of life, a stale site signals a business that may have closed. All of this favours new companies. Traditional channels reward age and budget; AI visibility rewards structure and verifiable facts, which a young firm can put in order in weeks. For a newcomer the site is the anchor of its entity: with no external history, it is the only place AI can learn the company exists and what it fits. The right move is a narrow, honest profile (a new local company specialising in pool repair for houses in three Miami districts) over an unverifiable claim to do everything across South Florida.",
        },
      ],

      actions: [
        "Give every core service its own page that answers: which problem it solves, what is included, which property types and districts, when it is urgent, what the limits are, what warranty applies.",
        "Create problem-shaped pages for the situations users actually search (leaking water heater, burst pipe, no heat, clogged main line), each with a self-contained answer AI can lift.",
        "State your service area precisely by district and ZIP, and back it with operational proof (local number, real projects, arrival time), not just a city name in the title.",
        "State your limits: property types you serve, what you do not take on, and conditions (for example, high-rise work only after building-management approval).",
        "Make name, address, phone, hours and services identical across the site and every external profile (Google Business Profile, directories); fix every contradiction.",
        "Add Schema.org markup (LocalBusiness, Service, areaServed, OpeningHours) and put licence and insurance numbers in plain text, so AI reads verifiable facts, not guesses.",
        "Keep the site alive: publish real project pages with district, property type, work done and equipment used, and update dates, so AI reads the business as active.",
      ],

      faq: [
        {
          question: "We are an established brand with thousands of reviews. Do we still need a strong site?",
          answer:
            "For broad queries your reputation carries you. But AI splits questions into narrow parts (specific equipment, district, property type, urgency, licence), and those decide who gets the job. For each, AI needs a fact it can confirm on your site; without it, it hedges or names a competitor. Reputation keeps you on general lists; the site keeps you in the narrow queries that convert, and lets AI tell which local branch actually serves a district.",
        },
        {
          question: "Why would a problem page matter more than a services page?",
          answer:
            "Because users ask AI in the shape of a problem, not a service category. Someone types my water heater is leaking, not water heater services. A page built around that exact situation gives AI a self-contained answer it can lift and attribute to you. A general Plumbing Services page lists what you do but rarely matches the user's wording closely enough to be cited.",
        },
        {
          question: "Does listing what we do NOT do really help?",
          answer:
            "Yes, counterintuitively. Over-broad claims (we handle anything, anywhere) are hard to verify and read as marketing. Clear limits (we serve houses and small commercial; high-rises only after building-management approval) read as a real operating model. They let AI include or exclude you with confidence, which raises how often you are recommended for the queries you actually fit.",
        },
        {
          question: "We are a brand-new company with no reviews. Is a strong site worth it?",
          answer:
            "It is where you have the most to gain. For a newcomer the site is the anchor of your entity: with no external history, it is the only place AI can learn you exist and what you fit. Traditional channels reward age and budget; AI visibility rewards structure and verifiable facts you can put in order in weeks. Our roofing case reached the top of every major AI assistant in 24 days with no external links. Build a narrow, honest, well-documented profile rather than an unverifiable claim to do everything.",
        },
      ],

      nextStepLabel: "How Schema.org markup helps AI understand your business",
      nextHref: "/what-site-needs/schema-org-for-ai",
    },

    ru: {
      h1: "Что отличает сайты в сфере домашних услуг, которые рекомендует ИИ?",
      subtitle: "HVAC · кровля · сантехника · электрика · ландшафт · борьба с вредителями · бассейны · ремонт",
      methodology:
        "Кросс-модельное исследование: мы задали один и тот же вопрос четырем ведущим ИИ-системам и попросили каждую разобрать известные компании Нью-Йорка и Майами. Выводы, совпавшие у всех четырех, приняты как устойчивые. Факты о компаниях проверены по открытым источникам (июль 2026). Аналитическая основа: методика AIRS (AI Ready Score).",
      crumb: "Домашние услуги в ответах ИИ",
      directAnswer:
        "Больше, чем большинству локальных бизнесов. Для сантехника, HVAC-подрядчика, электрика или кровельщика внешняя репутация (отзывы, каталоги, карты) доказывает, что компания существует. Но именно на сайте ИИ проверяет, что она реально делает, где работает и подходит ли под конкретный запрос. ИИ дробит реальный запрос на узкие части (услуга, район, тип объекта, срочность, лицензия), и для каждой ему нужен факт, который он может подтвердить из первоисточника. Слабый сайт редко стирает известный бренд из общих списков, но выбивает его из тех самых узких запросов, которые приносят оплачиваемый заказ: заменить водонагреватель в кондоминиуме в Brickell сегодня, лицензированно, во взаимодействии с управляющей компанией. Для новой компании сайт еще важнее: без внешней истории это единственное место, где ИИ вообще может собрать компанию как сущность.",

      keyFacts: [
        "Внешние источники доказывают, что компания существует; сайт доказывает, что она делает, где и для кого. ИИ нужно и то, и другое, и сайт несет то, чего больше взять неоткуда.",
        "ИИ сопоставляет компанию через три задачи: идентификация (что это за бизнес), классификация (услуги, район, типы объектов) и сопоставление с намерением (под какой запрос подходит).",
        "Слабый сайт редко убирает известный бренд из широких запросов, но выбивает его из узких, самых конверсионных (срочность, конкретное оборудование, конкретный район, тип объекта).",
        "Согласованность названия, адреса и телефона на сайте и во внешних профилях важнее объема контента: противоречие ИИ читает как сигнал риска.",
        "Для ИИ страница под конкретную проблему (протекает водонагреватель, лопнула труба) часто полезнее общей страницы услуги, потому что пользователи спрашивают в форме проблемы.",
        "Указание границ (чего компания не делает, где не работает) парадоксально повышает рекомендации: это позволяет ИИ уверенно включить или исключить компанию.",
        "Свежесть сайта читается как признак жизни: устаревший, заброшенный сайт сигналит, что бизнес мог закрыться, и снижает готовность ИИ его рекомендовать.",
        "Четыре вывода исследования один в один ложатся на четыре направления методики AIRS: Главная страница, Технические факторы, Контент, Авторитетность.",
        "Для новой компании сайт это якорь ее сущности: убери сайт у ветерана, и ИИ соберет его из внешних данных; убери сайт у новичка, и для ИИ его не существует.",
      ],

      body: [
        {
          heading: "Что ИИ берет с сайта, а что из внешних источников?",
          text: "Разделение чистое. Внешние источники, отзывы, рейтинги, карты, каталоги, реестры лицензий, дают ИИ социальное доказательство и подтверждение, что бизнес реален и активен. Сайт дает то, что больше нигде надежно не взять: точный перечень услуг и их границы, зону обслуживания по районам и ZIP-кодам, часы, экстренную доступность, номера лицензий и страховки, гарантии, марки оборудования, с которыми работает компания, а также имена и квалификацию людей за ней. Сайт это единственное место, где компания описывает себя структурно и от первого лица, поэтому именно на нем ИИ разрешает неоднозначность, когда внешние данные скудны или противоречивы. Вот почему сильный внешний слой при слабом сайте дает осторожную, обобщенную рекомендацию, а сильный сайт превращает ту же репутацию в точную, подходящую под узкий запрос.",
        },
        {
          heading: "Почему слабый сайт вредит даже известной компании?",
          text: "Слабый сайт бьет по качеству упоминания, а не по его факту. Известный сантехнический бренд все равно появится в широком запросе надежный сантехник в Нью-Йорке. Но ИИ дробит реальные вопросы на узкие части, а оплачиваемый заказ именно в узких: кто может заменить протекающий водонагреватель в кондоминиуме в Brickell сегодня, работает с управляющей компанией и дает гарантию на материалы. Для каждой из них ИИ нужен факт, который он подтвердит по сайту: работает ли компания с водонагревателями, делает ли замену, а не только ремонт, обслуживает ли кондоминиумы, работает ли в этом районе, есть ли выезд в тот же день, есть ли нужная лицензия. Если сайт этого не указывает, ИИ либо осторожничает, либо предпочитает менее известного конкурента, у которого указано. А слабый сайт часто дает не отсутствие рекомендации, а неправильную: называет компанию, но ошибается в ее районе, типах объектов или ценовом уровне. Узкие запросы конвертируются лучше всего, поэтому потеря приходится ровно туда, где больнее.",
          table: {
            headers: ["Тип запроса", "Что его решает", "Где проигрывает слабый сайт"],
            rows: [
              ["Широкий (надежный сантехник в Нью-Йорке)", "Внешняя авторитетность: отзывы, бренд, каталоги", "Редко проигрывает: вывозит репутация"],
              ["Узкий (водонагреватель, кондоминиум в Brickell, сегодня, лицензия)", "Факты из первоисточника на сайте", "Проигрывает часто: факта нет, ИИ осторожничает или берет конкурента"],
              ["По проблеме (лопнула труба, нет отопления, затопило подвал)", "Страница, отвечающая на конкретную ситуацию", "Проигрывает: есть только общая страница услуги, нечего процитировать"],
            ],
            caption: "Пользователи спрашивают в форме проблемы, а узкие запросы конвертируются лучше всего; и то, и другое решают факты из первоисточника на сайте, а не известность.",
          },
        },
        {
          heading: "Как реальные компании попадают в ответы ИИ: два примера",
          text: "Два проверенных кейса очерчивают диапазон. У Roto-Rooter (основана в 1935 году, крупнейший провайдер сантехники и прочистки в Северной Америке, работа 24/7 на 600+ локациях) огромный внешний след: рекомендация существует и без глубоких локальных страниц. Здесь задача сайта подтвердить категорию и добавить операционные факты, экстренную доступность, объем услуг, прозрачные цены. Слабое место ровно то, что национальному бренду трудно доказать: какой локальный филиал обслуживает данный район, как быстро приедет бригада, какие лицензии где действуют. Petri Plumbing (семейная компания в Бруклине с 1906 года, четыре-пять поколений, база на Bay Ridge Avenue, сертификат Green Plumbers USA) показывает обратное: локальная компания, где сайт может перевесить внешний слой за счет человеческого лица и плотной географической привязки. Для локальной фирмы именно детализация по районам и типам объектов (brownstones, довоенные дома, кооперативы, кондоминиумы, старые системы отопления) выигрывает узкие запросы, которые национальному бренду недоступны. В обоих случаях сайт не убеждает, он снимает неоднозначность и доказывает соответствие.",
        },
        {
          heading: "Что именно ИИ оценивает на сайте компании домашних услуг?",
          text: "ИИ оценивает сайт компании домашних услуг по четырем направлениям, и наша методика AIRS (AI Ready Score) измеряет каждое. Понимает ли ИИ компанию с первого экрана, что она делает, для кого, в каком районе, это направление Главная страница. Может ли ИИ вообще прочитать сайт, без деталей услуг, спрятанных в JavaScript, без меню и цен, запертых в картинках, это направление Технические факторы. Есть ли на страницах прямые ответы, описанные услуги, страницы проблем и цитируемые блоки это направление Контент. Единообразны ли название, адрес, телефон и лицензии и выглядит ли компания подтвержденной, живой сущностью это направление Авторитетность. Диагноз и лекарство от одних авторов: исследование ставит проблему, методика ее измеряет, а инструмент AI Answers Score проверяет сайт автоматически. Наш собственный кейс по кровле, а кровля это тоже домашняя услуга, вышел в топ всех ведущих ИИ-ассистентов за 24 дня без единой внешней ссылки, доказательство того, что цитируемость в ИИ определяет структура, а не история.",
        },
        {
          heading: "Как новой компании домашних услуг попасть в рекомендации ИИ?",
          text: "У этой ниши есть сигналы, которых нет у ресторана. Страница под конкретную проблему (протекает водонагреватель, лопнула труба, нет отопления) сильнее общей страницы Услуги сантехники, потому что пользователи спрашивают в форме проблемы, а ИИ берет ближайший самодостаточный ответ. Указание границ повышает доверие: обслуживаем частные дома, таунхаусы и небольшие коммерческие объекты; в высотках только после согласования доступа с управляющей компанией читается как реальная операционная модель, а не рекламное обещание, и позволяет ИИ уверенно включить или исключить компанию. Даже страница Вакансии это доказательство: если в услугах написано делаем все, а в вакансиях ищут только разнорабочих, ИИ снижает доверие; вакансия с требованием пяти лет опыта на чиллерах Daikin подтверждает реальную компетенцию. А свежесть сайта читается как признак жизни, устаревший сайт сигналит, что бизнес мог закрыться. Все это на руку новым компаниям. Традиционные каналы вознаграждают возраст и бюджет; видимость в ответах ИИ вознаграждает структуру и проверяемые факты, которые молодая фирма может привести в порядок за недели. Для новичка сайт это якорь его сущности: без внешней истории это единственное место, где ИИ узнает, что компания существует и подо что подходит. Верный ход это узкий, честный профиль (новая локальная компания, специализирующаяся на ремонте бассейнов в частных домах трех районов Майами) вместо непроверяемого заявления делать все по всей Южной Флориде.",
        },
      ],

      actions: [
        "Дайте каждой основной услуге отдельную страницу, отвечающую: какую проблему решает, что входит, какие типы объектов и районы, когда это срочно, какие ограничения, какая гарантия.",
        "Создайте страницы под проблемы, которые пользователи реально ищут (протекает водонагреватель, лопнула труба, нет отопления, засор магистрали), каждая с самодостаточным ответом, который ИИ сможет процитировать.",
        "Укажите зону обслуживания точно, по районам и ZIP-кодам, и подтвердите операционными деталями (местный номер, реальные проекты, время выезда), а не одним названием города в заголовке.",
        "Укажите границы: какие типы объектов обслуживаете, за что не беретесь, и условия (например, работы в высотках только после согласования с управляющей компанией).",
        "Сделайте название, адрес, телефон, часы и услуги одинаковыми на сайте и во всех внешних профилях (Google Business Profile, каталоги); устраните каждое противоречие.",
        "Добавьте разметку Schema.org (LocalBusiness, Service, areaServed, OpeningHours) и разместите номера лицензий и страховки обычным текстом, чтобы ИИ читал проверяемые факты, а не догадывался.",
        "Держите сайт живым: публикуйте страницы реальных проектов с районом, типом объекта, выполненной работой и оборудованием, и обновляйте даты, чтобы ИИ читал бизнес как активный.",
      ],

      faq: [
        {
          question: "Мы известный бренд с тысячами отзывов. Нам все равно нужен сильный сайт?",
          answer:
            "В широких запросах репутация вывозит. Но ИИ дробит вопросы на узкие части (конкретное оборудование, район, тип объекта, срочность, лицензия), и именно они решают, кто получит заказ. Для каждой ИИ нужен факт, который он подтвердит на вашем сайте; без него он осторожничает или называет конкурента. Репутация держит вас в общих списках; сайт держит вас в узких запросах, которые конвертируются, и позволяет ИИ понять, какой локальный филиал реально обслуживает район.",
        },
        {
          question: "Почему страница проблемы важнее страницы услуги?",
          answer:
            "Потому что пользователи спрашивают ИИ в форме проблемы, а не категории услуги. Человек пишет у меня течет водонагреватель, а не услуги по водонагревателям. Страница, построенная вокруг этой конкретной ситуации, дает ИИ самодостаточный ответ, который он может процитировать и приписать вам. Общая страница Услуги сантехники перечисляет, что вы делаете, но редко совпадает с формулировкой пользователя достаточно точно, чтобы быть процитированной.",
        },
        {
          question: "Указание того, чего мы НЕ делаем, правда помогает?",
          answer:
            "Да, вопреки интуиции. Слишком широкие заявления (беремся за все и везде) трудно проверить, и они читаются как реклама. Четкие границы (обслуживаем частные дома и небольшие коммерческие объекты; высотки только после согласования с управляющей компанией) читаются как реальная операционная модель. Они позволяют ИИ уверенно включить или исключить вас, а это повышает, как часто вас рекомендуют по запросам, которым вы реально подходите.",
        },
        {
          question: "Мы совсем новая компания без отзывов. Сильный сайт того стоит?",
          answer:
            "Именно здесь у вас больше всего выигрыша. Для новичка сайт это якорь вашей сущности: без внешней истории это единственное место, где ИИ узнает, что вы существуете и подо что подходите. Традиционные каналы вознаграждают возраст и бюджет; видимость в ответах ИИ вознаграждает структуру и проверяемые факты, которые можно привести в порядок за недели. Наш кейс по кровле вышел в топ всех ведущих ИИ-ассистентов за 24 дня без единой внешней ссылки. Стройте узкий, честный, задокументированный профиль вместо непроверяемого заявления делать все.",
        },
      ],

      nextStepLabel: "Как разметка Schema.org помогает ИИ понять бизнес",
      nextHref: "/what-site-needs/schema-org-for-ai",
    },
  },
};

export default topic;
