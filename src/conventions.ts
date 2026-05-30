/**
 * Project architecture conventions (riont marketplace).
 *
 * LAYERS
 * - app/          → Routes only (RSC pages, layouts, metadata)
 * - features/     → Domain UI + feature logic (components, hooks, types)
 * - server/       → Server Actions + data services (Supabase)
 * - components/   → Global reusable UI (ui/, layout/, shared/)
 * - store/        → Zustand client state (cart, wishlist, UI)
 * - hooks/        → Shared React hooks
 * - constants/    → Design tokens, storage keys, locale config
 * - utils/        → Pure helpers (cn, format, slug, RTL)
 * - types/        → Shared domain types (catalog, orders, auth)
 * - validations/  → Zod schemas
 * - lib/          → Infrastructure (Supabase, auth, email, env)
 * - services/     → Client-side service stubs (server data → server/services/)
 *
 * FEATURE MODULES
 * - homepage, products, categories, cart, checkout, auth, orders, support, admin, shared
 *
 * RULES
 * - Marketplace-specific UI lives in features/, not components/
 * - Server Components by default; "use client" only when needed
 * - Persist cart/wishlist via Zustand; ephemeral UI via useUIStore
 * - Import domain types from @/types/* (not feature folders) in server code
 */

export {};
