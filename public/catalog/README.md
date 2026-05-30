# Catalog media (dev seed)

Product thumbnails use **category-branded SVG tiles** in `thumbs/` for a consistent marketplace look in demo mode.

## Thumbnail system

- `thumbs/gaming.svg` — Steam, Xbox, PlayStation, Valorant, etc.
- `thumbs/subscriptions.svg` — Spotify, Netflix, Discord, Telegram, YouTube
- `thumbs/software.svg` — Windows, Office, Adobe
- `thumbs/gift-cards.svg` — Amazon, Apple, Google Play, Steam wallet
- `thumbs/social.svg` — Instagram verification & social services
- `thumbs/vpn.svg` — NordVPN and VPN products
- `thumbs/tools.svg` — ChatGPT, CapCut, digital tools
- `thumbs/default.svg` — fallback

Mapping lives in `src/features/products/lib/product-thumbnails.ts`.

Legacy JPG files in this folder are kept for reference but demo catalog uses SVG thumbs.
