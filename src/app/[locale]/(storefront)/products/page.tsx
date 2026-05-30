import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { ProductsBrowseShell } from "@/features/products/components/products-browse-shell";
import { listProducts, searchProducts } from "@/server/services/product.service";
import { getCategoryBySlug, listCategories } from "@/server/services/category.service";
import type { CatalogProduct } from "@/types/catalog";
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

async function ProductsBrowseContent({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const t = await getTranslations("catalog");
  const locale = await getLocale();
  const { category: categorySlug, q: searchQuery } = searchParams;

  const category = categorySlug
    ? await getCategoryBySlug(locale, categorySlug)
    : null;

  const trimmedQuery = searchQuery?.trim() ?? "";
  const categories = await listCategories(locale);

  let products: CatalogProduct[] = [];
  let error = false;
  try {
    products = trimmedQuery
      ? await searchProducts(locale, trimmedQuery, {
          categorySlug: category?.slug ?? categorySlug,
        })
      : await listProducts(locale, {
          categorySlug: category?.slug ?? categorySlug,
        });
  } catch {
    error = true;
    products = [];
  }

  const pageTitle = trimmedQuery
    ? t("searchResults", { query: trimmedQuery })
    : category
      ? category.name
      : t("browseTitle");

  const showBrowseTitle = !trimmedQuery && !category;

  return (
    <ProductsBrowseShell
      products={products}
      categories={categories}
      activeCategorySlug={category?.slug ?? categorySlug ?? null}
      searchQuery={trimmedQuery}
      pageTitle={pageTitle}
      showBrowseTitle={showBrowseTitle}
      error={error}
    />
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const resolved = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="nex-browse-page">
          <h1 className="nex-browse-title">…</h1>
        </div>
      }
    >
      <ProductsBrowseContent searchParams={resolved} />
    </Suspense>
  );
}
