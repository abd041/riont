"use client";

import { Sparkles } from "lucide-react";
import { MarketplaceAmbientDecor } from "./marketplace-ambient-decor";

export function PromoBannerShell({ text }: { text: string }) {
  return (
    <div className="mp-promo-banner" role="banner">
      <MarketplaceAmbientDecor variant="promo" />
      <span className="mp-promo-banner__glow" aria-hidden />
      <span className="mp-promo-banner__sheen" aria-hidden />
      <p className="mp-promo-banner__text">
        <Sparkles className="mp-promo-banner__spark" strokeWidth={2} aria-hidden />
        <span>{text}</span>
      </p>
    </div>
  );
}
