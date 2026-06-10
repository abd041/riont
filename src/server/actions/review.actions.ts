"use server";

import { revalidatePath } from "next/cache";
import { getSession, getProfile } from "@/server/services/auth.service";
import {
  submitCustomerProductReview,
  submitCustomerStoreReview,
} from "@/server/services/review.service";
import {
  submitProductReviewSchema,
  submitStoreReviewSchema,
} from "@/validations/review.schema";

export type SubmitReviewActionResult =
  | { success: true }
  | { success: false; code: string };

export async function submitProductReviewAction(
  _prev: SubmitReviewActionResult | null,
  formData: FormData,
): Promise<SubmitReviewActionResult> {
  const parsed = submitProductReviewSchema.safeParse({
    productId: formData.get("productId"),
    locale: formData.get("locale"),
    rating: formData.get("rating"),
    body: formData.get("body"),
    authorName: formData.get("authorName") || undefined,
    guestEmail: formData.get("guestEmail") || undefined,
  });

  if (!parsed.success) {
    return { success: false, code: "VALIDATION" };
  }

  const user = await getSession();
  let profileName = user?.email?.split("@")[0];
  if (user) {
    const profile = await getProfile(user.id);
    profileName = profile?.display_name ?? profileName;
  }

  const result = await submitCustomerProductReview(
    parsed.data,
    user?.id,
    profileName,
  );

  if (!result.success) {
    return result;
  }

  const slug = formData.get("productSlug");
  if (typeof slug === "string" && slug.length > 0) {
    revalidatePath(`/products/${slug}`);
  }

  return { success: true };
}

export async function submitStoreReviewAction(
  _prev: SubmitReviewActionResult | null,
  formData: FormData,
): Promise<SubmitReviewActionResult> {
  const parsed = submitStoreReviewSchema.safeParse({
    locale: formData.get("locale"),
    rating: formData.get("rating"),
    body: formData.get("body"),
    authorName: formData.get("authorName") || undefined,
    guestEmail: formData.get("guestEmail") || undefined,
  });

  if (!parsed.success) {
    return { success: false, code: "VALIDATION" };
  }

  const user = await getSession();
  let profileName = user?.email?.split("@")[0];
  if (user) {
    const profile = await getProfile(user.id);
    profileName = profile?.display_name ?? profileName;
  }

  const result = await submitCustomerStoreReview(
    parsed.data,
    user?.id,
    profileName,
  );

  if (!result.success) {
    return result;
  }

  revalidatePath("/");
  return { success: true };
}
