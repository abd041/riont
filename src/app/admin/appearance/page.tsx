import { getAdminSiteAppearance } from "@/server/services/theme.service";
import { getAdminStoreRuntimeConfig } from "@/server/services/store-config.service";
import { AdminThemeForm } from "@/features/admin/components/admin-theme-form";
import { AdminBrandingForm } from "@/features/admin/components/admin-branding-form";
import { AdminStoreControlsForm } from "@/features/admin/components/admin-store-controls-form";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminAppearancePage() {
  const [appearance, storeConfig] = await Promise.all([
    getAdminSiteAppearance(),
    getAdminStoreRuntimeConfig(),
  ]);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Appearance"
        description="Theme, branding, and storefront controls — no code changes needed."
      />
      <AdminBrandingForm
        heroBackgroundUrl={appearance.heroBackgroundUrl}
        logoUrl={appearance.logoUrl}
      />
      <AdminStoreControlsForm config={storeConfig} />
      <AdminThemeForm
        preset={appearance.preset}
        tokens={appearance.tokens}
      />
    </AdminPageShell>
  );
}
