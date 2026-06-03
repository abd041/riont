# RIONT — Premium Digital Marketplace

Order management + fulfillment for digital products. Premium dark UI · EN + AR RTL · SEO-first · Supabase backend.

---

## Start here (implementation)

| Priority | Document |
|----------|----------|
| **1** | **[docs/MASTER_ARCHITECTURE.md](docs/MASTER_ARCHITECTURE.md)** — **Final source of truth** |
| **1b** | **[docs/PAYMENT_MODEL.md](docs/PAYMENT_MODEL.md)** — **Payment: external + admin confirm (approved)** |
| **2** | [docs/REQUIREMENTS_ALIGNMENT.md](docs/REQUIREMENTS_ALIGNMENT.md) — **Client requirements vs plan** |
| **3** | [docs/IMPLEMENTATION_RULES.md](docs/IMPLEMENTATION_RULES.md) — Mandatory engineering standards |
| **4** | [docs/MVP_ROADMAP.md](docs/MVP_ROADMAP.md) — Scope + 6-week summary |

---

## Locked stack

Next.js 15 · Supabase (Postgres, Auth, Storage) · Tailwind v4 · Radix · Framer Motion · next-intl · Resend · Sentry · Vercel · (Upstash · Inngest optional)

**Payments:** [External + admin confirm](docs/PAYMENT_MODEL.md) — no in-app payment SDKs (not planned).

---

## Documentation index

| Doc | Topic |
|-----|-------|
| [PAYMENT_MODEL.md](docs/PAYMENT_MODEL.md) | External payment + admin workflow |
| [MASTER_ARCHITECTURE.md](docs/MASTER_ARCHITECTURE.md) | Full plan §1–13 |
| [IMPLEMENTATION_RULES.md](docs/IMPLEMENTATION_RULES.md) | Code standards |
| [TECH_STACK.md](docs/TECH_STACK.md) | Env vars |
| [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) | Services detail |
| [DATABASE_ARCHITECTURE.md](docs/DATABASE_ARCHITECTURE.md) | SQL + RLS |
| [SECURITY.md](docs/SECURITY.md) | Security |
| [SEO_ARCHITECTURE.md](docs/SEO_ARCHITECTURE.md) | Arabic SEO |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | UI tokens |
| [UX_ARCHITECTURE.md](docs/UX_ARCHITECTURE.md) | Flows |
| [RTL_GUIDE.md](docs/RTL_GUIDE.md) | RTL |
| [PRODUCTION_RECOMMENDATIONS.md](docs/PRODUCTION_RECOMMENDATIONS.md) | Ops |

---

## MVP flow

```
Submit order → Admin review → External payment → Admin confirms
  → Fulfillment (auto/manual) → Delivery
```

---

## Sign-off

Development starts only after [MASTER_ARCHITECTURE.md](docs/MASTER_ARCHITECTURE.md) sign-off gate is complete.
