import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { CategoriesBrowseShell } from "@/features/categories/components/categories-browse-shell";
import { listCategories } from "@/server/services/category.service";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  return buildPageMetadata({
    locale,
    path: "/categories",
    title: `${t("browseTitle")} | riont`,
    description:
      locale === "ar"
        ? "تصفّح تصنيفات المنتجات الرقمية — ألعاب، برامج، اشتراكات والمزيد."
        : "Browse digital product categories — gaming, software, subscriptions, and more.",
  });
}

export default async function CategoriesPage() {
  const locale = await getLocale();
  const categories = await listCategories(locale);

  return <CategoriesBrowseShell categories={categories} />;
}
