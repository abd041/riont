-- Store-wide customer reviews (homepage carousel + moderation)

CREATE TABLE IF NOT EXISTS store_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_email TEXT,
  author_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_reviews_homepage
  ON store_reviews (is_approved, locale, sort_order, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_store_reviews_user
  ON store_reviews (user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_store_reviews_guest_email
  ON store_reviews (guest_email)
  WHERE guest_email IS NOT NULL;

ALTER TABLE store_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY store_reviews_public_read ON store_reviews
  FOR SELECT
  USING (is_approved = TRUE);
