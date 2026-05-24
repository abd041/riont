import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProductBySlug } from "@/server/services/product.service";
import { ProductMediaGallery } from "@/features/catalog/components/product-media-gallery";
import { Badge } from "@/components/ui/badge";
import { ProductPurchaseActions } from "@/features/catalog/components/product-purchase-actions";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/storage/media-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(locale, slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return buildPageMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.metaTitle ?? `${product.name} | riont`,
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
  const t = await getTranslations("product");

  if (!product) notFound();

  const productId = product.id ?? slug;

  return (
    <div className="mx-auto max-w-content">
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductMediaGallery media={product.media} productName={product.name} />
        <div>
          {product.badge === "bestSeller" && (
            <Badge variant="accent" className="mb-3">
              {t("bestSeller")}
            </Badge>
          )}
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-[var(--text-muted)]">{product.category}</p>
          {product.shortDescription && (
            <p className="mt-4 text-[var(--text-secondary)]">{product.shortDescription}</p>
          )}
          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              {product.description}
            </p>
          )}
          {product.badge === "instant" && (
            <Badge variant="success" className="mt-3">
              {t("instantDelivery")}
            </Badge>
          )}
          <ProductPurchaseActions
            productId={productId}
            slug={slug}
            name={product.name}
            imageUrl={product.imageUrl ?? null}
            priceCents={product.priceCents}
            compareAtCents={product.compareAtCents}
          />
        </div>
      </div>
    </div>
  );
}
