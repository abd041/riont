import { createAdminClient } from "@/lib/supabase/admin";

type CouponRow = {
  id: string;
  code: string;
  coupon_type: "percent" | "fixed";
  value: number;
  min_order_cents: number | null;
  max_discount_cents: number | null;
  usage_limit: number | null;
  usage_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
};

export type CouponQuote = {
  couponId: string;
  code: string;
  discountCents: number;
};

export type CouponErrorCode =
  | "INVALID"
  | "EXPIRED"
  | "INACTIVE"
  | "MIN_ORDER"
  | "USAGE_LIMIT";

export async function quoteCoupon(
  code: string,
  subtotalCents: number,
): Promise<
  | { success: true; quote: CouponQuote }
  | { success: false; code: CouponErrorCode }
> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { success: false, code: "INVALID" };
  }

  const admin = createAdminClient();
  const { data: coupon, error } = await admin
    .from("coupons")
    .select("*")
    .eq("code", normalized)
    .maybeSingle();

  if (error || !coupon) {
    return { success: false, code: "INVALID" };
  }

  const row = coupon as CouponRow;

  if (!row.is_active) {
    return { success: false, code: "INACTIVE" };
  }

  const now = Date.now();
  if (row.starts_at && new Date(row.starts_at).getTime() > now) {
    return { success: false, code: "INACTIVE" };
  }
  if (row.expires_at && new Date(row.expires_at).getTime() < now) {
    return { success: false, code: "EXPIRED" };
  }
  if (row.usage_limit != null && row.usage_count >= row.usage_limit) {
    return { success: false, code: "USAGE_LIMIT" };
  }
  if (row.min_order_cents != null && subtotalCents < row.min_order_cents) {
    return { success: false, code: "MIN_ORDER" };
  }

  let discountCents = 0;
  if (row.coupon_type === "percent") {
    discountCents = Math.floor((subtotalCents * row.value) / 100);
  } else {
    discountCents = row.value;
  }

  if (row.max_discount_cents != null) {
    discountCents = Math.min(discountCents, row.max_discount_cents);
  }

  discountCents = Math.min(discountCents, subtotalCents);

  return {
    success: true,
    quote: {
      couponId: row.id,
      code: row.code,
      discountCents,
    },
  };
}
