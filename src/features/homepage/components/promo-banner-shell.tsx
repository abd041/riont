"use client";

import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MarketplaceAmbientDecor } from "./marketplace-ambient-decor";

export function PromoBannerShell({
  text,
  href,
}: {
  text: string;
  href?: string;
}) {
  const content = (
    <>
      <Sparkles className="mp-promo-banner__spark" strokeWidth={2} aria-hidden />
      <span>{text}</span>
    </>
  );

  return (
    <div className="mp-promo-banner" role="banner">
      <MarketplaceAmbientDecor variant="promo" />
      <span className="mp-promo-banner__glow" aria-hidden />
      <span className="mp-promo-banner__sheen" aria-hidden />
      {href ? (
        <Link href={href} className="mp-promo-banner__text mp-promo-banner__link">
          {content}
        </Link>
      ) : (
        <p className="mp-promo-banner__text">{content}</p>
      )}
    </div>
  );
}
