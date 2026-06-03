import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listCategories } from "@/server/services/category.service";
import { CategoryCard } from "@/features/categories/components/category-card";

export async function PopularCategories() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tCategories = await getTranslations("categories");
  const locale = await getLocale();
  const categories = await listCategories(locale);

  if (categories.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("popularCategories")}</h2>
        <Link
          href="/categories"
          className="text-sm text-accent-400 hover:text-accent-500"
        >
          {tCommon("viewAll")} →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.slice(0, 4).map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            productCountLabel={tCategories("productCount", {
              count: category.productCount,
            })}
          />
        ))}
      </div>
    </section>
  );
}
