# riont — Security Architecture (Next.js + Supabase)

> **Payments:** External only — no in-app payment processing, no PCI scope, no payment webhooks.

---

## 1. Security model (defense in depth)

| Layer | Responsibility |
|-------|----------------|
| **Application services** | Authorization, validation, encryption, IDOR checks |
| **Supabase Auth** | Identity, OAuth, session cookies |
| **RLS** | Safety net for direct client reads — not sole admin gate |
| **Service role** | Privileged ops — server-only, after role checks |
| **Storage policies** | Bucket isolation + signed URLs |
| **Vercel / Cloudflare** | TLS, optional WAF, Turnstile |

**Do not rely ONLY on Supabase.** Application-layer checks are mandatory.

---

## 2. Supabase Auth architecture

### 2.1 Providers (Phase 1)

- Email/password (Supabase built-in, min length enforced in dashboard + Zod)  
- Google OAuth  
- Apple OAuth  

Configure redirect URLs: `https://riont.com/auth/callback` (and localhost dev).

### 2.2 Session handling

- `@supabase/ssr` cookie pattern in middleware  
- Server Actions: `createServerClient()` → `supabase.auth.getUser()`  
- Never trust `session` from client-sent headers alone  

### 2.3 Roles

| role | Storage |
|------|---------|
| `customer` | `profiles.role` default |
| `admin` | `profiles.role = 'admin'` |

```typescript
// auth.service.ts
export async function assertAdmin() {
  const user = await getUser()
  if (!user) throw new AuthError('UNAUTHENTICATED')
  const profile = await getProfile(user.id)
  if (profile.role !== 'admin') throw new AuthError('FORBIDDEN')
  return { user, profile }
}
```

Bootstrap first admin: SQL update on `profiles` after first signup.

### 2.4 Route protection

| Route | Guard |
|-------|-------|
| `/admin/*` | middleware: session exists + profile role admin |
| `/[locale]/account/*` | middleware: session required |
| Storefront public | open |
| Server Actions (admin) | `assertAdmin()` inside service |

### 2.5 Guest orders

- Not authenticated via Supabase  
- `guest_order_access.token_hash` validated in `order.service`  
- High-entropy token (32+ bytes), stored hashed  

---

## 3. Service role security

### 3.1 Rules

- `SUPABASE_SERVICE_ROLE_KEY` only in server env  
- Import `createAdminClient()` only from `server/services/*` and `lib/encryption` helpers  
- Never pass admin client to Client Components  
- Never log service key  

### 3.2 When service role is required

- Inventory CRUD + allocation RPC  
- Decrypting sensitive order fields for admin  
- Audit log inserts  
- Admin product writes  
- Storage uploads to private buckets  
- Guest order fetch by token  

### 3.3 Supabase Dashboard

- Disable public signups if invite-only (optional)  
- Enable leaked password protection  
- Configure SMTP or use custom Resend for auth emails (optional)  

---

## 4. RLS security notes

- `delivery_inventory`: RLS enabled, **no** policies for anon/auth → deny  
- Sensitive columns never in PostgREST exposed views  
- Avoid `select *` in client queries  
- Review policies when adding new tables  

See [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) §4.

---

## 5. Application encryption

| Data | Method |
|------|--------|
| `delivery_inventory.payload_encrypted` | AES-256-GCM app layer |
| Sensitive `order_field_values` | AES-256-GCM app layer |
| Guest tokens | SHA-256 hash stored |

Env keys: `INVENTORY_ENCRYPTION_KEY`, `FIELD_ENCRYPTION_KEY` (server only).

Supabase disk encryption is additive, not a substitute.

---

## 6. Storage security

| Bucket | Policy |
|--------|--------|
| `product-images` | Public read; admin-only write (service role) |
| `support-attachments` | No public access; signed URLs |
| `delivery-files` | Admin + signed delivery URL to customer |

Storage RLS policies in Supabase Dashboard:

- Authenticated users can upload only to their ticket path (if client upload) — **prefer Server Action upload via service role** for simplicity Phase 1.

MIME allowlist + max size in Server Action before upload.

---

## 7. Threat model (Phase 1)

| Threat | Mitigation |
|--------|------------|
| Service key leak | Server-only env, Vercel secrets, no client import |
| IDOR orders | `user_id` check + guest token hash |
| Inventory leak via API | No RLS SELECT on inventory; service-only |
| Admin impersonation | `profiles.role` + middleware + assertAdmin |
| Order spam | Turnstile + rate limit + review queue |
| XSS | Sanitize HTML descriptions |
| SQL injection | Parameterized Supabase client (no raw string SQL from user input) |
| Attachment malware | Allowlist MIME, size cap |

---

## 8. API & Server Action protection

- Zod on every action input  
- CSRF: built into Server Actions (Next.js)  
- Rate limits: Upstash on `submitOrderAction`, auth routes  
- Generic error messages to client  

---

## 9. Audit & logging

- `audit_logs` for admin mutations  
- `order_status_history` for order transitions  
- Sentry with sensitive field scrubbing  
- Never log decrypted payloads  

---

## 10. Pre-launch checklist

- [ ] Service role key not in client bundle (inspect build)  
- [ ] RLS denies anon on `delivery_inventory`  
- [ ] Admin routes blocked for customers  
- [ ] Guest token cannot enumerate orders  
- [ ] Storage buckets policies verified  
- [ ] Encryption roundtrip tested  
- [ ] Sentry scrubbing configured  

---

*Implementation: [IMPLEMENTATION_RULES.md](./IMPLEMENTATION_RULES.md)*
