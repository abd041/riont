import { createAdminClient } from "@/lib/supabase/admin";
import {
  type SocialLinks,
  type StoreFeatures,
  type StoreRuntimeConfig,
} from "@/lib/site/store-config";
import {
  getAdminSiteRuntimeSettings,
  getSiteRuntimeSettings,
} from "@/server/services/site-runtime.service";

export async function getStoreRuntimeConfig(): Promise<StoreRuntimeConfig> {
  const s = await getSiteRuntimeSettings();
  return {
    features: s.features,
    socialLinks: s.socialLinks,
    supportWhatsapp: s.supportWhatsapp,
  };
}

export async function getAdminStoreRuntimeConfig(): Promise<StoreRuntimeConfig> {
  const s = await getAdminSiteRuntimeSettings();
  return {
    features: s.features,
    socialLinks: s.socialLinks,
    supportWhatsapp: s.supportWhatsapp,
  };
}

export async function updateStoreConfig(input: {
  features: StoreFeatures;
  socialLinks: SocialLinks;
}): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .update({
      store_features: input.features,
      social_links: input.socialLinks,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (error) throw error;
}
