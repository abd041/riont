"use client";

import type { ProductMediaItem } from "@/types/catalog";
import { ProductImage } from "./product-image";

export function ProductMediaGallery({
  media,
  productName,
}: {
  media: ProductMediaItem[];
  productName: string;
}) {
  const primary = media[0];

  if (!primary) {
    return (
      <div className="nex-pdp-gallery-main relative min-h-[320px]">
        <ProductImage alt={productName} className="absolute inset-0 min-h-[320px]" priority />
      </div>
    );
  }

  if (primary.type === "video") {
    return (
      <div className="nex-pdp-gallery-main overflow-hidden">
        <video
          src={primary.url}
          controls
          className="aspect-video w-full bg-black"
          aria-label={primary.alt ?? productName}
        />
      </div>
    );
  }

  return (
    <div className="nex-pdp-gallery-main relative min-h-[320px]">
      <ProductImage
        src={primary.url}
        alt={primary.alt ?? productName}
        className="absolute inset-0 min-h-[320px]"
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      {media.length > 1 && (
        <div className="absolute bottom-3 end-3 rounded-md bg-black/50 px-2 py-1 text-xs text-white">
          +{media.length - 1}
        </div>
      )}
    </div>
  );
}
