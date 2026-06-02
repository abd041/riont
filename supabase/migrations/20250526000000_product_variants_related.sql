-- Product variants, manual badges, related products

CREATE TYPE product_badge_type AS ENUM (
  'none',
  'bestSeller',
  'instant',
  'hot',
  'trending',
  'limited',
  'offer'
);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS badge product_badge_type NOT NULL DEFAULT 'none';

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name JSONB NOT NULL,
  price_cents INT NOT NULL,
  compare_at_cents INT,
  offer_label JSONB,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product
  ON product_variants (product_id, sort_order);

CREATE TABLE IF NOT EXISTS product_related (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  related_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, related_product_id),
  CHECK (product_id <> related_product_id)
);

ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id),
  ADD COLUMN IF NOT EXISTS variant_name_snapshot JSONB;
