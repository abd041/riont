# riont — Final Technical Stack (Locked)

> **Master plan:** [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md)  
> **Stack:** Next.js 15 + Supabase (Postgres, Auth, Storage) + Vercel + Hostinger DNS  
> **Scope:** Order management + fulfillment — **external payment only** (no payment SDKs, not planned)

---

## 1. Locked stack

| Layer | Technology | Role |
|-------|------------|------|
| Framework | **Next.js 15** (App Router) | UI, SSR, SEO, Server Actions |
| Backend data | **Supabase PostgreSQL** | Single source of truth |
| Auth | **Supabase Auth** | Google, Apple, email/password |
| File storage | **Supabase Storage** | Product images, private attachments |
| Styling | **Tailwind CSS v4** | Design tokens |
| UI | **Radix UI** + **Framer Motion** | Accessible primitives + motion |
| i18n | **next-intl** | `/en`, `/ar` |
| Email | **Resend** | Transactional email |
| Monitoring | **Sentry** | Errors + performance |
| Hosting | **Vercel** | Next.js deployment |
| Charts | **Recharts** | Admin dashboard |
| Rate limit (optional) | **Upstash Redis** | Order submit, auth |
| Jobs (optional) | **Inngest** | Async email + auto-delivery |
| Bot check (optional) | **Cloudflare Turnstile** | Order submit |

### Replaced (do not use)

| Removed | Replaced by |
|---------|-------------|
| Prisma | Supabase SQL migrations + generated types |
| Neon (standalone) | Supabase hosted Postgres |
| Auth.js | Supabase Auth |
| Cloudflare R2 | Supabase Storage |

---

## 2. Supabase project structure

```
riont/
├── supabase/
│   ├── migrations/           # SQL migrations (source of truth)
│   ├── seed.sql              # dev seed
│   └── config.toml
├── src/
│   ├── app/
│   │   ├── [locale]/         # storefront (next-intl)
│   │   ├── admin/            # admin app
│   │   └── api/
│   │       └── health/
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts     # browser client
│   │       ├── server.ts     # Server Component / Action
│   │       ├── admin.ts      # service role (server only)
│   │       └── middleware.ts # session refresh
│   ├── server/
│   │   ├── services/         # ALL business logic
│   │   └── jobs/             # Inngest (optional)
│   ├── components/
│   ├── types/
│   │   └── database.ts       # supabase gen types
│   └── styles/
├── messages/en.json, ar.json
└── docs/
```

**No Turborepo. No Prisma folder.**

---

## 3. Supabase client strategy

| Client | Where | Key | Use |
|--------|-------|-----|-----|
| Browser | Client components | `anon` | Auth UI, session subscribe |
| Server | RSC, Server Actions | `anon` + cookies | User-scoped reads |
| Admin | `server/services/*` only | `service_role` | Writes, inventory, admin, encryption |

**Rule:** Components never import `admin.ts`. Services never run in client.

---

## 4. Data access pattern

```
UI → Server Action → service.* → supabaseAdmin (or server client)
```

- **Catalog (public):** Server Component + server client or cached query  
- **Customer orders:** Server client with RLS **or** service + `assertOrderOwner()`  
- **Admin mutations:** `assertAdmin()` → service → admin client  
- **Guest orders:** Service validates `guest_order_access` token — not RLS alone  

See [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) for RLS balance.

---

## 5. Auth (Supabase Auth)

| Provider | MVP |
|----------|-----|
| Email/password | ✅ |
| Google OAuth | ✅ |
| Apple OAuth | ✅ |

- `profiles` table: `id` = `auth.users.id`, `role`, `locale`, `display_name`  
- Admin: `profiles.role = 'admin'`  
- Middleware protects `/admin/*`  
- Session via `@supabase/ssr` cookie pattern  

Detail: [SECURITY.md](./SECURITY.md) §2, [IMPLEMENTATION_RULES.md](./IMPLEMENTATION_RULES.md).

---

## 6. Storage buckets

| Bucket | Public | Contents |
|--------|--------|----------|
| `product-images` | Yes | Product/category images |
| `support-attachments` | No | Ticket files |
| `delivery-files` | No | Optional FILE delivery assets |

Signed URLs for private buckets (short TTL).  
Detail: [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) §9.

---

## 7. NOT in dependencies (permanent)

- `prisma`, `@prisma/client`  
- `@auth/core`, `next-auth`  
- `stripe`, PayPal, Binance, and other payment SDKs  
- `api/webhooks/*` for payment providers  
- AWS S3 / R2 SDKs (use Supabase Storage)  

---

## 8. Environment variables

```bash
# Next.js
NEXT_PUBLIC_APP_URL=

# Supabase (public — safe in browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase (SERVER ONLY — never NEXT_PUBLIC)
SUPABASE_SERVICE_ROLE_KEY=

# Encryption (SERVER ONLY)
INVENTORY_ENCRYPTION_KEY=
FIELD_ENCRYPTION_KEY=

# Resend
RESEND_API_KEY=
EMAIL_FROM=

# Optional
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
SENTRY_DSN=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

**Removed:** `DATABASE_URL` (Prisma), `AUTH_SECRET` (Auth.js), `R2_*`

Direct Postgres connection (`SUPABASE_DB_URL`) optional for migrations CLI only.

---

## 10. Type generation

```bash
supabase gen types typescript --project-id <ref> > src/types/database.ts
```

Run after each migration. Services import `Database` types from here.

---

## 11. Implementation timeline (6 weeks)

| Week | Focus |
|------|-------|
| 1 | Next.js + Supabase project, migrations, Auth, shell |
| 2 | Catalog + Storage uploads + SEO |
| 3 | Orders + dynamic fields + guest tracking |
| 4 | Delivery + inventory + encryption |
| 5 | Admin dashboard + support |
| 6 | RTL, mobile, Sentry, deploy |

---

## 12. Testing

| Layer | Tool |
|-------|------|
| Services | Vitest + local Supabase or branch |
| RLS policies | Supabase SQL tests (optional) |
| E2E | Playwright |
| Types | `tsc --noEmit` |

Use **Supabase local dev** (`supabase start`) for integration tests.

---

## 13. Documentation index

| Document | Topic |
|----------|-------|
| [IMPLEMENTATION_RULES.md](./IMPLEMENTATION_RULES.md) | **Required before coding** |
| [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | Services + Supabase |
| [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) | Schema + RLS + migrations |
| [SECURITY.md](./SECURITY.md) | Auth + encryption |
| [MVP_ROADMAP.md](./MVP_ROADMAP.md) | Scope |
| [UX_ARCHITECTURE.md](./UX_ARCHITECTURE.md) | Flows |
| [SEO_ARCHITECTURE.md](./SEO_ARCHITECTURE.md) | SEO |
| [PRODUCTION_RECOMMENDATIONS.md](./PRODUCTION_RECOMMENDATIONS.md) | Ops |

---

## 14. Sign-off checklist

- [ ] Supabase project + migrations reviewed  
- [ ] RLS + service-layer split understood  
- [ ] Storage buckets defined  
- [ ] No in-app payment SDKs or webhooks  
- [ ] [IMPLEMENTATION_RULES.md](./IMPLEMENTATION_RULES.md) acknowledged  

