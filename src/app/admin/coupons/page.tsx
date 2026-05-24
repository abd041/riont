import { listAdminCoupons } from "@/server/services/admin-catalog.service";
import { AdminCouponsPanel } from "@/features/admin/components/admin-coupons-panel";

export default async function AdminCouponsPage() {
  const coupons = await listAdminCoupons();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Coupons</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Create, edit, and remove discount codes for checkout.
        </p>
      </div>

      <AdminCouponsPanel coupons={coupons} />
    </div>
  );
}
