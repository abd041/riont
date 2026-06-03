import type { CatalogProduct, ProductBadge } from "@/types/catalog";
import { withProductThumbnail } from "../lib/product-thumbnails";

type DemoSeed = {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  priceCents: number;
  compareAtCents?: number;
  badge?: ProductBadge;
  salesCount?: number;
  isFeatured?: boolean;
};

function item(seed: DemoSeed): CatalogProduct {
  return {
    slug: seed.slug,
    name: seed.name,
    category: seed.category,
    categorySlug: seed.categorySlug,
    priceCents: seed.priceCents,
    compareAtCents: seed.compareAtCents,
    badge: seed.badge,
    salesCount: seed.salesCount,
    isFeatured: seed.isFeatured,
    deliveryMode: "manual",
    inStock: true,
  };
}

/** Demo catalog aligned to store category slugs — ~5 products per category. */
const RAW_DEMO_PRODUCTS: CatalogProduct[] = [
  // Steam Private
  item({ slug: "steam-premium-account", name: "Steam Premium Account", category: "Steam Private", categorySlug: "steam-private", priceCents: 2999, compareAtCents: 3499, badge: "bestSeller", salesCount: 245, isFeatured: true }),
  item({ slug: "steam-aaa-bundle", name: "Steam AAA Games Bundle", category: "Steam Private", categorySlug: "steam-private", priceCents: 3499, compareAtCents: 4299, badge: "instant", salesCount: 118, isFeatured: true }),
  item({ slug: "steam-indie-pack", name: "Steam Indie Collection", category: "Steam Private", categorySlug: "steam-private", priceCents: 1999, compareAtCents: 2599, badge: "offer", salesCount: 86 }),
  item({ slug: "steam-rust-account", name: "Steam Rust Ready Account", category: "Steam Private", categorySlug: "steam-private", priceCents: 2799, compareAtCents: 3299, badge: "hot", salesCount: 64 }),
  item({ slug: "steam-cs2-prime", name: "Steam CS2 Prime Account", category: "Steam Private", categorySlug: "steam-private", priceCents: 3199, compareAtCents: 3799, badge: "trending", salesCount: 52 }),

  // Steam Shared
  item({ slug: "steam-shared-account", name: "Steam Shared Account", category: "Steam Shared", categorySlug: "steam-shared", priceCents: 1999, compareAtCents: 2799, badge: "bestSeller", salesCount: 164, isFeatured: true }),
  item({ slug: "steam-shared-monthly", name: "Steam Shared — 1 Month", category: "Steam Shared", categorySlug: "steam-shared", priceCents: 899, compareAtCents: 1199, badge: "instant", salesCount: 98 }),
  item({ slug: "steam-shared-student", name: "Steam Shared Student Plan", category: "Steam Shared", categorySlug: "steam-shared", priceCents: 1299, compareAtCents: 1699, salesCount: 71 }),
  item({ slug: "steam-shared-lite", name: "Steam Shared Lite Access", category: "Steam Shared", categorySlug: "steam-shared", priceCents: 699, compareAtCents: 999, badge: "offer", salesCount: 55 }),
  item({ slug: "steam-shared-family", name: "Steam Shared Family Slot", category: "Steam Shared", categorySlug: "steam-shared", priceCents: 1499, compareAtCents: 1899, salesCount: 43 }),

  // Instagram Services
  item({ slug: "instagram-growth-package", name: "Instagram Growth Package", category: "Instagram Services", categorySlug: "instagram", priceCents: 799, compareAtCents: 999, badge: "hot", salesCount: 210, isFeatured: true }),
  item({ slug: "instagram-followers-10k", name: "Instagram Followers — 10K", category: "Instagram Services", categorySlug: "instagram", priceCents: 599, compareAtCents: 799, salesCount: 142 }),
  item({ slug: "instagram-likes-boost", name: "Instagram Likes Boost", category: "Instagram Services", categorySlug: "instagram", priceCents: 399, compareAtCents: 549, badge: "instant", salesCount: 88 }),
  item({ slug: "instagram-reels-promo", name: "Instagram Reels Promotion", category: "Instagram Services", categorySlug: "instagram", priceCents: 699, compareAtCents: 899, badge: "trending", salesCount: 76 }),
  item({ slug: "instagram-comments-pack", name: "Instagram Comments Pack", category: "Instagram Services", categorySlug: "instagram", priceCents: 449, compareAtCents: 599, salesCount: 51 }),

  // Instagram Verification
  item({ slug: "instagram-verified-badge", name: "Instagram Verified Badge", category: "Instagram Verification", categorySlug: "instagram-verification", priceCents: 1499, compareAtCents: 1999, badge: "hot", salesCount: 128, isFeatured: true }),
  item({ slug: "instagram-blue-badge-express", name: "Blue Badge Express", category: "Instagram Verification", categorySlug: "instagram-verification", priceCents: 1799, compareAtCents: 2299, badge: "bestSeller", salesCount: 96 }),
  item({ slug: "instagram-business-verify", name: "Business Verification", category: "Instagram Verification", categorySlug: "instagram-verification", priceCents: 999, compareAtCents: 1499, badge: "limited", salesCount: 142 }),
  item({ slug: "instagram-meta-badge", name: "Meta Verified Setup", category: "Instagram Verification", categorySlug: "instagram-verification", priceCents: 1299, compareAtCents: 1699, salesCount: 67 }),
  item({ slug: "instagram-verification-3month", name: "Verification — 3 Months", category: "Instagram Verification", categorySlug: "instagram-verification", priceCents: 3999, compareAtCents: 4999, badge: "offer", salesCount: 41 }),

  // Python Tools
  item({ slug: "python-instagram-bot", name: "Python Instagram Bot", category: "Python Tools", categorySlug: "python-tools", priceCents: 899, compareAtCents: 1299, badge: "trending", salesCount: 73, isFeatured: true }),
  item({ slug: "python-telegram-bot", name: "Python Telegram Bot", category: "Python Tools", categorySlug: "python-tools", priceCents: 799, compareAtCents: 1099, salesCount: 58 }),
  item({ slug: "python-web-scraper", name: "Python Web Scraper Kit", category: "Python Tools", categorySlug: "python-tools", priceCents: 649, compareAtCents: 899, badge: "instant", salesCount: 44 }),
  item({ slug: "python-discord-bot", name: "Python Discord Bot", category: "Python Tools", categorySlug: "python-tools", priceCents: 749, compareAtCents: 999, salesCount: 39 }),
  item({ slug: "python-tiktok-bot", name: "Python TikTok Automation", category: "Python Tools", categorySlug: "python-tools", priceCents: 999, compareAtCents: 1399, badge: "hot", salesCount: 31 }),

  // Gift Cards
  item({ slug: "amazon-gift-card-25", name: "Amazon Gift Card $25", category: "Gift Cards", categorySlug: "gift-cards", priceCents: 2399, compareAtCents: 2500, badge: "instant", salesCount: 55, isFeatured: true }),
  item({ slug: "spotify-premium-1year", name: "Spotify Premium — 1 Year", category: "Gift Cards", categorySlug: "gift-cards", priceCents: 499, compareAtCents: 799, badge: "offer", salesCount: 186, isFeatured: true }),
  item({ slug: "steam-gift-card-20", name: "Steam Gift Card $20", category: "Gift Cards", categorySlug: "gift-cards", priceCents: 1899, compareAtCents: 2000, badge: "bestSeller", salesCount: 92 }),
  item({ slug: "apple-gift-card-50", name: "Apple Gift Card $50", category: "Gift Cards", categorySlug: "gift-cards", priceCents: 4799, compareAtCents: 5000, salesCount: 48 }),
  item({ slug: "google-play-25", name: "Google Play Gift Card $25", category: "Gift Cards", categorySlug: "gift-cards", priceCents: 2299, compareAtCents: 2500, salesCount: 36 }),
  item({ slug: "playstation-store-50", name: "PlayStation Store $50", category: "Gift Cards", categorySlug: "gift-cards", priceCents: 4599, compareAtCents: 5000, badge: "instant", salesCount: 29 }),

  // Software
  item({ slug: "windows-11-pro", name: "Windows 11 Pro Key", category: "Software", categorySlug: "software", priceCents: 1499, compareAtCents: 1899, badge: "offer", salesCount: 92, isFeatured: true }),
  item({ slug: "microsoft-office-365", name: "Microsoft Office 365", category: "Software", categorySlug: "software", priceCents: 899, compareAtCents: 1299, badge: "bestSeller", salesCount: 74 }),
  item({ slug: "chatgpt-plus-1month", name: "ChatGPT Plus — 1 Month", category: "Software", categorySlug: "software", priceCents: 1699, compareAtCents: 2000, badge: "instant", salesCount: 61 }),
  item({ slug: "adobe-creative-cloud", name: "Adobe Creative Cloud", category: "Software", categorySlug: "software", priceCents: 3499, compareAtCents: 4999, salesCount: 38 }),
  item({ slug: "capcut-pro-1year", name: "CapCut Pro — 1 Year", category: "Software", categorySlug: "software", priceCents: 599, compareAtCents: 899, badge: "trending", salesCount: 47 }),
];

export const demoProducts: CatalogProduct[] = RAW_DEMO_PRODUCTS.map(withProductThumbnail);
