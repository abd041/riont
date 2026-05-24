# riont — Architecture Audit Report

> **Project:** riont — premium digital marketplace  
> **Phase:** Planning (pre-implementation)  
> **Reviewer lens:** Principal engineer / startup CTO / security engineer  
> **Documents audited:** All docs in `/docs`

---

## Update: Locked stack — Next.js + Supabase (final)

All planning refactored from Prisma/Neon/Auth.js/R2 to:

- **Supabase PostgreSQL** + SQL migrations  
- **Supabase Auth** + `profiles.role`  
- **Supabase Storage** (buckets + policies)  
- **Service layer** preserved in `src/server/services/`  

See [TECH_STACK.md](./TECH_STACK.md), [IMPLEMENTATION_RULES.md](./IMPLEMENTATION_RULES.md).

---

## Update: Payment scope (client decision — permanent)

**No integrated payments are planned.** The platform is an **order management** product with **external payment** and admin confirmation.

| Not in scope (permanent) |
|--------------------------|
| Stripe, PayPal, Binance, Apple Pay in checkout |
| Payment webhooks, PCI, `payments` tables |

See [MVP_ROADMAP.md](./MVP_ROADMAP.md) §7.

---

## Executive summary

The existing planning documents provide a **strong UI/UX foundation** but are **insufficient for production backend architecture**. Critical gaps exist in delivery orchestration, payment reconciliation, encryption, inventory concurrency, audit logging, and Arabic SEO depth.

**Severity breakdown:**

| Severity | Count | Theme |
|----------|-------|-------|
| Critical | 8 | Security, delivery race conditions, payment webhooks |
| High | 12 | Missing domain models, underplanned admin ops |
| Medium | 10 | Scalability, DX, SEO |
| Low / Simplification | 6 | Overengineering to remove |

**Verdict:** Implementation follows [IMPLEMENTATION_RULES.md](./IMPLEMENTATION_RULES.md), [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md), [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md), [SECURITY.md](./SECURITY.md), and [MVP_ROADMAP.md](./MVP_ROADMAP.md). No payment integration docs apply.

---

## 1. Missing systems (Critical)

### 1.1 Hybrid delivery engine

| Issue | Why problematic | Real-world impact | Solution |
|-------|-----------------|-------------------|----------|
| No delivery state machine | Orders cannot transition reliably | Customers stuck on "Processing" forever | Define `OrderStatus` + `FulfillmentStatus` per line item — see [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) §2 |
| No inventory allocation model | Auto-delivery will double-sell | Two customers receive same Steam account | Pessimistic row lock + `FOR UPDATE SKIP LOCKED` on inventory rows |
| No delivery idempotency | Webhook + worker retries duplicate delivery | Duplicate credentials sent, refund disputes | `DeliveryLog` with unique `(orderItemId, attempt)` + idempotency keys |
| No manual fulfillment workflow | Manual products have no ops path | Support chaos in DMs | Link `SupportTicket` to `OrderItem`; admin "Mark fulfilled" with audit |
| No re-send / revoke | Admin cannot fix bad delivery | Permanent support load | `DeliveryLog` types: `DELIVERED`, `RESENT`, `REVOKED` |

### 1.2 Dynamic field engine (backend)

| Issue | Why problematic | Real-world impact | Solution |
|-------|-----------------|-------------------|----------|
| `dynamicFields Json?` on Product only | No versioning, no encryption flag per field | Schema changes break old orders | `ProductField` table + `OrderFieldValue` with snapshot |
| No sensitive field handling | Passwords stored plaintext | Credential leak = business death | `isSensitive` + app-level encryption + never log values |
| No validation contract | Frontend-only validation | API abuse, bad orders | Shared Zod schemas generated from `ProductField` rows |

### 1.3 Payment infrastructure

| Issue | Why problematic | Real-world impact | Solution |
|-------|-----------------|-------------------|----------|
| Payment integrations in app | Out of client scope | Delay, PCI scope | **Not planned** — external payment only |
| Manual payment workflow | Must be clear in UX | Customer confusion | `site_settings` + order statuses — [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) |
| Wallet in UX | Scope creep | Delayed MVP | **Removed** — [MVP_ROADMAP.md](./MVP_ROADMAP.md) |

### 1.4 Security & compliance layer

| Issue | Why problematic | Real-world impact | Solution |
|-------|-----------------|-------------------|----------|
| Security = 3 bullet points | Marketplace sells accounts | Breach, fraud, legal exposure | [SECURITY.md](./SECURITY.md) |
| No audit log | Cannot investigate admin abuse | No accountability | `AuditLog` for admin mutations |
| No rate limiting plan | Brute force checkout/auth | Downtime, card testing | Edge + application rate limits |

### 1.5 Operations & support

| Issue | Why problematic | Real-world impact | Solution |
|-------|-----------------|-------------------|----------|
| Support tickets in IA only | No message/attachment model | Email-only support at scale | `SupportTicket` + `SupportMessage` — [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) §4 |
| No notification system | Users don't know manual delivery ready | Chargebacks | `Notification` + email triggers |

### 1.6 SEO (Arabic)

| Issue | Why problematic | Real-world impact | Solution |
|-------|-----------------|-------------------|----------|
| 3-line SEO section | Arabic market is core requirement | No organic traffic in MENA | [SEO_ARCHITECTURE.md](./SEO_ARCHITECTURE.md) |
| `slug String @unique` | Cannot have `/ar/...` and `/en/...` slugs | Broken hreflang | Locale-specific slugs in translation table |

---

## 2. Weak architecture decisions

### 2.1 Monolithic JSON product translations

**Problem:** `name Json // { en, ar }` without a normalized translation strategy.  
**Impact:** Hard to query, index, and validate; SEO slug per locale becomes messy.  
**Fix:** `ProductTranslation` table OR structured JSON with enforced Zod schema + DB check constraints. Prefer **translation table** for SEO fields (title, slug, meta).

### 2.2 Single `Order.status`

**Problem:** Payment success, fulfillment, and delivery are conflated.  
**Impact:** Cannot represent "paid but awaiting manual delivery."  
**Fix:** Split statuses:

```
Order.paymentStatus: PENDING | PAID | FAILED | REFUNDED | PARTIALLY_REFUNDED
OrderItem.fulfillmentStatus: PENDING | PROCESSING | DELIVERED | FAILED | CANCELLED
OrderItem.deliveryMode: AUTO | MANUAL (copied from product at purchase time)
```

### 2.3 Admin in same route tree without hardening

**Problem:** `app/admin` with role check only in middleware.  
**Impact:** IDOR bugs, CSRF on mutations.  
**Fix:** Separate admin layout, `ADMIN` role in DB, optional IP allowlist later, all mutations via Server Actions with CSRF built-in, audit every write.

### 2.4 Zustand cart as source of truth

**Problem:** Cart only client-side for checkout with dynamic fields + inventory.  
**Impact:** Price tampering, stale stock, lost field values.  
**Fix:** Server-side `Cart` or checkout session; client Zustand is **optimistic UI cache** only. Recalculate totals on server at checkout.

### 2.5 NextAuth mentioned without session strategy

**Problem:** No decision on JWT vs database sessions for admin.  
**Impact:** Revoked admin still has access with JWT.  
**Fix:** **Database sessions** for admin users; shorter session TTL; force re-auth for sensitive actions.

---

## 3. Security risks (pre-mitigation)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Inventory credentials exposed via API | High if careless | Critical | Encrypt at rest; reveal only on authorized order detail; mask in admin list |
| Webhook spoofing | Medium | Critical | Signature verification per provider; raw body parsing |
| Race on last inventory unit | High at scale | High | Transactional allocation — see delivery engine |
| Admin credential stuffing | Medium | Critical | Rate limit, MFA (post-launch), audit logs |
| Customer uploads in tickets | Medium | High | Virus scan / type allowlist / size cap; private bucket |
| IDOR on order detail | High if untested | High | `order.userId === session.userId` on every read |
| Logging sensitive fields | High dev mistake | Critical | Structured logging with redaction middleware |
| Coupon brute force | Medium | Medium | Rate limit apply endpoint |

Full controls: [SECURITY.md](./SECURITY.md).

---

## 4. Scalability issues

| Area | Current plan gap | Growth pain (10k orders/mo) | Mitigation |
|------|------------------|----------------------------|------------|
| Auto-delivery | Synchronous in request | Timeouts, failed deliveries | Async job via Inngest/Trigger.dev |
| Search | Not specified | Slow LIKE queries | Meilisearch or Postgres FTS (MVP: FTS) |
| Images | Large files | CDN costs | Supabase Storage CDN |
| DB | Connection limits | Pool exhaustion | Supabase pooler (transaction mode) |
| Analytics | Recharts on admin | Heavy DB aggregations | Nightly rollup table `DailySalesStats` (post-launch) |
| Webhooks | None | Duplicate events | Idempotent `PaymentEvent` processing |

**MVP acceptable:** Next.js on Vercel + Supabase + optional Inngest. **Not acceptable:** Business logic in React components or client-side service role.

---

## 5. Overengineering to remove

| Item | In current docs | Recommendation |
|------|-----------------|----------------|
| Turborepo monorepo | TECH_STACK §2 | **Remove** — single `src/` app for solo/Fiverr delivery |
| `packages/ui` extraction | Premature | Keep `components/ui` until 30+ shared components |
| Wallet / balance top-up | UX topbar + account | **Remove MVP** — no ledger, no balance chip (or static "N/A") |
| Subscriptions admin section | IA + Phase 4 | **Postpone** — not in business MVP list |
| Discord auth | UX auth | **Postpone** — Google + Apple + email only |
| Storybook | Phase 0 | **Optional** — use one showcase page instead |
| Tremor + Recharts both | Stack table | Pick **one** — Recharts sufficient |
| Separate microservices | Not proposed (good) | Keep monolith |

---

## 6. Underplanned areas

1. **Product reordering** — need `sortOrder` on Product + admin drag-drop spec  
2. **Coupon rules** — product/category restrictions, usage limits, stackability  
3. **Refund flow** — partial refunds per line item  
4. **Email templates** — bilingual order/delivery/support emails  
5. **Inventory import** — CSV bulk upload for credentials  
6. **Out-of-stock behavior** — hide vs allow backorder (recommend: block checkout when auto stock = 0)  
7. **Guest checkout** — email capture + order lookup token  
8. **Legal/compliance** — terms acceptance timestamp on order  

---

## 7. Developer experience risks

| Risk | Impact | Fix |
|------|--------|-----|
| No shared domain types package | Duplicated enums | `src/lib/domain/` constants + Zod |
| SQL migrations without discipline | Production drift | `supabase/migrations` only; no dashboard schema drift |
| Missing local webhook testing | Payment bugs | Stripe CLI + documented scripts |
| No seed data strategy | Slow manual QA | `prisma/seed.ts` with products + inventory |
| ENV sprawl | Misconfiguration | `.env.example` with groups documented in TECH_STACK |

---

## 8. Technical debt risks (if coding starts now)

1. **Bolting delivery onto Order model later** → full rewrite  
2. **Storing credentials in Order.notes** → breach  
3. **Payment provider-specific logic in checkout route** → unmaintainable  
4. **Arabic slugs as afterthought** → SEO migration pain  
5. **No audit log from day 1** → cannot debug admin mistakes  

---

## 9. Database weaknesses (original sketch)

| Weakness | Fix document |
|----------|--------------|
| No `DeliveryInventory` | DATABASE §DeliveryInventory |
| No `DeliveryLog` | DATABASE §DeliveryLog |
| No `ProductField` / `OrderFieldValue` | DATABASE §Dynamic fields |
| No `Payment` / `PaymentEvent` tables | By design — external payment only |
| No `AuditLog` | DATABASE + SECURITY |
| No indexes documented | DATABASE §Indexes |
| Decimal money in float risk | Use `Decimal` / integer cents |

---

## 10. Performance concerns

| Concern | MVP approach |
|---------|--------------|
| Product listing N+1 | Supabase `.select()` joins discipline; pagination `.range()` |
| Large inventory tables | Index `(productId, status)`; archive sold rows |
| Checkout POST heavy | Defer delivery to job; return 202 + poll status |
| Admin table load | Server-side pagination 25/page |
| Image LCP | Next/Image + priority on hero only |
| RTL bundle size | Subset Arabic font weights |

---

## 11. Improvements applied (document map)

| New / updated document | Purpose |
|------------------------|---------|
| [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | Delivery engine, forms, support, notifications |
| [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) | Full schema |
| [SECURITY.md](./SECURITY.md) | Security architecture |
| [SEO_ARCHITECTURE.md](./SEO_ARCHITECTURE.md) | Arabic + EN SEO |
| [MVP_ROADMAP.md](./MVP_ROADMAP.md) | Scope control |
| [TECH_STACK.md](./TECH_STACK.md) | Final stack decisions |
| [PRODUCTION_RECOMMENDATIONS.md](./PRODUCTION_RECOMMENDATIONS.md) | Ops, performance, risks |
| UX_ARCHITECTURE.md (updated) | Aligned IA, delivery UX, no wallet MVP |

---

## 12. Sign-off checklist (planning gate)

Before implementation:

- [ ] Hybrid delivery state machine approved  
- [ ] Inventory allocation strategy approved (transactional)  
- [ ] Encryption approach for inventory + sensitive fields approved  
- [ ] Order status workflow approved (external payment, no payment gateway)  
- [ ] Client confirms in-app payments are out of scope permanently  
- [ ] MVP scope signed (no wallet, no subscriptions)  
- [ ] Arabic SEO URL strategy signed  
- [ ] Supabase Auth + profiles.role pattern signed  
- [ ] Job runner choice signed (Inngest recommended)  

---

*Next: [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)*
