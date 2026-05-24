# riont — MVP scope

> **Master plan:** [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md)  
> **Stack:** Next.js 15 + Supabase  
> **Model:** Order management + fulfillment — **external payment only** (no in-app payment SDKs)  
> **Timeline:** 6–8 weeks (solo developer)

---

## 1. MVP definition

**riont MVP** = premium catalog + order requests + admin workflow + hybrid delivery + support.

### Customer

1. Browse EN/AR catalog (Supabase-backed, SSR/SEO)  
2. Submit order with dynamic fields  
3. Receive order number + external payment instructions  
4. Track status (account or guest link)  
5. Support messaging + receive delivery  

### Admin

1. Manage products (Storage images, translations, SEO)  
2. Review `pending_review` queue  
3. Mark payment received manually (external payment)  
4. Run fulfillment (auto inventory / manual tickets)  
5. Manage coupons, settings, support  

---

## 2. Feature matrix

| Feature | In MVP |
|---------|--------|
| Next.js 15 + Tailwind + Radix UI | ✅ |
| Supabase Postgres + Auth + Storage | ✅ |
| Product catalog + SEO | ✅ |
| Order submission + guest tracking | ✅ |
| Manual payment confirmation (external) | ✅ |
| AUTO/MANUAL delivery + inventory | ✅ |
| Support tickets | ✅ |
| Resend emails | ✅ |
| Currency display (IP/geo) | ✅ |
| Homepage CMS + site settings | ✅ |
| Sentry | ✅ |
| Inngest / Upstash (optional) | optional |
| **Stripe / PayPal / Binance / payment webhooks** | ❌ **not planned** |
| Prisma / Auth.js / R2 | ❌ never |

---

## 3. Six-week plan (Supabase)

| Week | Deliverables |
|------|----------------|
| **1** | Supabase project, migrations, Auth (Google/Apple/email), profiles, middleware, app shell, design tokens |
| **2** | Catalog services, Storage product images, translations, SEO metadata, homepage |
| **3** | `product_fields`, order submit Server Actions, guest tokens, confirmation UX |
| **4** | `delivery_inventory` encryption, `allocate_inventory` RPC, auto + manual delivery |
| **5** | Admin dashboard, order queue, status workflow, support tickets, Resend |
| **6** | RTL/mobile QA, sitemap/hreflang, security checklist, Vercel deploy |

---

## 4. Order flow

```
Submit → pending_review → awaiting_payment → payment_received
  → processing → delivered → completed
```

Payment instructions live in `site_settings`. Customers pay **outside** the app; admins confirm in the admin panel.

---

## 5. Technical boundaries

- Business logic in `src/server/services/`  
- SQL migrations in `supabase/migrations/`  
- No Prisma, no Auth.js, no R2  
- No `api/webhooks` for payments  
- No Stripe, PayPal, Binance, or similar SDKs  
- Service role server-only  

---

## 6. Launch gates

| Gate | Criteria |
|------|----------|
| Supabase | Migrations applied prod; RLS smoke tested |
| Orders | Submit → admin paid → auto deliver |
| Security | Service key not exposed; inventory hidden |
| RTL | Arabic QA |
| SEO | Sitemap + hreflang |
| Payments | External instructions clear; admin confirm workflow tested |

---

## 7. Explicitly out of scope (not planned)

- Integrated checkout payments (Stripe, PayPal, Binance, Apple Pay in checkout, crypto gateways)  
- Payment webhooks or `Payment` tables  
- In-app subscriptions / wallet billing  
- Realtime support chat (tickets + email only for MVP)

---

*Rules: [IMPLEMENTATION_RULES.md](./IMPLEMENTATION_RULES.md)*  
*Stack: [TECH_STACK.md](./TECH_STACK.md)*
