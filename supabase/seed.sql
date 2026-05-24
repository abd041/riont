-- Optional dev seed — run after 20250523000000_core.sql

INSERT INTO categories (id, sort_order, icon_url) VALUES
  ('a0000000-0000-4000-8000-000000000001', 1, 'catalog/categories/instagram.jpg'),
  ('a0000000-0000-4000-8000-000000000002', 2, 'catalog/categories/gaming.jpg'),
  ('a0000000-0000-4000-8000-000000000003', 3, 'catalog/categories/software.jpg'),
  ('a0000000-0000-4000-8000-000000000004', 4, 'catalog/categories/subscriptions.jpg')
ON CONFLICT (id) DO UPDATE SET icon_url = EXCLUDED.icon_url;

INSERT INTO category_translations (category_id, locale, name, slug, description, meta_title, meta_description) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'en', 'Instagram Services', 'instagram', 'Growth and verification services for Instagram.', 'Instagram Services | riont', 'Premium Instagram digital services with fast delivery.'),
  ('a0000000-0000-4000-8000-000000000001', 'ar', 'خدمات إنستغرام', 'instagram', 'خدمات النمو والتوثيق لإنستغرام.', 'خدمات إنستغرام | riont', 'خدمات إنستغرام رقمية مميزة مع تسليم سريع.'),
  ('a0000000-0000-4000-8000-000000000002', 'en', 'Gaming', 'gaming', 'Accounts, keys, and in-game digital goods.', 'Gaming | riont', 'Digital gaming products with instant delivery.'),
  ('a0000000-0000-4000-8000-000000000002', 'ar', 'ألعاب', 'gaming', 'حسابات ومفاتيح ومنتجات رقمية للألعاب.', 'ألعاب | riont', 'منتجات ألعاب رقمية مع تسليم فوري.'),
  ('a0000000-0000-4000-8000-000000000003', 'en', 'Software', 'software', 'Licenses and keys for productivity software.', 'Software | riont', 'Software license keys and digital downloads.'),
  ('a0000000-0000-4000-8000-000000000003', 'ar', 'برامج', 'software', 'تراخيص ومفاتيح لبرامج الإنتاجية.', 'برامج | riont', 'مفاتيح ترخيص وبرامج رقمية.'),
  ('a0000000-0000-4000-8000-000000000004', 'en', 'Subscriptions', 'subscriptions', 'Streaming and app subscriptions.', 'Subscriptions | riont', 'Premium subscription codes and renewals.'),
  ('a0000000-0000-4000-8000-000000000004', 'ar', 'اشتراكات', 'subscriptions', 'اشتراكات البث والتطبيقات.', 'اشتراكات | riont', 'أكواد اشتراك بريميوم وتجديدات.')
ON CONFLICT (category_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;

INSERT INTO products (id, category_id, status, delivery_mode, price_cents, compare_at_cents, is_featured, sales_count) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'active', 'manual', 1499, 1999, true, 128),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002', 'active', 'auto', 2999, null, true, 45),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000004', 'active', 'auto', 499, 799, true, 12),
  ('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000003', 'active', 'auto', 1499, null, false, 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_translations (product_id, locale, name, slug, short_description, description, meta_title, meta_description, og_image_url) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'en', 'Instagram Verified Badge', 'instagram-verified-badge', 'Blue verification badge delivery.', 'Get your Instagram profile verified with our premium delivery service. Includes setup guidance and status tracking.', 'Instagram Verified Badge | riont', 'Buy Instagram verification badge delivery — safe, fast, and reliable.', '/catalog/instagram-verified-badge.jpg'),
  ('b0000000-0000-4000-8000-000000000001', 'ar', 'شارة توثيق إنستغرام', 'instagram-verified-badge', 'تسليم شارة التوثيق الزرقاء.', 'احصل على توثيق حسابك في إنستغرام مع خدمة تسليم مميزة تشمل الإرشاد والمتابعة.', 'شارة توثيق إنستغرام | riont', 'شراء شارة توثيق إنستغرام — آمن وسريع وموثوق.', '/catalog/instagram-verified-badge.jpg'),
  ('b0000000-0000-4000-8000-000000000002', 'en', 'Steam Premium Account', 'steam-premium-account', 'Premium Steam account with games.', 'Pre-loaded Steam account with popular titles. Instant credentials delivery after order approval.', 'Steam Premium Account | riont', 'Premium Steam accounts with games — instant digital delivery.', '/catalog/steam-premium-account.jpg'),
  ('b0000000-0000-4000-8000-000000000002', 'ar', 'حساب Steam مميز', 'steam-premium-account', 'حساب Steam مميز مع ألعاب.', 'حساب Steam محمّل بألعاب شائعة مع تسليم فوري للبيانات بعد الموافقة.', 'حساب Steam مميز | riont', 'حسابات Steam مميزة مع ألعاب — تسليم رقمي فوري.', '/catalog/steam-premium-account.jpg'),
  ('b0000000-0000-4000-8000-000000000003', 'en', 'Spotify Premium 1 Year', 'spotify-premium-1year', '12 months premium subscription.', 'Full 12-month Spotify Premium upgrade code. Redeem on your existing account.', 'Spotify Premium 1 Year | riont', 'Spotify Premium 12-month subscription code with instant delivery.', '/catalog/spotify-premium-1year.jpg'),
  ('b0000000-0000-4000-8000-000000000003', 'ar', 'سبوتيفاي بريميوم سنة', 'spotify-premium-1year', 'اشتراك بريميوم لمدة 12 شهراً.', 'كود ترقية Spotify Premium لمدة 12 شهراً — فعّله على حسابك الحالي.', 'سبوتيفاي بريميوم سنة | riont', 'كود Spotify Premium لسنة كاملة مع تسليم فوري.', '/catalog/spotify-premium-1year.jpg'),
  ('b0000000-0000-4000-8000-000000000004', 'en', 'Windows 11 Pro Key', 'windows-11-pro', 'Genuine digital license key.', 'Genuine Windows 11 Pro digital license. One-time activation key delivered instantly.', 'Windows 11 Pro Key | riont', 'Buy Windows 11 Pro license key — genuine digital activation.', '/catalog/windows-11-pro.jpg'),
  ('b0000000-0000-4000-8000-000000000004', 'ar', 'مفتاح Windows 11 Pro', 'windows-11-pro', 'مفتاح ترخيص رقمي أصلي.', 'ترخيص Windows 11 Pro رقمي أصلي — مفتاح تفعيل لمرة واحدة مع تسليم فوري.', 'مفتاح Windows 11 Pro | riont', 'شراء مفتاح Windows 11 Pro — تفعيل رقمي أصلي.', '/catalog/windows-11-pro.jpg')
ON CONFLICT (product_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  og_image_url = EXCLUDED.og_image_url;

DELETE FROM product_media WHERE product_id IN (
  'b0000000-0000-4000-8000-000000000001',
  'b0000000-0000-4000-8000-000000000002',
  'b0000000-0000-4000-8000-000000000003',
  'b0000000-0000-4000-8000-000000000004'
);

INSERT INTO product_media (product_id, media_type, storage_path, alt, sort_order) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'image', 'catalog/instagram-verified-badge.jpg', 'Instagram verified badge', 0),
  ('b0000000-0000-4000-8000-000000000002', 'image', 'catalog/steam-premium-account.jpg', 'Steam gaming', 0),
  ('b0000000-0000-4000-8000-000000000003', 'image', 'catalog/spotify-premium-1year.jpg', 'Spotify Premium', 0),
  ('b0000000-0000-4000-8000-000000000004', 'image', 'catalog/windows-11-pro.jpg', 'Windows 11 Pro', 0)
ON CONFLICT DO NOTHING;

UPDATE site_settings SET
  payment_instructions_en = 'After your order is approved, we will email you payment details (bank transfer, wallet, or crypto). Do not pay until you receive instructions with your order number.',
  payment_instructions_ar = 'بعد الموافقة على طلبك، سنرسل تفاصيل الدفع بالبريد (تحويل بنكي، محفظة، أو عملات رقمية). لا تدفع حتى تستلم التعليمات مع رقم طلبك.'
WHERE id = 'default';

INSERT INTO product_fields (product_id, field_key, field_type, label, help_text, required, sort_order, is_sensitive) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'instagram_username', 'text', '{"en":"Instagram username","ar":"اسم مستخدم إنستغرام"}', '{"en":"@handle without spaces","ar":"بدون مسافات"}', true, 0, false),
  ('b0000000-0000-4000-8000-000000000002', 'steam_email', 'email', '{"en":"Steam account email","ar":"بريد حساب Steam"}', null, true, 0, false),
  ('b0000000-0000-4000-8000-000000000003', 'spotify_email', 'email', '{"en":"Spotify account email","ar":"بريد حساب Spotify"}', null, true, 0, false),
  ('b0000000-0000-4000-8000-000000000004', 'license_email', 'email', '{"en":"Email for license delivery","ar":"بريد لتسليم الترخيص"}', null, true, 0, false)
ON CONFLICT (product_id, field_key) DO NOTHING;

INSERT INTO coupons (code, coupon_type, value, min_order_cents, max_discount_cents, usage_limit, is_active) VALUES
  ('WELCOME10', 'percent', 10, 500, 500, 100, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO exchange_rates (base_currency, target_currency, rate) VALUES
  ('USD', 'EUR', 0.92),
  ('USD', 'SAR', 3.75),
  ('USD', 'AED', 3.67),
  ('USD', 'EGP', 48.5)
ON CONFLICT (base_currency, target_currency) DO UPDATE SET rate = EXCLUDED.rate;
