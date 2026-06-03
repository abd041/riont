import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProductBySlug } from "@/server/services/product.service";
import { getSession, getProfile } from "@/server/services/auth.service";
import { ProductDetailView } from "@/features/products/components/product-detail-view";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/storage/media-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(locale, slug);
  const tCommon = await getTranslations({ locale, namespace: "common" });

  if (!product) {
    return { title: "Product not found" };
  }

  return buildPageMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.metaTitle ?? `${product.name} | ${tCommon("brand")}`,
    description:
      product.metaDescription ??
      product.shortDescription ??
      product.description ??
      product.name,
    image: product.ogImageUrl ? absoluteUrl(product.ogImageUrl) : null,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const product = await getProductBySlug(locale, slug);

  if (!product) notFound();

  const user = await getSession();
  const profile = user ? await getProfile(user.id) : null;

  return (
    <ProductDetailView
      product={product}
      slug={slug}
      locale={locale}
      isLoggedIn={Boolean(user)}
      userEmail={user?.email}
      userDisplayName={profile?.display_name ?? user?.email?.split("@")[0]}
    />
  );
}
