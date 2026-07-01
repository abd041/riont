"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Home, ImageIcon, Palette, Store } from "lucide-react";
import type { SiteRuntimeSettings } from "@/server/services/site-runtime.service";
import { AdminBrandingForm } from "./admin-branding-form";
import { AdminThemeForm } from "./admin-theme-form";
import { AdminStoreControlsForm } from "./admin-store-controls-form";
import { AdminHeroSlideContentForm } from "./admin-hero-slide-content-form";
import { AdminPromoBannerForm } from "./admin-promo-banner-form";
import { AdminStorefrontPreview } from "./admin-storefront-preview";

type AppearanceTab = "branding" | "homepage" | "colors" | "storefront";

const TABS: Array<{
  id: AppearanceTab;
  label: string;
  description: string;
  icon: typeof ImageIcon;
}> = [
  {
    id: "branding",
    label: "Branding",
    description: "Logo & homepage images",
    icon: ImageIcon,
  },
  {
    id: "homepage",
    label: "Homepage",
    description: "Promo strip & hero slide text",
    icon: Home,
  },
  {
    id: "colors",
    label: "Colors",
    description: "Solid colors, gradients & accent",
    icon: Palette,
  },
  {
    id: "storefront",
    label: "Storefront",
    description: "Footer, social & maintenance",
    icon: Store,
  },
];

function presetLabel(preset: SiteRuntimeSettings["preset"]): string {
  return preset === "geist-dark" ? "Geist Dark" : "Bronze";
}

export function AdminAppearanceShell({
  runtime,
}: {
  runtime: SiteRuntimeSettings;
}) {
  const [tab, setTab] = useState<AppearanceTab>("branding");

  const slideCount = Object.keys(runtime.heroSlideImages).length;
  const hasCustomLogo = Boolean(runtime.logoUrl);
  const hasCustomHero = Boolean(runtime.heroBackgroundUrl);
  const customHeroCopy = Object.keys(runtime.heroSlideContent).length;

  return (
    <div className="admin-appearance">
      <div className="admin-appearance-overview">
        <div className="admin-appearance-overview__main">
          <p className="admin-appearance-overview__eyebrow">Live storefront</p>
          <h2 className="admin-appearance-overview__title">
            Changes here update the public shop instantly after you save.
          </h2>
          <ul className="admin-appearance-overview__stats">
            <li>
              <span>Theme</span>
              <strong>{presetLabel(runtime.preset)}</strong>
            </li>
            <li>
              <span>Logo</span>
              <strong>{hasCustomLogo ? "Custom" : "Default"}</strong>
            </li>
            <li>
              <span>Hero cover</span>
              <strong>{hasCustomHero ? "Custom" : "Default"}</strong>
            </li>
            <li>
              <span>Hero slides</span>
              <strong>
                {slideCount > 0 ? `${slideCount} custom` : "Default"}
              </strong>
            </li>
            <li>
              <span>Hero copy</span>
              <strong>
                {customHeroCopy > 0 ? `${customHeroCopy} slides` : "Default"}
              </strong>
            </li>
            <li>
              <span>Gradients</span>
              <strong>
                {Object.values(runtime.gradients).filter((g) => g.enabled).length}{" "}
                active
              </strong>
            </li>
          </ul>
        </div>
        <div className="admin-appearance-overview__actions">
          <Link
            href="/en"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-appearance-link"
          >
            Preview English
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link
            href="/ar"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-appearance-link"
          >
            Preview Arabic
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>

      <nav className="admin-appearance-tabs" aria-label="Appearance sections">
        {TABS.map(({ id, label, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={
              tab === id
                ? "admin-appearance-tab admin-appearance-tab--active"
                : "admin-appearance-tab"
            }
            aria-selected={tab === id}
            onClick={() => setTab(id)}
          >
            <Icon className="admin-appearance-tab__icon" strokeWidth={1.75} />
            <span className="admin-appearance-tab__text">
              <span className="admin-appearance-tab__label">{label}</span>
              <span className="admin-appearance-tab__desc">{description}</span>
            </span>
          </button>
        ))}
      </nav>

      <div className="admin-appearance-workspace">
        <div className="admin-appearance-panel">
          {tab === "branding" && (
            <AdminBrandingForm
              heroBackgroundUrl={runtime.heroBackgroundUrl}
              heroSlideImages={runtime.heroSlideImages}
              logoUrl={runtime.logoUrl}
            />
          )}
          {tab === "homepage" && (
            <>
              <AdminPromoBannerForm
                config={{
                  features: runtime.features,
                  socialLinks: runtime.socialLinks,
                  supportWhatsapp: runtime.supportWhatsapp,
                }}
              />
              <AdminHeroSlideContentForm
                heroSlideContent={runtime.heroSlideContent}
              />
            </>
          )}
          {tab === "colors" && (
            <AdminThemeForm
              preset={runtime.preset}
              tokens={runtime.tokens}
              gradients={runtime.gradients}
            />
          )}
          {tab === "storefront" && (
            <AdminStoreControlsForm
              config={{
                features: runtime.features,
                socialLinks: runtime.socialLinks,
                supportWhatsapp: runtime.supportWhatsapp,
              }}
            />
          )}
        </div>
        <AdminStorefrontPreview />
      </div>
    </div>
  );
}
