"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  uploadHeroBackgroundAction,
  clearHeroBackgroundAction,
  uploadSiteLogoAction,
  clearSiteLogoAction,
  uploadHeroSlideImageAction,
  clearHeroSlideImageAction,
  type ThemeActionResult,
} from "@/server/actions/admin-theme.actions";
import { BRAND_LOGO } from "@/components/shared/brand-logo";
import { HERO_SLIDES } from "@/features/homepage/components/hero-slides";
import type { HeroSlideImages } from "@/server/services/site-runtime.service";

const DEFAULT_HERO = "/hero/hero-marketplace-bg.png";

const SLIDE_LABELS: Record<string, string> = {
  "promo-deals": "Slide 1 — Deals",
  "promo-gaming": "Slide 2 — Gaming",
  "promo-instant": "Slide 3 — Instant delivery",
};

export function AdminBrandingForm({
  heroBackgroundUrl,
  heroSlideImages,
  logoUrl,
}: {
  heroBackgroundUrl: string | null;
  heroSlideImages: HeroSlideImages;
  logoUrl: string | null;
}) {
  const router = useRouter();
  const [heroState, heroAction, heroPending] = useActionState<
    ThemeActionResult | null,
    FormData
  >(uploadHeroBackgroundAction, null);
  const [logoState, logoAction, logoPending] = useActionState<
    ThemeActionResult | null,
    FormData
  >(uploadSiteLogoAction, null);
  const [slideState, slideAction, slidePending] = useActionState<
    ThemeActionResult | null,
    FormData
  >(uploadHeroSlideImageAction, null);
  const [clearPending, startClear] = useTransition();

  useEffect(() => {
    if (!heroState) return;
    if (heroState.success) {
      toast.success(heroState.message);
      router.refresh();
    } else toast.error(heroState.error);
  }, [heroState]);

  useEffect(() => {
    if (!logoState) return;
    if (logoState.success) {
      toast.success(logoState.message);
      router.refresh();
    } else toast.error(logoState.error);
  }, [logoState]);

  useEffect(() => {
    if (!slideState) return;
    if (slideState.success) {
      toast.success(slideState.message);
      router.refresh();
    } else toast.error(slideState.error);
  }, [slideState]);

  const heroSrc = heroBackgroundUrl ?? DEFAULT_HERO;
  const logoSrc = logoUrl ?? BRAND_LOGO.src;

  function runClear(action: () => Promise<ThemeActionResult>) {
    startClear(async () => {
      const result = await action();
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="admin-branding-page">
      <section className="admin-panel admin-panel--flat">
        <div className="admin-section-intro">
          <h3 className="font-semibold">Store logo</h3>
          <p className="admin-section-intro__desc">
            Appears in the header, footer, and browser tab (favicon). PNG with a
            transparent background works best. Max 5 MB — JPG, PNG, or WebP.
          </p>
        </div>
        <div className="admin-branding-preview admin-branding-preview--logo">
          <Image
            src={logoSrc}
            alt="Logo preview"
            width={160}
            height={44}
            className="h-11 w-auto object-contain"
            unoptimized={logoSrc.startsWith("http")}
          />
        </div>
        <form action={logoAction} className="mt-4 space-y-3">
          <input
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp"
            className="admin-file-input"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={logoPending || clearPending}>
              {logoPending ? "Uploading…" : "Upload logo"}
            </Button>
            {logoUrl && (
              <Button
                type="button"
                variant="outline"
                disabled={logoPending || clearPending}
                onClick={() => runClear(clearSiteLogoAction)}
              >
                Reset to default
              </Button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-panel admin-panel--flat">
        <div className="admin-section-intro">
          <h3 className="font-semibold">Homepage hero cover</h3>
          <p className="admin-section-intro__desc">
            The main banner behind your homepage hero. Used when a carousel slide
            has no custom image. Recommended: 1600×900 or wider.
          </p>
        </div>
        <div className="admin-branding-preview admin-branding-preview--hero">
          <Image
            src={heroSrc}
            alt="Hero preview"
            fill
            className="object-cover"
            sizes="400px"
            unoptimized={heroSrc.startsWith("http")}
          />
        </div>
        <form action={heroAction} className="mt-4 space-y-3">
          <input
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp"
            className="admin-file-input"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={heroPending || clearPending}>
              {heroPending ? "Uploading…" : "Upload cover image"}
            </Button>
            {heroBackgroundUrl && (
              <Button
                type="button"
                variant="outline"
                disabled={heroPending || clearPending}
                onClick={() => runClear(clearHeroBackgroundAction)}
              >
                Reset to default
              </Button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-panel admin-panel--flat">
        <div className="admin-section-intro">
          <h3 className="font-semibold">Hero carousel slides</h3>
          <p className="admin-section-intro__desc">
            The homepage rotates through 3 promo slides. Upload a unique background
            per slide, or leave empty to use the cover image above.
          </p>
        </div>
        <div className="admin-hero-slides-grid">
          {HERO_SLIDES.map((slide) => {
            const slideSrc =
              heroSlideImages[slide.id] ?? heroBackgroundUrl ?? DEFAULT_HERO;
            const hasCustom = Boolean(heroSlideImages[slide.id]);

            return (
              <div key={slide.id} className="admin-hero-slide-card">
                <p className="admin-hero-slide-card__title">
                  {SLIDE_LABELS[slide.id] ?? slide.id}
                </p>
                {hasCustom ? (
                  <span className="admin-hero-slide-card__badge">Custom image</span>
                ) : (
                  <span className="admin-hero-slide-card__badge admin-hero-slide-card__badge--muted">
                    Using cover
                  </span>
                )}
                <div className="admin-branding-preview admin-branding-preview--hero admin-branding-preview--slide">
                  <Image
                    src={slideSrc}
                    alt={`${SLIDE_LABELS[slide.id] ?? slide.id} preview`}
                    fill
                    className="object-cover"
                    sizes="280px"
                    unoptimized={slideSrc.startsWith("http")}
                  />
                </div>
                <form action={slideAction} className="mt-3 space-y-2">
                  <input type="hidden" name="slideId" value={slide.id} />
                  <input
                    type="file"
                    name="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="admin-file-input admin-file-input--sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={slidePending || clearPending}
                    >
                      {slidePending ? "Uploading…" : "Upload"}
                    </Button>
                    {hasCustom && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={slidePending || clearPending}
                        onClick={() =>
                          runClear(() => clearHeroSlideImageAction(slide.id))
                        }
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
