import type { CartLine } from "@/features/cart/types";

export function cartLineKey(line: Pick<CartLine, "productId" | "variantId">): string {
  return `${line.productId}:${line.variantId ?? ""}`;
}
