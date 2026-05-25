import type { CatalogProduct } from "@/features/catalog/types";

/** Fallback catalog when Supabase is empty or not configured. */
export const demoProducts: CatalogProduct[] = [
  {
    slug: "instagram-verified-badge",
    name: "Instagram Verified Badge",
    category: "Instagram Services",
    categorySlug: "instagram",
    priceCents: 1499,
    compareAtCents: 1999,
    badge: "bestSeller",
    imageUrl: "/catalog/instagram-verified-badge.jpg",
  },
  {
    slug: "steam-premium-account",
    name: "Steam Premium Account",
    category: "Gaming",
    categorySlug: "gaming",
    priceCents: 2999,
    compareAtCents: 3999,
    badge: "instant",
    imageUrl: "/catalog/steam-premium-account.jpg",
  },
  {
    slug: "spotify-premium-1year",
    name: "Spotify Premium 1 Year",
    category: "Subscriptions",
    categorySlug: "subscriptions",
    priceCents: 499,
    compareAtCents: 799,
    badge: "instant",
    imageUrl: "/catalog/spotify-premium-1year.jpg",
  },
  {
    slug: "windows-11-pro",
    name: "Windows 11 Pro Key",
    category: "Software",
    categorySlug: "software",
    priceCents: 1499,
    compareAtCents: 1899,
    badge: "instant",
    imageUrl: "/catalog/windows-11-pro.jpg",
  },
];
