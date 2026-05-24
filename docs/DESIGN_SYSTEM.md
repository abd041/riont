# Premium Digital Marketplace — Design System

> **Status:** Pre-implementation foundation  
> **References:** NIGHT MARKET storefront, riont multi-screen platform, dashboard UI board  
> **Goal:** Cohesive luxury SaaS / gaming-dashboard / crypto-marketplace aesthetic — not generic ecommerce

---

## 1. Design principles

| Principle | Implementation |
|-----------|----------------|
| **Expensive, not loud** | Dark layers, restrained glow, one accent family (purple) |
| **Information-dense, not crowded** | Compact spacing scale, clear hierarchy, scannable grids |
| **Fast feel** | 150–250ms transitions, skeleton loaders, optimistic UI |
| **Dashboard-native** | Sidebar + top bar on all authenticated surfaces |
| **Product-first** | Hero → trust → categories → products above the fold |
| **RTL-native** | Logical properties, mirrored nav, Arabic typography — not CSS `scaleX(-1)` hacks |

**Avoid:** Bootstrap-default cards, white backgrounds, heavy drop shadows, rainbow accents, bouncy animations, Shopify-clone layouts.

---

## 2. Color tokens

### 2.1 Core palette (CSS variables)

```css
/* Backgrounds — layered depth */
--bg-void:        #000000;   /* Deepest canvas */
--bg-base:        #050508;   /* App shell */
--bg-elevated:    #0a0a0f;   /* Main content area */
--bg-surface:     #0f0f16;   /* Cards, panels */
--bg-surface-2:   #14141e;   /* Nested cards, table rows */
--bg-overlay:     rgba(10, 10, 15, 0.85);

/* Borders */
--border-subtle:  rgba(255, 255, 255, 0.06);
--border-default: rgba(255, 255, 255, 0.10);
--border-strong:  rgba(255, 255, 255, 0.14);
--border-glow:    rgba(139, 92, 246, 0.35);

/* Purple accent system */
--accent-50:      #f5f3ff;
--accent-100:     #ede9fe;
--accent-400:     #a78bfa;
--accent-500:     #8b5cf6;   /* Primary neon */
--accent-600:     #7c3aed;
--accent-700:     #6d28d9;
--accent-glow:    rgba(139, 92, 246, 0.45);
--accent-glow-sm: rgba(139, 92, 246, 0.20);

/* Gradients */
--gradient-primary:   linear-gradient(135deg, #8b5cf6 0%, #6d28d9 50%, #5b21b6 100%);
--gradient-hero:      linear-gradient(135deg, rgba(139,92,246,0.15) 0%, transparent 60%);
--gradient-card-edge: linear-gradient(180deg, rgba(139,92,246,0.08) 0%, transparent 100%);
--gradient-glass:     linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);

/* Semantic */
--success:        #22c55e;
--success-muted:  rgba(34, 197, 94, 0.15);
--warning:        #f59e0b;
--warning-muted:  rgba(245, 158, 11, 0.15);
--error:          #ef4444;
--error-muted:    rgba(239, 68, 68, 0.15);
--info:           #3b82f6;

/* Typography */
--text-primary:   #ffffff;
--text-secondary: rgba(255, 255, 255, 0.72);
--text-muted:     rgba(255, 255, 255, 0.45);
--text-disabled:  rgba(255, 255, 255, 0.28);
--text-accent:    #c4b5fd;
```

### 2.2 Surface layering model

```
void (0) → base (1) → elevated (2) → surface (3) → surface-2 (4) → glass overlay
```

Each layer uses `+1` border opacity and optional top-edge highlight (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.04)`).

### 2.3 Glow system

| Token | Use |
|-------|-----|
| `glow-sm` | `0 0 12px var(--accent-glow-sm)` — inputs on focus |
| `glow-md` | `0 0 24px var(--accent-glow-sm)` — cards on hover |
| `glow-lg` | `0 0 40px var(--accent-glow)` — hero CTA, featured product |
| `glow-ring` | `0 0 0 1px var(--border-glow), 0 0 20px var(--accent-glow-sm)` — active nav |

---

## 3. Typography

### 3.1 Font stack

| Role | LTR | RTL (Arabic) |
|------|-----|--------------|
| Display / UI | **Inter** or **Geist Sans** | **IBM Plex Sans Arabic** or **Cairo** |
| Mono (order IDs, codes) | **JetBrains Mono** | Same |

Load via `next/font` with `subsets: ['latin', 'arabic']`.

### 3.2 Type scale

| Token | Size | Weight | Line-height | Use |
|-------|------|--------|-------------|-----|
| `display-xl` | 3rem (48px) | 700 | 1.1 | Hero headlines |
| `display-lg` | 2.25rem (36px) | 700 | 1.15 | Section heroes |
| `heading-lg` | 1.5rem (24px) | 600 | 1.25 | Page titles |
| `heading-md` | 1.25rem (20px) | 600 | 1.3 | Card headers |
| `heading-sm` | 1rem (16px) | 600 | 1.4 | Subsections |
| `body-md` | 0.875rem (14px) | 400 | 1.5 | Default body |
| `body-sm` | 0.8125rem (13px) | 400 | 1.45 | Meta, captions |
| `label` | 0.75rem (12px) | 500 | 1.2 | Badges, table headers |
| `overline` | 0.6875rem (11px) | 600 | 1.2 | Section labels (uppercase, tracking +0.08em) |

### 3.3 Typography rules

- Headlines: white, tight tracking (`-0.02em`), accent words use `text-accent` or gradient clip
- Body: `--text-secondary`; never pure white for paragraphs
- Prices: `heading-md` + `font-variant-numeric: tabular-nums`
- Arabic: increase line-height +4% on `body-*`; avoid uppercase overlines in AR — use semibold labels instead

---

## 4. Spacing & layout

### 4.1 Spacing scale (4px base)

`0, 1(4), 2(8), 3(12), 4(16), 5(20), 6(24), 8(32), 10(40), 12(48), 16(64), 20(80), 24(96)`

**Compact professional default:** section gaps `6–8`, card padding `4–5`, grid gap `4`.

### 4.2 Layout constants

| Token | Value |
|-------|-------|
| `--sidebar-width` | 240px (collapsed: 72px) |
| `--topbar-height` | 64px |
| `--content-max` | 1440px |
| `--radius-sm` | 6px |
| `--radius-md` | 10px |
| `--radius-lg` | 14px |
| `--radius-xl` | 18px |
| `--radius-full` | 9999px |

### 4.3 Grid

- Storefront product grid: `repeat(auto-fill, minmax(200px, 1fr))` desktop; `minmax(160px, 1fr)` tablet; 2-col mobile
- Category grid: `repeat(auto-fill, minmax(140px, 1fr))`
- Admin stats row: 4 equal columns → 2 → 1

### 4.4 App shell (storefront + account)

```
┌──────────┬────────────────────────────────────────┐
│ Sidebar  │ Topbar (search | actions | balance)    │
│  240px   ├────────────────────────────────────────┤
│          │ Main content (scroll)                  │
│          │                                        │
│ promo    │                                        │
│ user     │                                        │
└──────────┴────────────────────────────────────────┘
```

**Admin shell:** Same structure; sidebar icons + labels; denser table area.

---

## 5. Effects & glassmorphism

```css
.glass-panel {
  background: var(--gradient-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
}

.glass-card {
  background: rgba(15, 15, 22, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-default);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
}
```

**Hero ambient:** radial gradient blob `400px` at 70% 30%, `rgba(139,92,246,0.12)`, `filter: blur(80px)`, `pointer-events: none`.

---

## 6. Component specifications

### 6.1 Button

| Variant | Style |
|---------|-------|
| `primary` | `--gradient-primary`, white text, `glow-sm` hover → `glow-md` |
| `secondary` | `bg-surface`, border default, hover border-glow |
| `ghost` | transparent, hover `bg-surface` |
| `danger` | error muted bg, error text |
| `icon` | 36×36, radius-md, ghost |

- Height: `40px` (default), `36px` (sm), `48px` (lg)
- Padding: `px-5` default
- Transition: `all 200ms cubic-bezier(0.4, 0, 0.2, 1)`
- Disabled: 40% opacity, no glow

### 6.2 Input / Select / Textarea

- Background: `--bg-surface`
- Border: `--border-default`
- Radius: `--radius-md`
- Height input: `40px`; textarea min `96px`
- Focus: `border-glow` + `glow-sm` + outline none
- Placeholder: `--text-muted`

### 6.3 Card (product, stat, generic)

```
Structure:
┌─────────────────────────┐
│ [badge]        [action] │  optional
│                         │
│      media / icon       │
│                         │
│ title                   │
│ meta · rating           │
│ price          [button] │
└─────────────────────────┘
```

- Base: `glass-card`, radius-lg, padding-4
- Hover: `translateY(-2px)`, `glow-md`, border → `border-glow` (200ms)
- Product card: centered logo 48–64px, price in accent-400, "Instant" pill

### 6.4 Badge / Status pill

| Status | BG | Text |
|--------|-----|------|
| Active / Completed / DELIVERED | success-muted | success |
| Pending review / Awaiting payment | warning-muted | warning |
| Processing / On hold | info or warning | accent or warning |
| Cancelled / Failed | error-muted | error |
| Best seller | accent glow sm | accent-400 |

- Height: 22px, px-2.5, radius-full, label size

### 6.5 Sidebar nav item

- Height: 40px, radius-md, gap-3 icon+label
- Default: text-muted, icon 20px stroke 1.5
- Active: `bg` rgba(139,92,246,0.15), text-primary, `glow-ring`, icon accent-500
- Hover (inactive): bg-surface-2

### 6.6 Topbar

- Search: max-w-xl, centered, glass input, icon inset-start
- Actions: icon buttons 40px, notification dot accent-500, cart badge
- Locale switcher: compact EN | AR toggle (MVP — no wallet balance chip)

### 6.7 Table (admin)

- Header: overline labels, bg-surface, sticky top
- Row height: 52px compact / 60px comfortable
- Row hover: bg-surface-2
- Cell padding: px-4
- Actions: icon ghost cluster at row end

### 6.8 Tabs (product detail, admin forms)

- Underline style: inactive muted, active accent-500 2px bottom border + glow-sm
- Panel fade-in: 200ms opacity

### 6.9 Modal / Drawer

- Overlay: `--bg-overlay` + blur 4px
- Panel: bg-elevated, radius-xl, border default, max-w-lg (modal) / 480px slide (drawer cart)
- Enter: scale 0.96→1 + opacity, 250ms spring (stiffness 400, damping 30)

### 6.10 Charts (admin)

- Line: accent-500 stroke 2px, gradient fill below 15% opacity
- Grid: border-subtle only
- Tooltip: glass-card, compact

---

## 7. Motion system (Framer Motion)

### 7.1 Durations & easing

| Token | Value |
|-------|-------|
| `instant` | 100ms |
| `fast` | 150ms |
| `normal` | 200ms |
| `slow` | 300ms |
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `ease-spring` | `{ type: "spring", stiffness: 400, damping: 30 }` |

### 7.2 Patterns

```tsx
// Page enter
{ opacity: 0, y: 8 } → { opacity: 1, y: 0 }  // 200ms

// Card hover (CSS + optional motion)
whileHover={{ y: -2 }}

// Stagger children (product grid)
staggerChildren: 0.04, delayChildren: 0.05

// List item
{ opacity: 0, x: -8 } → { opacity: 1, x: 0 }

// Skeleton pulse
animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}
```

### 7.3 Do / Don't

| Do | Don't |
|----|-------|
| Hover glow transitions | Parallax scroll |
| Fade route changes | Slide entire page from far off-screen |
| Scale 0.98 on button press | Bounce loops |
| Skeleton on data fetch | Spinners on every micro-action |

---

## 8. Iconography

- Library: **Lucide React** (consistent 1.5 stroke)
- Size: 16 inline, 20 nav, 24 feature highlights
- Active nav: accent-500 fill optional on key icons only
- Brand logos: official SVG assets in product cards (Netflix, Spotify, etc.) — not emoji substitutes

---

## 9. Imagery & media

- Product heroes: 3D-style renders or high-res brand assets on `bg-surface` with soft purple rim light
- Category tiles: icon + gradient orb background (subtle, not rainbow)
- Avatar: 32px circle, border subtle
- Lazy load below fold; blur placeholder dominant color `#0f0f16`

---

## 10. Accessibility

- Minimum contrast: body text 4.5:1 against surface (muted text on surface-2 only)
- Focus visible: glow-ring on all interactive elements
- `prefers-reduced-motion`: disable transforms, keep opacity fades ≤100ms
- Touch targets: 44×44px minimum on mobile

---

## 11. Tailwind mapping (implementation)

Extend `tailwind.config` theme:

```ts
colors: {
  void: 'var(--bg-void)',
  base: 'var(--bg-base)',
  elevated: 'var(--bg-elevated)',
  surface: { DEFAULT: 'var(--bg-surface)', 2: 'var(--bg-surface-2)' },
  accent: { 400: '...', 500: '...', 600: '...', 700: '...' },
},
boxShadow: {
  'glow-sm': '0 0 12px var(--accent-glow-sm)',
  'glow-md': '0 0 24px var(--accent-glow-sm)',
  'glow-lg': '0 0 40px var(--accent-glow)',
},
backgroundImage: {
  'gradient-primary': 'var(--gradient-primary)',
  'gradient-hero': 'var(--gradient-hero)',
},
```

Use `tailwindcss-logical` or native logical utilities: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`.

---

## 12. Component inventory (build order)

### Phase A — Primitives
`Button`, `Input`, `Select`, `Badge`, `Avatar`, `Skeleton`, `Spinner`

### Phase B — Layout
`AppShell`, `Sidebar`, `Topbar`, `MobileNav`, `PageHeader`, `Container`

### Phase C — Commerce
`ProductCard`, `CategoryCard`, `HeroSection`, `TrustBar`, `PriceDisplay`, `Rating`, `QuantityStepper`, `CartDrawer`, `CouponInput`, `OrderSummary`

### Phase D — Product & checkout
`ProductGallery`, `ProductInfo`, `DynamicFields`, `TabbedContent`, `OrderReviewPanel`, `OrderConfirmation`, `PaymentInstructions` (static CMS content)

### Phase E — Admin
`StatCard`, `DataTable`, `StatusBadge`, `ChartCard`, `FormTabs`, `SlideOverForm`, `ActionMenu`

### Phase F — Feedback
`Toast`, `EmptyState`, `ErrorState`, `ConfirmDialog`

---

## 13. Reference alignment checklist

| Reference element | Spec section |
|-------------------|--------------|
| NIGHT sidebar + promo card | §4.4, §6.5, §6.6 |
| Hero + 3D product visual | §5, Homepage §UX_ARCHITECTURE |
| Trust bar (4 items) | `TrustBar` component |
| Popular products row | §6.3 product card |
| riont product detail split | §UX_ARCHITECTURE product page |
| Admin stats + chart + table | §6.7, §6.10 |
| Order submission + payment instructions | §UX_ARCHITECTURE order flow |
| Mobile bottom nav | §UX_ARCHITECTURE mobile |
| Login social + email | §UX_ARCHITECTURE auth |

---

*UX: [UX_ARCHITECTURE.md](./UX_ARCHITECTURE.md)*  
*Implementation: [IMPLEMENTATION_RULES.md](./IMPLEMENTATION_RULES.md) §6–7*
