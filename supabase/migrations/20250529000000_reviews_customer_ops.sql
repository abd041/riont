-- Customer review submission + operational fields

ALTER TABLE product_reviews
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS guest_email TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_reviews_user_product
  ON product_reviews (product_id, user_id)
  WHERE user_id IS NOT NULL;

ALTER TABLE product_reviews
  ALTER COLUMN is_approved SET DEFAULT FALSE;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT;

ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'refunded';
