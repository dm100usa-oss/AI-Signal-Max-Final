const ru = {
  footer: {
    copyright: "© 2025 AI Signal Max. All rights reserved.",
    disclaimer:
      "Показатели видимости рассчитаны приблизительно и основаны на общедоступных данных. Не являются юридической консультацией.",
  },

  home: {
    tagline: "новое конкурентное преимущество",
    description:
      "Проверьте, насколько ваш сайт готов к появлению в рекомендациях AI-ассистентов: ChatGPT · Copilot · Gemini · Claude · Perplexity · Grok и других",
    placeholder: "https://example.com",
    errorInvalidUrl: "Введите корректный URL, включая https://",
    errorCannotCheck: "Не удалось выполнить анализ сайта. Укажите другой сайт",
    errorNotAccessible:
      "Мы не можем проверить этот сайт. Убедитесь, что он доступен",
    quickButton: "Быстрая проверка $5.99",
    quickChecking: "Проверяем",
    quickDesc:
      "Процент готовности сайта, 10 ключевых факторов и краткие рекомендации на экране",
    proButton: "Детальная проверка $19.99",
    proChecking: "Проверяем",
    proDesc:
      "15 факторов, результат на экране и по email, расширенные рекомендации для владельца и готовое ТЗ для разработчика",
  },

  quickPreview: {
    dateLabel: "Дата",
    started: "Мы начали проверку",
    factors: [
      "Открыт ли сайт для ИИ",
      "Понимает ли ИИ, о чём ваш сайт",
      "Видит ли ИИ название сайта",
      "Понимает ли ИИ категорию вашего сайта",
      "Понятна ли ИИ структура сайта",
      "Считает ли ИИ ваш сайт безопасным",
      "Достаточна ли скорость сайта для ИИ",
      "Видит ли ИИ разметку данных сайта",
      "Может ли ИИ читать страницы сайта",
      "Будет ли ИИ рекомендовать ваш сайт",
    ],
    analyzing: "Анализ 10 ключевых факторов",
    timerText: (sec: number) => `Проверка завершится через ${sec} сек`,
    checkComplete: "Проверка завершена",
    getResult: "Получить результат",
    limitTitle: "Лимит на сегодня исчерпан",
    limitText: "Вы использовали 3 бесплатные быстрые проверки за сегодня. Попробуйте снова завтра.",
    backHome: "На главную",
  },

  proPreview: {
    dateLabel: "Дата",
    started: "Мы начали детальную проверку",
    factors: [
      "Открыт ли сайт для ИИ",
      "Понимает ли ИИ, о чём ваш сайт",
      "Видит ли ИИ название сайта",
      "Может ли ИИ ориентироваться на странице",
      "Понятна ли ИИ структура сайта",
      "Считает ли ИИ ваш сайт безопасным",
      "Достаточна ли скорость сайта для ИИ",
      "Видит ли ИИ разметку данных сайта",
      "Понимает ли ИИ категорию вашего сайта",
      "Может ли ИИ читать страницы сайта",
      "Корректна ли работа сайта для ИИ",
      "Понимает ли ИИ приоритет страниц",
      "Удобен ли сайт на мобильных устройствах",
      "Понимает ли ИИ изображения на сайте",
      "Будет ли ИИ рекомендовать ваш сайт",
    ],
    auditLabel: "Аудит 15 ключевых факторов",
    ownerReport: "Формируем отчёт для владельца сайта",
    devReport: "Создаём ТЗ для разработчика",
    finalReport: "Отчёт для владельца • ТЗ для разработчика",
    auditDone: "Проверка завершена",
    reportsDone: "Отчёты созданы",
    timerText: (sec: number) => `Детальная проверка завершится через ${sec} сек`,
    getResult: "Получить результат",
  },

  preview: {
    resultReady: "Your result is ready",
    websiteLabel: "Website",
    dateLabel: "Date",
    quickFactorsIntro:
      "Мы проверили 5 ключевых факторов видимости вашего сайта для ИИ:",
    proFactorsIntro:
      "Мы проверили все 15 ключевых факторов видимости вашего сайта в ответах ИИ:",
    emailLabel: "Your email to receive the PDF after payment",
    emailPlaceholder: "you@example.com",
    emailError: "Please enter a valid email.",
    getResultsButton: "Get Results",
    getFullReportButton: "Get Full Report",
    paidQuick:
      "Оплата подтверждена. Спасибо, что воспользовались нашим сервисом.",
    paidPro:
      "Оплата подтверждена. PDF-отчёт будет отправлен на вашу электронную почту.",
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
    quickTitle: "Результаты быстрой проверки",
    proTitle: "Результаты детальной проверки",
    siteLabel: "Сайт",
    dateLabel: "Дата",
    loading: "Загрузка результатов...",
    highReadiness: "Высокая готовность сайта",
    mediumReadiness: "Средняя готовность сайта",
    lowReadiness: "Низкая готовность сайта",
    materialsTitle: "Материалы проверки",
    factorsTitle: "Проверенные параметры",
    backHome: "Назад на главную",
    leaveReview: "Оставить отзыв",
    pdfSent:
      "Полный отчёт для владельца и ТЗ для разработчика отправлены вам на email.",
    andMore: "и другие данные...",
    statusGood: "Хорошо",
    statusModerate: "Средне",
    statusPoor: "Плохо",
    aiScores: {
      explainTitle: "Из чего складывается попадание в ответы ИИ",
      explainIntro:
        "Чтобы ИИ находил, понимал и рекомендовал ваш сайт, важны четыре вещи. Ниже — оценка каждой из них по вашему сайту.",
      partsTitle: "Оценка по четырём направлениям",
      home: "Главная",
      tech: "Техника",
      content: "Контент",
      authority: "Признаки авторитета",
      homeHint: "Понимает ли ИИ, кто вы и чем полезны",
      techHint: "Может ли ИИ прочитать сайт",
      contentHint: "Есть ли на сайте что цитировать",
      authorityHint: "Видит ли ИИ признаки доверия к сайту",
      weakNote: "Это направление стоит усилить в первую очередь.",
    },
    labels: {
      title_tag: "Заголовок",
      h1_present: "H1",
      h2_present: "Сейчас на сайте",
      meta_description: "Описание",
      site_language: "Язык",
      mobile_friendly: "Мобильная версия сайта",
      contacts: "Контакт",
      robots_txt: "Доступ для ИИ",
      sitemap_xml: "Страниц",
      sitemap_lastmod: "Обновлён",
      https: "Протокол",
      page_speed: "Ответ",
      structured_data: "JSON-LD",
      open_graph: "Open Graph",
      canonical: "Canonical",
      x_robots_tag: "X-Robots",
      meta_robots: "Meta robots",
      alt_attributes: "ALT атрибуты",
      page_404: "Страница 404",
    },
    factors: [
      {
        key: "robots_txt",
        name: "Открыт ли сайт для ИИ",
        desc: "Проверяет, разрешён ли доступ ИИ-платформам к вашему сайту.",
      },
      {
        key: "meta_description",
        name: "Понимает ли ИИ, о чём ваш сайт",
        desc: "Проверяет мета-описание сайта, которое помогает ИИ понять его тематику и содержание.",
      },
      {
        key: "title_tag",
        name: "Видит ли ИИ название сайта",
        desc: "Проверяет наличие и корректность тега Title.",
      },
      {
        key: "h2_present",
        name: "Может ли ИИ ориентироваться на странице",
        desc: "Проверяет наличие подзаголовков H2, которые помогают ИИ ориентироваться в тексте страницы.",
      },
      {
        key: "sitemap_xml",
        name: "Понятна ли ИИ структура сайта",
        desc: "Проверяет наличие карты сайта sitemap.xml, чтобы ИИ знал все страницы.",
      },
      {
        key: "https",
        name: "Считает ли ИИ ваш сайт безопасным",
        desc: "Проверяет, используется ли защищённое соединение HTTPS.",
      },
      {
        key: "page_speed",
        name: "Достаточна ли скорость сайта для ИИ",
        desc: "Проверяет скорость ответа сервера — медленный сайт может быть пропущен ИИ-краулером.",
      },
      {
        key: "structured_data",
        name: "Видит ли ИИ разметку данных сайта",
        desc: "Проверяет наличие структурированных данных JSON-LD, которые помогают ИИ понимать контент.",
      },
      {
        key: "theme",
        name: "Понимает ли ИИ категорию вашего сайта",
        desc: "Определяет, ясна ли ИИ категория сайта по заголовку, описанию и разметке.",
      },
      {
        key: "meta_robots",
        name: "Может ли ИИ читать страницы сайта",
        desc: "Проверяет, нет ли запретов на чтение страниц — в коде страницы (meta robots) и в ответе сервера (x-robots-tag).",
      },
      {
        key: "page_404",
        name: "Корректна ли работа сайта для ИИ",
        desc: "Проверяет корректность обработки ошибок — сайт должен правильно сообщать об отсутствующих страницах.",
      },
      {
        key: "canonical",
        name: "Понимает ли ИИ приоритет страниц",
        desc: "Проверяет корректность канонических ссылок, чтобы ИИ понимал, какие страницы приоритетные.",
      },
      {
        key: "mobile_friendly",
        name: "Удобен ли сайт на мобильных устройствах",
        desc: "Проверяет наличие мета-тега viewport для корректного отображения на мобильных.",
      },
      {
        key: "alt_attributes",
        name: "Понимает ли ИИ изображения на сайте",
        desc: "Проверяет наличие alt-атрибутов у изображений.",
      },
      {
        key: "score",
        name: "Будет ли ИИ рекомендовать ваш сайт",
        desc: "Итоговая оценка готовности сайта к рекомендациям со стороны ИИ-систем.",
      },
    ],
    summaries: {
      highQuick: `Ваш сайт хорошо подготовлен к рекомендациям со стороны ИИ-систем. <strong>Он уже может попадать в ответы и привлекать клиентов</strong>, благодаря корректной структуре и настройкам.<br/><br/>В рамках быстрой проверки мы показываем <strong>ключевые параметры</strong>, которые уже работают корректно и поддерживают вашу готовность.<br/><br/>С уважением, команда AI Signal Max.`,
      highPro: `Ваш сайт хорошо подготовлен к рекомендациям со стороны ИИ-систем. <strong>Он уже может попадать в ответы и привлекать клиентов</strong>, благодаря корректной структуре и настройкам.<br/><br/>Основные параметры настроены правильно, и ИИ-системы воспринимают сайт как понятный и надёжный источник. <strong>Дальнейшие точечные улучшения помогут усилить позиции и увеличить поток обращений.</strong><br/><br/>Мы отправили вам два PDF-файла на email: <strong>подробный отчёт с разъяснениями для владельца и техническое задание для разработчика</strong>. Это позволит закрепить результат и повысить эффективность сайта.<br/><br/>С уважением, команда AI Signal Max.`,
      mediumQuick: `Ваш сайт частично готов к рекомендациям со стороны ИИ-систем. <strong>Вы близки к хорошему результату</strong> – достаточно доработать детали, чтобы структура стала понятнее для ИИ. Тогда сайт сможет чаще появляться в ответах, и вы получите больше переходов и обращений.<br/><br/>В рамках быстрой проверки мы показываем <strong>основные параметры</strong>, которые требуют доработки.<br/><br/>С уважением, команда AI Signal Max.`,
      mediumPro: `Ваш сайт частично готов к рекомендациям со стороны ИИ-систем. <strong>Вы близки к хорошему результату</strong> – достаточно доработать детали, чтобы структура стала понятнее для ИИ. Тогда сайт сможет чаще появляться в ответах, и вы получите больше переходов и обращений.<br/><br/>Отдельные параметры пока настроены не полностью, из-за этого сайт не всегда попадает в ответы ИИ. <strong>Их точечная корректировка повысит готовность сайта к рекомендациям и позволит чаще появляться в ответах.</strong><br/><br/>Мы отправили вам два PDF-файла на email: <strong>подробный отчёт с разъяснениями для владельца и техническое задание для разработчика</strong>. Это готовый план действий, который можно сразу передать в работу и затем проверить результат повторно.<br/><br/>С уважением, команда AI Signal Max.`,
      lowQuick: `Ваш сайт пока не готов к рекомендациям со стороны ИИ-систем. <strong>В текущем состоянии он не попадает в ответы</strong>, из-за чего вы теряете потенциальных клиентов и обращения.<br/><br/>В рамках быстрой проверки мы показываем <strong>основные параметры</strong>, которые требуют срочного исправления.<br/><br/>С уважением, команда AI Signal Max.`,
      lowPro: `Ваш сайт пока не готов к рекомендациям со стороны ИИ-систем. <strong>В текущем состоянии он не попадает в ответы</strong>, из-за чего вы теряете потенциальных клиентов и обращения.<br/><br/>Критически важные параметры настроены некорректно или отсутствуют. <strong>Без их исправления сайт не сможет рекомендоваться ИИ-системами.</strong><br/><br/>Мы отправили вам два PDF-файла на email: <strong>подробный отчёт с разъяснениями для владельца и техническое задание для разработчика</strong>. Это пошаговый план, который позволит исправить ошибки и подготовить сайт к получению трафика из ИИ.<br/><br/>С уважением, команда AI Signal Max.`,
    },
  },

  scanFailed: {
    message:
      "Не удалось завершить сканирование этого сайта. Проверьте адрес и попробуйте снова.",
    backButton: "Back to Home",
  },

  notFound: {
    title: "Website not found",
    message:
      "Не удалось выполнить сканирование этого сайта. Проверьте адрес и попробуйте снова.",
    backButton: "Back to Home",
  },

  reviews: {
    whatUsersNote: "что отмечают пользователи",
    tags: [
      "полезно",
      "понятно",
      "удобно",
      "экономит время и деньги",
      "можно переслать разработчику",
      "подходит для повседневной работы",
    ],
    namePlaceholder: "Ваше имя",
    ratingLabel: "Ваша оценка:",
    reviewPlaceholder: "Ваш отзыв...",
    submitButton: "Отправить",
    submitting: "Отправка",
    successMessage: "Спасибо! Ваш отзыв отправлен на модерацию.",
    errorMessage: "Ошибка. Попробуйте позже.",
    shareText:
      "Поделитесь своим мнением, расскажите о себе или своей компании, вашу историю увидят тысячи пользователей по всему миру",
    backHome: "На главную",
  },

  addReview: {
    title: "Оставить отзыв",
    namePlaceholder: "Ваше имя",
    reviewPlaceholder: "Ваш отзыв...",
    submitButton: "Отправить",
    submitting: "Отправка...",
    successTitle: "Спасибо!",
    successMessage: "Ваш отзыв отправлен на модерацию.",
    errorMessage: "Ошибка. Попробуйте позже.",
  },

  quickPreviewV2: {
    steps: [
      "Открыт ли сайт для ИИ",
      "Понимает ли ИИ, о чём ваш сайт",
      "Может ли ИИ читать содержание страниц",
      "Видит ли ИИ заголовки и описания",
      "Понимает ли ИИ структуру сайта",
      "Видит ли ИИ изображения на сайте",
      "Считает ли ИИ ваш сайт безопасным и заслуживающим доверия",
      "Учитывает ли ИИ ваш сайт при поиске",
      "Видит ли ИИ ваш сайт среди конкурентов",
      "Как оценивает ИИ ваш сайт",
    ],
    timerText: (sec: number) => `Проверка завершится через ${sec} сек`,
    checkComplete: "Проверка завершена",
    getResult: "Получить результат",
  },

  quickPreviewV3: {
    steps: [
      "Открыт ли сайт для ИИ",
      "Понимает ли ИИ, о чём ваш сайт",
      "Может ли ИИ читать содержание страниц",
      "Видит ли ИИ заголовки и описания",
      "Понимает ли ИИ структуру сайта",
      "Видит ли ИИ изображения на сайте",
      "Считает ли ИИ ваш сайт безопасным и заслуживающим доверия",
      "Учитывает ли ИИ ваш сайт при поиске",
      "Видит ли ИИ ваш сайт среди конкурентов",
      "Как оценивает ИИ ваш сайт",
    ],
    timerText: (sec: number) => `Проверка завершится через ${sec} сек`,
    checkComplete: "Проверка завершена",
    getResult: "Получить результат",
  },
};

export default ru;
