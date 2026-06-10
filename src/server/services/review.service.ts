import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env/public";
import type {
  SubmitProductReviewInput,
  SubmitStoreReviewInput,
} from "@/validations/review.schema";

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

type ReviewRow = {
  id: string;
  author_name: string;
  rating: number;
  body: string;
  created_at: string;
};

function mapReviewRows(rows: ReviewRow[]): ProductReview[] {
  return rows.map((r) => ({
    id: r.id,
    authorName: r.author_name,
    rating: r.rating,
    body: r.body,
    createdAt: r.created_at,
  }));
}

/** Approved store + product reviews for homepage carousel. */
export async function listFeaturedReviews(
  locale: string,
  limit = 6,
): Promise<ProductReview[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const select = "id, author_name, rating, body, created_at";

  const [storeResult, productResult] = await Promise.all([
    supabase
      .from("store_reviews")
      .select(select)
      .eq("is_approved", true)
      .eq("locale", locale)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("product_reviews")
      .select(select)
      .eq("is_approved", true)
      .eq("locale", locale)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  const merged = [
    ...mapReviewRows((storeResult.data ?? []) as ReviewRow[]),
    ...mapReviewRows((productResult.data ?? []) as ReviewRow[]),
  ];

  const seen = new Set<string>();
  const unique = merged.filter((review) => {
    if (seen.has(review.id)) return false;
    seen.add(review.id);
    return true;
  });

  return unique
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

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

export async function submitCustomerProductReview(
  input: SubmitProductReviewInput,
  userId?: string | null,
  profileName?: string | null,
): Promise<{ success: true } | { success: false; code: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, code: "NOT_CONFIGURED" };
  }

  const admin = createAdminClient();

  if (userId) {
    const { data: existing } = await admin
      .from("product_reviews")
      .select("id")
      .eq("product_id", input.productId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      return { success: false, code: "ALREADY_REVIEWED" };
    }
  }

  const authorName =
    input.authorName?.trim() ||
    profileName?.trim() ||
    (userId ? "Customer" : "");

  if (!authorName) {
    return { success: false, code: "NAME_REQUIRED" };
  }

  if (!userId && !input.guestEmail?.trim()) {
    return { success: false, code: "EMAIL_REQUIRED" };
  }

  const { error } = await admin.from("product_reviews").insert({
    product_id: input.productId,
    user_id: userId ?? null,
    guest_email: userId ? null : input.guestEmail?.trim() || null,
    author_name: authorName,
    rating: input.rating,
    body: input.body.trim(),
    locale: input.locale,
    is_approved: false,
    sort_order: 0,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false, code: "ALREADY_REVIEWED" };
    }
    return { success: false, code: "INTERNAL" };
  }

  return { success: true };
}

export async function submitCustomerStoreReview(
  input: SubmitStoreReviewInput,
  userId?: string | null,
  profileName?: string | null,
): Promise<{ success: true } | { success: false; code: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, code: "NOT_CONFIGURED" };
  }

  const admin = createAdminClient();

  if (userId) {
    const { data: existing } = await admin
      .from("store_reviews")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      return { success: false, code: "ALREADY_REVIEWED" };
    }
  } else if (input.guestEmail?.trim()) {
    const { data: existing } = await admin
      .from("store_reviews")
      .select("id")
      .eq("guest_email", input.guestEmail.trim())
      .maybeSingle();

    if (existing) {
      return { success: false, code: "ALREADY_REVIEWED" };
    }
  }

  const authorName =
    input.authorName?.trim() ||
    profileName?.trim() ||
    (userId ? "Customer" : "");

  if (!authorName) {
    return { success: false, code: "NAME_REQUIRED" };
  }

  if (!userId && !input.guestEmail?.trim()) {
    return { success: false, code: "EMAIL_REQUIRED" };
  }

  const { error } = await admin.from("store_reviews").insert({
    user_id: userId ?? null,
    guest_email: userId ? null : input.guestEmail?.trim() || null,
    author_name: authorName,
    rating: input.rating,
    body: input.body.trim(),
    locale: input.locale,
    is_approved: false,
    sort_order: 0,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false, code: "ALREADY_REVIEWED" };
    }
    return { success: false, code: "INTERNAL" };
  }

  return { success: true };
}
