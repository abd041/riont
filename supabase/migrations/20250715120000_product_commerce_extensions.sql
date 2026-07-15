-- Product commerce extensions: hybrid delivery, availability, fees, trust badges,
-- variant offer ladder, plan highlights, manual daily slots, order fee_cents.

-- 1. Delivery mode: Hybrid
ALTER TYPE delivery_mode ADD VALUE IF NOT EXISTS 'hybrid';

-- 2. Availability status
DO $$ BEGIN
  CREATE TYPE product_availability_status AS ENUM (
    'available_now',
    'out_of_stock',
    'available_soon',
    'service_paused',
    'after_manual_review',
    'coming_soon',
    'manual_busy',
    'limited_availability'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. Extra fee type
DO $$ BEGIN
  CREATE TYPE product_extra_fee_type AS ENUM ('none', 'percent', 'fixed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 4. Plan highlight on variants
DO $$ BEGIN
  CREATE TYPE variant_plan_highlight AS ENUM (
    'none',
    'bestValue',
    'recommended',
    'mostPopular'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 5. Product columns
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS availability_status product_availability_status
    NOT NULL DEFAULT 'available_now',
  ADD COLUMN IF NOT EXISTS extra_fee_type product_extra_fee_type
    NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS extra_fee_value integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS trust_badges jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS manual_daily_slot_limit integer,
  ADD COLUMN IF NOT EXISTS manual_slots_remaining integer,
  ADD COLUMN IF NOT EXISTS manual_slots_date date;

COMMENT ON COLUMN products.extra_fee_value IS
  'Percent: whole percent (5 = 5%). Fixed: fee in cents per unit.';
COMMENT ON COLUMN products.trust_badges IS
  'JSON array of: instantDelivery, warranty, verifiedService, manualSupport, securePayment';
COMMENT ON COLUMN products.manual_daily_slot_limit IS
  'Null = unlimited. Used for manual/hybrid fulfillment capacity.';

-- 6. Variant offer ladder fields
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS benefits jsonb NOT NULL DEFAULT '{"en":[],"ar":[]}'::jsonb,
  ADD COLUMN IF NOT EXISTS plan_highlight variant_plan_highlight
    NOT NULL DEFAULT 'none';

-- 7. Order fee (sum of product extra fees)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS fee_cents integer NOT NULL DEFAULT 0;

ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS fee_cents integer NOT NULL DEFAULT 0;

-- 8. Atomic slot consume helper (manual capacity)
CREATE OR REPLACE FUNCTION consume_manual_slot(
  p_product_id uuid,
  p_quantity integer DEFAULT 1
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  today date := (timezone('utc', now()))::date;
  lim integer;
  rem integer;
  slot_date date;
BEGIN
  IF p_quantity < 1 THEN
    RETURN false;
  END IF;

  SELECT
    manual_daily_slot_limit,
    manual_slots_remaining,
    manual_slots_date
  INTO lim, rem, slot_date
  FROM products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Unlimited when limit is null
  IF lim IS NULL THEN
    RETURN true;
  END IF;

  -- Reset remaining for a new UTC day
  IF slot_date IS DISTINCT FROM today THEN
    rem := lim;
    slot_date := today;
  END IF;

  IF rem IS NULL OR rem < p_quantity THEN
    UPDATE products
    SET
      manual_slots_remaining = COALESCE(rem, 0),
      manual_slots_date = today
    WHERE id = p_product_id;
    RETURN false;
  END IF;

  UPDATE products
  SET
    manual_slots_remaining = rem - p_quantity,
    manual_slots_date = today
  WHERE id = p_product_id;

  RETURN true;
END;
$$;
