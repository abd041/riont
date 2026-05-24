"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ProductImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 400px",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-surface-2 text-accent-400",
          className,
        )}
      >
        <Package className="h-12 w-12" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-surface-2", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
