-- Public read policies for storefront catalog (Week 2)

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY categories_public_read ON categories FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY category_translations_public_read ON category_translations FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM categories c
      WHERE c.id = category_id AND c.is_active = true
    )
  );

CREATE POLICY product_media_public_read ON product_media FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_id AND p.status = 'active'
    )
  );
