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
      <div className="nex-pdp-gallery-main relative">
        <ProductImage alt={productName} className="absolute inset-0" priority />
      </div>
    );
  }

  const thumbs = images.slice(0, 5);
  const showThumbs = thumbs.length > 1;

  return (
    <div className="nex-pdp-gallery">
      <div className="nex-pdp-gallery-main relative">
        <Image
          src={active.url}
          alt={active.alt ?? productName}
          fill
          className="object-contain p-1.5 md:p-2"
          sizes="(max-width: 767px) 100vw, 360px"
          priority
        />
      </div>
      {showThumbs && (
        <div className="nex-pdp-thumbs" role="list" aria-label={productName}>
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
