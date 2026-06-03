import { createAdminClient } from "@/lib/supabase/admin";

export type AdminProductReview = {
  id: string;
  authorName: string;
  rating: number;
  body: string;
  locale: string;
  isApproved: boolean;
  sortOrder: number;
  createdAt: string;
};

export async function listAdminProductReviews(
  productId: string,
): Promise<AdminProductReview[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("product_reviews")
    .select(
      "id, author_name, rating, body, locale, is_approved, sort_order, created_at",
    )
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const r = row as {
      id: string;
      author_name: string;
      rating: number;
      body: string;
      locale: string;
      is_approved: boolean;
      sort_order: number;
      created_at: string;
    };
    return {
      id: r.id,
      authorName: r.author_name,
      rating: r.rating,
      body: r.body,
      locale: r.locale,
      isApproved: r.is_approved,
      sortOrder: r.sort_order,
      createdAt: r.created_at,
    };
  });
}

export async function createAdminProductReview(input: {
  productId: string;
  authorName: string;
  rating: number;
  body: string;
  locale: string;
  sortOrder: number;
  isApproved: boolean;
}): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("product_reviews").insert({
    product_id: input.productId,
    author_name: input.authorName.trim(),
    rating: input.rating,
    body: input.body.trim(),
    locale: input.locale,
    sort_order: input.sortOrder,
    is_approved: input.isApproved,
  });

  if (error) throw error;
}

export async function deleteAdminProductReview(reviewId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("product_reviews").delete().eq("id", reviewId);
  if (error) throw error;
}
