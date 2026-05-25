# Hero slider animation

## Active (default — approved)

**Source:** `src/features/home/components/hero-animation.default.ts`  
**UI:** `src/features/home/components/hero-section.tsx`

| Behavior | Setting |
|----------|---------|
| Slide interval | 6.5s |
| Background | Crossfade + scale `1 → 1.06` on inactive |
| Background easing | `[0.22, 1, 0.36, 1]`, 1.35s |
| Text | `AnimatePresence mode="wait"` |
| Text stagger | 0.09s children, 0.12s delay |
| Text motion | Blur + slide up in, slide up out |

Images: `/hero/hero.png`, `/hero/hero-second.png`, `/hero/hero-third.png`

## Archived (not used)

**Source:** `src/features/home/components/archives/hero-animation-premium-polish.archive.ts`

Experimental pass with overlapping text, directional drift, ambient orbs, parallax. Reverted per product request — kept only as reference.

## Changing animation

1. Edit values in `hero-animation.default.ts` only.
2. Do not inline variants in `hero-section.tsx` (import from default module).
3. If trying the archived polish again, copy patterns from the archive file into a new branch and test separately.
