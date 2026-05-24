-- Public read for active homepage CMS blocks

ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_blocks_public_read ON content_blocks
  FOR SELECT TO anon, authenticated
  USING (is_active = true);
