import { listAdminCoupons } from "@/server/services/admin-catalog.service";
import { AdminCouponsPanel } from "@/features/admin/components/admin-coupons-panel";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminCouponsPage() {
  const coupons = await listAdminCoupons();

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Coupons"
        description="Create, edit, and remove discount codes for checkout."
      />
      <AdminCouponsPanel coupons={coupons} />
    </AdminPageShell>
  );
}
