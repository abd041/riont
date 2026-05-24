"use client";

import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";

export function AddToCartButton({
  productId,
  slug,
  name,
  imageUrl,
  priceCents,
  variant = "secondary",
  className,
}: {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  priceCents: number;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}) {
  const t = useTranslations("product");
  const { addItem } = useCart();

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={() => {
        addItem({ productId, slug, name, imageUrl, priceCents });
        toast.success(t("addedToCart"));
      }}
    >
      <ShoppingCart className="h-4 w-4" />
      {t("addToCart")}
    </Button>
  );
}
