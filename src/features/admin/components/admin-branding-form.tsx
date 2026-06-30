"use client";

import Image from "next/image";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  uploadHeroBackgroundAction,
  clearHeroBackgroundAction,
  uploadSiteLogoAction,
  clearSiteLogoAction,
  type ThemeActionResult,
} from "@/server/actions/admin-theme.actions";
import { BRAND_LOGO } from "@/components/shared/brand-logo";

const DEFAULT_HERO = "/hero/hero-marketplace-bg.png";

export function AdminBrandingForm({
  heroBackgroundUrl,
  logoUrl,
}: {
  heroBackgroundUrl: string | null;
  logoUrl: string | null;
}) {
  const [heroState, heroAction, heroPending] = useActionState<
    ThemeActionResult | null,
    FormData
  >(uploadHeroBackgroundAction, null);
  const [logoState, logoAction, logoPending] = useActionState<
    ThemeActionResult | null,
    FormData
  >(uploadSiteLogoAction, null);
  const [clearPending, startClear] = useTransition();

  useEffect(() => {
    if (!heroState) return;
    if (heroState.success) {
      toast.success(heroState.message);
      window.location.reload();
    } else toast.error(heroState.error);
  }, [heroState]);

  useEffect(() => {
    if (!logoState) return;
    if (logoState.success) {
      toast.success(logoState.message);
      window.location.reload();
    } else toast.error(logoState.error);
  }, [logoState]);

  const heroSrc = heroBackgroundUrl ?? DEFAULT_HERO;
  const logoSrc = logoUrl ?? BRAND_LOGO.src;

  function runClear(action: () => Promise<ThemeActionResult>) {
    startClear(async () => {
      const result = await action();
      if (result.success) {
        toast.success(result.message);
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="admin-branding-grid">
      <section className="admin-panel admin-panel--flat">
        <h3 className="font-semibold">Hero cover image</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Homepage banner background. Recommended: wide image, 1600×900 or larger.
        </p>
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
            className="block w-full text-sm text-[var(--text-muted)] file:me-3 file:rounded-md file:border-0 file:bg-accent-500/15 file:px-3 file:py-2 file:text-sm file:font-medium"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={heroPending || clearPending}>
              {heroPending ? "Uploading…" : "Upload hero image"}
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
        <h3 className="font-semibold">Store logo</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Shown in navigation and footer. PNG with transparent background works best.
        </p>
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
            className="block w-full text-sm text-[var(--text-muted)] file:me-3 file:rounded-md file:border-0 file:bg-accent-500/15 file:px-3 file:py-2 file:text-sm file:font-medium"
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
    </div>
  );
}
