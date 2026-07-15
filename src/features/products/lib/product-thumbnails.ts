/**
 * Consistent marketplace thumbnails — category-branded SVG assets.
 * Keeps demo catalog visually cohesive (no random stock photos).
 */

const THUMB_BY_SLUG: Record<string, string> = {
  "steam-premium-account": "/catalog/thumbs/gaming.svg",
  "steam-shared-account": "/catalog/thumbs/gaming.svg",
  "steam-rust-account": "/catalog/thumbs/gaming.svg",
  "steam-cs2-prime": "/catalog/thumbs/gaming.svg",
  "steam-shared-monthly": "/catalog/thumbs/gaming.svg",
  "steam-shared-student": "/catalog/thumbs/gaming.svg",
  "steam-shared-lite": "/catalog/thumbs/gaming.svg",
  "steam-wallet-50": "/catalog/thumbs/gaming.svg",
  "epic-games-voucher": "/catalog/thumbs/gaming.svg",
  "ps-plus-12-months": "/catalog/thumbs/gaming.svg",
  "playstation-store-50": "/catalog/thumbs/gift-cards.svg",
  "xbox-game-pass-ultimate": "/catalog/thumbs/gaming.svg",
  "valorant-points-5350": "/catalog/thumbs/gaming.svg",
  "discord-nitro-annual": "/catalog/thumbs/subscriptions.svg",
  "spotify-premium-1year": "/catalog/thumbs/subscriptions.svg",
  "netflix-premium-1month": "/catalog/thumbs/subscriptions.svg",
  "nordvpn-2-year": "/catalog/thumbs/vpn.svg",
  "chatgpt-plus-1month": "/catalog/thumbs/tools.svg",
  "youtube-premium-family": "/catalog/thumbs/subscriptions.svg",
  "telegram-premium-1year": "/catalog/thumbs/subscriptions.svg",
  "instagram-verified-badge": "/catalog/thumbs/social.svg",
  "instagram-growth-package": "/catalog/thumbs/social.svg",
  "instagram-followers-10k": "/catalog/thumbs/social.svg",
  "instagram-likes-boost": "/catalog/thumbs/social.svg",
  "instagram-reels-promo": "/catalog/thumbs/social.svg",
  "instagram-blue-badge-express": "/catalog/thumbs/social.svg",
  "instagram-meta-badge": "/catalog/thumbs/social.svg",
  "instagram-verification-3month": "/catalog/thumbs/social.svg",
  "windows-11-pro": "/catalog/thumbs/software.svg",
  "microsoft-office-365": "/catalog/thumbs/software.svg",
  "adobe-creative-cloud": "/catalog/thumbs/software.svg",
  "capcut-pro-1year": "/catalog/thumbs/tools.svg",
  "python-instagram-bot": "/catalog/thumbs/tools.svg",
  "python-telegram-bot": "/catalog/thumbs/tools.svg",
  "python-web-scraper": "/catalog/thumbs/tools.svg",
  "python-discord-bot": "/catalog/thumbs/tools.svg",
  "amazon-gift-card-25": "/catalog/thumbs/gift-cards.svg",
  "apple-gift-card-50": "/catalog/thumbs/gift-cards.svg",
  "google-play-25": "/catalog/thumbs/gift-cards.svg",
  "steam-gift-card-20": "/catalog/thumbs/gift-cards.svg",
};

const THUMB_BY_CATEGORY: Record<string, string> = {
  gaming: "/catalog/thumbs/gaming.svg",
  games: "/catalog/thumbs/gaming.svg",
  "steam-private": "/catalog/thumbs/gaming.svg",
  "steam-shared": "/catalog/thumbs/gaming.svg",
  subscriptions: "/catalog/thumbs/subscriptions.svg",
  software: "/catalog/thumbs/software.svg",
  "gift-cards": "/catalog/thumbs/gift-cards.svg",
  gifts: "/catalog/thumbs/gift-cards.svg",
  instagram: "/catalog/thumbs/social.svg",
  "instagram-verification": "/catalog/thumbs/social.svg",
  "python-tools": "/catalog/thumbs/tools.svg",
  accounts: "/catalog/thumbs/social.svg",
};

export function productThumbnailUrl(
  slug: string,
  categorySlug?: string,
): string {
  return (
    THUMB_BY_SLUG[slug] ??
    (categorySlug ? THUMB_BY_CATEGORY[categorySlug.toLowerCase()] : undefined) ??
    "/catalog/thumbs/default.svg"
  );
}

export function withProductThumbnail<
  T extends { slug: string; categorySlug?: string; imageUrl?: string | null },
>(product: T): T {
  return {
    ...product,
    imageUrl: productThumbnailUrl(product.slug, product.categorySlug),
  };
}
