"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { ServiceError } from "@/lib/domain/errors";
import { getCartCheckoutLines } from "@/server/services/product.service";
import {
  submitCartOrder,
  type OrderServiceErrorCode,
} from "@/server/services/order.service";
import { submitCartOrderSchema } from "@/validations/order.schema";
import type { CartCheckoutLine } from "@/types/order";

export type CartCheckoutActionResult =
  | { success: true }
  | { success: false; code: OrderServiceErrorCode | "VALIDATION" };

function parseItemsJson(raw: unknown) {
  if (typeof raw !== "string" || !raw.length) return null;
  try {
    return JSON.parse(raw) as Array<{
      productSlug: string;
      variantId?: string;
      quantity: number;
      fieldValues?: Record<string, string>;
    }>;
  } catch {
    return null;
  }
}

function parseFieldValuesBySlug(formData: FormData): Record<string, Record<string, string>> {
  const json = formData.get("fieldValuesBySlugJson");
  if (typeof json !== "string" || !json.length) return {};
  try {
    return JSON.parse(json) as Record<string, Record<string, string>>;
  } catch {
    return {};
  }
}

export async function loadCartCheckoutLines(
  locale: string,
  items: Array<{ slug: string; quantity: number; variantId?: string }>,
): Promise<CartCheckoutLine[]> {
  return getCartCheckoutLines(locale, items);
}

export async function submitCartOrderAction(
  _prev: CartCheckoutActionResult | null,
  formData: FormData,
): Promise<CartCheckoutActionResult> {
  const itemsRaw = parseItemsJson(formData.get("itemsJson"));
  const fieldValuesBySlug = parseFieldValuesBySlug(formData);
  const termsRaw = formData.get("termsAccepted");

  if (!itemsRaw?.length) {
    return { success: false, code: "VALIDATION" };
  }

  const items = itemsRaw.map((item) => ({
    productSlug: item.productSlug,
    variantId: item.variantId || undefined,
    quantity: item.quantity,
    fieldValues: fieldValuesBySlug[item.productSlug] ?? item.fieldValues ?? {},
  }));

  const parsed = submitCartOrderSchema.safeParse({
    locale: formData.get("locale"),
    items,
    guestEmail: formData.get("guestEmail") || undefined,
    customerNote: formData.get("customerNote") || undefined,
    couponCode: formData.get("couponCode") || undefined,
    termsAccepted:
      termsRaw === "on" || termsRaw === "true" ? true : undefined,
  });

  if (!parsed.success) {
    return { success: false, code: "VALIDATION" };
  }

  try {
    const result = await submitCartOrder(parsed.data);
    const locale = parsed.data.locale;
    const params = new URLSearchParams({ order: result.orderNumber });
    if (result.guestToken) {
      params.set("token", result.guestToken);
    }
    redirect(`/${locale}/orders/confirmation?${params.toString()}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof ServiceError) {
      if (error.code === "NOT_FOUND") {
        return { success: false, code: "NOT_FOUND" };
      }
      if (error.code === "CONFLICT") {
        return { success: false, code: "OUT_OF_STOCK" };
      }
      if (error.code === "VALIDATION") {
        const msg = error.message;
        if (msg.startsWith("COUPON_")) {
          return { success: false, code: msg as OrderServiceErrorCode };
        }
        return { success: false, code: "VALIDATION" };
      }
    }
    return { success: false, code: "INTERNAL" };
  }
}
