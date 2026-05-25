# RIONT vs NEXORA — UI pixel audit & action list

Side-by-side audit: **current implementation** vs **target reference**.

---

## 1. Global / atmosphere

| Aspect | Current (wrong) | Target (correct) | Action |
|--------|-----------------|------------------|--------|
| Page background | Flat `#040404`, weak purple wash | Layered blacks + multiple soft purple radials | Stronger `nex-storefront` gradients |
| Ambient glow | Barely visible | Purple bloom behind hero, cards, sidebar | Add `nex-home-glow` on main column |
| Visual depth | Cards float on flat black | Glass + inner highlight + outer purple bloom | Increase card `box-shadow` layers |
| Border opacity | ~5–6% white, sometimes heavy | ~4–6% white, often glow-defined | Softer borders, glow on hover |
| Premium feel | Dashboard-like | AAA gaming marketplace | Full glow system pass |

---

## 2. Layout proportions

| Element | Current | Target | Action |
|---------|---------|--------|--------|
| Left sidebar | 248px | ~230–250px, denser | Keep ~248px, tighten padding |
| Right sidebar | 272px | ~260–280px | Keep 272px |
| Main max-width | 1440px | ~1440px balanced | OK |
| Section gap | 20px | ~16–20px compact | OK |
| Hero height | ~368px, empty right | ~340–380px, **filled** with art | Fix hero media |
| Featured columns | 3 visible @ typical width | **5** in row | `xl` grid → 5 cols when space allows |
| Categories | 4 cards (data) | **5** in row | 5-col grid (4 items OK) |

---

## 3. Sidebar

| Aspect | Current | Target | Action |
|--------|---------|--------|--------|
| Active item | Gradient, moderate glow | **Solid purple pill** + stronger glow | `nex-nav-link--active` more opaque |
| Item height | 40px | ~38–42px | OK |
| Icon size | 17px | ~16–18px muted | OK |
| Dividers | Visible line | Very subtle | Lower opacity |
| Promo card | Flat gradient, emoji gift | Rich purple, **3D gift**, strong glow | Enhance promo + glow |
| Logo | “R” square | Stylized “N” (brand: keep RIONT) | No change |
| Theme toggle | Present | Compact pill | OK |

---

## 4. Top navbar

| Aspect | Current | Target | Action |
|--------|---------|--------|--------|
| Height | 68px | ~64–72px | OK |
| Search | Dark box, light purple border | **Glass** + purple edge glow + inner shadow | Enhance `nex-search` |
| Ctrl+K badge | Present | Dark pill, crisp | OK |
| Language/currency | Pills | Compact dark glass | OK |
| Cart badge | Only when items > 0 | **Always show** (e.g. “2” in ref) | Show bell always; cart badge when >0 |
| Notifications | Hidden when logged out | **Bell always visible** | Ghost bell for guests |
| Profile | Welcome + avatar | Same hierarchy | OK |

---

## 5. Hero (critical)

| Aspect | Current (wrong) | Target (correct) | Action |
|--------|-----------------|------------------|--------|
| Background | Center purple blob, **empty right** | **Cyber city + soldier** full bleed | Layered images, right-aligned character |
| Soldier | Not visible (overlay kills it) | Prominent right, purple visor glow | `nex-hero-character-wrap` + mask |
| City | Weak / hidden | Neon skyline, rain, purple lights | City layer full cover |
| Overlay | Full-width dark gradient | **Left-only scrim** (~50%), clear right | `nex-hero-scrim-left` width 52% |
| Purple fog | Weak | Strong right-side radial bloom | `nex-hero-atmosphere` |
| Title size | ~2.85rem max | Large, uppercase feel, bold | Slightly larger, uppercase CSS |
| Title line 2 | Purple gradient | Purple–blue gradient + glow | Enhance gradient |
| Badge | Small pill | Compact neon pill | OK |
| Buttons | OK shape | Stronger primary glow | Boost `shadow-btn-primary` |
| Stats | One glass bar | Glass bar, **glowing circle icons** | Brighter stat icons |
| Border radius | 18px | ~16–20px | OK |
| Composition | Text left, dead right | Text left, **art right** | Grid/media layout |

---

## 6. Stats bar

| Aspect | Current | Target | Action |
|--------|---------|--------|--------|
| Container | Single bar, flat | Glass, subtle border, blur | More transparency + blur |
| Icons | Small purple circles | **Glowing** circles | Increase glow radius |
| Dividers | Thin vertical | Subtle separators | OK |
| Typography | 10–11px | Small, muted white | OK |

---

## 7. Category cards

| Aspect | Current | Target | Action |
|--------|---------|--------|--------|
| Count in row | 4 | 5 | 5-col grid |
| Height | ~108px | **~90–100px** compact | Reduce min-height |
| Icon glow | Present but soft | **Strong neon bloom** on card | Increase blur/opacity |
| Card bg | Dark gradient | Glass + subtle border glow | `nex-card` + top edge glow |
| Typography | 12px title | Compact, bold white | OK |

---

## 8. Product cards

| Aspect | Current | Target | Action |
|--------|---------|--------|--------|
| Count | 3 visible | **5** in row | Grid + 5 featured products |
| Card height | ~188px | **~170–185px** tighter | Reduce padding/image |
| Product image | Blurred / placeholder dark | **Clear product art** | Lighter overlay; fix image URLs |
| Discount badge | Purple pill | Neon glowing pill | OK |
| Image area | Heavy bottom fade | Cinematic but **visible** logo | Reduce `::after` opacity |
| Cart button | 34px square | Small purple square, glow | OK |
| Hover | Lift + glow | Lift + border bloom | OK |
| Top edge glow | Weak | Subtle purple rim | `::before` gradient stronger |

---

## 9. Right sidebar

| Aspect | Current | Target | Action |
|--------|---------|--------|--------|
| Why Choose Us | Flat icon boxes | **Glowing** purple icon squares | Stronger `nex-why-icon` |
| Best Sellers | 3 items, OK | Compact rows, sharp thumbs | OK |
| Deals card | Purple gradient | **Deep gradient + treasure/crystal** + CTA glow | Enhance deals card |
| Card padding | p-4 | Slightly tighter | p-3.5–4 |
| Spacing between widgets | gap-4 | ~16px | OK |

---

## 10. Typography

| Aspect | Current | Target | Action |
|--------|---------|--------|--------|
| Hero H1 | Bold, 2 lines | **Extra bold**, tight tracking | `font-weight: 800`, uppercase optional |
| Section labels | 10.5px caps | Small caps, muted | OK |
| Muted text | Slate gray | Lower contrast gray | `rgba(148,163,184,0.65)` |
| Prices | White bold | White, clear | OK |

---

## Implementation checklist (ordered)

- [x] Document audit (this file)
- [x] **Hero:** layered city + soldier (`/public/hero/`), left-only scrim, atmosphere pass
- [x] **Global:** stronger page + main column glow
- [x] **Sidebar:** solid active state, promo glow
- [x] **Navbar:** bell for all users, search glow
- [x] **Categories:** compact + stronger icon bloom
- [x] **Products:** 5-col grid, lighter image mask, clearer thumbnails
- [x] **Right sidebar:** icon/deals glow boost
- [x] **CSS tokens:** shadow/glow intensity bump

---

*After implementation, compare at 1440×900 with browser zoom 100%.*

---

## Phase 2 — Micro-detail refinement (complete)

- [x] Multi-layer glow tokens (`--glow-edge`, `--glow-focus`, `--glow-bloom`)
- [x] Page-wide ambient haze (`nex-storefront::before`, `nex-main::before`)
- [x] Hero: depth grade, character glow, dual fog, light streaks, neon edge, vignette
- [x] Product cards: spec gradient `rgba(139,92,246,0.08) → rgba(10,10,15,0.98)`, image bloom
- [x] Right sidebar: `nex-panel-card`, bestseller row hover, deals crystal bloom
- [x] Typography: tighter hero/section labels, `nex-hero-subtitle`, `nex-product-title`

---

## Phase 3 — AAA realism polish (complete)

- [x] `nexora-aaa-polish.css` — film grain, environmental noise, premium easing
- [x] Hero: depth haze, bloom diffusion, floor mist, rim diffusion, lens, color grade, grain
- [x] Page-wide subtle noise + luminance variation (non-flat blacks)
- [x] Card material: corner specular, glass sheen, soft transitions
- [x] Product art bleed + screen blend + glow spill
- [x] Right sidebar: panel fog, crystal pulse, thumb hover realism

---

## Phase 4 — Authenticity / filmic restraint (complete)

- [x] `nexora-authenticity.css` — moodier grade, toned-down neon, spatial dark pockets
- [x] Hero: figure contact shadow, silhouette feather, hidden harsh streaks/neon
- [x] Restrained violets (dark magenta undertone), softer bloom blur
- [x] Product: normal blend + integration shadow, calmer hover
- [x] Sidebar: denser spacing, no crystal pulse, softer panels
- [x] Inertial motion curves (`0.16, 1, 0.3, 1`)

---

## Reference match pass (NEXORA clarity)

- [x] `nexora-reference-match.css` — overrides fog/bloom overprocessing
- [x] Hero: `/hero/hero.png` at `object-position: 72% 42%`, 3 overlays only
- [x] Tighter hero typography, reduced text glow
- [x] Sharper globals, sidebar, navbar, categories, products, right panel
