-- Public read-only RLS for site_settings + hero slide image paths

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS hero_slides JSONB NOT NULL DEFAULT '{}';

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS site_settings_public_read ON site_settings;
CREATE POLICY site_settings_public_read ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);
