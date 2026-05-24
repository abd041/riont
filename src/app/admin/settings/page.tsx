import { getAdminSiteSettings } from "@/server/services/admin-catalog.service";
import { AdminSettingsForm } from "@/features/admin/components/admin-settings-form";

export default async function AdminSettingsPage() {
  const settings = await getAdminSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site settings</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Payment instructions and support contact shown to customers.
        </p>
      </div>
      <AdminSettingsForm settings={settings} />
    </div>
  );
}
