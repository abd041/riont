-- Store feature toggles + editable social links (admin Appearance)

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS store_features JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS social_links JSONB NOT NULL DEFAULT '{}';
