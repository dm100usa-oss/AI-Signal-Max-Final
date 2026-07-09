// lib/analyze.ts
//
// ПРИНЦИП ПРОВЕРКИ AIRS:
// Оцениваем только то, что сам сайт показывает искусственному интеллекту в
// своём коде. Внешние источники, поисковые системы, каталоги, СМИ и сторонние
// отзывы не проверяются. Если признак есть на сайте — он может влиять на оценку.
// Если признак существует только вне сайта — он не влияет на AIRS.
//
// Каждый фактор оценивает не факт наличия элемента, а СИЛУ сигнала, который
// сайт показывает ИИ. Присутствие слова даёт мало, доказательство даёт много.
//
import {
  QUICK_KEYS,
  PRO_KEYS,
  weightOf,
  nameOf,
  interpret,
  CheckKey,
  Mode,
} from "./score";
import { saveData } from "./storage";
import { computeAiScores, FactorKey, AiScores } from "./partScores";

export interface CheckItem {
  key: CheckKey;
  name: string;
  passed: boolean | null;
  description: string;
  status?: "Good" | "Moderate" | "Poor";
  value?: string;
}

export interface AnalyzeResult {
  url: string;
  mode: Mode;
  items: CheckItem[];
  allItems: CheckItem[];
  score: number;
  interpretation: ReturnType<typeof interpret>;
  results: Record<string, "Good" | "Moderate" | "Poor">;
  factors: Record<string, { status: "Good" | "Moderate" | "Poor" }>;
  aiScores?: AiScores;
  pageLang?: string;
}

const DEFAULT_UA =
  "Mozilla/5.0 (compatible; AIVCheckBot/1.0; +https://aivcheck.com)";

export async function analyze(rawUrl: string, mode: Mode): Promise<AnalyzeResult> {
  const { origin, url } = normalizeUrl(rawUrl);
  const { html, headers, schemeOk, responseTimeMs } = await fetchHTML(url);

  const sitemapResult = await checkSitemap(origin, html, headers);

  // ----- старый слой проверок (для показа списка на экране, не трогаем) -----
  const all: Record<CheckKey, CheckItem> = {
    robots_txt: await checkRobotsTxt(origin),
    sitemap_xml: sitemapResult.pageCount,
    sitemap_lastmod: sitemapResult.lastmod,
    x_robots_tag: checkXRobots(headers),
    meta_robots: checkMetaRobots(html),
    canonical: checkCanonical(html, origin),
    title_tag: checkTitle(html),
    meta_description: checkMetaDescription(html),
    open_graph: checkOpenGraph(html),
    h1_present: checkH1(html),
    h2_present: checkH2(html),
    structured_data: checkJSONLD(html),
    mobile_friendly: checkViewport(html),
    https: {
      key: "https",
      name: nameOf("https"),
      passed: schemeOk,
      description: schemeOk ? "HTTPS detected" : "Page is not served via HTTPS",
      value: schemeOk ? "HTTPS" : "HTTP",
    },
    alt_attributes: checkAltAttributes(html),
    page_speed: checkPageSpeed(responseTimeMs),
    page_404: await check404(origin),
    contacts: checkContacts(html),
    site_language: checkLanguage(html),
  };

  const score = calcWeightedScore(all);
  const keysToShow = mode === "pro" ? PRO_KEYS : QUICK_KEYS;
  const items = keysToShow.map((k) => all[k]);
  const allItems = Object.values(all);

  const results: Record<string, "Good" | "Moderate" | "Poor"> = {};
  const factors: Record<string, { status: "Good" | "Moderate" | "Poor" }> = {};
  for (const [key, item] of Object.entries(all)) {
    const status =
      item.passed === true ? "Good" : item.passed === false ? "Poor" : "Moderate";
    results[key] = status;
    factors[key] = { status };
  }

  // язык проверяемой страницы (из <html lang="...">) — на нём будет отчёт
  const langRaw = (html || "").match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1] || "";
  const pageLang = langRaw.split("-")[0].toLowerCase() === "ru" ? "ru" : "en";

  // ================== НОВЫЙ СЛОЙ: AI Scores (доли 0..1) ==================
  const { factorScores, notApplicable, aiFactorStatuses } =
    buildFactorScores(html, headers, all, sitemapResult);

  // статусы новых факторов кладём в results для показа (Good/Moderate/Poor)
  for (const [key, share] of Object.entries(aiFactorStatuses)) {
    const status = share >= 0.75 ? "Good" : share >= 0.35 ? "Moderate" : "Poor";
    if (!(key in results)) {
      results[key] = status;
      factors[key] = { status };
    }
  }

  const aiScores = computeAiScores(factorScores, notApplicable);

  const resultData = {
    url,
    mode,
    items,
    allItems,
    score,
    interpretation: interpret(score),
    results,
    factors,
    aiScores,
    factorScores,
    notApplicable: Array.from(notApplicable),
    pageLang,
  };

  const sessionKey = `${mode}:${url}`;
  await saveData(sessionKey, resultData);

  return resultData;
}

// ============================================================================
//  ПОСТРОЕНИЕ factorScores ДЛЯ AI SCORES
//  Каждый фактор — доля 0..1. Обычные = 0/1, составные = шкала, связки = умножение.
// ============================================================================
function buildFactorScores(
  html: string | null,
  headers: Headers,
  all: Record<CheckKey, CheckItem>,
  sitemap: { pageCount: CheckItem; lastmod: CheckItem }
): {
  factorScores: Partial<Record<FactorKey, number>>;
  notApplicable: Set<FactorKey>;
  aiFactorStatuses: Record<string, number>;
} {
  const f: Partial<Record<FactorKey, number>> = {};
  const na = new Set<FactorKey>();
  const bin = (cond: boolean) => (cond ? 1 : 0);

  // helper: статус старого слоя -> доля
  const passedShare = (key: CheckKey): number =>
    all[key].passed === true ? 1 : 0;

  // ---------- ТЕХНИКА ----------
  f.no_js          = checkNoJsShare(html);
  f.robots_txt     = passedShare("robots_txt");
  // неизвестно не значит хорошо: null не даёт полный балл
  f.meta_robots    = all.meta_robots.passed === false ? 0 : all.meta_robots.passed === true ? 1 : 0.6;
  f.sitemap_xml    = passedShare("sitemap_xml");
  f.https          = passedShare("https");
  f.x_robots_tag   = all.x_robots_tag.passed === false ? 0 : all.x_robots_tag.passed === true ? 1 : 0.6;
  f.page_speed     = all.page_speed.passed === true ? 1 : all.page_speed.passed === null ? 0.5 : 0;
  f.mobile_friendly= all.mobile_friendly.passed === true ? 1 : all.mobile_friendly.passed === null ? 0.5 : 0;
  f.canonical      = all.canonical.passed === false ? 0 : all.canonical.passed === true ? 1 : 0.3;
  f.page_404       = all.page_404.passed === true ? 1 : all.page_404.passed === null ? 0.3 : 0;

  // ---------- ГЛАВНАЯ ----------
  const titleOk = titleShare(html);
  const descOk  = descShare(html);
  const h1Ok    = bin(hasH1(html));
  f.title_tag        = titleOk;
  f.meta_description = descOk;
  f.h1_present       = h1Ok;
  f.specialization   = specializationShare(html);
  f.services         = servicesShare(html);
  f.contacts         = realBusinessShare(html); // та же шкала, что и реальный бизнес (контакты)
  f.site_language    = bin(hasLang(html));
  f.offer            = offerShare(html);
  f.region           = regionShare(html);
  f.open_graph       = all.open_graph.passed === true ? 1 : all.open_graph.passed === null ? 0.5 : 0;
  f.faq              = faqShare(html);

  // ---------- КОНТЕНТ ----------
  const coverage = topicCoverageShare(html);
  const contentBase = contentDepthShare(html); // насколько вообще есть тематический контент
  f.facts              = factsShare(html);
  f.topic_coverage     = coverage;
  f.structured_content = structuredContentShare(html);
  // связка: прямые ответы не дают полный балл без полноценного контента
  f.direct_answers     = faqShare(html) * contentBase;
  f.structured_data    = passedShare("structured_data");
  f.tables_lists       = tablesListsShare(html);
  f.topic_volume       = topicVolumeShare(sitemap.pageCount);
  f.freshness          = sitemap.lastmod.passed === true ? 1 : 0;
  f.alt_attributes     = all.alt_attributes.passed === true ? 1 : all.alt_attributes.passed === null ? 0 : 0.3;
  // alt не применим, если картинок нет
  if (all.alt_attributes.passed === null && /No images/i.test(all.alt_attributes.description)) {
    na.add("alt_attributes");
  }

  // ---------- АВТОРИТЕТ ----------
  const realBiz = realBusinessShare(html);
  f.real_business = realBiz;
  // связка: org-схема даёт полный балл только при подтверждении реального бизнеса
  const orgPresent = bin(hasOrgSchema(html));
  f.org_schema    = orgPresent * (0.4 + 0.6 * realBiz); // без бизнеса максимум 0.4
  f.reviews       = reviewsShare(html);
  f.experience    = experienceShare(html);
  f.trust_signals = trustShare(html);
  f.authorship    = transparencyShare(html); // прозрачность компании и команды
  f.social        = socialShare(html);
  // freshness уже задан выше (общий для контента и авторитета)

  // статусы для показа (берём ключевые новые факторы)
  const aiFactorStatuses: Record<string, number> = {
    specialization: f.specialization ?? 0,
    theme: f.specialization ?? 0, // пункт "категория" = специализация (учитывает Schema.org + согласованность заголовков)
    offer: f.offer ?? 0,
    facts: f.facts ?? 0,
    topic_coverage: f.topic_coverage ?? 0,
    real_business: f.real_business ?? 0,
    experience: f.experience ?? 0,
    trust_signals: f.trust_signals ?? 0,
  };

  return { factorScores: f, notApplicable: na, aiFactorStatuses };
}

function calcWeightedScore(all: Record<CheckKey, CheckItem>): number {
  const total = PRO_KEYS.reduce((a, k) => a + weightOf(k), 0);
  const pass = PRO_KEYS.reduce(
    (a, k) => a + (all[k].passed === true ? weightOf(k) : 0),
    0
  );
  return Math.round((pass / total) * 100);
}

// ============================================================================
//  ПРОВЕРКИ-ДОЛИ ДЛЯ AI SCORES
// ============================================================================

function cleanText(html: string | null): string {
  if (!html) return "";
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  return stripTags(cleaned).replace(/\s+/g, " ").trim();
}

function ldBlob(html: string | null): string {
  if (!html) return "";
  return (html.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || []).join(" ");
}

// --- Техника: контент без JS (доля по объёму видимого текста) ---
function checkNoJsShare(html: string | null): number {
  const len = cleanText(html).length;
  if (len >= 1200) return 1;
  if (len >= 600) return 0.7;
  if (len >= 300) return 0.4;
  if (len >= 120) return 0.2;
  return 0;
}

// Признак «понятно, чем занимается бизнес»: есть слова ниши/услуги/действия.
// Регион — плюс, но не обязателен для всех бизнесов.
function meaningSignal(s: string): boolean {
  const t = s.toLowerCase();
  const doesWhat = /(услуг|сервис|service|ремонт|repair|строит|construct|доставк|deliver|производств|manufact|консалт|consult|clinic|клиник|студи|studio|агентств|agency|магазин|shop|store|обучен|курс|course|юрист|law|бухгалт|account|дизайн|design|разработ|develop|marketing|маркетинг|roof|кровл|плитк|мебел|аренд|rental|отел|hotel|ресторан|restaurant|кафе|cafe|салон|salon|клиника|стоматолог|dental)/i.test(t);
  return doesWhat;
}

// --- Главная: title (длина + понятность, что делает бизнес) ---
function titleShare(html: string | null): number {
  const t = stripTags(textMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || "");
  if (!t.length) return 0;
  if (t.length < 10) return 0.4;
  // длина в норме — базовый балл, полный только при понятности сути
  return meaningSignal(t) ? 1 : 0.7;
}

// --- Главная: description (длина + понятность) ---
function descShare(html: string | null): number {
  const d = textMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i) || "";
  const len = d.trim().length;
  if (!len) return 0;
  if (len < 30) return 0.4;
  return meaningSignal(d) ? 1 : 0.7;
}

function hasH1(html: string | null): boolean {
  return !!stripTags(textMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || "").length;
}

function hasLang(html: string | null): boolean {
  return !!textMatch(html, /<html[^>]+lang=["']([^"']+)["']/i);
}

// --- Главная: специализация (одна тема в title+h1+description) ---
function specializationShare(html: string | null): number {
  if (!html) return 0;
  // Главный сигнал: явный тип бизнеса в разметке Schema.org — категория указана однозначно.
  const ld = ldBlob(html);
  const businessTypes = /"@type"\s*:\s*"(Organization|LocalBusiness|Corporation|Restaurant|Store|HomeAndConstructionBusiness|GeneralContractor|HomeBuilder|Dentist|MedicalBusiness|LegalService|ProfessionalService|FinancialService|RealEstateAgent|AutoRepair|BeautySalon|Hotel|SoftwareApplication|Product|Service|EducationalOrganization|SportsActivityLocation|FoodEstablishment|EntertainmentBusiness|TravelAgency|InsuranceAgency|Physician|Attorney|Electrician|Plumber|RoofingContractor|MovingCompany)"/i;
  const hasBusinessType = businessTypes.test(ld);

  const title = (stripTags(textMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || "")).toLowerCase();
  const h1 = (stripTags(textMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || "")).toLowerCase();
  const desc = (textMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || "").toLowerCase();
  // разметка с типом бизнеса даёт полный балл даже при "эмоциональных" заголовках
  if (hasBusinessType) return 1;
  if (!title || !h1) return 0;
  // общие значимые слова между title и h1 — признак единой темы
  const words = (s: string) =>
    s.split(/[^a-zа-яё0-9]+/i).filter((w) => w.length >= 4);
  const tW = new Set(words(title));
  const hW = words(h1);
  const overlap = hW.filter((w) => tW.has(w)).length;
  let share = 0;
  if (overlap >= 2) share = 1;
  else if (overlap === 1) share = 0.7;
  else share = 0.4;
  if (desc && words(desc).some((w) => tW.has(w))) share = Math.min(1, share + 0.1);
  // любая разметка Schema.org (без явного бизнес-типа) слегка усиливает ясность темы
  if (/"@type"\s*:/i.test(ld)) share = Math.max(share, 0.6);
  return share;
}

// Услуги: реальный перечень или разметка = 1, одиночное упоминание = 0.4.
function servicesShare(html: string | null): number {
  if (!html) return 0;
  const ld = ldBlob(html);
  if (/"(Service|Offer|OfferCatalog)"/i.test(ld)) return 1;
  // список из нескольких пунктов рядом со словом услуг/services — признак перечня
  const listItems = (html.match(/<li[\s>]/gi) || []).length;
  const hasWord = /(услуг|services|our services|what we do|наши услуги|сервис|тариф|pricing|product)/i.test(html);
  if (hasWord && listItems >= 3) return 1;
  if (hasWord) return 0.4;
  return 0;
}

// FAQ: разметка FAQPage/Question = 1, обычный текстовый блок = 0.5.
function faqShare(html: string | null): number {
  if (!html) return 0;
  const ld = ldBlob(html);
  if (/"FAQPage"|"Question"/i.test(ld)) return 1;
  if (/(faq|часто задаваемые|frequently asked|вопрос[\s\-—]*ответ|q&a|вопросы и ответы)/i.test(html)) return 0.5;
  return 0;
}

// Регион: адресная разметка, телефон или конкретный город/регион в тексте = 1;
// только общее слово «адрес/город» без конкретики = 0.5.
function regionShare(html: string | null): number {
  if (!html) return 0;
  const ld = ldBlob(html);
  if (/"(address|areaServed|addressLocality|addressRegion|addressCountry)"/i.test(ld)) return 1;
  if (/href=["']tel:\+?\d/i.test(html)) return 1;
  // конкретный город/регион в тексте — тоже полный балл
  if (/(chicago|new york|los angeles|москва|санкт[\s\-]?петербург|киев|минск|almaty|астана|\bг\.\s?[А-ЯA-Z]|город[е]?\s+[А-ЯA-Z]|зона обслуживания|serving\s+[A-Z]|located in\s+[A-Z]|обслуживаем\s+[А-ЯA-Z])/i.test(html)) return 1;
  // общий след адреса без конкретики
  if (/(город|регион|область|street|улиц|city|district|adres|адрес)/i.test(html)) return 0.5;
  return 0;
}

// --- Главная: оффер (что и кому) ---
function offerShare(html: string | null): number {
  const text = cleanText(html).toLowerCase();
  if (!text) return 0;
  const head = text.slice(0, 600);
  const action = /(помога|делаем|предлага|создаём|создаем|разрабат|оказыва|provide|help|build|create|offer|deliver|we make|we build|do you|для вас|для бизнеса|for your|for businesses)/i.test(head);
  const audience = /(для |for |бизнес|клиент|компани|business|client|customer|owner|стартап|предприят)/i.test(head);
  if (action && audience) return 1;
  if (action || audience) return 0.5;
  return 0;
}

// --- Контент: факты и конкретика (числа, цены, сроки, проценты) ---
function factsShare(html: string | null): number {
  const text = cleanText(html);
  if (!text) return 0;
  const numbers = (text.match(/\b\d{1,4}([.,]\d+)?\b/g) || []).length;
  const money = (text.match(/[\$€₽£]\s?\d|\d+\s?(usd|eur|руб|долл|\$|€|₽)/gi) || []).length;
  const units = (text.match(/\d+\s?(%|год|лет|years?|дн|days?|час|hours?|кг|kg|см|cm|мм|mm|м²|sq|ft|тыс|млн|k\b)/gi) || []).length;
  const signal = money * 3 + units * 2 + numbers;
  let share: number;
  if (signal >= 40) share = 1;
  else if (signal >= 20) share = 0.75;
  else if (signal >= 8) share = 0.5;
  else if (signal >= 3) share = 0.25;
  else share = 0;
  // цифры на почти пустой странице не должны давать высокий балл
  if (text.length < 600) share = Math.min(share, 0.5);
  return share;
}

// --- Контент: раскрытие темы (несколько H2/H3) ---
function topicCoverageShare(html: string | null): number {
  if (!html) return 0;
  const h2 = (html.match(/<h2[\s>]/gi) || []).length;
  const h3 = (html.match(/<h3[\s>]/gi) || []).length;
  const headings = h2 + h3;
  if (headings >= 6) return 1;
  if (headings >= 4) return 0.75;
  if (headings >= 2) return 0.5;
  if (headings >= 1) return 0.25;
  return 0;
}

// общий уровень "есть ли вообще тематический контент" (для связки direct_answers)
function contentDepthShare(html: string | null): number {
  const len = cleanText(html).length;
  if (len >= 1500) return 1;
  if (len >= 700) return 0.7;
  if (len >= 300) return 0.4;
  return 0.1;
}

// --- Контент: структурированность (заголовки, абзацы, разделы) ---
function structuredContentShare(html: string | null): number {
  if (!html) return 0;
  const headings = (html.match(/<h[1-4][\s>]/gi) || []).length;
  const paras = (html.match(/<p[\s>]/gi) || []).length;
  const lists = (html.match(/<(ul|ol)[\s>]/gi) || []).length;
  let s = 0;
  if (headings >= 2) s += 0.4; else if (headings >= 1) s += 0.2;
  if (paras >= 5) s += 0.4; else if (paras >= 2) s += 0.2;
  if (lists >= 1) s += 0.2;
  return Math.min(1, s);
}

// --- Контент: таблицы и списки ---
function tablesListsShare(html: string | null): number {
  if (!html) return 0;
  const hasTable = /<table[\s>]/i.test(html);
  const lists = (html.match(/<(ul|ol)[\s>]/gi) || []).length;
  if (hasTable && lists >= 1) return 1;
  if (hasTable || lists >= 2) return 0.6;
  if (lists >= 1) return 0.3;
  return 0;
}

// --- Контент: объём тематического контента (страницы по sitemap) ---
function topicVolumeShare(pageCount: CheckItem): number {
  const v = pageCount.value || "";
  const n = parseInt(v.replace(/[^0-9]/g, ""), 10);
  if (!n || Number.isNaN(n)) return 0;
  if (n >= 100) return 1;
  if (n >= 30) return 0.75;
  if (n >= 10) return 0.5;
  if (n >= 4) return 0.3;
  return 0.1;
}

// ============================================================================
//  АВТОРИТЕТ — проверки
// ============================================================================

// составной "реальный бизнес": телефон/email — надёжная основа, адрес/часы — бонус
function realBusinessShare(html: string | null): number {
  if (!html) return 0;
  const phone = /href=["']tel:[^"']+["']/i.test(html);
  const email = /href=["']mailto:[^"']+["']/i.test(html);
  const ld = ldBlob(html);
  const address =
    /"(address|streetAddress|addressLocality|postalCode)"/i.test(ld) ||
    /(улиц|street|адрес|address|просп|avenue|д\.\s?\d|,\s?\d{5})/i.test(html);
  const hours =
    /"openingHours"/i.test(ld) ||
    /(час[ыов]\s+работы|opening hours|пн[\s\-—].*вс|mon[\s\-—].*(fri|sun)|режим работы|working hours)/i.test(html);

  let share = 0;
  if (phone) share += 0.35;
  if (email) share += 0.20;
  if (address) share += 0.25;
  if (hours) share += 0.20;
  // если есть только один контакт — не выше 0.35
  return Math.min(1, share);
}

function hasOrgSchema(html: string | null): boolean {
  const ld = ldBlob(html);
  return /"@type"\s*:\s*"(Organization|LocalBusiness|Corporation|[A-Za-z]*Business|ProfessionalService)"/i.test(ld);
}

// Отзывы по силе сигнала:
//   рейтинг в разметке (aggregateRating / ratingValue) = 1
//   отдельные отзывы в разметке (review / Review) = 0.6
//   только слова/звёзды в тексте = 0.3
function reviewsShare(html: string | null): number {
  if (!html) return 0;
  const ld = ldBlob(html);
  if (/"(aggregateRating|ratingValue)"/i.test(ld)) return 1;
  if (/"(review|Review)"/i.test(ld)) return 0.6;
  if (/(отзыв|review|рейтинг|rating|звёзд|звезд|stars|★|☆|testimonial)/i.test(html)) return 0.3;
  return 0;
}

// доказательства опыта: годы работы, число клиентов/проектов, кейсы
function experienceShare(html: string | null): number {
  const text = cleanText(html).toLowerCase();
  if (!text) return 0;
  let s = 0;
  if (/(с \d{4}|since \d{4}|\d+\s?(лет|год|years?)\s?(опыт|на рынке|in business|experience))/i.test(text)) s += 0.4;
  if (/(\d+[\s,]*(клиент|client|customer|проект|project|объект))/i.test(text)) s += 0.3;
  if (/(кейс|case stud|портфолио|portfolio|выполненны|completed project|наши работы|our work)/i.test(text)) s += 0.3;
  return Math.min(1, s);
}

// trust-сигналы: лицензии, сертификаты, гарантии, политика, ассоциации/членство
function trustShare(html: string | null): number {
  const text = cleanText(html).toLowerCase();
  if (!text) return 0;
  let s = 0;
  if (/(лиценз|licens|сертификат|certif|аккредит|accredit)/i.test(text)) s += 0.3;
  if (/(гаранти|warrant|guarantee|страхов|insur)/i.test(text)) s += 0.3;
  if (/(политик[а]? конфиденц|privacy policy|условия|terms|публичн[ая]? оферт)/i.test(text)) s += 0.2;
  if (/(член[\s\-]*(ассоциаци|организаци)|ассоциаци|associat|member of|аккредитован в|отраслев[аяых]+ (организаци|союз)|guild|chamber of commerce|торгов[ао][йя] палат)/i.test(text)) s += 0.2;
  return Math.min(1, s);
}

// Прозрачность компании и команды: реальные люди за бизнесом.
// Полный балл только при 2-3 признаках (имена, должности, фото, раздел
// About/Team, специалисты, владельцы), а не за одно слово «команда».
function transparencyShare(html: string | null): number {
  if (!html) return 0;
  const ld = ldBlob(html);
  const text = cleanText(html).toLowerCase();
  let s = 0;

  // раздел о команде / о нас
  if (/(<a[^>]+href=["'][^"']*(about|team|command|o-nas|о-нас|our-team|komanda)[^"']*["'])/i.test(html) ||
      /(о нас|about us|наша команда|our team|о компании|meet the team|кто мы)/i.test(text)) {
    s += 0.35;
  }
  // роли / должности реальных людей
  if (/(основател|владел|founder|owner|ceo|директор|руководител|врач|доктор|мастер|специалист|инженер|эксперт|консультант|manager|specialist|engineer|doctor)/i.test(text)) {
    s += 0.35;
  }
  // разметка автора/персоны или фото людей в разметке
  if (/"(author|Person)"/i.test(ld)) s += 0.2;
  // фото/аватары сотрудников
  if (/(team-member|team_member|staff|employee|our-people|team-photo|avatar)/i.test(html)) s += 0.2;
  // слабый текстовый след автора — минимальный вклад
  if (s === 0 && /rel=["']author["']|(автор|author)[\s:]/i.test(html)) s = 0.2;

  return Math.min(1, s);
}

// Соцсети: одна площадка = 0.5, две и больше = 1.
function socialShare(html: string | null): number {
  if (!html) return 0;
  const nets = [
    /facebook\.com/i, /instagram\.com/i, /twitter\.com/i, /x\.com/i,
    /linkedin\.com/i, /youtube\.com/i, /t\.me/i, /vk\.com/i,
  ];
  const count = nets.filter((re) => re.test(html)).length;
  if (count >= 2) return 1;
  if (count === 1) return 0.5;
  return 0;
}

// ============================================================================
//  ИНФРАСТРУКТУРА (без изменений) + старый слой проверок
// ============================================================================

function normalizeUrl(input: string): { origin: string; url: string } {
  let u = input.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  const urlObj = new URL(u);
  return { origin: urlObj.origin, url: urlObj.toString() };
}

async function fetchWithTimeout(
  resource: string,
  opts: RequestInit & { timeoutMs?: number } = {}
) {
  const { timeoutMs = 12000, ...rest } = opts;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(resource, {
      ...rest,
      redirect: "follow",
      headers: { "user-agent": DEFAULT_UA, ...(rest.headers || {}) },
      signal: controller.signal,
      cache: "no-store",
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function fetchHTML(
  url: string
): Promise<{ html: string | null; headers: Headers; schemeOk: boolean; responseTimeMs: number }> {
  const start = Date.now();
  const res = await fetchWithTimeout(url);
  const responseTimeMs = Date.now() - start;
  const schemeOk = url.startsWith("https://") && res.ok;
  const html = res.ok ? await res.text() : null;
  return { html, headers: res.headers, schemeOk, responseTimeMs };
}

function item(key: CheckKey, passed: boolean | null, description: string, value?: string): CheckItem {
  return { key, name: nameOf(key), passed, description, value };
}

function textMatch(html: string | null, re: RegExp) {
  if (!html) return null;
  const m = html.match(re);
  return m ? m[1] || m[0] : null;
}

function stripTags(s: string) {
  return s.replace(/<[^>]*>/g, "").trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

async function checkRobotsTxt(origin: string): Promise<CheckItem> {
  const url = origin + "/robots.txt";
  try {
    const res = await fetchWithTimeout(url, { method: "GET" });
    if (!res.ok) return item("robots_txt", true, "No robots.txt — crawling allowed", "Open");
    const text = await res.text();
    const blocksAll =
      /Disallow:\s*\/\s*$/im.test(text) ||
      /User-agent:\s*\*\s*[\r\n]+Disallow:\s*\/\s*$/im.test(text);
    return item(
      "robots_txt",
      blocksAll ? false : true,
      blocksAll ? "robots.txt blocks all" : "robots.txt valid",
      blocksAll ? "Blocked" : "Open"
    );
  } catch {
    return item("robots_txt", null, "robots.txt not accessible", "Unknown");
  }
}

function formatDate(raw: string): string {
  try {
    const d = new Date(raw.trim());
    if (isNaN(d.getTime())) return raw.trim();
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return raw.trim();
  }
}

async function checkSitemap(
  origin: string,
  html: string | null,
  headers: Headers
): Promise<{ pageCount: CheckItem; lastmod: CheckItem }> {
  const paths = ["/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml"];
  for (const p of paths) {
    try {
      const res = await fetchWithTimeout(origin + p, { method: "GET" });
      if (res.ok) {
        const text = await res.text();
        const urlCount = (text.match(/<url>/gi) || []).length;
        const sitemapCount = (text.match(/<sitemap>/gi) || []).length;
        const count = urlCount > 0 ? urlCount : sitemapCount;
        const lastmodRaw = textMatch(text, /<lastmod>([^<]+)<\/lastmod>/i);
        const countStr = count > 0 ? `${count}` : "Found";
        const lastmodFormatted = lastmodRaw ? formatDate(lastmodRaw) : "Not found";
        return {
          pageCount: item("sitemap_xml", true, `Found ${p}`, countStr),
          lastmod: item("sitemap_lastmod", lastmodRaw ? true : null, `lastmod: ${lastmodRaw}`, lastmodFormatted),
        };
      }
    } catch {}
  }
  const lastmodFormatted = getFallbackDate(html, headers);
  return {
    pageCount: item("sitemap_xml", false, "Sitemap not found", "Not found"),
    lastmod: item("sitemap_lastmod", lastmodFormatted ? true : null, "fallback date", lastmodFormatted || "Not found"),
  };
}

function getFallbackDate(html: string | null, headers: Headers): string {
  const metaModified = textMatch(html, /<meta[^>]+property=["']article:modified_time["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  if (metaModified) return formatDate(metaModified);
  const metaLastMod = textMatch(html, /<meta[^>]+name=["']last-modified["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  if (metaLastMod) return formatDate(metaLastMod);
  const headerDate = headers.get("last-modified");
  if (headerDate) return formatDate(headerDate);
  return "";
}

function checkXRobots(headers: Headers): CheckItem {
  const v = headers.get("x-robots-tag") || "";
  if (!v) return item("x_robots_tag", null, "No X-Robots-Tag header");
  const blocked = /\bnoindex\b|\bnone\b/i.test(v);
  return item("x_robots_tag", blocked ? false : true, `X-Robots-Tag: ${v}`);
}

function checkMetaRobots(html: string | null): CheckItem {
  const content = textMatch(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i) || "";
  if (!content) return item("meta_robots", null, "No meta robots tag");
  const blocked = /\bnoindex\b|\bnone\b/i.test(content);
  return item("meta_robots", blocked ? false : true, `meta robots: ${content}`);
}

function checkCanonical(html: string | null, origin: string): CheckItem {
  const href = textMatch(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i) || "";
  if (!href) return item("canonical", null, "No canonical link");
  const abs = /^https?:\/\//i.test(href);
  const sameOrigin = abs ? href.startsWith(origin) : true;
  return item("canonical", sameOrigin ? true : false, `canonical: ${href}`);
}

function checkTitle(html: string | null): CheckItem {
  const t = stripTags(textMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || "");
  return item("title_tag", t.length ? true : false, t.length ? `Title: ${t}` : "Missing <title>", t || "Not found");
}

function checkMetaDescription(html: string | null): CheckItem {
  const d = textMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i) || "";
  return item("meta_description", d.trim().length ? true : false, d ? `Meta description: ${d}` : "Missing meta description", d || "Not found");
}

function checkOpenGraph(html: string | null): CheckItem {
  const t = textMatch(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i) || "";
  const d = textMatch(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i) || "";
  if (t && d) return item("open_graph", true, "OG tags found", t);
  if (!t && !d) return item("open_graph", false, "OG tags missing", "Not found");
  return item("open_graph", null, "OG tags partially found", t || "Partial");
}

function checkH1(html: string | null): CheckItem {
  const h1 = stripTags(textMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || "");
  return item("h1_present", h1.length ? true : false, h1 ? `H1: ${h1}` : "Missing H1", h1 || "Not found");
}

function checkH2(html: string | null): CheckItem {
  const h2 = decodeEntities(stripTags(textMatch(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i) || ""));
  return item("h2_present", h2.length ? true : null, h2 ? `H2: ${h2}` : "Missing H2", h2 || "Not found");
}

function checkContacts(html: string | null): CheckItem {
  if (!html) return item("contacts", null, "No contacts found", "Not found");
  const phone = textMatch(html, /href=["']tel:([^"']+)["']/i);
  if (phone) return item("contacts", true, `Phone: ${phone}`, phone.trim());
  const email = textMatch(html, /href=["']mailto:([^"']+)["']/i);
  if (email) return item("contacts", true, `Email: ${email}`, email.trim());
  return item("contacts", null, "No contacts found", "Not found");
}

const LANG_MAP: Record<string, string> = {
  ru: "Russian", en: "English", de: "Deutsch", fr: "Français",
  es: "Español", it: "Italiano", pt: "Português", zh: "中文",
  ja: "日本語", ko: "한국어", ar: "العربية", tr: "Türkçe",
  pl: "Polski", nl: "Nederlands", uk: "Ukrainian",
};

function checkLanguage(html: string | null): CheckItem {
  const lang = textMatch(html, /<html[^>]+lang=["']([^"']+)["']/i);
  if (!lang) return item("site_language", null, "No lang attribute", "Unknown");
  const code = lang.split("-")[0].toLowerCase();
  const name = LANG_MAP[code] || lang.toUpperCase();
  return item("site_language", true, `Language: ${lang}`, name);
}

function checkJSONLD(html: string | null): CheckItem {
  if (!html) return item("structured_data", false, "No JSON-LD structured data", "Not detected");
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ok = false;
  let schemaType = "";
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const json = JSON.parse(m[1]);
      if (json) { ok = true; schemaType = json["@type"] || ""; break; }
    } catch {}
  }
  return item("structured_data", ok ? true : false, ok ? "Valid JSON-LD present" : "No JSON-LD structured data", ok ? (schemaType || "Found") : "Not detected");
}

function checkViewport(html: string | null): CheckItem {
  const v = textMatch(html, /<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["'][^>]*>/i) || "";
  if (!v) return item("mobile_friendly", false, "Missing viewport meta", "No");
  const ok = /width\s*=\s*device-width/i.test(v);
  return item("mobile_friendly", ok ? true : null, `viewport: ${v}`, ok ? "Yes" : "No");
}

function checkAltAttributes(html: string | null): CheckItem {
  if (!html) return item("alt_attributes", null, "No images detected");
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  if (!imgTags.length) return item("alt_attributes", null, "No images on page");
  let withAlt = 0;
  for (const tag of imgTags) {
    const alt = (tag.match(/alt\s*=\s*["']([^"']*)["']/i) || [, ""])[1].trim();
    if (alt.length > 0) withAlt++;
  }
  const ratio = withAlt / imgTags.length;
  if (ratio >= 0.8) return item("alt_attributes", true, `Images with alt: ${withAlt}/${imgTags.length}`);
  if (ratio >= 0.3) return item("alt_attributes", null, `Partial alts: ${withAlt}/${imgTags.length}`);
  return item("alt_attributes", false, `Poor alts: ${withAlt}/${imgTags.length}`);
}

function checkPageSpeed(responseTimeMs: number): CheckItem {
  const valueStr = `${responseTimeMs} мс`;
  if (responseTimeMs <= 1500) return item("page_speed", true, `Response time: ${responseTimeMs}ms — fast`, valueStr);
  if (responseTimeMs <= 3000) return item("page_speed", null, `Response time: ${responseTimeMs}ms — moderate`, valueStr);
  return item("page_speed", false, `Response time: ${responseTimeMs}ms — slow`, valueStr);
}

async function check404(origin: string): Promise<CheckItem> {
  const url = `${origin}/__aivcheck_not_found_${Date.now().toString(36)}.html`;
  try {
    const res = await fetchWithTimeout(url, { method: "GET" });
    const text = await res.text();
    const hint = /404/i.test(text) || /not found/i.test(text);
    const ok = res.status === 404 || hint;
    return item("page_404", ok ? true : false, ok ? "Proper 404 response" : `Unexpected status ${res.status}`);
  } catch {
    return item("page_404", null, "404 check inconclusive");
  }
}
