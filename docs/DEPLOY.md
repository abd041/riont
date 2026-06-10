# RIONT — Deployment guide

Deploy the Next.js storefront + admin to **Vercel**, with **Supabase** as the backend. Payments stay **external** (admin confirms payment in the panel).

**Related docs:** [TECH_STACK.md](./TECH_STACK.md) (env vars) · [PRODUCTION_RECOMMENDATIONS.md](./PRODUCTION_RECOMMENDATIONS.md) (ops) · [SECURITY.md](./SECURITY.md) (auth, RLS)

---

## Prerequisites

- [Supabase](https://supabase.com) project (Postgres, Auth, Storage)
- [GitHub](https://github.com) repo for this codebase
- [Vercel](https://vercel.com) account
- [Resend](https://resend.com) API key (sandbox until your domain is verified)
- Local `.env.local` copied from `.env.example` (for reference — **never commit** `.env.local`)

---

## Phase A — Prepare Supabase (once per project)

### 1. Run migrations

In **Supabase Dashboard → SQL Editor**, run each file under `supabase/migrations/` **in filename order**:

| Order | File |
|-------|------|
| 1 | `20250523000000_core.sql` |
| 2 | `20250523100000_catalog_public_read.sql` |
| 3 | `20250524100000_delivery_rpc.sql` |
| 4 | `20250525100000_support_rls.sql` |
| 5 | `20250526100000_content_blocks_rls.sql` |
| 6 | `20250526110000_support_attachments.sql` |
| 7 | `20250526000000_product_variants_related.sql` |
| 8 | `20250527000000_product_reviews.sql` |
| 9 | `20250528000000_product_reviews_rls.sql` |
| 10 | `20250529000000_reviews_customer_ops.sql` |
| 11 | `20250530000000_store_reviews.sql` |

Alternatively, with the [Supabase CLI](https://supabase.com/docs/guides/cli) linked to the project:

```bash
supabase db push
```

### 2. Storage buckets

**Storage → New bucket:**

| Bucket | Public | Purpose |
|--------|--------|---------|
| `product-images` | **Yes** | Product/category images (public URLs) |
| `support-attachments` | **No** | Ticket uploads (signed URLs via app) |

Set sensible file-size limits in bucket policies (see [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) §9).

### 3. Authentication — URL configuration (update again after Vercel deploy)

**Authentication → URL configuration:**

| Setting | Local dev | After Vercel deploy |
|---------|-----------|---------------------|
| **Site URL** | `http://localhost:3000` | `https://YOUR-PROJECT.vercel.app` |
| **Redirect URLs** | `http://localhost:3000/auth/callback` | `https://YOUR-PROJECT.vercel.app/auth/callback` |

Keep the localhost callback in the list so local dev keeps working.

OAuth callback path used by the app: `/auth/callback` (see `src/app/auth/callback/route.ts`).

### 4. Authentication — providers

- **Email** — enabled (register/login)
- **Google** — optional; add the same `/auth/callback` URL in [Google Cloud Console](https://console.cloud.google.com/) if used
- **Apple** — optional; set `NEXT_PUBLIC_ENABLE_APPLE_AUTH=true` only after Apple is configured in Supabase

### 5. Create an admin user

1. Register a user via the app (e.g. `/en/register`) or create one in **Authentication → Users**.
2. In **SQL Editor**, promote that user:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'you@example.com'  -- your admin email
);
```

3. Sign in and open `/admin` (redirects to `/admin/orders`).

### 6. Catalog seed (recommended for production parity)

`supabase/seed.sql` loads **30 products**, **7 categories**, a sample coupon, and demo reviews. Run it **after** all migrations (through `20250529000000_reviews_customer_ops.sql`).

| Environment | Command |
|-------------|---------|
| Local Supabase | `npm run db:seed` |
| Linked remote project | `npx supabase link` then `npm run db:seed:linked` |
| Dashboard only | Paste `supabase/seed.sql` into **SQL Editor** → Run |

After seeding **production**, set on Vercel:

`CATALOG_DEMO_FALLBACK=false`

so `/products` lists only real database rows (the app can merge demo catalog when fewer than 10 products exist and this flag is not `false`).

For encrypted auto-delivery inventory in dev:

```bash
npm run seed:inventory
```

Requires `INVENTORY_ENCRYPTION_KEY` and `SUPABASE_SERVICE_ROLE_KEY` in the environment running the script.

---

## Phase B — Push code to GitHub

From the project root (e.g. `d:\riont`):

```bash
git status
git add .
git commit -m "RIONT MVP storefront and admin"
```

Create a repo on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USER/riont.git
git branch -M main
git push -u origin main
```

**Do not commit** `.env.local` or any file containing secrets. Confirm `.env.local` is in `.gitignore`.

---

## Phase C — Vercel project

1. [vercel.com](https://vercel.com) → **Add New → Project** → import the GitHub repo.
2. Framework: **Next.js** (auto-detected).
3. Build command: `npm run build` (default). Use **Node.js 20.x** in Vercel project settings (recommended).
4. Keep **Next.js** on a patched release (currently `15.2.9+` — see [Next.js security advisories](https://nextjs.org/blog/security-update-2025-12-11)).
5. Add **Environment variables** for **Production** and **Preview**:

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_APP_URL` | Yes | `https://YOUR-PROJECT.vercel.app` at first; update after custom domain |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | **Server only** — never expose as `NEXT_PUBLIC_*` |
| `FIELD_ENCRYPTION_KEY` | Yes (prod orders) | Same value as local if you already have encrypted data |
| `INVENTORY_ENCRYPTION_KEY` | Yes (auto delivery) | Same as local; do not rotate if inventory exists |
| `RESEND_API_KEY` | Yes (emails) | From Resend dashboard |
| `EMAIL_FROM` | Yes | `onboarding@resend.dev` until domain verified |
| `NEXT_PUBLIC_ENABLE_APPLE_AUTH` | No | `true` only when Apple Sign-In is configured |

Optional (documented, not required for MVP):

- `SENTRY_DSN` — error monitoring ([PRODUCTION_RECOMMENDATIONS.md](./PRODUCTION_RECOMMENDATIONS.md))
- Upstash / rate limiting — see [TECH_STACK.md](./TECH_STACK.md)

6. **Deploy** and wait for the build to finish.

### CLI alternative

```bash
npm i -g vercel
vercel login
cd path/to/riont
vercel
# set env vars in the Vercel dashboard, then:
vercel --prod
```

---

## Phase D — Wire Supabase to the production URL

1. Copy the Vercel URL, e.g. `https://riont-xxx.vercel.app`.
2. Vercel → **Settings → Environment Variables** → set `NEXT_PUBLIC_APP_URL` to that URL → **Redeploy**.
3. Supabase → **Authentication → URL configuration**:
   - **Site URL:** `https://riont-xxx.vercel.app`
   - **Redirect URLs** (both):
     - `https://riont-xxx.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback`
4. If using **Google OAuth**, add the production callback URL in Google Cloud Console.

---

## Phase E — Smoke test on production

| Test | URL / action |
|------|----------------|
| Health | `GET /api/health` → `{ "status": "ok", "supabaseConfigured": true }` |
| Home EN / AR | `/en`, `/ar` (RTL on Arabic) |
| Catalog | `/en/products` |
| Login | `/en/login` |
| Admin | Sign in as admin → `/admin` → orders list |
| Order flow | Checkout → admin marks payment received → delivery / ticket |
| Sign out | Navbar shows Login; notifications hidden when logged out |
| SEO | `/robots.txt`, `/sitemap.xml` |

---

## Phase F — Custom domain (when ready)

1. Vercel → **Settings → Domains** → add `riont.com` and `www.riont.com`.
2. **Hostinger DNS** (or your registrar):
   - `www` → CNAME to `cname.vercel-dns.com` (or use Vercel’s shown A/CNAME records).
3. Update **`NEXT_PUBLIC_APP_URL`** to `https://riont.com` → redeploy.
4. Supabase auth:
   - **Site URL:** `https://riont.com`
   - **Redirect URLs:** `https://riont.com/auth/callback` (+ keep localhost for dev).
5. **Resend:** verify domain → set `EMAIL_FROM` e.g. `RIONT <orders@riont.com>`.

---

## Pre-launch checklist

| Item | Done |
|------|------|
| All migrations applied (through `20250529000000`) | ☐ |
| Catalog seed run (`npm run db:seed` or SQL Editor) | ☐ |
| `CATALOG_DEMO_FALLBACK=false` on Vercel after seed | ☐ |
| Buckets `product-images` (public), `support-attachments` (private) | ☐ |
| Admin user promoted (`profiles.role = 'admin'`) | ☐ |
| Vercel env vars set (especially encryption keys) | ☐ |
| `NEXT_PUBLIC_APP_URL` matches live URL | ☐ |
| Supabase redirect URLs include production + localhost | ☐ |
| Google/Apple OAuth URLs updated (if used) | ☐ |
| Test order: submit → admin confirm → fulfillment | ☐ |
| Resend: test email received (sandbox limits apply until domain verified) | ☐ |

---

## Local development (quick reference)

```bash
cp .env.example .env.local
# fill in Supabase + keys
npm install
npm run dev
```

Open `http://localhost:3000` — middleware redirects to `/en` or `/ar`.

---

## Troubleshooting

| Symptom | Likely fix |
|---------|------------|
| OAuth redirects to wrong host | Match `NEXT_PUBLIC_APP_URL` and Supabase redirect URLs |
| “Admin” routes redirect to login | `profiles.role` must be `admin` for that `auth.users.id` |
| Order submit fails in prod | Set `FIELD_ENCRYPTION_KEY`; use same key as when data was encrypted |
| Auto-delivery fails | `INVENTORY_ENCRYPTION_KEY`, inventory rows, `allocate_inventory` RPC applied |
| Images 404 | `product-images` bucket exists and is public; paths in `product_media` |
| Emails not sent | `RESEND_API_KEY`, `EMAIL_FROM`; sandbox only sends to verified Resend addresses |
| Build fails on Vercel | Run `npm run build` locally; fix TypeScript/lint errors |

---

## What’s not in this deploy

These are **post-MVP** or separate tasks (see [MVP_ROADMAP.md](./MVP_ROADMAP.md)):

- Custom domain DNS at Hostinger (Phase F when you own `riont.com`)
- IP-based currency (manual currency selector works today)
- Product fields admin UI (fields via SQL/seed until built)
- Multi-item cart checkout (cart is per-line checkout today)
- Sentry / Upstash (optional)

---

## Suggested order after first deploy

1. Validate full order + fulfillment on the Vercel preview URL.
2. Complete the pre-launch checklist above.
3. Add custom domain + Resend domain verification.
4. Implement remaining product gaps (e.g. product fields admin) before handing off to non-technical operators.
