"use client";

import { ProductImage } from "./product-image";
import { cn } from "@/lib/utils/cn";

export function ProductThumbnail({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <ProductImage
      src={src}
      alt={alt}
      className={cn("h-full w-full min-h-[7rem] rounded-[var(--radius-md)]", className)}
      sizes="200px"
    />
  );
}
