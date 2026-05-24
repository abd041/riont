# RTL & Arabic Design Guide

> Arabic (RTL) must feel **natively designed**, not mirrored LTR.  
> Use with [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) logical properties.

---

## 1. Core strategy

1. **`dir="rtl"`** on `<html>` when locale is `ar`
2. **Logical CSS** everywhere — no `left`/`right`/`ml`/`pr` in component code
3. **Separate font stack** for Arabic body text
4. **Copy & layout** adjustments — not only direction flip
5. **Test with real Arabic content** — placeholder English in RTL layouts lies

---

## 2. HTML & Next.js setup

```tsx
// app/[locale]/layout.tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

Use `next-intl`:

- Locales: `en`, `ar`
- Routes: **`/en/...` and `/ar/...` path prefixes** (decided — see [SEO_ARCHITECTURE.md](./SEO_ARCHITECTURE.md))
- Persist locale in cookie + `User.locale`
- Language switcher maps same page across locales via translation slug lookup

---

## 3. Logical properties cheat sheet

| Avoid | Use |
|-------|-----|
| `margin-left` | `margin-inline-start` / `ms-*` |
| `padding-right` | `padding-inline-end` / `pe-*` |
| `text-left` | `text-start` |
| `left: 0` | `inset-inline-start: 0` |
| `border-l` | `border-s` (border-inline-start) |
| `rounded-l-lg` | `rounded-s-lg` |
| `translateX(-100%)` drawer | `translateX` with direction-aware variant |

### Sidebar

| LTR | RTL |
|-----|-----|
| Sidebar on **start** side | Sidebar on **start** side (visually right) |
| Drawer slides from start | Drawer slides from start |
| Cart drawer from end | Cart drawer from end (visually left) |

Collapsible sidebar chevron: flip icon direction in RTL (`ChevronRight` ↔ `ChevronLeft`).

---

## 4. Typography (Arabic)

| Setting | Value |
|---------|-------|
| Font | IBM Plex Sans Arabic or Cairo |
| Body line-height | +0.04–0.06 vs Latin |
| Headings | Avoid `uppercase` + `letter-spacing` — use semibold normal case |
| Numbers in prices | Use `dir="ltr"` on price spans **inside** RTL (`$14.99`, `١٤٫٩٩` per locale) |
| Mixed content | Wrap Latin SKUs, emails in `<span dir="ltr">` |

### Font loading

```ts
const arabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], variable: '--font-ar' });
const latin = Inter({ subsets: ['latin'], variable: '--font-en' });
// Apply font-ar to html[lang=ar]
```

---

## 5. Icons & visuals

| Element | RTL behavior |
|---------|--------------|
| Chevron/back | Mirror |
| Arrow "View all" | Points toward reading direction |
| Checkmarks in lists | Stay at **start** of row |
| Progress stepper | Flow start → end |
| Charts | Keep LTR time axis (industry standard) — label in Arabic below |
| Brand logos | Centered — no flip |
| Hero 3D asset | Can stay on **end** side (opposite headline block) |

---

## 6. Component-specific RTL

### Search input
- Icon `inset-inline-start`
- Text `text-start`

### Product gallery
- Thumbnails scroll horizontally; `scroll-snap` with `direction` inherited

### Tables
- Column order: most important column at **start**
- Action column at **end**

### Modals
- Close button: `inset-inline-end` top corner

### Toast notifications
- Slide in from `inline-end`

### Bottom navigation (mobile)
- Icon order preserved; labels `text-center`

---

## 7. Copy & content

- Use professional Modern Standard Arabic for UI chrome
- Product descriptions: allow seller locale; fallback chain `ar → en`
- **Shorter Arabic labels** for buttons where possible (`شراء` vs long phrases)
- Date formatting: `Intl.DateTimeFormat('ar-SA', ...)` or `ar-EG` per market

---

## 8. Forms

- Labels above inputs (both locales) — clearest for Arabic
- Error messages align `text-start`
- Phone/email fields: `dir="ltr"` inside input
- Password visibility toggle on `inline-end`

---

## 9. Testing checklist

- [ ] Sidebar + main content swap correctly
- [ ] Cart drawer opens from correct side
- [ ] No horizontal overflow on mobile AR
- [ ] Mixed AR/EN product titles wrap cleanly
- [ ] Admin tables scroll with sticky start column
- [ ] Checkout stepper reads 1→2→3 right-to-left
- [ ] Focus rings visible on all controls
- [ ] Screen reader: `lang` attributes on mixed blocks

---

## 10. Anti-patterns

| Bad | Good |
|-----|------|
| `transform: scaleX(-1)` on layout | `dir` + logical CSS |
| Mirror brand logos | Keep original |
| English placeholders in AR QA | Real copy |
| `float: left` for columns | Flex/Grid + logical alignment |
| Hard-coded `ml-4` in Tailwind | `ms-4` |

---

*Stack: Next.js + Supabase — [TECH_STACK.md](./TECH_STACK.md)*  
*Rules: [IMPLEMENTATION_RULES.md](./IMPLEMENTATION_RULES.md)*
