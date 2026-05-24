import { getTranslations } from "next-intl/server";
import { CartPage } from "@/features/cart/components/cart-page";

export default async function CartRoutePage() {
  const t = await getTranslations("cart");

  return (
    <div className="mx-auto max-w-content">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <CartPage />
    </div>
  );
}
