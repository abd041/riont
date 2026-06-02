import { getAdminSiteSettings } from "@/server/services/admin-catalog.service";
import { AdminSettingsForm } from "@/features/admin/components/admin-settings-form";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminSettingsPage() {
  const settings = await getAdminSiteSettings();

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Site settings"
        description="Payment instructions and support contact shown to customers."
      />
      <AdminSettingsForm settings={settings} />
    </AdminPageShell>
  );
}
