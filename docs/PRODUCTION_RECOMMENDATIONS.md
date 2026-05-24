# riont — Production Recommendations

> **Stack:** Vercel (Next.js) + Supabase (Postgres, Auth, Storage) + Resend + Sentry

---

## 1. Deployment topology

```
Users → Vercel (Next.js 15)
          ├── Supabase Postgres (hosted)
          ├── Supabase Auth
          ├── Supabase Storage (+ CDN)
          ├── Resend (email)
          ├── Sentry (errors)
          └── Inngest (optional jobs)
```

**No separate Neon or R2 accounts required.**

---

## 2. Supabase production setup

| Setting | Recommendation |
|---------|----------------|
| Region | Closest to primary users (MENA/EU) |
| Backups | Pro plan PITR enabled |
| Pooler | Use connection pooler for serverless (transaction mode for RPC) |
| Auth | Configure production OAuth redirect URLs |
| Storage | CDN enabled on public bucket |
| Secrets | Service role key only in Vercel env (not exposed) |

### Environments

| Env | Supabase |
|-----|----------|
| Local | `supabase start` |
| Preview | Branch project or staging project |
| Production | Main linked project |

---

## 3. Vercel configuration

- Link Git repo → auto preview deploys  
- Env vars per environment (see [TECH_STACK.md](./TECH_STACK.md))  
- `NEXT_PUBLIC_SUPABASE_*` for client  
- `SUPABASE_SERVICE_ROLE_KEY` server only  

---

## 4. Performance

| Area | Pattern |
|------|---------|
| Catalog RSC | `unstable_cache` + tag `catalog` |
| Images | Supabase public URL + `next/image` |
| Admin lists | Pagination `.range(0, 24)` |
| Inventory | Indexed queries; no cache |
| Serverless cold starts | Keep service functions lean |

### ISR / revalidation

- Product pages: revalidate 60s or on-demand via admin `revalidateTag`  
- Homepage sections: same tag `catalog`  

---

## 5. Scalability path

| Stage | Approach |
|-------|----------|
| Launch | Single Supabase project, Vercel hobby/pro |
| Growth | Supabase compute upgrade, read replicas (Pro) |
| Search | Meilisearch or dedicated search (post-launch, if needed) |
| Jobs | Inngest when email/fulfillment volume grows |

---

## 6. Observability

| Tool | Use |
|------|-----|
| Sentry | Next.js SDK, scrub sensitive fields |
| Supabase Dashboard | DB metrics, Auth logs, Storage usage |
| Vercel Analytics | Web vitals |
| Inngest dashboard | Failed fulfillment jobs |

Health: `GET /api/health` → Supabase lightweight query `select 1`.

---

## 7. CI/CD

```yaml
- pnpm lint && pnpm tsc
- supabase db lint (optional)
- vitest services
- deploy preview on PR
- production: supabase db push --linked && vercel --prod
```

Never commit service role key.

---

## 8. Customer communication

Site must state payments are **completed outside the platform**.  
`site_settings` stores bilingual instructions editable in admin.

---

## 9. Launch gates

| Gate | Check |
|------|-------|
| Migrations | All applied on prod |
| RLS | Inventory not readable by anon |
| Auth | OAuth prod URLs work |
| Orders | E2E submit → fulfill |
| Storage | Public images load; private signed URLs work |
| RTL | Arabic mobile pass |
| SEO | GSC sitemap |

---

## 10. Risk register

| Risk | Mitigation |
|------|------------|
| Service key exposure | Build scan, server-only imports |
| Admin queue bottleneck | Email alerts on new orders |
| Supabase rate limits | Pagination, avoid N+1 |
| Vendor lock-in | Standard Postgres — exportable |
| Manual payment confusion | Clear UX + FAQ |

---

---


*Roadmap: [MVP_ROADMAP.md](./MVP_ROADMAP.md)*
