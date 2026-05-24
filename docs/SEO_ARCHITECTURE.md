# riont — SEO Architecture (English + Arabic)

> Arabic SEO is a **primary growth channel**, not an afterthought.  
> **Stack:** Next.js 15 (SSR/RSC) + Supabase Postgres (content source).  
> **Phase 1:** No payment URLs — exclude `/admin`, `/account`, Server Action paths from index.

SEO content is fetched in **Server Components** from Supabase (cached) — never client-only catalog for indexable pages.

---

## 1. URL & locale strategy (decision)

**Chosen: Path-based locales**

```
https://riont.com/en/products/netflix-premium
https://riont.com/ar/products/نتفليكس-بريميوم
```

| Approach | Verdict |
|----------|---------|
| Path `/en` `/ar` | **Recommended** — clear hreflang, single domain authority |
| Subdomain `ar.riont.com` | Splits authority — avoid MVP |
| Query `?lang=ar` | Poor SEO — avoid |
| Cookie-only locale | No crawlable Arabic — avoid |

**Default locale:** `ar` OR `en` based on business priority — configure `middleware` redirect from `/` to default.

---

## 2. hreflang implementation

Every public page includes:

```html
<link rel="alternate" hreflang="en" href="https://riont.com/en/..." />
<link rel="alternate" hreflang="ar" href="https://riont.com/ar/..." />
<link rel="alternate" hreflang="x-default" href="https://riont.com/en/..." />
```

**Rules:**
- Each locale version must be a **true translation**, not machine-duplicated thin content  
- `x-default` → primary market (recommend `en` for global default, or `ar` if MENA-first)  
- Canonical points to **same-locale** URL only (no cross-locale canonical)  

**Next.js:** `generateMetadata()` per `[locale]` route with alternates.languages map.

---

## 3. Localized slugs (Arabic-critical)

### 3.1 Storage

Slugs live in `ProductTranslation.slug` and `CategoryTranslation.slug` — **not** a single `Product.slug`.

### 3.2 Arabic slug rules

| Rule | Reason |
|------|--------|
| Allow Unicode Arabic in slugs | Native SERP appearance |
| Normalize: NFC, trim, collapse spaces to hyphen | Consistent URLs |
| Optional Latin transliteration field `slugLatin` for analytics only | Not required in URL |
| Unique per `(locale, slug)` | Prevent collisions |
| Redirect on slug change | 301 from old slug table `SlugRedirect` (post-launch, if needed) |

### 3.3 Slug generation (admin)

- Auto-generate from Arabic title with manual override  
- Validate uniqueness before publish  
- Preview full URL in admin SEO tab  

---

## 4. Metadata system

### 4.1 Central metadata builder

```typescript
// Planning pattern
buildPageMetadata({
  locale: 'ar',
  title: string,           // 50-60 chars ideal
  description: string,     // 150-160 chars
  path: string,            // without domain
  ogImage?: string,
  noIndex?: boolean,
  jsonLd?: object | object[],
})
```

### 4.2 Page-level metadata

| Page | Title pattern (AR example) |
|------|---------------------------|
| Home | `riont \| منتجات رقمية مميزة — تسليم فوري` |
| Category | `{category} \| شراء {category} — riont` |
| Product | `{product} \| شراء بسعر {price} — riont` |
| Static | `{page} \| riont` |

**Avoid:** duplicate titles across products; auto-append price only on product pages.

### 4.3 Open Graph / Twitter

- `og:locale` = `ar_SA` or `en_US`  
- `og:locale:alternate` for other locale  
- Product OG image: `ProductTranslation.ogImageUrl` or first `ProductImage`  
- Twitter `summary_large_image`  

---

## 5. Structured data (JSON-LD)

### 5.1 Organization (sitewide)

```json
{
  "@type": "Organization",
  "name": "riont",
  "url": "https://riont.com",
  "logo": "..."
}
```

### 5.2 Product (per product page)

```json
{
  "@type": "Product",
  "name": "...",
  "description": "...",
  "image": ["https://...supabase.co/storage/v1/object/public/product-images/..."],
  "sku": "...",
  "offers": {
    "@type": "Offer",
    "price": "14.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://riont.com/ar/products/..."
  }
}
```

**Critical:** `availability` from live Supabase inventory count for `delivery_mode = auto` (SSR query in RSC).  
Phase 1: offer URL points to product page (order request) — not checkout payment.

### 5.3 BreadcrumbList

Home → Category → Product (localized names)

### 5.4 WebSite + SearchAction (homepage)

```json
{
  "@type": "WebSite",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://riont.com/{locale}/search?q={search_term_string}"
  }
}
```

### 5.5 FAQ (optional static pages)

FAQ schema on support/FAQ page only with visible content.

**Rule:** Never fake `aggregateRating` — Google penalty risk.

---

## 6. Sitemap architecture

### 6.1 Dynamic sitemaps

```
/sitemap.xml              → index
/sitemap-en.xml           → English URLs
/sitemap-ar.xml           → Arabic URLs
/sitemap-products-en.xml  → if >1000 products, split
```

### 6.2 Entry rules

| Include | Exclude |
|---------|---------|
| ACTIVE products both locales | DRAFT, ARCHIVED |
| ACTIVE categories | Admin, cart, checkout, account |
| Static pages | Paginated internal search |

### 6.3 Fields

```xml
<url>
  <loc>https://riont.com/ar/products/...</loc>
  <xhtml:link rel="alternate" hreflang="en" href="..." />
  <xhtml:link rel="alternate" hreflang="ar" href="..." />
  <lastmod>2026-05-20</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

Generate via Next.js `app/sitemap.ts` + DB query.

---

## 7. robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*/checkout/
Disallow: /*/account/
Sitemap: https://riont.com/sitemap.xml
```

---

## 8. Internal linking

| Pattern | Purpose |
|---------|---------|
| Home → featured categories | Crawl depth |
| Category → products | Topical relevance |
| Product → related products | 4 max, same category |
| Footer category links | Sitewide |
| Breadcrumbs | Structure + schema |

**Arabic:** Use Arabic anchor text in AR locale — not English product names in links.

---

## 9. Programmatic SEO (controlled)

**Allow (post-launch, curated only):**
- Landing pages: `/ar/instagram-services` curated, not auto-spam  
- Category + attribute combos only if unique copy 300+ words  

**Disallow:**
- Auto-generating thousands of thin pages from tags  

---

## 10. Performance & Core Web Vitals (SEO impact)

| Metric | Target | Tactic |
|--------|--------|--------|
| LCP | < 2.5s | Priority hero image, RSC |
| INP | < 200ms | Minimal client JS on product pages |
| CLS | < 0.1 | Image dimensions, skeleton same size |

Arabic fonts: subset weights 400, 600 only — reduce LCP penalty.

---

## 11. Content SEO checklist (per product)

Admin SEO tab fields (stored in `ProductTranslation`):

- [ ] metaTitle (locale-specific)  
- [ ] metaDescription  
- [ ] slug reviewed  
- [ ] description 200+ words unique AR + EN  
- [ ] alt text on images  
- [ ] FAQ section in description (optional, boosts long-tail)  

---

## 12. Analytics & Search Console

- Separate GSC property paths or single property with locale folders  
- Track queries per country (UAE, SA, EG) for Arabic  
- UTM discipline on campaigns  

---

## 13. Middleware locale detection

```
1. URL prefix /en or /ar → use it
2. Else cookie NEXT_LOCALE
3. Else Accept-Language (ar-* → ar)
4. Else default locale
```

**Never** auto-redirect crawlers away from requested URL (Googlebot must access both).

---

## 14. Implementation checklist (pre-launch)

- [ ] hreflang on all indexable pages  
- [ ] Arabic slugs in sitemap  
- [ ] Product JSON-LD validates (Rich Results Test)  
- [ ] Canonical self-referencing per locale  
- [ ] No noindex on product pages  
- [ ] 301 www vs non-www decided  
- [ ] HTTPS enforced  

---

*UX routes: [UX_ARCHITECTURE.md](./UX_ARCHITECTURE.md)*
