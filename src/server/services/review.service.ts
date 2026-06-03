import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env/public";

export type ProductReview = {
  id: string;
  authorName: string;
  rating: number;
  body: string;
  createdAt: string;
};

export type ProductReviewSummary = {
  averageRating: number;
  count: number;
  reviews: ProductReview[];
};

export async function getProductReviewSummary(
  productId: string,
  locale: string,
  limit = 12,
): Promise<ProductReviewSummary | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select("id, author_name, rating, body, created_at")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .eq("locale", locale)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return null;

  const reviews = (data ?? []).map((row) => {
    const r = row as {
      id: string;
      author_name: string;
      rating: number;
      body: string;
      created_at: string;
    };
    return {
      id: r.id,
      authorName: r.author_name,
      rating: r.rating,
      body: r.body,
      createdAt: r.created_at,
    };
  });

  if (reviews.length === 0) return { averageRating: 0, count: 0, reviews: [] };

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return { averageRating, count: reviews.length, reviews };
}

export type ProductReviewSummaryBrief = {
  averageRating: number;
  count: number;
};

export async function getReviewSummariesForProducts(
  productIds: string[],
  locale: string,
): Promise<Map<string, ProductReviewSummaryBrief>> {
  const result = new Map<string, ProductReviewSummaryBrief>();
  if (!isSupabaseConfigured() || productIds.length === 0) return result;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select("product_id, rating")
    .in("product_id", productIds)
    .eq("is_approved", true)
    .eq("locale", locale);

  if (error) return result;

  const buckets = new Map<string, number[]>();
  for (const row of data ?? []) {
    const r = row as { product_id: string; rating: number };
    const list = buckets.get(r.product_id) ?? [];
    list.push(r.rating);
    buckets.set(r.product_id, list);
  }

  for (const [productId, ratings] of buckets) {
    const count = ratings.length;
    const averageRating = ratings.reduce((s, n) => s + n, 0) / count;
    result.set(productId, { averageRating, count });
  }

  return result;
}
