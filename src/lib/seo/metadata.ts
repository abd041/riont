import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/storage/media-url";

type PageMetadataInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string | null;
};

function appBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function localizedPath(locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  image,
}: PageMetadataInput): Metadata {
  const base = appBaseUrl();
  const canonicalPath = localizedPath(locale, path);
  const canonical = `${base}${canonicalPath}`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${base}${localizedPath(loc, path)}`;
  }
  languages["x-default"] = `${base}${localizedPath(routing.defaultLocale, path)}`;

  const ogImage = image ? absoluteUrl(image) : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, alt: title }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
