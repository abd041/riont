import { getAdminSiteRuntimeSettings } from "@/server/services/site-runtime.service";
import { AdminAppearanceShell } from "@/features/admin/components/admin-appearance-shell";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminAppearancePage() {
  const runtime = await getAdminSiteRuntimeSettings();

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Appearance"
        description="Customize how your storefront looks and behaves — organized in three simple sections below."
      />
      <AdminAppearanceShell runtime={runtime} />
    </AdminPageShell>
  );
}
