-- Theme engine + site media paths (appearance admin)

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS theme_preset TEXT NOT NULL DEFAULT 'geist-dark',
  ADD COLUMN IF NOT EXISTS theme_config JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS hero_background_path TEXT,
  ADD COLUMN IF NOT EXISTS logo_path TEXT;
