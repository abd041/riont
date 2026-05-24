-- RIONT core schema (Phase 1)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE delivery_mode AS ENUM ('auto', 'manual');
CREATE TYPE inventory_status AS ENUM ('available', 'allocated', 'delivered', 'revoked');
CREATE TYPE order_status AS ENUM (
  'pending_review', 'awaiting_payment', 'payment_received',
  'processing', 'delivered', 'completed', 'cancelled',
  'needs_customer_response', 'on_hold'
);
CREATE TYPE order_item_fulfillment_status AS ENUM ('pending', 'allocated', 'delivered', 'failed');
CREATE TYPE delivery_log_type AS ENUM ('auto_delivered', 'manual_delivered', 'resent', 'revoked', 'failed');
CREATE TYPE field_type AS ENUM ('text', 'textarea', 'email', 'password', 'select', 'checkbox', 'radio', 'url', 'number');
CREATE TYPE support_ticket_status AS ENUM ('open', 'waiting_customer', 'waiting_admin', 'resolved', 'closed');
CREATE TYPE support_ticket_type AS ENUM ('general', 'fulfillment', 'order_issue');
CREATE TYPE coupon_type AS ENUM ('percent', 'fixed');
CREATE TYPE media_type AS ENUM ('image', 'video');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  locale TEXT NOT NULL DEFAULT 'en',
  display_name TEXT,
  preferred_currency TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  UNIQUE (category_id, locale),
  UNIQUE (locale, slug)
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id),
  status product_status NOT NULL DEFAULT 'draft',
  delivery_mode delivery_mode NOT NULL DEFAULT 'manual',
  price_cents INT NOT NULL,
  compare_at_cents INT,
  cost_cents INT,
  sort_order INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sales_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  deliverables TEXT,
  requirements TEXT,
  slug TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  UNIQUE (product_id, locale),
  UNIQUE (locale, slug)
);

CREATE TABLE product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  media_type media_type NOT NULL DEFAULT 'image',
  storage_path TEXT NOT NULL,
  alt TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,
  field_type field_type NOT NULL,
  label JSONB NOT NULL,
  help_text JSONB,
  required BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  options JSONB,
  validation JSONB,
  is_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (product_id, field_key)
);

CREATE TABLE delivery_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  status inventory_status NOT NULL DEFAULT 'available',
  payload_encrypted TEXT NOT NULL,
  payload_version INT NOT NULL DEFAULT 1,
  order_item_id UUID,
  allocated_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  imported_batch_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  coupon_type coupon_type NOT NULL,
  value INT NOT NULL,
  min_order_cents INT,
  max_discount_cents INT,
  usage_limit INT,
  usage_count INT NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id),
  guest_email TEXT,
  status order_status NOT NULL DEFAULT 'pending_review',
  subtotal_cents INT NOT NULL,
  discount_cents INT NOT NULL DEFAULT 0,
  total_cents INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  display_currency TEXT,
  display_rate NUMERIC(18, 8),
  total_display_cents INT,
  coupon_id UUID REFERENCES coupons(id),
  coupon_code_snapshot TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  customer_note TEXT,
  admin_note TEXT,
  ip_hash TEXT,
  terms_accepted_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payment_received_at TIMESTAMPTZ,
  processing_started_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name_snapshot JSONB NOT NULL,
  unit_price_cents INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  delivery_mode delivery_mode NOT NULL,
  fulfillment_status order_item_fulfillment_status NOT NULL DEFAULT 'pending',
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE delivery_inventory
  ADD CONSTRAINT delivery_inventory_order_item_id_fkey
  FOREIGN KEY (order_item_id) REFERENCES order_items(id);

CREATE TABLE order_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  product_field_id UUID REFERENCES product_fields(id),
  field_key TEXT NOT NULL,
  field_label_snapshot JSONB NOT NULL,
  value_encrypted TEXT,
  value_plain TEXT,
  is_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status order_status,
  to_status order_status NOT NULL,
  changed_by_user_id UUID REFERENCES profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  log_type delivery_log_type NOT NULL,
  channel TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  delivered_payload_encrypted TEXT,
  admin_user_id UUID REFERENCES profiles(id),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  order_id UUID REFERENCES orders(id),
  order_item_id UUID REFERENCES order_items(id),
  ticket_type support_ticket_type NOT NULL DEFAULT 'general',
  status support_ticket_status NOT NULL DEFAULT 'open',
  subject TEXT NOT NULL,
  assigned_to_id UUID REFERENCES profiles(id),
  priority INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_user_id UUID REFERENCES profiles(id),
  sender_type TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title JSONB NOT NULL,
  body JSONB NOT NULL,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES profiles(id),
  actor_role user_role,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE guest_order_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  payment_instructions_en TEXT,
  payment_instructions_ar TEXT,
  support_email TEXT,
  support_whatsapp TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_key TEXT NOT NULL,
  locale TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (block_key, locale)
);

CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT NOT NULL DEFAULT 'USD',
  target_currency TEXT NOT NULL,
  rate NUMERIC(18, 8) NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (base_currency, target_currency)
);

-- Indexes
CREATE INDEX idx_orders_status_created ON orders (status, created_at DESC);
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
CREATE INDEX idx_inventory_product_status ON delivery_inventory (product_id, status);
CREATE INDEX idx_product_translations_locale_slug ON product_translations (locale, slug);
CREATE INDEX idx_products_status_sort ON products (status, sort_order);

-- Profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, locale)
  VALUES (NEW.id, 'customer', 'en');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY orders_select_own ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY notifications_select_own ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notifications_update_own ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY products_public_read ON products FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY product_translations_public_read ON product_translations FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.status = 'active'));

INSERT INTO site_settings (id) VALUES ('default');
