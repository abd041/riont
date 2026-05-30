"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductMediaItem } from "@/types/catalog";
import { ProductImage } from "./product-image";

export function ProductDetailGallery({
  media,
  productName,
}: {
  media: ProductMediaItem[];
  productName: string;
}) {
  const images = media.filter((m) => m.type === "image");
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) {
    return (
      <div className="nex-pdp-gallery-main relative min-h-[280px]">
        <ProductImage alt={productName} className="absolute inset-0 min-h-[280px]" priority />
      </div>
    );
  }

  const baseThumbs =
    images.length > 0
      ? images
      : [{ type: "image" as const, url: active.url, alt: active.alt }];

  const thumbs =
    baseThumbs.length === 1
      ? Array.from({ length: 5 }, () => baseThumbs[0]!)
      : baseThumbs.slice(0, 5);

  return (
    <div>
      <div className="nex-pdp-gallery-main relative">
        <Image
          src={active.url}
          alt={active.alt ?? productName}
          fill
          className="object-contain p-4"
          sizes="(max-width: 1024px) 100vw, 45vw"
          priority
        />
      </div>
      {thumbs.length > 0 && (
        <div className="nex-pdp-thumbs">
          {thumbs.map((item, index) => (
            <button
              key={`${item.url}-${index}`}
              type="button"
              className={`nex-pdp-thumb relative ${index === activeIndex ? "nex-pdp-thumb--active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={item.alt ?? productName}
              aria-current={index === activeIndex}
            >
              <Image
                src={item.url}
                alt=""
                fill
                className="object-cover"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
