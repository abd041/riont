import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/features/catalog/components/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { listProducts, searchProducts } from "@/server/services/product.service";
import { getCategoryBySlug } from "@/server/services/category.service";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { category: categorySlug } = await searchParams;
  const t = await getTranslations({ locale, namespace: "nav" });

  if (categorySlug) {
    const category = await getCategoryBySlug(locale, categorySlug);
    if (category) {
      return buildPageMetadata({
        locale,
        path: `/products?category=${categorySlug}`,
        title: category.metaTitle ?? `${category.name} | riont`,
        description:
          category.metaDescription ??
          category.description ??
          t("products"),
        image: category.iconUrl,
      });
    }
  }

  return buildPageMetadata({
    locale,
    path: "/products",
    title: `${t("products")} | riont`,
    description:
      locale === "ar"
        ? "تصفّح كل المنتجات الرقمية — تسليم سريع وأسعار واضحة."
        : "Browse all premium digital products with fast delivery.",
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const t = await getTranslations("nav");
  const tCatalog = await getTranslations("catalog");
  const tErrors = await getTranslations("errors");
  const locale = await getLocale();
  const { category: categorySlug, q: searchQuery } = await searchParams;

  const category = categorySlug
    ? await getCategoryBySlug(locale, categorySlug)
    : null;

  const trimmedQuery = searchQuery?.trim() ?? "";

  let products;
  try {
    products = trimmedQuery
      ? await searchProducts(locale, trimmedQuery, {
          categorySlug: category?.slug ?? categorySlug,
        })
      : await listProducts(locale, {
          categorySlug: category?.slug ?? categorySlug,
        });
  } catch {
    return (
      <div className="mx-auto max-w-content">
        <h1 className="mb-6 text-2xl font-bold">{t("products")}</h1>
        <ErrorState
          title={tCatalog("loadErrorTitle")}
          description={tCatalog("loadErrorDescription")}
        />
      </div>
    );
  }

  const title = trimmedQuery
    ? tCatalog("searchResults", { query: trimmedQuery })
    : category
      ? category.name
      : t("products");

  return (
    <div className="mx-auto max-w-content">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        {categorySlug && (
          <Link
            href="/products"
            className="text-sm text-accent-400 hover:text-accent-500"
          >
            {tCatalog("viewAllProducts")}
          </Link>
        )}
      </div>
      {categorySlug && !category && (
        <p className="mb-4 text-sm text-[var(--text-muted)]">
          {tCatalog("emptyDescription")}
        </p>
      )}
      {products.length === 0 ? (
        <EmptyState
          title={tCatalog("emptyTitle")}
          description={tCatalog("emptyDescription")}
          action={
            <Button asChild>
              <Link href="/">{tErrors("backHome")}</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
