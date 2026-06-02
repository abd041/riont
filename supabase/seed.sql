-- Optional dev seed — run after 20250523000000_core.sql and 20250526000000_product_variants_related.sql

INSERT INTO categories (id, sort_order, icon_url) VALUES
  ('a0000000-0000-4000-8000-000000000001', 1, 'catalog/categories/instagram.jpg'),
  ('a0000000-0000-4000-8000-000000000002', 2, 'catalog/categories/gaming.jpg'),
  ('a0000000-0000-4000-8000-000000000003', 3, 'catalog/categories/software.jpg'),
  ('a0000000-0000-4000-8000-000000000004', 4, 'catalog/categories/subscriptions.jpg'),
  ('a0000000-0000-4000-8000-000000000005', 5, 'catalog/categories/gift-cards.jpg'),
  ('a0000000-0000-4000-8000-000000000006', 6, 'catalog/categories/python.jpg')
ON CONFLICT (id) DO UPDATE SET icon_url = EXCLUDED.icon_url, sort_order = EXCLUDED.sort_order;

INSERT INTO category_translations (category_id, locale, name, slug, description, meta_title, meta_description) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'en', 'Instagram Services', 'instagram', 'Growth and verification services for Instagram.', 'Instagram Services | riyont', 'Premium Instagram digital services with fast delivery.'),
  ('a0000000-0000-4000-8000-000000000001', 'ar', 'خدمات إنستغرام', 'instagram', 'خدمات النمو والتوثيق لإنستغرام.', 'خدمات إنستغرام | riyont', 'خدمات إنستغرام رقمية مميزة مع تسليم سريع.'),
  ('a0000000-0000-4000-8000-000000000002', 'en', 'Steam Accounts', 'steam', 'Private and shared Steam accounts with instant delivery.', 'Steam Accounts | riyont', 'Premium Steam accounts — private and shared options.'),
  ('a0000000-0000-4000-8000-000000000002', 'ar', 'حسابات Steam', 'steam', 'حسابات Steam خاصة ومشتركة مع تسليم فوري.', 'حسابات Steam | riyont', 'حسابات Steam مميزة — خيارات خاصة ومشتركة.'),
  ('a0000000-0000-4000-8000-000000000003', 'en', 'Python Tools', 'python-tools', 'Scripts, bots, and automation tools.', 'Python Tools | riyont', 'Python tools and automation utilities.'),
  ('a0000000-0000-4000-8000-000000000003', 'ar', 'أدوات Python', 'python-tools', 'سكربتات وبوتات وأدوات أتمتة.', 'أدوات Python | riyont', 'أدوات Python وأتمتة.'),
  ('a0000000-0000-4000-8000-000000000004', 'en', 'Instagram Verification', 'instagram-verification', 'Official-style verification services.', 'Instagram Verification | riyont', 'Instagram verification services.'),
  ('a0000000-0000-4000-8000-000000000004', 'ar', 'توثيق إنستغرام', 'instagram-verification', 'خدمات توثيق إنستغرام.', 'توثيق إنستغرام | riyont', 'خدمات توثيق إنستغرام.'),
  ('a0000000-0000-4000-8000-000000000005', 'en', 'Gift Cards', 'gift-cards', 'Digital gift cards and top-ups.', 'Gift Cards | riyont', 'Digital gift cards with fast delivery.'),
  ('a0000000-0000-4000-8000-000000000005', 'ar', 'بطاقات هدايا', 'gift-cards', 'بطاقات هدايا رقمية وشحن.', 'بطاقات هدايا | riyont', 'بطاقات هدايا رقمية مع تسليم سريع.'),
  ('a0000000-0000-4000-8000-000000000006', 'en', 'Software', 'software', 'Licenses and keys for productivity software.', 'Software | riyont', 'Software license keys and digital downloads.'),
  ('a0000000-0000-4000-8000-000000000006', 'ar', 'برامج', 'software', 'تراخيص ومفاتيح لبرامج الإنتاجية.', 'برامج | riyont', 'مفاتيح ترخيص وبرامج رقمية.')
ON CONFLICT (category_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;

INSERT INTO products (id, category_id, status, delivery_mode, price_cents, compare_at_cents, is_featured, sales_count, badge) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000004', 'active', 'manual', 1499, 1999, true, 128, 'hot'),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002', 'active', 'auto', 2999, null, true, 45, 'instant'),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000005', 'active', 'auto', 499, 799, true, 12, 'offer'),
  ('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000006', 'active', 'auto', 1499, null, false, 8, 'none')
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  badge = EXCLUDED.badge,
  price_cents = EXCLUDED.price_cents,
  compare_at_cents = EXCLUDED.compare_at_cents;

INSERT INTO product_translations (product_id, locale, name, slug, short_description, description, meta_title, meta_description, og_image_url) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'en', 'Instagram Verified Badge', 'instagram-verified-badge', 'Blue verification badge delivery.', 'Get your Instagram profile verified with our premium delivery service. Includes setup guidance and status tracking.', 'Instagram Verified Badge | riyont', 'Buy Instagram verification badge delivery — safe, fast, and reliable.', '/catalog/instagram-verified-badge.jpg'),
  ('b0000000-0000-4000-8000-000000000001', 'ar', 'شارة توثيق إنستغرام', 'instagram-verified-badge', 'تسليم شارة التوثيق الزرقاء.', 'احصل على توثيق حسابك في إنستغرام مع خدمة تسليم مميزة تشمل الإرشاد والمتابعة.', 'شارة توثيق إنستغرام | riyont', 'شراء شارة توثيق إنستغرام — آمن وسريع وموثوق.', '/catalog/instagram-verified-badge.jpg'),
  ('b0000000-0000-4000-8000-000000000002', 'en', 'Steam Premium Account', 'steam-premium-account', 'Premium Steam account with games.', 'Pre-loaded Steam account with popular titles. Instant credentials delivery after order approval.', 'Steam Premium Account | riyont', 'Premium Steam accounts with games — instant digital delivery.', '/catalog/steam-premium-account.jpg'),
  ('b0000000-0000-4000-8000-000000000002', 'ar', 'حساب Steam مميز', 'steam-premium-account', 'حساب Steam مميز مع ألعاب.', 'حساب Steam محمّل بألعاب شائعة مع تسليم فوري للبيانات بعد الموافقة.', 'حساب Steam مميز | riyont', 'حسابات Steam مميزة مع ألعاب — تسليم رقمي فوري.', '/catalog/steam-premium-account.jpg'),
  ('b0000000-0000-4000-8000-000000000003', 'en', 'Spotify Premium 1 Year', 'spotify-premium-1year', '12 months premium subscription.', 'Full 12-month Spotify Premium upgrade code. Redeem on your existing account.', 'Spotify Premium 1 Year | riyont', 'Spotify Premium 12-month subscription code with instant delivery.', '/catalog/spotify-premium-1year.jpg'),
  ('b0000000-0000-4000-8000-000000000003', 'ar', 'سبوتيفاي بريميوم سنة', 'spotify-premium-1year', 'اشتراك بريميوم لمدة 12 شهراً.', 'كود ترقية Spotify Premium لمدة 12 شهراً — فعّله على حسابك الحالي.', 'سبوتيفاي بريميوم سنة | riyont', 'كود Spotify Premium لسنة كاملة مع تسليم فوري.', '/catalog/spotify-premium-1year.jpg'),
  ('b0000000-0000-4000-8000-000000000004', 'en', 'Windows 11 Pro Key', 'windows-11-pro', 'Genuine digital license key.', 'Genuine Windows 11 Pro digital license. One-time activation key delivered instantly.', 'Windows 11 Pro Key | riyont', 'Buy Windows 11 Pro license key — genuine digital activation.', '/catalog/windows-11-pro.jpg'),
  ('b0000000-0000-4000-8000-000000000004', 'ar', 'مفتاح Windows 11 Pro', 'windows-11-pro', 'مفتاح ترخيص رقمي أصلي.', 'ترخيص Windows 11 Pro رقمي أصلي — مفتاح تفعيل لمرة واحدة مع تسليم فوري.', 'مفتاح Windows 11 Pro | riyont', 'شراء مفتاح Windows 11 Pro — تفعيل رقمي أصلي.', '/catalog/windows-11-pro.jpg')
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
  ('b0000000-0000-4000-8000-000000000004', 'image', 'catalog/windows-11-pro.jpg', 'Windows 11 Pro', 0);

UPDATE site_settings SET
  payment_instructions_en = 'After your order is approved, we will email you payment details (bank transfer, wallet, or crypto). Do not pay until you receive instructions with your order number.',
  payment_instructions_ar = 'بعد الموافقة على طلبك، سنرسل تفاصيل الدفع بالبريد (تحويل بنكي، محفظة، أو عملات رقمية). لا تدفع حتى تستلم التعليمات مع رقم طلبك.'
WHERE id = 'default';

INSERT INTO product_fields (product_id, field_key, field_type, label, help_text, required, sort_order, is_sensitive) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'instagram_username', 'text', '{"en":"Instagram username","ar":"اسم مستخدم إنستغرام"}', '{"en":"@handle without spaces","ar":"بدون مسافات"}', true, 0, false),
  ('b0000000-0000-4000-8000-000000000001', 'contact_email', 'email', '{"en":"Contact email","ar":"البريد للتواصل"}', null, true, 1, false),
  ('b0000000-0000-4000-8000-000000000002', 'steam_email', 'email', '{"en":"Steam account email","ar":"بريد حساب Steam"}', null, true, 0, false),
  ('b0000000-0000-4000-8000-000000000003', 'spotify_email', 'email', '{"en":"Spotify account email","ar":"بريد حساب Spotify"}', null, true, 0, false),
  ('b0000000-0000-4000-8000-000000000004', 'license_email', 'email', '{"en":"Email for license delivery","ar":"بريد لتسليم الترخيص"}', null, true, 0, false)
ON CONFLICT (product_id, field_key) DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'b0000000-0000-4000-8000-000000000001';

INSERT INTO product_variants (product_id, name, price_cents, compare_at_cents, offer_label, sort_order, is_default, is_active) VALUES
  ('b0000000-0000-4000-8000-000000000001', '{"en":"1 Month","ar":"شهر واحد"}', 1499, 1999, '{"en":"20% OFF","ar":"خصم 20%"}', 0, true, true),
  ('b0000000-0000-4000-8000-000000000001', '{"en":"3 Months","ar":"3 أشهر"}', 3999, 4999, '{"en":"Best Value","ar":"أفضل قيمة"}', 1, false, true),
  ('b0000000-0000-4000-8000-000000000001', '{"en":"6 Months","ar":"6 أشهر"}', 6999, 8999, null, 2, false, true);

INSERT INTO product_related (product_id, related_product_id, sort_order) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 0),
  ('b0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 1)
ON CONFLICT DO NOTHING;

INSERT INTO coupons (code, coupon_type, value, min_order_cents, max_discount_cents, usage_limit, is_active) VALUES
  ('WELCOME10', 'percent', 10, 500, 500, 100, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO exchange_rates (base_currency, target_currency, rate) VALUES
  ('USD', 'EUR', 0.92),
  ('USD', 'SAR', 3.75),
  ('USD', 'AED', 3.67),
  ('USD', 'EGP', 48.5)
ON CONFLICT (base_currency, target_currency) DO UPDATE SET rate = EXCLUDED.rate;
