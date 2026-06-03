-- RLS for product_reviews (public read approved; admin full access via service role)

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_reviews_public_read ON product_reviews
  FOR SELECT TO anon, authenticated
  USING (is_approved = TRUE);
