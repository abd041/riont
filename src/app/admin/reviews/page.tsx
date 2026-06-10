import { listAdminStoreReviews } from "@/server/services/admin-review.service";
import { AdminStoreReviews } from "@/features/admin/components/admin-store-reviews";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminStoreReviewsPage() {
  const reviews = await listAdminStoreReviews();

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Store reviews"
        description="Moderate homepage store reviews submitted by customers."
      />
      <AdminStoreReviews reviews={reviews} />
    </AdminPageShell>
  );
}
