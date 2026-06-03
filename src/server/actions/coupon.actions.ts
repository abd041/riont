"use server";

import { quoteCoupon, type CouponErrorCode } from "@/server/services/coupon.service";

export type QuoteCouponResult =
  | { success: true; code: string; discountCents: number }
  | { success: false; code: CouponErrorCode };

export async function quoteCouponAction(
  code: string,
  subtotalCents: number,
): Promise<QuoteCouponResult> {
  const result = await quoteCoupon(code, subtotalCents);
  if (!result.success) {
    return { success: false, code: result.code };
  }
  return {
    success: true,
    code: result.quote.code,
    discountCents: result.quote.discountCents,
  };
}
