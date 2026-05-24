# riont — Implementation Rules

> **Required reading before any application code.**  
> **Master plan:** [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md)  
> Stack: Next.js 15 + Supabase + Tailwind v4 + next-intl.  
> Order platform only — external payment; no in-app payment SDKs (not planned).

---

## 1. Golden rules

1. **Business logic lives in `src/server/services/`** — never in components.  
2. **Service role key never touches the client** — not even `NEXT_PUBLIC_`.  
3. **Validate every Server Action input with Zod.**  
4. **Encrypt sensitive data in application layer** — Supabase does not replace field encryption.  
5. **No hardcoded UI strings** — use `next-intl` messages.  
6. **No `any`** — strict TypeScript.  
7. **No Stripe/PayPal/Binance imports (permanent).**

---

## 2. Code standards

### 2.1 TypeScript

- `"strict": true` in `tsconfig.json`  
- Prefer `interface` for public shapes; `type` for unions  
- Use generated `Database['public']['Tables']['orders']['Row']` types  
- Narrow enums: `OrderStatus`, `UserRole` in `src/lib/domain/enums.ts`  

### 2.2 Naming

| Item | Convention | Example |
|------|------------|---------|
| Files (components) | PascalCase | `ProductCard.tsx` |
| Files (services) | kebab + `.service.ts` | `order.service.ts` |
| Files (utils) | kebab | `format-price.ts` |
| React components | PascalCase | `OrderStatusBadge` |
| Functions | camelCase | `submitOrder` |
| Constants | SCREAMING_SNAKE | `MAX_ATTACHMENT_BYTES` |
| DB columns | snake_case | `order_number` |
| Server Actions | verb + noun | `submitOrderAction` |

### 2.3 Folder conventions

```
src/app/              # routes only — thin
src/features/         # feature UI grouped by domain
src/components/ui/    # primitives — no business logic
src/server/services/  # ALL domain logic
src/server/actions/   # thin Server Actions
src/validations/      # Zod schemas
src/lib/supabase/     # clients only
src/types/            # database.ts (generated)
```

See full tree: [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md) §2.

### 2.4 Imports

- Use `@/` path alias  
- Order: external → `@/lib` → `@/server` → `@/components` → relative  
- Never import `server/services` from client components  

---

## 3. Next.js rules

### 3.1 Server Components (default)

Use RSC for:

- Product listing / detail (SEO)  
- Category pages  
- Marketing homepage sections  
- Admin list pages (after auth in layout)  

Fetch via service functions called from RSC, not inline 50-line queries in page files.

### 3.2 Client Components (`"use client"`)

Allowed for:

- Interactive forms (React Hook Form)  
- Framer Motion  
- Cart drawer, modals, tabs  
- Auth UI (Supabase browser client for sign-in only)  

**Not allowed:** direct `service_role` usage, decryption of inventory.

### 3.3 Server Actions

```typescript
'use server'

export async function submitOrderAction(input: unknown) {
  const session = await getSession()
  const parsed = submitOrderSchema.parse(input)
  return orderService.submitOrder({ ...parsed, session })
}
```

- Always: auth check → Zod parse → service call → return `{ ok, data } | { ok: false, error }`  
- Never return raw DB errors to client  
- `revalidatePath` / `revalidateTag` after admin mutations  

### 3.4 Caching

| Data | Strategy |
|------|----------|
| Active products | `unstable_cache` 60s, tag `catalog` |
| Product by slug | cache per slug, invalidate on admin save |
| Inventory count | **never cache** |
| User orders | no cache |
| Admin queues | no cache |

Use `export const dynamic = 'force-dynamic'` on account/admin order pages.

### 3.5 Route Handlers

Allowed:

- `GET /api/health`  
- Inngest serve route (if used)  

**Forbidden (permanent):** payment webhooks and payment provider Route Handlers.

### 3.6 Middleware

`middleware.ts`:

- Refresh Supabase session (`@supabase/ssr`)  
- `next-intl` locale routing  
- Redirect unauthenticated users from `/admin/*`  
- Redirect non-admin away from admin  
- Set `display_currency` cookie from geo (see `currency.service`)  

---

## 4. Supabase rules

### 4.1 Client usage

```typescript
// src/lib/supabase/server.ts — RSC & Actions (user context)
// src/lib/supabase/client.ts — browser (auth only)
// src/lib/supabase/admin.ts — service role, import ONLY in server/services
```

### 4.2 Never do

- Put `SUPABASE_SERVICE_ROLE_KEY` in client bundle  
- Call admin client from Client Component  
- Expose `delivery_inventory.payload_encrypted` to anon/authenticated SELECT policies  
- Trust client-sent `role: 'admin'`  

### 4.3 Query patterns

**Reads (catalog):**

```typescript
// product.service.ts — server client or admin with public policy
const { data, error } = await supabase
  .from('products')
  .select('*, product_translations(*)')
  .eq('status', 'ACTIVE')
```

**Writes (admin):**

```typescript
// Always after assertAdmin(session)
const supabase = createAdminClient()
```

**Transactions (inventory allocation):**

Use Supabase RPC function `allocate_inventory(p_order_item_id, p_qty)` defined in SQL migration — keeps atomicity.

### 4.4 RLS guidelines

| Approach | When |
|----------|------|
| RLS enabled + policy | `profiles`, customer `orders` SELECT own |
| No direct client DB | Admin pages — Server Actions only |
| Service role | Inventory, delivery logs, audit, admin writes |
| Guest orders | Token validated in service — no `auth.uid()` |

Do **not** write 30+ overlapping policies. See [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md).

### 4.5 Migrations

- All schema changes in `supabase/migrations/*.sql`  
- Never edit production via Dashboard Table Editor without migration file  
- Regenerate types after migrate  

### 4.6 Storage

- Upload via Server Action → admin client `storage.from(bucket).upload()`  
- Validate MIME + size server-side  
- Public URLs only for `product-images`  
- Private: `createSignedUrl(path, 900)` — 15 min  

---

## 5. Security rules

### 5.1 Encryption (mandatory)

- `src/lib/encryption.ts` — AES-256-GCM encrypt/decrypt  
- Use for: `delivery_inventory.payload_encrypted`, sensitive `order_field_values`  
- Keys from env only  

### 5.2 Logging

- Never log field values, payloads, tokens, service key  
- Sentry: scrub `password`, `payload`, `secret` before send  

### 5.3 Validation

- Zod schema per Server Action in `src/validations/`  
- Sanitize HTML product descriptions (isomorphic-dompurify or similar)  

### 5.4 Audit

- Insert `audit_logs` on admin: status change, inventory import, settings update  
- Insert `order_status_history` on every status transition  

### 5.5 Rate limits

- Order submit: 5/hour/IP (Upstash or middleware counter)  
- Auth: Supabase built-in + optional Upstash on custom routes  

---

## 6. UI rules

- Colors/spacing from [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) tokens only  
- No inline hex except in `globals.css` token definitions  
- Radix for dialogs, dropdowns, tabs  
- Framer Motion: hover lifts, page fade — no bounce loops  
- `prefers-reduced-motion` respected  
- Loading: skeleton components matching layout dimensions  
- Accessibility: Radix primitives; focus rings per DESIGN_SYSTEM; min 44px touch targets  
- Admin: dense tables, sticky headers, status pills from `OrderStatus` enum  

---

## 7. i18n rules

- All copy in `messages/en.json`, `messages/ar.json`  
- Server: `getTranslations('namespace')`  
- Client: `useTranslations('namespace')`  
- Prices: `currency.service.formatDisplayPrice()` — USD base, display conversion only  
- Price disclaimer i18n key on product/order pages  
- `dir="ltr"` on numeric price spans in RTL  
- Dates: `Intl.DateTimeFormat(locale)`  
- No uppercase + letter-spacing on Arabic headings  
- Logical CSS: `ms-`, `me-`, `text-start` — see [RTL_GUIDE.md](./RTL_GUIDE.md)  

---

## 8. Service layer responsibilities

### 8.1 `product.service.ts`

- List/filter products (catalog, admin)  
- Get by slug + locale  
- CRUD product, translations, images, fields (admin)  
- Reorder `sort_order`  
- Trigger catalog revalidation  

### 8.2 `order.service.ts`

- `submitOrder()` — validate stock, fields, coupon quote, create order  
- `transitionStatus()` — admin state machine + history  
- `getOrderForCustomer()` — IDOR + guest token  
- `getAdminQueue()` — filters, pagination  
- `getOrderTimeline()` — status history  

### 8.3 `delivery.service.ts`

- `startFulfillment(orderId)` — set PROCESSING, queue items  
- `fulfillOrderItem(orderItemId)` — allocate via RPC, decrypt, log  
- `manualDeliver()` — admin mark + log  
- `resendDelivery()` — rate limited  

### 8.4 `inventory.service.ts`

- Stock counts  
- CSV import (encrypt rows)  
- List metadata (no plaintext secrets)  

### 8.5 `support.service.ts`

- Create/reply tickets  
- Link to orders  
- Attachment upload to private bucket  

### 8.6 `notification.service.ts`

- In-app notifications insert  
- Queue Resend emails (Inngest or async)  
- Template selection by locale  

### 8.7 `coupon.service.ts`

- Validate + apply quote  
- Increment usage on `payment_received` status transition  

### 8.8 `currency.service.ts`

- Resolve display currency (cookie → profile → geo → locale)  
- Fetch/cache rates in `exchange_rates`  
- `formatDisplayPrice()` — never used for charging  
- Snapshot on order submit  

### 8.9 `content.service.ts`

- CRUD `content_blocks` for homepage CMS  
- `site_settings` payment instructions EN/AR  

### 8.10 `customer.service.ts`

- Admin list profiles + order counts  
- Customer detail with order history (no decrypt unless order opened)  

### 8.11 `category.service.ts`

- Categories + translations CRUD  

### 8.12 `audit.service.ts`

- `audit_logs` + `order_status_history` inserts  

### 8.13 Cross-cutting

- `auth.service.ts` — `getSession`, `assertAdmin`, `assertUser`  
- Services call each other sparingly; orchestrate in `order.service` for submit flow  
- **Forbidden:** Supabase queries inside `components/` or `features/*/components/`  

### 8.14 Business logic boundaries

| Layer | May do |
|-------|--------|
| `components/ui` | Render props only |
| `features/*/components` | UI + local UI state |
| `server/actions` | Parse, auth, call service, revalidate |
| `server/services` | DB, encryption, rules, notifications |
| `lib/supabase/admin` | Imported only by services |

---

## 9. Error handling

```typescript
// Service returns
type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; code: 'NOT_FOUND' | 'FORBIDDEN' | 'VALIDATION'; message: string }
```

- Map codes to i18n in Server Actions  
- Unexpected errors → log + Sentry + generic user message  

---

## 10. Git & PR discipline

- One migration per logical change  
- PR checklist: no service key in diff, no `any`, Zod on new actions, audit log for admin writes  

---

## 11. Phase 1 file creation order

1. Supabase migrations + seed  
2. `lib/supabase/*` + `types/database.ts`  
3. `lib/encryption.ts` + domain enums/schemas  
4. Services (bottom-up: product → order → delivery)  
5. Server Actions wiring  
6. UI components  

---

## 12. Permanent prohibitions

- No `stripe`, PayPal, Binance, or similar payment packages  
- No `api/webhooks/payment` routes  
- No in-app charging — external payment + admin confirm only  
- No storing card data  
- No Prisma / Auth.js / R2 SDK  

---

## 13. Testing expectations

Per [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md) §11:

- Unit test encryption + currency + coupon + status transitions  
- Integration test `allocate_inventory`  
- E2E: order submit → admin fulfill  

---

*Master plan: [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md)*
