# RIONT — Requirements Alignment Audit

> **Purpose:** Verify client requirements + UI references vs planning docs.  
> **Stack confirmed:** Next.js 15 + Supabase (Postgres, Auth, Storage) + Vercel + Hostinger.  
> **Master plan:** [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md)

**Verdict:** You are **correctly aligned** on stack, architecture, and ~90% of requirements. Gaps below are **documented and patched** in planning — not blockers if acknowledged before build.

---

## 1. Stack & architecture alignment

| Client / you | Planning | Status |
|--------------|----------|--------|
| Next.js | Next.js 15 App Router | ✅ Aligned |
| Scalable backend | Supabase PostgreSQL | ✅ Aligned |
| Auth (Google, Apple, email) | Supabase Auth | ✅ Aligned |
| File uploads | Supabase Storage | ✅ Aligned |
| Clean scalable codebase | `server/services/` + thin UI | ✅ [IMPLEMENTATION_RULES.md](./IMPLEMENTATION_RULES.md) |
| No in-app payment integrations | Order platform + external payment + admin confirm | ✅ [MVP_ROADMAP.md](./MVP_ROADMAP.md) |

**Not using (correctly excluded):** Prisma, Neon, Auth.js, R2.

---

## 2. UI reference alignment (RIONT / NEXORA boards)

References may show checkout with PayPal/Apple Pay — **not in scope**. MVP uses the same visual language with **order submission** and external payment instructions instead of an in-app payment step.

| Reference element | Planning | Phase |
|-------------------|----------|-------|
| Ultra-dark + purple neon + glass | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | 1 |
| Left sidebar + top search | [UX_ARCHITECTURE.md](./UX_ARCHITECTURE.md) §2 | 1 |
| Featured product cards, badges (Best Seller) | ProductCard spec | 1 |
| Hero + trust bar | `content_blocks` + homepage | 1 |
| Product detail: gallery, tabs | PDP spec | 1 |
| Cart drawer | Optional MVP | 1 |
| Checkout payment grid (Stripe/PayPal/etc.) | Not planned — external payment only | — |
| Admin: stats, chart, product table | Admin dashboard Phase 7 | 1 |
| Add product tabs (General, Pricing, Delivery, SEO) | Admin product editor | 1 |
| Mobile bottom nav | [UX_ARCHITECTURE.md](./UX_ARCHITECTURE.md) | 1 |
| Arabic RTL sidebar on right | [RTL_GUIDE.md](./RTL_GUIDE.md) | 1 |
| Wallet in sidebar (some boards) | **Removed** — not in requirements | — |
| Realtime dashboard | Optional later; refresh on load MVP | 1 |

---

## 3. Full requirements traceability

### 3.1 Project guidelines

| Requirement | Planning | Status |
|-------------|----------|--------|
| Modern marketplace (Next.js) | MASTER §1 | ✅ |
| Sleek, premium, simple UI | DESIGN_SYSTEM + UX | ✅ |
| Fully responsive | UX breakpoints + mobile nav | ✅ |
| Compact uncluttered | Spacing scale compact | ✅ |
| Featured cards + sidebar | Layout spec | ✅ |
| Smooth transitions | Framer 150–250ms | ✅ |

### 3.2 Branding & domain

| Requirement | Planning | Status |
|-------------|----------|--------|
| Name RIONT | All docs | ✅ |
| riont.com | MASTER §12 Hostinger + Vercel | ✅ |
| Publish on client domain | PRODUCTION_RECOMMENDATIONS | ✅ |

### 3.3 Languages & SEO

| Requirement | Planning | Status |
|-------------|----------|--------|
| Arabic + English | next-intl `/en` `/ar` | ✅ |
| SEO both languages | [SEO_ARCHITECTURE.md](./SEO_ARCHITECTURE.md) | ✅ |
| Digital services SEO | JSON-LD Product, slugs, meta | ✅ |
| Clean slugs | `product_translations.slug` per locale | ✅ |
| Instagram / Steam / games examples | Seed + category taxonomy (implementation) | ✅ Content task |

### 3.4 Key features

| Requirement | Planning | Status |
|-------------|----------|--------|
| Currency by IP/location | MASTER §5 `currency.service` | ✅ Display only |
| Discount/voucher codes | `coupons` + coupon.service | ✅ |
| Fast performance | RSC, cache tags, image opt | ✅ |
| Scalable DB | Supabase + indexes + RPC | ✅ |

### 3.5 Administrator panel

| Requirement | Planning | Status |
|-------------|----------|--------|
| Add/edit/delete/reorder products | product.service + sort_order | ✅ |
| Change names/descriptions | product_translations | ✅ |
| Change website images/content | content_blocks + site_settings | ✅ |
| Upload product images | Storage `product-images` | ✅ |
| Upload product **videos** | `product_media` table (see §4) | ✅ **Added to schema** |
| Manage subscriptions/plans | — | ❌ **Out of scope** (see §5) |
| Manage orders/customers | order + customer services | ✅ |
| Manage coupons | coupon.service | ✅ |
| Manage categories | category.service | ✅ |
| Choose delivery type (auto/manual) | products.delivery_mode | ✅ |
| Define what customer receives | translation fields + tabs | ✅ **Added to schema** |
| Dynamic fields per product | product_fields | ✅ |

### 3.6 Product & delivery system

| Requirement | Planning | Status |
|-------------|----------|--------|
| Manual delivery | MANUAL + support tickets | ✅ |
| Automatic delivery | AUTO + inventory + RPC | ✅ |
| Order/support for manual | FULFILLMENT tickets | ✅ |
| Optional fields (email, password, etc.) | product_fields types | ✅ |
| Instant delivery after payment | After admin marks `payment_received` → PROCESSING | ✅ |

### 3.7 Client features

| Requirement | Planning | Status |
|-------------|----------|--------|
| Account system | Supabase Auth + profiles | ✅ |
| Login / register | Auth routes | ✅ |
| Google + Apple login | Supabase providers | ✅ |
| Current & past orders | account/orders | ✅ |
| Order history page | UX §9 | ✅ |
| **Order updates** | notifications + email on status change | ✅ |
| Guest tracking | guest_order_access | ✅ |

### 3.8 Publishing & hosting

| Requirement | Planning | Status |
|-------------|----------|--------|
| Full publishing | Vercel deploy | ✅ |
| Domain connection | Hostinger DNS → Vercel | ✅ MASTER §12 |
| Vercel + Hostinger assistance | PRODUCTION doc | ✅ |

### 3.9 Main focus (visual)

| Requirement | Planning | Status |
|-------------|----------|--------|
| Distinctive dark UI | DESIGN_SYSTEM | ✅ |
| Professional product cards | §6.3 DESIGN_SYSTEM | ✅ |
| Similar to shared references | Reference checklist DESIGN_SYSTEM §13 | ✅ |

---

## 4. Planning patches (gaps closed in docs)

These were missing or thin — now specified:

### 4.1 Product videos

**Table `product_media`:**

| Column | Type |
|--------|------|
| id | uuid |
| product_id | uuid FK |
| media_type | `image` \| `video` |
| storage_path | text |
| sort_order | int |
| alt | text |

Videos: Storage bucket `product-images` or separate `product-videos` (max 50MB, mp4/webm). Prefer dedicated bucket for size policies.

### 4.2 “What customer receives” + requirements (PDP tabs)

**On `product_translations`:**

| Column | Type |
|--------|------|
| deliverables | text | HTML/markdown — “What you receive” tab |
| requirements | text | “Requirements” tab |
| description | text | “Description” tab (existing) |

Admin product editor: Delivery tab includes deliverables copy (separate from inventory credentials).

### 4.3 Order updates (explicit)

**Triggers → `notifications` + Resend:**

| Event | Customer notified |
|-------|-------------------|
| Order submitted | Yes |
| Status → awaiting_payment | Yes |
| Status → payment_received | Yes |
| Status → processing | Yes |
| Item delivered | Yes |
| Ticket reply | Yes |

### 4.4 Cart (optional but reference-aligned)

- **Recommended MVP:** Cart drawer + review step (no payment).  
- Server recalculates totals on submit (not client-only Zustand).  
- Documented in UX + IMPLEMENTATION_RULES.

---

## 5. Payment model (client approved)

**Decision:** External payment + admin confirmation. Full detail: **[PAYMENT_MODEL.md](./PAYMENT_MODEL.md)**.

- Checkout creates an **order request** (`pending_review`); payment happens outside the site.
- Admin marks **payment received** after verifying the transfer; then fulfillment runs.
- Admin notifications on submit = **new request**, not “payment completed.”

---

## 6. Explicitly out of scope (not planned)

| Client wording | MVP approach |
|----------------|--------------|
| Stripe / PayPal / Apple Pay / Binance in checkout | External payment + admin confirms `payment_received` |
| Checkout “Pay Now” / payment webhooks | Order request + payment instructions in email/UI |
| Manage subscriptions/plans | Not in MVP |
| Reviews submit + moderation | Optional later; not in MVP |
| Wallet balance | Not in requirements — omitted |
| Supabase Realtime live dashboard | Polling/refresh on load for MVP |

**Client communication:** References may show payment UI — MVP uses **order request + payment instructions**; admins confirm payment manually after external transfer.

---

## 7. “Instant after payment” (MVP)

| Client phrase | MVP behavior |
|---------------|--------------|
| Receives instantly after payment | After admin marks **payment_received**, auto SKU allocates on **Processing** |

One admin step confirms external payment; then fulfillment runs as designed.

---

## 8. Clean codebase commitment

Your priority is met by:

| Practice | Document |
|----------|----------|
| Single responsibility services | MASTER §1.4, IMPLEMENTATION_RULES §8 |
| No DB in components | IMPLEMENTATION_RULES §8.14 |
| SQL migrations versioned | DATABASE §6 |
| Feature folders | MASTER §2 |
| Typed Supabase client | TECH_STACK §10 |
| No payment SDKs in repo | IMPLEMENTATION_RULES — permanent |

---

## 9. Pre-build checklist (nothing critical missing)

- [x] Next.js + Supabase locked  
- [x] Order + delivery + support + admin  
- [x] EN/AR + RTL + SEO  
- [x] Currency display by IP  
- [x] Coupons  
- [x] CMS-lite homepage  
- [x] Product videos in schema  
- [x] Deliverables/requirements content  
- [x] Order notifications  
- [x] Hostinger + Vercel  
- [x] **Client confirms** no in-app payments (external only) — see [PAYMENT_MODEL.md](./PAYMENT_MODEL.md)  
- [ ] **Client confirms** subscriptions/wallet out of scope  
- [ ] **Client provides** payment instruction text (bank/WhatsApp) for launch  
- [ ] **Sign-off** MASTER + IMPLEMENTATION_RULES  

---

## 10. Recommended sidebar nav (MVP storefront)

Align with references; omit out-of-scope nav:

**Show:** Home, All Products, Categories (dynamic), Accounts/Services/Keys as **categories** not separate systems, Support  
**Omit:** Subscriptions, Wallet (not planned)  
**Topbar:** Search, locale, currency selector, cart, notifications, auth  

---

*Update schema details: [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)*
