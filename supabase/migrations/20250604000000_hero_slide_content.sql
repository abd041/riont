-- Per-slide hero copy (EN/AR) editable from Admin → Appearance

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS hero_slide_content JSONB NOT NULL DEFAULT '{}';
