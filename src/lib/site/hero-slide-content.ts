import type { HeroSlideId } from "@/lib/site/hero-slides";
import { HERO_SLIDE_IDS } from "@/lib/site/hero-slides";

export type HeroSlideLocaleCopy = {
  title: string;
  highlight: string;
  subtitle: string;
  tag: string;
};

export type HeroSlideContentEntry = {
  en?: HeroSlideLocaleCopy;
  ar?: HeroSlideLocaleCopy;
};

export type HeroSlideContentMap = Partial<
  Record<HeroSlideId, HeroSlideContentEntry>
>;

export const EMPTY_HERO_SLIDE_COPY: HeroSlideLocaleCopy = {
  title: "",
  highlight: "",
  subtitle: "",
  tag: "",
};

export function parseHeroSlideContent(raw: unknown): HeroSlideContentMap {
  const result: HeroSlideContentMap = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return result;
  }

  const parseLocale = (value: unknown): HeroSlideLocaleCopy | undefined => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return undefined;
    }
    const o = value as Record<string, unknown>;
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const highlight = typeof o.highlight === "string" ? o.highlight.trim() : "";
    const subtitle = typeof o.subtitle === "string" ? o.subtitle.trim() : "";
    const tag = typeof o.tag === "string" ? o.tag.trim() : "";
    if (!title && !highlight && !subtitle && !tag) return undefined;
    return { title, highlight, subtitle, tag };
  };

  for (const slideId of HERO_SLIDE_IDS) {
    const entry = (raw as Record<string, unknown>)[slideId];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const e = entry as Record<string, unknown>;
    const en = parseLocale(e.en);
    const ar = parseLocale(e.ar);
    if (en || ar) {
      result[slideId] = { ...(en ? { en } : {}), ...(ar ? { ar } : {}) };
    }
  }

  return result;
}

export function resolveHeroSlideCopy(
  slideId: HeroSlideId,
  locale: string,
  map: HeroSlideContentMap,
): HeroSlideLocaleCopy | null {
  const entry = map[slideId];
  if (!entry) return null;
  const copy =
    locale === "ar"
      ? entry.ar ?? entry.en
      : entry.en ?? entry.ar;
  if (!copy?.title?.trim()) return null;
  return copy;
}
