import { getTranslations } from "next-intl/server";
import { MarketplaceProductCard } from "./marketplace-product-card";
import type { CatalogProduct } from "@/types/catalog";

export async function ProductDetailRelated({
  products,
}: {
  products: CatalogProduct[];
}) {
  const t = await getTranslations("product");

  if (products.length === 0) return null;

  return (
    <section className="nex-pdp-related">
      <h2 className="nex-pdp-related__title">{t("relatedProducts")}</h2>
      <div className="nex-pdp-related__grid">
        {products.map((product) => (
          <MarketplaceProductCard key={product.id ?? product.slug} {...product} />
        ))}
      </div>
    </section>
  );
}
