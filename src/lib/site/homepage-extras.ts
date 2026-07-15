/**
 * Homepage extras stored inside site_settings.store_features.homepageExtras
 * so no DB migration is required.
 */

export type LiveStatusItem = {
  labelEn: string;
  labelAr: string;
  valueEn: string;
  valueAr: string;
};

export type StatItem = {
  valueEn: string;
  valueAr: string;
  labelEn: string;
  labelAr: string;
};

export type PathCard = {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  href: string;
};

export type RiyontPick = {
  productId: string;
  reasonEn: string;
  reasonAr: string;
};

export type HomepageExtras = {
  liveStatusEnabled: boolean;
  liveStatusItems: LiveStatusItem[];
  statsEnabled: boolean;
  statsItems: StatItem[];
  trustStripEnabled: boolean;
  heroCoverMode: "static" | "animated";
  heroPhrasesEn: string[];
  heroPhrasesAr: string[];
  showInstantFilter: boolean;
  mostRequestedIds: string[];
  pathCards: PathCard[];
  riyontPicks: RiyontPick[];
};

export const DEFAULT_HOMEPAGE_EXTRAS: HomepageExtras = {
  liveStatusEnabled: true,
  liveStatusItems: [
    {
      labelEn: "Support",
      labelAr: "الدعم",
      valueEn: "Online",
      valueAr: "متصل",
    },
    {
      labelEn: "Instant delivery",
      labelAr: "تسليم فوري",
      valueEn: "Active",
      valueAr: "نشط",
    },
    {
      labelEn: "Manual queue",
      labelAr: "الطابور اليدوي",
      valueEn: "Normal",
      valueAr: "عادي",
    },
  ],
  statsEnabled: true,
  statsItems: [
    {
      valueEn: "1.2k+",
      valueAr: "+1.2k",
      labelEn: "Orders fulfilled",
      labelAr: "طلبات مكتملة",
    },
    {
      valueEn: "4.8",
      valueAr: "4.8",
      labelEn: "Avg. rating",
      labelAr: "متوسط التقييم",
    },
    {
      valueEn: "24/7",
      valueAr: "24/7",
      labelEn: "Support",
      labelAr: "دعم",
    },
  ],
  trustStripEnabled: true,
  heroCoverMode: "animated",
  heroPhrasesEn: [
    "Support Online",
    "Instant Delivery Available",
    "Recently Ordered",
  ],
  heroPhrasesAr: ["الدعم متصل", "التسليم الفوري متاح", "طُلب مؤخراً"],
  showInstantFilter: true,
  mostRequestedIds: [],
  pathCards: [
    {
      titleEn: "I want instant delivery",
      titleAr: "أريد تسليماً فورياً",
      descriptionEn: "Auto products ready after payment",
      descriptionAr: "منتجات تلقائية بعد الدفع",
      href: "/?filter=instant",
    },
    {
      titleEn: "I need premium accounts",
      titleAr: "أحتاج حسابات مميزة",
      descriptionEn: "Gaming & shared plans",
      descriptionAr: "خطط ألعاب ومشاركة",
      href: "/products?category=steam-private",
    },
    {
      titleEn: "I need help choosing",
      titleAr: "أحتاج مساعدة في الاختيار",
      descriptionEn: "Talk to support before you buy",
      descriptionAr: "تواصل مع الدعم قبل الشراء",
      href: "/support",
    },
  ],
  riyontPicks: [],
};

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringArray(v: unknown, fallback: string[]): string[] {
  if (!Array.isArray(v)) return fallback;
  const out = v
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter(Boolean);
  return out.length ? out : fallback;
}

function parseLiveStatusItems(raw: unknown): LiveStatusItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_HOMEPAGE_EXTRAS.liveStatusItems;
  }
  return raw.slice(0, 4).map((item, i) => {
    const o = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const d = DEFAULT_HOMEPAGE_EXTRAS.liveStatusItems[i] ?? DEFAULT_HOMEPAGE_EXTRAS.liveStatusItems[0];
    return {
      labelEn: asString(o.labelEn, d.labelEn),
      labelAr: asString(o.labelAr, d.labelAr),
      valueEn: asString(o.valueEn, d.valueEn),
      valueAr: asString(o.valueAr, d.valueAr),
    };
  });
}

function parseStatsItems(raw: unknown): StatItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_HOMEPAGE_EXTRAS.statsItems;
  }
  return raw.slice(0, 4).map((item, i) => {
    const o = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const d = DEFAULT_HOMEPAGE_EXTRAS.statsItems[i] ?? DEFAULT_HOMEPAGE_EXTRAS.statsItems[0];
    return {
      valueEn: asString(o.valueEn, d.valueEn),
      valueAr: asString(o.valueAr, d.valueAr),
      labelEn: asString(o.labelEn, d.labelEn),
      labelAr: asString(o.labelAr, d.labelAr),
    };
  });
}

function parsePathCards(raw: unknown): PathCard[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_HOMEPAGE_EXTRAS.pathCards;
  }
  return raw.slice(0, 3).map((item, i) => {
    const o = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const d = DEFAULT_HOMEPAGE_EXTRAS.pathCards[i] ?? DEFAULT_HOMEPAGE_EXTRAS.pathCards[0];
    return {
      titleEn: asString(o.titleEn, d.titleEn),
      titleAr: asString(o.titleAr, d.titleAr),
      descriptionEn: asString(o.descriptionEn, d.descriptionEn),
      descriptionAr: asString(o.descriptionAr, d.descriptionAr),
      href: asString(o.href, d.href) || d.href,
    };
  });
}

function parseRiyontPicks(raw: unknown): RiyontPick[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 3)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const productId = asString(o.productId).trim();
      if (!productId) return null;
      return {
        productId,
        reasonEn: asString(o.reasonEn),
        reasonAr: asString(o.reasonAr),
      };
    })
    .filter((x): x is RiyontPick => x !== null);
}

export function parseHomepageExtras(raw: unknown): HomepageExtras {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_HOMEPAGE_EXTRAS };
  }
  const o = raw as Record<string, unknown>;
  const mode = o.heroCoverMode === "static" ? "static" : "animated";

  return {
    liveStatusEnabled: o.liveStatusEnabled !== false,
    liveStatusItems: parseLiveStatusItems(o.liveStatusItems),
    statsEnabled: o.statsEnabled !== false,
    statsItems: parseStatsItems(o.statsItems),
    trustStripEnabled: o.trustStripEnabled !== false,
    heroCoverMode: mode,
    heroPhrasesEn: asStringArray(o.heroPhrasesEn, DEFAULT_HOMEPAGE_EXTRAS.heroPhrasesEn),
    heroPhrasesAr: asStringArray(o.heroPhrasesAr, DEFAULT_HOMEPAGE_EXTRAS.heroPhrasesAr),
    showInstantFilter: o.showInstantFilter !== false,
    mostRequestedIds: asStringArray(o.mostRequestedIds, []),
    pathCards: parsePathCards(o.pathCards),
    riyontPicks: parseRiyontPicks(o.riyontPicks),
  };
}

export function localizedStatusItems(
  extras: HomepageExtras,
  locale: string,
): Array<{ label: string; value: string }> {
  const ar = locale === "ar";
  return extras.liveStatusItems.map((item) => ({
    label: ar ? item.labelAr || item.labelEn : item.labelEn,
    value: ar ? item.valueAr || item.valueEn : item.valueEn,
  }));
}

export function localizedStatsItems(
  extras: HomepageExtras,
  locale: string,
): Array<{ value: string; label: string }> {
  const ar = locale === "ar";
  return extras.statsItems.map((item) => ({
    value: ar ? item.valueAr || item.valueEn : item.valueEn,
    label: ar ? item.labelAr || item.labelEn : item.labelEn,
  }));
}

export function localizedPathCards(extras: HomepageExtras, locale: string) {
  const ar = locale === "ar";
  return extras.pathCards.map((card) => ({
    title: ar ? card.titleAr || card.titleEn : card.titleEn,
    description: ar
      ? card.descriptionAr || card.descriptionEn
      : card.descriptionEn,
    href: card.href,
  }));
}

export function localizedHeroPhrases(
  extras: HomepageExtras,
  locale: string,
): string[] {
  const list =
    locale === "ar" ? extras.heroPhrasesAr : extras.heroPhrasesEn;
  return list.length
    ? list
    : locale === "ar"
      ? DEFAULT_HOMEPAGE_EXTRAS.heroPhrasesAr
      : DEFAULT_HOMEPAGE_EXTRAS.heroPhrasesEn;
}
