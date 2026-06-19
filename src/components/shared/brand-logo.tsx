import Image from "next/image";

export const BRAND_LOGO = {
  src: "/brand/riyont-logo.png",
  width: 1024,
  height: 559,
} as const;

export const BRAND_LOGO_MARK = {
  src: "/brand/riyont-mark.png",
  width: 830,
  height: 830,
} as const;

type BrandLogoProps = {
  className?: string;
  height?: number;
  priority?: boolean;
  /** Tight-cropped mark for nav/chrome; full wordmark for auth/footer */
  variant?: "full" | "mark";
};

export function BrandLogo({
  className,
  height = 36,
  priority = false,
  variant = "full",
}: BrandLogoProps) {
  const asset = variant === "mark" ? BRAND_LOGO_MARK : BRAND_LOGO;
  const width = Math.round((height * asset.width) / asset.height);

  return (
    <Image
      src={asset.src}
      alt=""
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={100}
      sizes={`${Math.max(width, height)}px`}
      aria-hidden
    />
  );
}
