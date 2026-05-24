import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { listCategories } from "@/server/services/category.service";
import { CategoryCard } from "@/features/catalog/components/category-card";
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
    title: `${t("title")} | riont`,
    description:
      locale === "ar"
        ? "تصفّح تصنيفات المنتجات الرقمية — ألعاب، برامج، اشتراكات والمزيد."
        : "Browse digital product categories — gaming, software, subscriptions, and more.",
  });
}

export default async function CategoriesPage() {
  const t = await getTranslations("categories");
  const locale = await getLocale();
  const categories = await listCategories(locale);

  return (
    <div className="mx-auto max-w-content">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            productCountLabel={t("productCount", { count: category.productCount })}
          />
        ))}
      </div>
    </div>
  );
}
