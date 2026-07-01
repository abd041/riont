export type StoreFeatures = {
  heroAutoplay: boolean;
  floatingWhatsappEnabled: boolean;
  maintenanceMode: boolean;
  maintenanceMessageEn: string;
  maintenanceMessageAr: string;
  showFooterSocial: boolean;
  showFooterNewsletter: boolean;
};

export type SocialLinks = {
  twitter: string;
  discord: string;
  instagram: string;
  email: string;
};

export const DEFAULT_STORE_FEATURES: StoreFeatures = {
  heroAutoplay: true,
  floatingWhatsappEnabled: false,
  maintenanceMode: false,
  maintenanceMessageEn: "",
  maintenanceMessageAr: "",
  showFooterSocial: true,
  showFooterNewsletter: true,
};

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  twitter: "",
  discord: "",
  instagram: "",
  email: "mailto:support@riont.com",
};

export type StoreRuntimeConfig = {
  features: StoreFeatures;
  socialLinks: SocialLinks;
  supportWhatsapp: string | null;
};

export function parseStoreFeatures(raw: unknown): StoreFeatures {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_STORE_FEATURES };
  }
  const o = raw as Record<string, unknown>;
  return {
    heroAutoplay: o.heroAutoplay !== false,
    floatingWhatsappEnabled: o.floatingWhatsappEnabled === true,
    maintenanceMode: o.maintenanceMode === true,
    maintenanceMessageEn:
      typeof o.maintenanceMessageEn === "string" ? o.maintenanceMessageEn : "",
    maintenanceMessageAr:
      typeof o.maintenanceMessageAr === "string" ? o.maintenanceMessageAr : "",
    showFooterSocial: o.showFooterSocial !== false,
    showFooterNewsletter: o.showFooterNewsletter !== false,
  };
}

export function parseSocialLinks(raw: unknown): SocialLinks {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_SOCIAL_LINKS };
  }
  const o = raw as Record<string, unknown>;
  return {
    twitter: typeof o.twitter === "string" ? o.twitter.trim() : "",
    discord: typeof o.discord === "string" ? o.discord.trim() : "",
    instagram: typeof o.instagram === "string" ? o.instagram.trim() : "",
    email:
      "email" in o && typeof o.email === "string"
        ? o.email.trim()
        : DEFAULT_SOCIAL_LINKS.email,
  };
}

/** Build wa.me link from digits-only phone / WhatsApp number. */
export function whatsappHref(number: string | null | undefined): string | null {
  if (!number?.trim()) return null;
  const digits = number.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}
