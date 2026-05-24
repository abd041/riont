"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { ServiceError } from "@/lib/domain/errors";
import { submitOrder } from "@/server/services/order.service";
import { submitOrderSchema } from "@/validations/order.schema";
import type { OrderServiceErrorCode } from "@/server/services/order.service";

export type OrderActionResult =
  | { success: true }
  | { success: false; code: OrderServiceErrorCode | "VALIDATION" };

function parseFieldValues(formData: FormData): Record<string, string> {
  const json = formData.get("fieldValuesJson");
  if (typeof json === "string" && json.length > 0) {
    try {
      return JSON.parse(json) as Record<string, string>;
    } catch {
      return {};
    }
  }
  return {};
}

export async function submitOrderAction(
  _prev: OrderActionResult | null,
  formData: FormData,
): Promise<OrderActionResult> {
  const termsRaw = formData.get("termsAccepted");
  const parsed = submitOrderSchema.safeParse({
    productSlug: formData.get("productSlug"),
    locale: formData.get("locale"),
    quantity: formData.get("quantity") ?? 1,
    guestEmail: formData.get("guestEmail") || undefined,
    customerNote: formData.get("customerNote") || undefined,
    couponCode: formData.get("couponCode") || undefined,
    termsAccepted:
      termsRaw === "on" || termsRaw === "true" ? true : undefined,
    fieldValues: parseFieldValues(formData),
  });

  if (!parsed.success) {
    return { success: false, code: "VALIDATION" };
  }

  try {
    const result = await submitOrder(parsed.data);
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
