# Catalog media (dev seed)

Product and category images are stored here for local/dev (`storage_path` like `catalog/product-slug.jpg`).

**Sources (free licenses):**

- [Pexels](https://www.pexels.com) — Pexels License (free for commercial use, no attribution required)

## Featured product images

| File | Product | Pexels photo |
|------|---------|--------------|
| `instagram-verified-badge.jpg` | Instagram Verified Badge | [1430631](https://www.pexels.com/photo/person-holding-smartphone-1430631/) |
| `steam-premium-account.jpg` | Steam Premium Account | [4526697](https://www.pexels.com/photo/a-person-playing-a-video-game-4526697/) |
| `spotify-premium-1year.jpg` | Spotify Premium 1 Year | [3756942](https://www.pexels.com/photo/person-wearing-black-headphones-3756942/) |
| `windows-11-pro.jpg` | Windows 11 Pro Key | [205421](https://www.pexels.com/photo/macbook-pro-on-brown-wooden-table-205421/) |

To use Supabase Storage instead, upload files to the `product-images` bucket with the same paths and update `product_media.storage_path` in the database.
