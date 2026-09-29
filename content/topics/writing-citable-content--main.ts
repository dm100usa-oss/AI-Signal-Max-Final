import type { Topic } from "./types";

// =============================================================
//  СТАТЬЯ: Как писать контент, который цитируют ИИ
//  Раздел: content-ai-uses (order 5)
//  Глубокая, плотная статья про копирайтинг под ИИ.
//  Факты проверены веб-поиском (июль 2026): длина цитируемого блока
//  40–60 слов, позиция цитат (SparkToro), нулевая корреляция длины
//  и цитируемости (Ahrefs, 174k страниц), обход рекламного текста,
//  корроборация фактов (VeriCite); см. sources.
//  Экспертный слой: методика AIRS, наш кейс (кровельный сайт без домена).
//  Фирменный термин: видимость в ответах ИИ (AI Answer Visibility).
//  Термин из корневой статьи: цитируемый блок (Citable Unit).
//  Правило: длинных тире нет.
// =============================================================

const topic: Topic = {
  slug: "writing-citable-content",
  section: "content-ai-uses",
  status: "published",
  accent: "rgba(245,158,11,0.185)",
  datePublished: "2026-07-03",
  sources: [
    {
      label:
        "Ahrefs - Short vs. Long Content in AI Overviews (174 048 страниц; корреляция длины и цитируемости 0,04)",
      url: "https://ahrefs.com/blog/short-vs-long-content-in-ai-overviews/",
    },
    {
      label:
        "SparkToro / NAV43 - доля цитат по позиции на странице (44% из первых 30% текста)",
      url: "https://nav43.com/blog/llm-citation-optimization-quote-ready-content-blocks/",
    },
    {
      label:
        "Digital Applied - 1000 AI Overviews Analyzed: Citation Pattern Study (апрель 2026)",
      url: "https://www.digitalapplied.com/blog/we-analyzed-1000-ai-overviews-citation-pattern-study",
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
        "AI Answers Rank - Как разметка Schema.org помогает ИИ понять бизнес",
      url: "/what-site-needs/schema-org-for-ai",
    },
  ],

  content: {
    en: {
      h1: "How do you write content that AI assistants actually cite?",
      crumb: "Writing citable content",
      directAnswer:
        "Write in citable units: self-contained blocks of roughly 40 to 60 words that answer one specific question completely and make sense when pulled out of the page. AI assistants do not read a page the way a person does; they extract passages that closely match the question and drop them into the answer. That means the direct answer must come first, be dense with verifiable facts rather than marketing phrases, and stand on its own. Position matters too: analysis of AI citations found that around 44% come from the first 30% of the page, so a buried answer is often no answer at all.",

      keyFacts: [
        "A citable unit is a self-contained block of about 40 to 60 words that fully answers one question and is understandable with no surrounding context.",
        "Roughly 44% of AI citations are drawn from the first 30% of a page, 31% from the middle and 25% from the end, so front-loading the answer is a citation decision (SparkToro, 2026).",
        "Content length barely affects citation: an Ahrefs study of 174,048 pages found a near-zero 0.04 correlation between word count and citation position (Ahrefs, December 2025).",
        "AI systems detect and avoid overly promotional copy when assembling an answer, skipping salesy text in favour of a more direct source.",
        "Specificity is what gets quoted: a claim with a number, a name and a source travels, while a generic statement is ignored because there is nothing concrete to extract.",
        "AI answer engines cross-check claims; a fact that appears nowhere else is discounted even from an otherwise trusted source (VeriCite verification pipeline, 2025).",
        "Content the model already knows (commodity explainer text) gives it no reason to cite you; original data, specific figures and first-hand experience do.",
        "Google's AI Overviews extract and score individual passages rather than reusing the top organic results, so passage quality is judged directly.",
      ],

      body: [
        {
          heading: "Why is promotional writing a poor fit for AI systems?",
          text: "Because there is nothing in it to extract. When a page opens with phrases like market leader, individual approach or best-in-class solutions, a human skims past them and a machine finds no fact to lift. AI systems actively detect and skip overly promotional copy, moving on to a source that states something concrete. The deeper problem is that marketing language is unverifiable by design. An AI answer engine cross-checks claims against other content before it cites them, so a sentence that asserts greatness but names no number, date or outcome cannot survive that check. The fix is not to write blandly; it is to replace adjectives with evidence. Instead of we install quickly, write installation takes two to three days. Instead of trusted by many, write used by 400 clinics across three states. The second version says the same thing with a fact the model can quote.",
        },
        {
          heading: "What is data density and how do you raise it?",
          text: "Data density is the share of a text that carries verifiable information rather than filler. There is no magic number for it, and anyone quoting a precise ratio is inventing one, but the direction is clear: every sentence should either state a fact or set up one that follows. You raise density by swapping abstract promises for concrete specifics. A price becomes a range with figures, a claim of speed becomes a timeframe, a boast of quality becomes a named certification or a measured outcome. The reason this works is that AI systems cite what they cannot already generate. Text that merely restates what the model knows by heart gives it no reason to reference you; it will answer from its own memory and skip the citation. Your own numbers, your own timeframes and your own first-hand results are exactly the material a model cannot produce without pointing to your page.",
        },
        {
          heading: "How long should a citable unit be, and where does it go?",
          text: "A citable unit runs roughly 40 to 60 words: long enough to answer one question completely, short enough to be lifted whole. The test is simple. If the block were shown on its own, with the rest of the page hidden, would a reader understand it fully? If yes, it is extractable; if it depends on the paragraph above it, it is not. Placement is the other half. Because roughly 44% of AI citations come from the first 30% of a page, the answer belongs at the top of the section, not after a warm-up. The pattern that works is three steps, the same one we use across this site: the question phrased the way people actually ask it, the direct answer in the very next sentence with no preamble, then a couple of supporting sentences with facts. A page can be thorough and still be passed over if nothing on it is shaped as an answer a model can grab.",
        },
        {
          heading: "Why do lists and tables make content easier to extract?",
          text: "Because they pre-separate facts into units a machine can lift without untangling prose. A dense narrative paragraph forces the extractor to work out where one fact ends and the next begins; a list or a table has already done that. A specifications table, in particular, presents each attribute and its value as a clean pair, which is close to how a model wants to store and reuse a fact. This does not mean turning every page into a grid. It means that when you have parallel facts, comparisons, steps or specifications, a list or table is the format most likely to be reused intact. The table below shows what tends to help extraction and what tends to defeat it.",
          table: {
            headers: ["Easy to extract", "Hard to extract"],
            rows: [
              ["Direct answer in the first sentence", "A long wind-up before the point"],
              ["One idea per short paragraph", "Several topics packed in one block"],
              ["Specific numbers, dates, names", "Vague words like fast or quality"],
              ["Lists and specification tables", "Facts buried inside dense prose"],
              ["A claim with a source", "An unverifiable marketing boast"],
            ],
            caption: "What makes a passage easy or hard for an AI to reuse. The left column lists the traits of a citable unit; the right lists the habits that make a model skip a page.",
          },
        },
        {
          heading: "Is it true that longer articles get cited more often?",
          text: "No, and this is one of the most persistent myths worth correcting. An Ahrefs study of 174,048 pages and more than half a million AI Overviews found a correlation of just 0.04 between word count and citation position, which is effectively none. Long content is not cited more often, and among cited pages length barely predicts where the citation lands. Transactional and utility pages with medians of 300 to 550 words are cited regularly. What the data points to is not length but shape: answer the question directly, lead with the main point, and write in clear declarative sentences. A ten-thousand-word guide does not out-cite a tight, well-structured page; it just takes longer to say the same thing. Write to cover the question completely, then stop.",
        },
        {
          heading: "What does structure not do? The honest limits",
          text: "Formatting is a delivery mechanism, not a source of truth. A perfectly shaped citable unit built around an empty or false claim does not get rewarded; it gets discounted, because AI answer engines cross-check facts against other sources and drop the ones that stand alone. Structure cannot make a weak claim strong, and stripping a text down to bare facts can go too far: if you cut the reasoning and context that make a fact meaningful, you lose the human reader whose engagement still signals value. The goal is not dryness, it is clarity with substance behind it. On our reference site, an informational resource about roof replacement in one American city, the content became a top source across ChatGPT, Perplexity, Copilot and Google's overviews within twenty days precisely because it answered concrete questions with precise figures and ranges. The structure made those facts easy to lift, but it was the facts, and their accuracy, that earned the citation. Our AIRS methodology treats content as one of four dimensions for that reason, alongside technical health, authority and structure.",
        },
      ],

      actions: [
        "Rewrite the opening of each key page so the direct answer appears in the first sentence, not after an introduction.",
        "Shape answers into citable units of roughly 40 to 60 words that make complete sense when read on their own.",
        "Replace marketing adjectives with verifiable specifics: turn fast into a timeframe, quality into a named certification, many into a number.",
        "Move parallel facts, comparisons and specifications into lists and tables so they can be lifted intact.",
        "Cite a source for each significant claim, since facts that cannot be corroborated are discounted during selection.",
        "Prioritise original material a model cannot generate itself: your own data, figures and first-hand results.",
        "Judge pages by whether they answer the question completely, not by word count, and stop once the answer is complete.",
      ],

      faq: [
        {
          question: "How long should a citable unit be?",
          answer:
            "Roughly 40 to 60 words. That is long enough to answer one specific question completely and short enough for an AI to lift the whole block into its answer. The reliable test is whether the block still makes full sense when the rest of the page is hidden; if it depends on the surrounding paragraphs, it is not yet extractable.",
        },
        {
          question: "Does longer content get cited more by AI?",
          answer:
            "No. An Ahrefs study of 174,048 pages found a near-zero 0.04 correlation between word count and citation position. Long articles are not cited more often, and shorter transactional pages are cited regularly. What matters is answering the question directly and clearly, not length. Write to cover the question, then stop.",
        },
        {
          question: "Why does AI skip my marketing copy?",
          answer:
            "Because there is no verifiable fact in it to extract, and AI systems actively avoid overly promotional text when building an answer. Phrases like market leader or best-in-class cannot be cross-checked, so they are passed over. Replace them with concrete numbers, timeframes and named outcomes that a model can quote and corroborate.",
        },
        {
          question: "Should I strip all context to make text denser?",
          answer:
            "No. Density means removing filler, not meaning. If you cut the reasoning and context that make a fact useful, you lose the human reader whose engagement still signals value, and you can leave facts stranded without support. Aim for clarity with substance: a direct answer, then the evidence and explanation that stand behind it.",
        },
      ],

      nextStepLabel: "Why do AI assistants recommend competitors?",
      nextHref: "/why-competitors/why-ai-recommends-competitors",
    },

    ru: {
      h1: "Как писать контент, который ИИ-ассистенты действительно цитируют?",
      crumb: "Контент, который цитируют ИИ",
      directAnswer:
        "Пишите цитируемыми блоками: самодостаточными фрагментами примерно в 40–60 слов, которые полностью отвечают на один конкретный вопрос и понятны в отрыве от страницы. ИИ-ассистенты не читают страницу как человек, они извлекают пассажи, близко совпадающие с вопросом, и вставляют их в ответ. Значит, прямой ответ должен идти первым, быть насыщен проверяемыми фактами, а не рекламными фразами, и держаться сам по себе. Позиция тоже важна: по анализу цитат ИИ около 44% берутся из первых 30% страницы, поэтому закопанный ответ это часто вовсе не ответ.",

      keyFacts: [
        "Цитируемый блок (Citable Unit) это самодостаточный фрагмент примерно в 40–60 слов, который полностью отвечает на один вопрос и понятен без окружающего контекста.",
        "Около 44% цитат ИИ берутся из первых 30% страницы, 31% из середины и 25% из конца, поэтому вынести ответ вперед это решение о цитируемости (SparkToro, 2026).",
        "Длина текста почти не влияет на цитирование: исследование Ahrefs на 174 048 страницах показало корреляцию длины и позиции цитаты всего 0,04, то есть практически нулевую (Ahrefs, декабрь 2025).",
        "ИИ распознают и обходят слишком рекламный текст при сборке ответа, пропуская «продающие» формулировки в пользу более прямого источника.",
        "Цитируют конкретику: утверждение с числом, названием и источником расходится, а общая фраза игнорируется, потому что из нее нечего извлечь.",
        "ИИ сверяют утверждения между источниками; факт, которого нет больше нигде, обесценивается даже у в остальном надежного источника (пайплайн проверки VeriCite, 2025).",
        "Контент, который модель и так знает (общий «товарный» текст), не дает ей повода вас цитировать; дают его свои данные, конкретные цифры и личный опыт.",
        "Обзоры Google (AI Overviews) извлекают и оценивают отдельные пассажи, а не переиспользуют топ органической выдачи, поэтому качество пассажа оценивается напрямую.",
      ],

      body: [
        {
          heading: "Почему рекламные тексты плохо подходят для ИИ?",
          text: "Потому что из них нечего извлечь. Когда страница открывается фразами вроде «лидер рынка», «индивидуальный подход» или «решения высшего класса», человек проскальзывает мимо них взглядом, а машина не находит факта, который можно вырезать. ИИ активно распознают и пропускают слишком рекламный текст, переходя к источнику, который говорит что-то конкретное. Более глубокая проблема в том, что рекламный язык непроверяем по своей природе. ИИ сверяет утверждения с другим контентом, прежде чем цитировать, поэтому предложение, заявляющее о величии, но не называющее ни числа, ни срока, ни результата, эту проверку не проходит. Решение не в том, чтобы писать пресно, а в том, чтобы заменить прилагательные доказательствами. Вместо «устанавливаем быстро» напишите «установка занимает два-три дня». Вместо «нам доверяют многие» напишите «работаем с 400 клиниками в трех штатах». Второй вариант говорит то же самое, но фактом, который модель может процитировать.",
        },
        {
          heading: "Что такое плотность данных и как ее поднять?",
          text: "Плотность данных это доля текста, которая несет проверяемую информацию, а не заполнитель. Волшебного числа для нее нет, и кто называет точный коэффициент, тот его выдумывает, но направление ясное: каждое предложение должно либо сообщать факт, либо подводить к следующему. Плотность растет, когда абстрактные обещания меняются на конкретику. Цена становится диапазоном с цифрами, заявление о скорости становится сроком, похвальба качеством становится названной сертификацией или измеренным результатом. Работает это потому, что ИИ цитирует то, что не может сгенерировать сам. Текст, который лишь повторяет то, что модель знает наизусть, не дает ей повода на вас ссылаться, она ответит из собственной памяти и цитату пропустит. Ваши цифры, ваши сроки и ваши результаты из первых рук это как раз тот материал, который модель не может выдать, не указав на вашу страницу.",
        },
        {
          heading: "Какой длины должен быть цитируемый блок и где он стоит?",
          text: "Цитируемый блок это примерно 40–60 слов: достаточно, чтобы полностью ответить на один вопрос, и достаточно коротко, чтобы его вырезали целиком. Проверка простая. Если показать этот блок отдельно, скрыв остальную страницу, поймет ли читатель его полностью? Если да, он извлекаем; если он зависит от абзаца выше, то нет. Вторая половина дела это расположение. Поскольку около 44% цитат ИИ берутся из первых 30% страницы, ответ должен стоять вверху раздела, а не после разгона. Работает модель из трех ступеней, та же, что мы используем на этом сайте: вопрос, сформулированный так, как его реально задают; прямой ответ в следующем же предложении, без вступлений; затем пара предложений с фактами. Страница может быть подробной и все равно быть пропущена, если ничто на ней не оформлено как ответ, который модель может взять.",
        },
        {
          heading: "Почему списки и таблицы облегчают извлечение?",
          text: "Потому что они заранее разделяют факты на единицы, которые машина берет, не распутывая прозу. Плотный повествовательный абзац заставляет извлекатель вычислять, где кончается один факт и начинается следующий; список или таблица это уже сделали. Таблица характеристик особенно: она подает каждый признак и его значение чистой парой, а это близко к тому, как модель хочет хранить и переиспользовать факт. Это не значит превращать каждую страницу в решетку. Это значит, что когда у вас есть параллельные факты, сравнения, шаги или характеристики, список или таблица это формат, который вероятнее всего переиспользуют целиком. Таблица ниже показывает, что обычно помогает извлечению, а что ему мешает.",
          table: {
            headers: ["Легко извлечь", "Трудно извлечь"],
            rows: [
              ["Прямой ответ в первом предложении", "Долгий разгон до сути"],
              ["Одна мысль на короткий абзац", "Несколько тем в одном блоке"],
              ["Конкретные числа, даты, названия", "Общие слова вроде «быстро», «качественно»"],
              ["Списки и таблицы характеристик", "Факты, закопанные в плотную прозу"],
              ["Утверждение с источником", "Непроверяемая рекламная похвальба"],
            ],
            caption: "Что делает пассаж легким или трудным для переиспользования ИИ. Левый столбец это признаки цитируемого блока, правый это привычки, из-за которых модель пропускает страницу.",
          },
        },
        {
          heading: "Правда ли, что длинные статьи цитируют чаще?",
          text: "Нет, и это один из самых живучих мифов, который стоит поправить. Исследование Ahrefs на 174 048 страницах и более чем полумиллионе обзоров ИИ нашло корреляцию всего 0,04 между числом слов и позицией цитаты, то есть фактически никакой. Длинный контент не цитируют чаще, и среди цитируемых страниц длина почти не предсказывает, куда попадет цитата. Транзакционные и служебные страницы с медианой 300–550 слов цитируются регулярно. Данные указывают не на длину, а на форму: отвечайте на вопрос прямо, ведите с главной мысли, пишите ясными утвердительными предложениями. Руководство на десять тысяч слов не обходит по цитируемости плотную, хорошо структурированную страницу, оно просто дольше говорит то же самое. Пишите, чтобы полностью закрыть вопрос, и на этом останавливайтесь.",
        },
        {
          heading: "Чего структура не делает? Честные границы",
          text: "Оформление это способ доставки, а не источник истины. Идеально оформленный цитируемый блок вокруг пустого или ложного утверждения не вознаграждается, а обесценивается, потому что ИИ сверяет факты с другими источниками и отбрасывает те, что стоят особняком. Структура не сделает слабое утверждение сильным, а выжимание текста до голых фактов может зайти слишком далеко: если вырезать рассуждение и контекст, которые делают факт осмысленным, теряется человек-читатель, чья вовлеченность по-прежнему сигнализирует о ценности. Цель не сухость, а ясность с содержанием за ней. На нашем референсном сайте, информационном ресурсе по замене кровли в одном американском городе, контент стал ведущим источником в ChatGPT, Perplexity, Copilot и обзорах Google за двадцать дней именно потому, что отвечал на конкретные вопросы точными цифрами и диапазонами. Структура сделала эти факты легкими для извлечения, но цитату заработали сами факты и их точность. Наша методика AIRS не случайно относит контент к одному из четырех направлений, наряду с техническим состоянием, авторитетом и структурой.",
        },
      ],

      actions: [
        "Перепишите начало каждой ключевой страницы так, чтобы прямой ответ стоял в первом предложении, а не после вступления.",
        "Оформляйте ответы в цитируемые блоки примерно по 40–60 слов, которые полностью понятны при чтении в отрыве от страницы.",
        "Замените рекламные прилагательные проверяемой конкретикой: «быстро» на срок, «качество» на названную сертификацию, «многие» на число.",
        "Перенесите параллельные факты, сравнения и характеристики в списки и таблицы, чтобы их можно было взять целиком.",
        "Указывайте источник для каждого значимого утверждения, поскольку факты, которые нельзя подтвердить, обесцениваются при отборе.",
        "Отдавайте приоритет оригинальному материалу, который модель не сгенерирует сама: своим данным, цифрам и результатам из первых рук.",
        "Оценивайте страницы по тому, полностью ли они отвечают на вопрос, а не по числу слов, и останавливайтесь, когда ответ закрыт.",
      ],

      faq: [
        {
          question: "Какой длины должен быть цитируемый блок?",
          answer:
            "Примерно 40–60 слов. Этого достаточно, чтобы полностью ответить на один конкретный вопрос, и достаточно коротко, чтобы ИИ вырезал блок целиком в свой ответ. Надежная проверка это понятен ли блок полностью, когда остальная страница скрыта; если он зависит от соседних абзацев, значит, он еще не извлекаем.",
        },
        {
          question: "Цитирует ли ИИ длинный контент чаще?",
          answer:
            "Нет. Исследование Ahrefs на 174 048 страницах нашло почти нулевую корреляцию 0,04 между числом слов и позицией цитаты. Длинные статьи не цитируют чаще, а более короткие транзакционные страницы цитируются регулярно. Важен прямой и ясный ответ на вопрос, а не длина. Пишите, чтобы закрыть вопрос, и останавливайтесь.",
        },
        {
          question: "Почему ИИ пропускает мой рекламный текст?",
          answer:
            "Потому что в нем нет проверяемого факта для извлечения, а ИИ активно избегает слишком рекламного текста при сборке ответа. Фразы вроде «лидер рынка» или «высший класс» нельзя перепроверить, поэтому их пропускают. Замените их конкретными числами, сроками и названными результатами, которые модель может процитировать и подтвердить.",
        },
        {
          question: "Нужно ли убирать весь контекст ради плотности?",
          answer:
            "Нет. Плотность это удаление заполнителя, а не смысла. Если вырезать рассуждение и контекст, которые делают факт полезным, теряется человек-читатель, чья вовлеченность по-прежнему сигнализирует о ценности, а факты остаются без опоры. Стремитесь к ясности с содержанием: прямой ответ, а затем доказательства и объяснение, которые за ним стоят.",
        },
      ],

      nextStepLabel: "Почему ИИ рекомендуют конкурентов, а не вас?",
      nextHref: "/why-competitors/why-ai-recommends-competitors",
    },
  },
};

export default topic;
