import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listCategories } from "@/server/services/category.service";
import {
  iconForCategory,
  themeForCategorySlug,
} from "@/features/catalog/lib/category-theme";
import { cn } from "@/lib/utils/cn";
import { HomeMotionSection } from "@/features/home/motion/home-motion-section";
import { HomeMotionStagger } from "@/features/home/motion/home-motion-stagger";

export async function HomeCategoryRow() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tCategories = await getTranslations("categories");
  const locale = await getLocale();
  const categories = await listCategories(locale);

  if (categories.length === 0) return null;

  return (
    <HomeMotionSection className="nex-categories-section">
      <div className="nex-categories-header">
        <h2 className="nex-categories-title">{t("browseCategories")}</h2>
        <Link href="/categories" className="nex-categories-view-all">
          {tCommon("viewAll")}
        </Link>
      </div>

      <HomeMotionStagger className="nex-categories-grid">
        {categories.slice(0, 5).map((category, index) => {
          const theme = themeForCategorySlug(category.slug, index);
          const Icon = iconForCategory(category.slug, theme);

          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={cn("nex-cat-card", `nex-cat-card--${theme}`)}
            >
              <span className="nex-cat-icon-wrap" aria-hidden>
                <Icon className="nex-cat-icon" strokeWidth={1.5} />
              </span>
              <span className="nex-cat-text">
                <span className="nex-cat-name">{category.name}</span>
                <span className="nex-cat-count">
                  {tCategories("productCount", { count: category.productCount })}
                </span>
              </span>
            </Link>
          );
        })}
      </HomeMotionStagger>
    </HomeMotionSection>
  );
}
