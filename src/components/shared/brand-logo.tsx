import Image from "next/image";

export const BRAND_LOGO = {
  src: "/brand/riyont-logo.png",
  width: 1024,
  height: 559,
} as const;

type BrandLogoProps = {
  className?: string;
  height?: number;
  priority?: boolean;
};

export function BrandLogo({
  className,
  height = 36,
  priority = false,
}: BrandLogoProps) {
  const width = Math.round((height * BRAND_LOGO.width) / BRAND_LOGO.height);

  return (
    <Image
      src={BRAND_LOGO.src}
      alt=""
      width={width}
      height={height}
      className={className}
      priority={priority}
      aria-hidden
    />
  );
}
