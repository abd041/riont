import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env/public";
import {
  type SocialLinks,
  type StoreFeatures,
  type StoreRuntimeConfig,
  parseSocialLinks,
  parseStoreFeatures,
} from "@/lib/site/store-config";

type StoreSettingsRow = {
  store_features: unknown;
  social_links: unknown;
  support_whatsapp: string | null;
};

const STORE_SELECT =
  "store_features, social_links, support_whatsapp";

function buildRuntime(row: StoreSettingsRow | null): StoreRuntimeConfig {
  return {
    features: parseStoreFeatures(row?.store_features),
    socialLinks: parseSocialLinks(row?.social_links),
    supportWhatsapp: row?.support_whatsapp?.trim() || null,
  };
}

export async function getStoreRuntimeConfig(): Promise<StoreRuntimeConfig> {
  if (!isSupabaseConfigured()) {
    return buildRuntime(null);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select(STORE_SELECT)
      .eq("id", "default")
      .maybeSingle();

    if (error) throw error;
    return buildRuntime(data as StoreSettingsRow | null);
  } catch {
    return buildRuntime(null);
  }
}

export async function getAdminStoreRuntimeConfig(): Promise<StoreRuntimeConfig> {
  if (!isSupabaseConfigured()) {
    return buildRuntime(null);
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("site_settings")
      .select(STORE_SELECT)
      .eq("id", "default")
      .maybeSingle();

    if (error) throw error;
    return buildRuntime(data as StoreSettingsRow | null);
  } catch {
    return buildRuntime(null);
  }
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
