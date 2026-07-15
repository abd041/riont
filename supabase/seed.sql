-- Demo catalog seed (30 products, 7 categories, coupons, sample reviews)
--
-- Prerequisites: all migrations through 20250529000000_reviews_customer_ops.sql
--
-- Local:
--   npm run db:seed
--   (or paste this file in Supabase Dashboard → SQL Editor)
--
-- Production (linked Supabase project):
--   npx supabase link --project-ref YOUR_REF
--   npm run db:seed:linked
--
-- After seeding production, set on Vercel: CATALOG_DEMO_FALLBACK=false
-- so the storefront uses only database products (not demo merge).

INSERT INTO categories (id, sort_order, icon_url) VALUES
  ('a0000000-0000-4000-8000-000000000001', 1, 'catalog/thumbs/social.svg'),
  ('a0000000-0000-4000-8000-000000000002', 2, 'catalog/thumbs/gaming.svg'),
  ('a0000000-0000-4000-8000-000000000007', 3, 'catalog/thumbs/gaming.svg'),
  ('a0000000-0000-4000-8000-000000000003', 4, 'catalog/thumbs/tools.svg'),
  ('a0000000-0000-4000-8000-000000000004', 5, 'catalog/thumbs/social.svg'),
  ('a0000000-0000-4000-8000-000000000005', 6, 'catalog/thumbs/gift-cards.svg'),
  ('a0000000-0000-4000-8000-000000000006', 7, 'catalog/thumbs/software.svg')
ON CONFLICT (id) DO UPDATE SET icon_url = EXCLUDED.icon_url, sort_order = EXCLUDED.sort_order;

INSERT INTO category_translations (category_id, locale, name, slug, description, meta_title, meta_description) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'en', 'Instagram Services', 'instagram', 'Growth and verification services for Instagram.', 'Instagram Services | riyont', 'Premium Instagram digital services with fast delivery.'),
  ('a0000000-0000-4000-8000-000000000001', 'ar', 'خدمات إنستغرام', 'instagram', 'خدمات النمو والتوثيق لإنستغرام.', 'خدمات إنستغرام | riyont', 'خدمات إنستغرام رقمية مميزة مع تسليم سريع.'),
  ('a0000000-0000-4000-8000-000000000002', 'en', 'Steam Private', 'steam-private', 'Private Steam accounts with full access and instant delivery.', 'Steam Private Accounts | riyont', 'Premium private Steam accounts with instant credentials.'),
  ('a0000000-0000-4000-8000-000000000002', 'ar', 'Steam خاص', 'steam-private', 'حسابات Steam خاصة مع وصول كامل وتسليم فوري.', 'حسابات Steam خاصة | riyont', 'حسابات Steam خاصة مميزة مع بيانات فورية.'),
  ('a0000000-0000-4000-8000-000000000007', 'en', 'Steam Shared', 'steam-shared', 'Shared Steam accounts at lower prices.', 'Steam Shared Accounts | riyont', 'Affordable shared Steam accounts with instant delivery.'),
  ('a0000000-0000-4000-8000-000000000007', 'ar', 'Steam مشترك', 'steam-shared', 'حسابات Steam مشتركة بأسعار أقل.', 'حسابات Steam مشتركة | riyont', 'حسابات Steam مشتركة بأسعار مناسبة وتسليم فوري.'),
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

INSERT INTO products (id, category_id, status, delivery_mode, price_cents, compare_at_cents, is_featured, sales_count, badge, sort_order) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000004', 'active', 'manual', 1499, 1999, true, 128, 'hot', 1),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002', 'active', 'manual', 2999, 3499, true, 245, 'bestSeller', 2),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000005', 'active', 'manual', 499, 799, true, 186, 'instant', 3),
  ('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000006', 'active', 'manual', 1499, 1899, true, 92, 'offer', 4),
  ('b0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000007', 'active', 'manual', 1999, 2799, true, 164, 'bestSeller', 5),
  ('b0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000003', 'active', 'manual', 899, 1299, true, 73, 'trending', 6),
  ('b0000000-0000-4000-8000-000000000007', 'a0000000-0000-4000-8000-000000000001', 'active', 'manual', 799, 999, true, 210, 'hot', 7),
  ('b0000000-0000-4000-8000-000000000008', 'a0000000-0000-4000-8000-000000000005', 'active', 'manual', 2399, 2500, true, 55, 'instant', 8),
  ('b0000000-0000-4000-8000-000000000009', 'a0000000-0000-4000-8000-000000000005', 'active', 'manual', 999, 1499, true, 142, 'limited', 9),
  ('b0000000-0000-4000-8000-000000000010', 'a0000000-0000-4000-8000-000000000002', 'active', 'manual', 3499, 4299, true, 118, 'instant', 10),
  ('b0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000001', 'active', 'manual', 599, 799, true, 142, 'instant', 11),
  ('b0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000001', 'active', 'manual', 399, 549, true, 88, 'none', 12),
  ('b0000000-0000-4000-8000-000000000013', 'a0000000-0000-4000-8000-000000000001', 'active', 'manual', 699, 899, true, 76, 'trending', 13),
  ('b0000000-0000-4000-8000-000000000014', 'a0000000-0000-4000-8000-000000000002', 'active', 'manual', 2799, 3299, true, 64, 'hot', 14),
  ('b0000000-0000-4000-8000-000000000015', 'a0000000-0000-4000-8000-000000000002', 'active', 'manual', 3199, 3799, true, 52, 'trending', 15),
  ('b0000000-0000-4000-8000-000000000016', 'a0000000-0000-4000-8000-000000000007', 'active', 'manual', 899, 1199, true, 98, 'instant', 16),
  ('b0000000-0000-4000-8000-000000000017', 'a0000000-0000-4000-8000-000000000007', 'active', 'manual', 1299, 1699, true, 71, 'none', 17),
  ('b0000000-0000-4000-8000-000000000018', 'a0000000-0000-4000-8000-000000000007', 'active', 'manual', 699, 999, true, 55, 'offer', 18),
  ('b0000000-0000-4000-8000-000000000019', 'a0000000-0000-4000-8000-000000000003', 'active', 'manual', 799, 1099, true, 58, 'none', 19),
  ('b0000000-0000-4000-8000-000000000020', 'a0000000-0000-4000-8000-000000000003', 'active', 'manual', 649, 899, true, 44, 'instant', 20),
  ('b0000000-0000-4000-8000-000000000021', 'a0000000-0000-4000-8000-000000000003', 'active', 'manual', 749, 999, true, 39, 'none', 21),
  ('b0000000-0000-4000-8000-000000000022', 'a0000000-0000-4000-8000-000000000004', 'active', 'manual', 1799, 2299, true, 96, 'bestSeller', 22),
  ('b0000000-0000-4000-8000-000000000023', 'a0000000-0000-4000-8000-000000000004', 'active', 'manual', 1299, 1699, true, 67, 'none', 23),
  ('b0000000-0000-4000-8000-000000000024', 'a0000000-0000-4000-8000-000000000004', 'active', 'manual', 3999, 4999, true, 41, 'offer', 24),
  ('b0000000-0000-4000-8000-000000000025', 'a0000000-0000-4000-8000-000000000005', 'active', 'manual', 4599, 5000, true, 29, 'instant', 25),
  ('b0000000-0000-4000-8000-000000000026', 'a0000000-0000-4000-8000-000000000005', 'active', 'manual', 4799, 5000, true, 48, 'none', 26),
  ('b0000000-0000-4000-8000-000000000027', 'a0000000-0000-4000-8000-000000000005', 'active', 'manual', 2299, 2500, true, 36, 'none', 27),
  ('b0000000-0000-4000-8000-000000000028', 'a0000000-0000-4000-8000-000000000006', 'active', 'manual', 899, 1299, true, 74, 'bestSeller', 28),
  ('b0000000-0000-4000-8000-000000000029', 'a0000000-0000-4000-8000-000000000006', 'active', 'manual', 1699, 2000, true, 61, 'instant', 29),
  ('b0000000-0000-4000-8000-000000000030', 'a0000000-0000-4000-8000-000000000006', 'active', 'manual', 3499, 4999, true, 38, 'none', 30)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  badge = EXCLUDED.badge,
  price_cents = EXCLUDED.price_cents,
  compare_at_cents = EXCLUDED.compare_at_cents,
  is_featured = EXCLUDED.is_featured,
  sales_count = EXCLUDED.sales_count,
  delivery_mode = EXCLUDED.delivery_mode,
  sort_order = EXCLUDED.sort_order;

DELETE FROM product_translations
WHERE product_id IN (
  'b0000000-0000-4000-8000-000000000001',
  'b0000000-0000-4000-8000-000000000002',
  'b0000000-0000-4000-8000-000000000003',
  'b0000000-0000-4000-8000-000000000004',
  'b0000000-0000-4000-8000-000000000005',
  'b0000000-0000-4000-8000-000000000006',
  'b0000000-0000-4000-8000-000000000007',
  'b0000000-0000-4000-8000-000000000008',
  'b0000000-0000-4000-8000-000000000009',
  'b0000000-0000-4000-8000-000000000010',
  'b0000000-0000-4000-8000-000000000011',
  'b0000000-0000-4000-8000-000000000012',
  'b0000000-0000-4000-8000-000000000013',
  'b0000000-0000-4000-8000-000000000014',
  'b0000000-0000-4000-8000-000000000015',
  'b0000000-0000-4000-8000-000000000016',
  'b0000000-0000-4000-8000-000000000017',
  'b0000000-0000-4000-8000-000000000018',
  'b0000000-0000-4000-8000-000000000019',
  'b0000000-0000-4000-8000-000000000020',
  'b0000000-0000-4000-8000-000000000021',
  'b0000000-0000-4000-8000-000000000022',
  'b0000000-0000-4000-8000-000000000023',
  'b0000000-0000-4000-8000-000000000024',
  'b0000000-0000-4000-8000-000000000025',
  'b0000000-0000-4000-8000-000000000026',
  'b0000000-0000-4000-8000-000000000027',
  'b0000000-0000-4000-8000-000000000028',
  'b0000000-0000-4000-8000-000000000029',
  'b0000000-0000-4000-8000-000000000030'
);

INSERT INTO product_translations (product_id, locale, name, slug, short_description, description, meta_title, meta_description, og_image_url) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'en', 'Instagram Verified Badge', 'instagram-verified-badge', 'Blue verification badge delivery.', 'Get your Instagram profile verified with our premium delivery service. Includes setup guidance and status tracking.', 'Instagram Verified Badge | riyont', 'Buy Instagram verification badge delivery — safe, fast, and reliable.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000001', 'ar', 'شارة توثيق إنستغرام', 'instagram-verified-badge', 'تسليم شارة التوثيق الزرقاء.', 'احصل على توثيق حسابك في إنستغرام مع خدمة تسليم مميزة تشمل الإرشاد والمتابعة.', 'شارة توثيق إنستغرام | riyont', 'شراء شارة توثيق إنستغرام — آمن وسريع وموثوق.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000002', 'en', 'Steam Premium Account', 'steam-premium-account', 'Premium Steam account with games.', 'Pre-loaded Steam account with popular titles. Instant credentials delivery after order approval.', 'Steam Premium Account | riyont', 'Premium Steam accounts with games — instant digital delivery.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000002', 'ar', 'حساب Steam مميز', 'steam-premium-account', 'حساب Steam مميز مع ألعاب.', 'حساب Steam محمّل بألعاب شائعة مع تسليم فوري للبيانات بعد الموافقة.', 'حساب Steam مميز | riyont', 'حسابات Steam مميزة مع ألعاب — تسليم رقمي فوري.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000003', 'en', 'Spotify Premium 1 Year', 'spotify-premium-1year', '12 months premium subscription.', 'Full 12-month Spotify Premium upgrade code. Redeem on your existing account.', 'Spotify Premium 1 Year | riyont', 'Spotify Premium 12-month subscription code with instant delivery.', '/catalog/thumbs/subscriptions.svg'),
  ('b0000000-0000-4000-8000-000000000003', 'ar', 'سبوتيفاي بريميوم سنة', 'spotify-premium-1year', 'اشتراك بريميوم لمدة 12 شهراً.', 'كود ترقية Spotify Premium لمدة 12 شهراً — فعّله على حسابك الحالي.', 'سبوتيفاي بريميوم سنة | riyont', 'كود Spotify Premium لسنة كاملة مع تسليم فوري.', '/catalog/thumbs/subscriptions.svg'),
  ('b0000000-0000-4000-8000-000000000004', 'en', 'Windows 11 Pro Key', 'windows-11-pro', 'Genuine digital license key.', 'Genuine Windows 11 Pro digital license. One-time activation key delivered instantly.', 'Windows 11 Pro Key | riyont', 'Buy Windows 11 Pro license key — genuine digital activation.', '/catalog/thumbs/software.svg'),
  ('b0000000-0000-4000-8000-000000000004', 'ar', 'مفتاح Windows 11 Pro', 'windows-11-pro', 'مفتاح ترخيص رقمي أصلي.', 'ترخيص Windows 11 Pro رقمي أصلي — مفتاح تفعيل لمرة واحدة مع تسليم فوري.', 'مفتاح Windows 11 Pro | riyont', 'شراء مفتاح Windows 11 Pro — تفعيل رقمي أصلي.', '/catalog/thumbs/software.svg'),
  ('b0000000-0000-4000-8000-000000000005', 'en', 'Steam Shared Account', 'steam-shared-account', 'Affordable shared Steam access.', 'Shared Steam account with popular titles. Manual setup after order approval.', 'Steam Shared Account | riyont', 'Shared Steam accounts at great prices.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000005', 'ar', 'حساب Steam مشترك', 'steam-shared-account', 'وصول Steam مشترك بسعر مناسب.', 'حساب Steam مشترك مع ألعاب شائعة — إعداد يدوي بعد الموافقة.', 'حساب Steam مشترك | riyont', 'حسابات Steam مشتركة بأسعار مميزة.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000006', 'en', 'Python Instagram Bot', 'python-instagram-bot', 'Automation script for Instagram growth.', 'Custom Python bot for Instagram engagement. Includes setup guide and support.', 'Python Instagram Bot | riyont', 'Python automation tools for social growth.', '/catalog/thumbs/tools.svg'),
  ('b0000000-0000-4000-8000-000000000006', 'ar', 'بوت Python لإنستغرام', 'python-instagram-bot', 'سكربت أتمتة لنمو إنستغرام.', 'بوت Python مخصص للتفاعل على إنستغرام مع دليل إعداد ودعم.', 'بوت Python لإنستغرام | riyont', 'أدوات Python للنمو على السوشيال.', '/catalog/thumbs/tools.svg'),
  ('b0000000-0000-4000-8000-000000000007', 'en', 'Instagram Growth Package', 'instagram-growth-package', 'Followers, reach, and engagement boost.', 'Premium Instagram growth service handled manually by our team.', 'Instagram Growth | riyont', 'Instagram growth and engagement services.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000007', 'ar', 'باقة نمو إنستغرام', 'instagram-growth-package', 'زيادة المتابعين والتفاعل.', 'خدمة نمو إنستغرام مميزة يديرها فريقنا يدوياً.', 'نمو إنستغرام | riyont', 'خدمات نمو وتفاعل على إنستغرام.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000008', 'en', 'Amazon Gift Card $25', 'amazon-gift-card-25', 'Digital gift card code.', 'Amazon gift card delivered after payment confirmation.', 'Amazon Gift Card | riyont', 'Amazon digital gift cards with fast delivery.', '/catalog/thumbs/gift-cards.svg'),
  ('b0000000-0000-4000-8000-000000000008', 'ar', 'بطاقة Amazon 25$', 'amazon-gift-card-25', 'كود بطاقة هدايا رقمية.', 'بطاقة Amazon تُسلّم بعد تأكيد الدفع.', 'بطاقة Amazon | riyont', 'بطاقات Amazon رقمية مع تسليم سريع.', '/catalog/thumbs/gift-cards.svg'),
  ('b0000000-0000-4000-8000-000000000009', 'en', 'Netflix Premium 1 Month', 'netflix-premium-1month', 'One month premium access.', 'Netflix Premium upgrade handled manually after order review.', 'Netflix Premium | riyont', 'Netflix Premium subscription service.', '/catalog/thumbs/subscriptions.svg'),
  ('b0000000-0000-4000-8000-000000000009', 'ar', 'نتflix Premium شهر', 'netflix-premium-1month', 'اشتراك بريميوم لشهر واحد.', 'ترقية Netflix Premium يدوياً بعد مراجعة الطلب.', 'Netflix Premium | riyont', 'خدمة اشتراك Netflix Premium.', '/catalog/thumbs/subscriptions.svg'),
  ('b0000000-0000-4000-8000-000000000010', 'en', 'Discord Nitro 1 Year', 'discord-nitro-annual', 'Full year of Discord Nitro.', 'Discord Nitro annual upgrade — manual delivery after approval.', 'Discord Nitro | riyont', 'Discord Nitro annual subscription.', '/catalog/thumbs/subscriptions.svg'),
  ('b0000000-0000-4000-8000-000000000010', 'ar', 'Discord Nitro سنة', 'discord-nitro-annual', 'Discord Nitro لمدة سنة.', 'ترقية Discord Nitro السنوية — تسليم يدوي بعد الموافقة.', 'Discord Nitro | riyont', 'اشتراك Discord Nitro السنوي.', '/catalog/thumbs/subscriptions.svg'),
  ('b0000000-0000-4000-8000-000000000011', 'en', 'Instagram Followers 10K', 'instagram-followers-10k', 'Boost your follower count.', 'Premium Instagram followers package delivered gradually for natural growth.', 'Instagram Followers | riyont', 'Instagram follower growth service.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000011', 'ar', 'متابعين إنستغرام 10K', 'instagram-followers-10k', 'زيادة عدد المتابعين.', 'باقة متابعين إنستغرام مميزة تُسلّم تدريجياً.', 'متابعين إنستغرام | riyont', 'خدمة نمو متابعين إنستغرام.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000012', 'en', 'Instagram Likes Boost', 'instagram-likes-boost', 'Increase post engagement.', 'Targeted likes boost for your latest Instagram posts.', 'Instagram Likes | riyont', 'Instagram likes and engagement boost.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000012', 'ar', 'تعزيز إعجابات إنستغرام', 'instagram-likes-boost', 'زيادة التفاعل على المنشورات.', 'تعزيز إعجابات موجه لأحدث منشوراتك.', 'إعجابات إنستغرام | riyont', 'خدمة تعزيز الإعجابات والتفاعل.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000013', 'en', 'Instagram Reels Promotion', 'instagram-reels-promo', 'Promote your reels reach.', 'Manual reels promotion handled by our social team.', 'Instagram Reels | riyont', 'Instagram reels promotion service.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000013', 'ar', 'ترويج Reels إنستغرام', 'instagram-reels-promo', 'ترويج وصول الريلز.', 'ترويج يدوي للريلز يقوم به فريقنا.', 'Reels إنستغرام | riyont', 'خدمة ترويج ريلز إنستغرام.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000014', 'en', 'Steam Rust Ready Account', 'steam-rust-account', 'Rust-ready Steam account.', 'Private Steam account prepared for Rust with instant setup support.', 'Steam Rust Account | riyont', 'Rust-ready private Steam accounts.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000014', 'ar', 'حساب Steam Rust', 'steam-rust-account', 'حساب Steam جاهز لـ Rust.', 'حساب Steam خاص جاهز للعب Rust مع دعم فوري.', 'حساب Rust Steam | riyont', 'حسابات Steam خاصة جاهزة لـ Rust.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000015', 'en', 'Steam CS2 Prime Account', 'steam-cs2-prime', 'CS2 Prime-enabled account.', 'Private Steam account with CS2 Prime status included.', 'CS2 Prime Account | riyont', 'CS2 Prime Steam accounts.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000015', 'ar', 'حساب CS2 Prime Steam', 'steam-cs2-prime', 'حساب Steam مع CS2 Prime.', 'حساب Steam خاص مع تفعيل CS2 Prime.', 'حساب CS2 Prime | riyont', 'حسابات Steam مع CS2 Prime.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000016', 'en', 'Steam Shared 1 Month', 'steam-shared-monthly', 'One month shared access.', 'Affordable shared Steam access for 30 days.', 'Steam Shared Monthly | riyont', 'Monthly shared Steam accounts.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000016', 'ar', 'Steam مشترك شهر', 'steam-shared-monthly', 'وصول مشترك لمدة شهر.', 'وصول Steam مشترك بسعر مناسب لمدة 30 يوماً.', 'Steam مشترك شهري | riyont', 'حسابات Steam مشتركة شهرية.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000017', 'en', 'Steam Shared Student', 'steam-shared-student', 'Student shared plan.', 'Discounted shared Steam plan for students.', 'Steam Student Shared | riyont', 'Student shared Steam access.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000017', 'ar', 'Steam مشترك طلاب', 'steam-shared-student', 'خطة مشتركة للطلاب.', 'خطة Steam مشتركة مخفّضة للطلاب.', 'Steam طلاب | riyont', 'وصول Steam مشترك للطلاب.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000018', 'en', 'Steam Shared Lite', 'steam-shared-lite', 'Lite shared access.', 'Budget shared Steam access with core titles.', 'Steam Shared Lite | riyont', 'Lite shared Steam accounts.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000018', 'ar', 'Steam مشترك Lite', 'steam-shared-lite', 'وصول مشترك اقتصادي.', 'وصول Steam مشترك بأسعار منخفضة.', 'Steam Lite | riyont', 'حسابات Steam مشتركة Lite.', '/catalog/thumbs/gaming.svg'),
  ('b0000000-0000-4000-8000-000000000019', 'en', 'Python Telegram Bot', 'python-telegram-bot', 'Telegram automation bot.', 'Custom Python Telegram bot with deployment guide.', 'Python Telegram Bot | riyont', 'Python Telegram automation tools.', '/catalog/thumbs/tools.svg'),
  ('b0000000-0000-4000-8000-000000000019', 'ar', 'بوت Telegram Python', 'python-telegram-bot', 'بوت أتمتة Telegram.', 'بوت Telegram مخصص مع دليل نشر.', 'بوت Telegram | riyont', 'أدوات Python لـ Telegram.', '/catalog/thumbs/tools.svg'),
  ('b0000000-0000-4000-8000-000000000020', 'en', 'Python Web Scraper Kit', 'python-web-scraper', 'Web scraping toolkit.', 'Python scraper kit for data collection projects.', 'Python Scraper | riyont', 'Python web scraping tools.', '/catalog/thumbs/tools.svg'),
  ('b0000000-0000-4000-8000-000000000020', 'ar', 'مجموعة Python Scraper', 'python-web-scraper', 'أدوات استخراج البيانات.', 'مجموعة Python لجمع البيانات من الويب.', 'Python Scraper | riyont', 'أدوات Python لاستخراج البيانات.', '/catalog/thumbs/tools.svg'),
  ('b0000000-0000-4000-8000-000000000021', 'en', 'Python Discord Bot', 'python-discord-bot', 'Discord server bot.', 'Python Discord bot with moderation and utility modules.', 'Python Discord Bot | riyont', 'Python Discord automation.', '/catalog/thumbs/tools.svg'),
  ('b0000000-0000-4000-8000-000000000021', 'ar', 'بوت Discord Python', 'python-discord-bot', 'بوت سيرفر Discord.', 'بوت Discord بلغة Python مع أدوات إدارية.', 'بوت Discord | riyont', 'أتمتة Discord بـ Python.', '/catalog/thumbs/tools.svg'),
  ('b0000000-0000-4000-8000-000000000022', 'en', 'Blue Badge Express', 'instagram-blue-badge-express', 'Fast-track verification.', 'Priority Instagram verification handling with express support.', 'Express Verification | riyont', 'Fast Instagram verification service.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000022', 'ar', 'توثيق سريع', 'instagram-blue-badge-express', 'توثيق بأولوية.', 'معالجة توثيق إنستغرام بأولوية ودعم سريع.', 'توثيق سريع | riyont', 'خدمة توثيق إنستغرام السريعة.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000023', 'en', 'Meta Verified Setup', 'instagram-meta-badge', 'Meta verification setup.', 'Full Meta verified badge setup and guidance.', 'Meta Verified | riyont', 'Meta verification setup service.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000023', 'ar', 'إعداد Meta Verified', 'instagram-meta-badge', 'إعداد توثيق Meta.', 'إعداد كامل لشارة Meta Verified مع إرشاد.', 'Meta Verified | riyont', 'خدمة إعداد توثيق Meta.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000024', 'en', 'Verification 3 Months', 'instagram-verification-3month', 'Three-month verification plan.', 'Instagram verification service with 3-month support window.', '3-Month Verification | riyont', 'Three-month Instagram verification plan.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000024', 'ar', 'توثيق 3 أشهر', 'instagram-verification-3month', 'خطة توثيق لثلاثة أشهر.', 'خدمة توثيق إنستغرام مع دعم لمدة 3 أشهر.', 'توثيق 3 أشهر | riyont', 'خطة توثيق إنستغرام لثلاثة أشهر.', '/catalog/thumbs/social.svg'),
  ('b0000000-0000-4000-8000-000000000025', 'en', 'PlayStation Store $50', 'playstation-store-50', 'PSN wallet top-up.', 'PlayStation Store gift card code after payment confirmation.', 'PlayStation Gift Card | riyont', 'PlayStation Store digital gift cards.', '/catalog/thumbs/gift-cards.svg'),
  ('b0000000-0000-4000-8000-000000000025', 'ar', 'PlayStation Store 50$', 'playstation-store-50', 'شحن محفظة PSN.', 'كود بطاقة PlayStation Store بعد تأكيد الدفع.', 'بطاقة PlayStation | riyont', 'بطاقات PlayStation Store رقمية.', '/catalog/thumbs/gift-cards.svg'),
  ('b0000000-0000-4000-8000-000000000026', 'en', 'Apple Gift Card $50', 'apple-gift-card-50', 'Apple digital gift card.', 'Apple gift card code delivered manually after approval.', 'Apple Gift Card | riyont', 'Apple digital gift cards.', '/catalog/thumbs/gift-cards.svg'),
  ('b0000000-0000-4000-8000-000000000026', 'ar', 'بطاقة Apple 50$', 'apple-gift-card-50', 'بطاقة Apple رقمية.', 'كود بطاقة Apple يُسلّم يدوياً بعد الموافقة.', 'بطاقة Apple | riyont', 'بطاقات Apple رقمية.', '/catalog/thumbs/gift-cards.svg'),
  ('b0000000-0000-4000-8000-000000000027', 'en', 'Google Play Gift Card $25', 'google-play-25', 'Google Play top-up code.', 'Google Play gift card delivered after payment confirmation.', 'Google Play Gift Card | riyont', 'Google Play digital gift cards.', '/catalog/thumbs/gift-cards.svg'),
  ('b0000000-0000-4000-8000-000000000027', 'ar', 'Google Play 25$', 'google-play-25', 'كود Google Play.', 'بطاقة Google Play تُسلّم بعد تأكيد الدفع.', 'Google Play | riyont', 'بطاقات Google Play رقمية.', '/catalog/thumbs/gift-cards.svg'),
  ('b0000000-0000-4000-8000-000000000028', 'en', 'Microsoft Office 365', 'microsoft-office-365', 'Office 365 license key.', 'Microsoft Office 365 activation key with setup help.', 'Office 365 | riyont', 'Microsoft Office 365 license keys.', '/catalog/thumbs/software.svg'),
  ('b0000000-0000-4000-8000-000000000028', 'ar', 'Microsoft Office 365', 'microsoft-office-365', 'مفتاح Office 365.', 'مفتاح تفعيل Microsoft Office 365 مع مساعدة الإعداد.', 'Office 365 | riyont', 'مفاتيح Microsoft Office 365.', '/catalog/thumbs/software.svg'),
  ('b0000000-0000-4000-8000-000000000029', 'en', 'ChatGPT Plus 1 Month', 'chatgpt-plus-1month', 'One month ChatGPT Plus.', 'ChatGPT Plus upgrade handled manually after order review.', 'ChatGPT Plus | riyont', 'ChatGPT Plus subscription service.', '/catalog/thumbs/tools.svg'),
  ('b0000000-0000-4000-8000-000000000029', 'ar', 'ChatGPT Plus شهر', 'chatgpt-plus-1month', 'ChatGPT Plus لشهر واحد.', 'ترقية ChatGPT Plus يدوياً بعد مراجعة الطلب.', 'ChatGPT Plus | riyont', 'خدمة اشتراك ChatGPT Plus.', '/catalog/thumbs/tools.svg'),
  ('b0000000-0000-4000-8000-000000000030', 'en', 'Adobe Creative Cloud', 'adobe-creative-cloud', 'Creative Cloud license.', 'Adobe Creative Cloud activation with onboarding support.', 'Adobe Creative Cloud | riyont', 'Adobe Creative Cloud licenses.', '/catalog/thumbs/software.svg'),
  ('b0000000-0000-4000-8000-000000000030', 'ar', 'Adobe Creative Cloud', 'adobe-creative-cloud', 'ترخيص Creative Cloud.', 'تفعيل Adobe Creative Cloud مع دعم الإعداد.', 'Adobe Creative Cloud | riyont', 'تراخيص Adobe Creative Cloud.', '/catalog/thumbs/software.svg')
ON CONFLICT (locale, slug) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  og_image_url = EXCLUDED.og_image_url;

DELETE FROM product_media WHERE product_id IN (
  'b0000000-0000-4000-8000-000000000001',
  'b0000000-0000-4000-8000-000000000002',
  'b0000000-0000-4000-8000-000000000003',
  'b0000000-0000-4000-8000-000000000004',
  'b0000000-0000-4000-8000-000000000005',
  'b0000000-0000-4000-8000-000000000006',
  'b0000000-0000-4000-8000-000000000007',
  'b0000000-0000-4000-8000-000000000008',
  'b0000000-0000-4000-8000-000000000009',
  'b0000000-0000-4000-8000-000000000010',
  'b0000000-0000-4000-8000-000000000011',
  'b0000000-0000-4000-8000-000000000012',
  'b0000000-0000-4000-8000-000000000013',
  'b0000000-0000-4000-8000-000000000014',
  'b0000000-0000-4000-8000-000000000015',
  'b0000000-0000-4000-8000-000000000016',
  'b0000000-0000-4000-8000-000000000017',
  'b0000000-0000-4000-8000-000000000018',
  'b0000000-0000-4000-8000-000000000019',
  'b0000000-0000-4000-8000-000000000020',
  'b0000000-0000-4000-8000-000000000021',
  'b0000000-0000-4000-8000-000000000022',
  'b0000000-0000-4000-8000-000000000023',
  'b0000000-0000-4000-8000-000000000024',
  'b0000000-0000-4000-8000-000000000025',
  'b0000000-0000-4000-8000-000000000026',
  'b0000000-0000-4000-8000-000000000027',
  'b0000000-0000-4000-8000-000000000028',
  'b0000000-0000-4000-8000-000000000029',
  'b0000000-0000-4000-8000-000000000030'
);

INSERT INTO product_media (product_id, media_type, storage_path, alt, sort_order) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'image', 'catalog/thumbs/social.svg', 'social', 0),
  ('b0000000-0000-4000-8000-000000000002', 'image', 'catalog/thumbs/gaming.svg', 'gaming', 0),
  ('b0000000-0000-4000-8000-000000000003', 'image', 'catalog/thumbs/subscriptions.svg', 'subscriptions', 0),
  ('b0000000-0000-4000-8000-000000000004', 'image', 'catalog/thumbs/software.svg', 'software', 0),
  ('b0000000-0000-4000-8000-000000000005', 'image', 'catalog/thumbs/gaming.svg', 'gaming', 0),
  ('b0000000-0000-4000-8000-000000000006', 'image', 'catalog/thumbs/tools.svg', 'tools', 0),
  ('b0000000-0000-4000-8000-000000000007', 'image', 'catalog/thumbs/social.svg', 'social', 0),
  ('b0000000-0000-4000-8000-000000000008', 'image', 'catalog/thumbs/gift-cards.svg', 'gift-cards', 0),
  ('b0000000-0000-4000-8000-000000000009', 'image', 'catalog/thumbs/subscriptions.svg', 'subscriptions', 0),
  ('b0000000-0000-4000-8000-000000000010', 'image', 'catalog/thumbs/subscriptions.svg', 'subscriptions', 0),
  ('b0000000-0000-4000-8000-000000000011', 'image', 'catalog/thumbs/social.svg', 'social', 0),
  ('b0000000-0000-4000-8000-000000000012', 'image', 'catalog/thumbs/social.svg', 'social', 0),
  ('b0000000-0000-4000-8000-000000000013', 'image', 'catalog/thumbs/social.svg', 'social', 0),
  ('b0000000-0000-4000-8000-000000000014', 'image', 'catalog/thumbs/gaming.svg', 'gaming', 0),
  ('b0000000-0000-4000-8000-000000000015', 'image', 'catalog/thumbs/gaming.svg', 'gaming', 0),
  ('b0000000-0000-4000-8000-000000000016', 'image', 'catalog/thumbs/gaming.svg', 'gaming', 0),
  ('b0000000-0000-4000-8000-000000000017', 'image', 'catalog/thumbs/gaming.svg', 'gaming', 0),
  ('b0000000-0000-4000-8000-000000000018', 'image', 'catalog/thumbs/gaming.svg', 'gaming', 0),
  ('b0000000-0000-4000-8000-000000000019', 'image', 'catalog/thumbs/tools.svg', 'tools', 0),
  ('b0000000-0000-4000-8000-000000000020', 'image', 'catalog/thumbs/tools.svg', 'tools', 0),
  ('b0000000-0000-4000-8000-000000000021', 'image', 'catalog/thumbs/tools.svg', 'tools', 0),
  ('b0000000-0000-4000-8000-000000000022', 'image', 'catalog/thumbs/social.svg', 'social', 0),
  ('b0000000-0000-4000-8000-000000000023', 'image', 'catalog/thumbs/social.svg', 'social', 0),
  ('b0000000-0000-4000-8000-000000000024', 'image', 'catalog/thumbs/social.svg', 'social', 0),
  ('b0000000-0000-4000-8000-000000000025', 'image', 'catalog/thumbs/gift-cards.svg', 'gift-cards', 0),
  ('b0000000-0000-4000-8000-000000000026', 'image', 'catalog/thumbs/gift-cards.svg', 'gift-cards', 0),
  ('b0000000-0000-4000-8000-000000000027', 'image', 'catalog/thumbs/gift-cards.svg', 'gift-cards', 0),
  ('b0000000-0000-4000-8000-000000000028', 'image', 'catalog/thumbs/software.svg', 'software', 0),
  ('b0000000-0000-4000-8000-000000000029', 'image', 'catalog/thumbs/tools.svg', 'tools', 0),
  ('b0000000-0000-4000-8000-000000000030', 'image', 'catalog/thumbs/software.svg', 'software', 0);

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

INSERT INTO product_variants (
  product_id, name, price_cents, compare_at_cents, offer_label,
  benefits, plan_highlight, sort_order, is_default, is_active
) VALUES
  (
    'b0000000-0000-4000-8000-000000000001',
    '{"en":"1 Month","ar":"شهر واحد"}',
    1499, 1999, '{"en":"20% OFF","ar":"خصم 20%"}',
    '{"en":["Standard processing","Email support"],"ar":["معالجة قياسية","دعم بالبريد"]}',
    'none', 0, true, true
  ),
  (
    'b0000000-0000-4000-8000-000000000001',
    '{"en":"2 Months","ar":"شهران"}',
    2799, 3499, null,
    '{"en":["Faster handling"],"ar":["معالجة أسرع"]}',
    'none', 1, false, true
  ),
  (
    'b0000000-0000-4000-8000-000000000001',
    '{"en":"3 Months","ar":"3 أشهر"}',
    3999, 4999, null,
    '{"en":["Best value for longer use","Priority support"],"ar":["أفضل قيمة للاستخدام الأطول","دعم ذو أولوية"]}',
    'bestValue', 2, false, true
  ),
  (
    'b0000000-0000-4000-8000-000000000001',
    '{"en":"4 Months","ar":"4 أشهر"}',
    5199, 6499, null,
    '{"en":["Priority handling","Longer warranty window"],"ar":["معالجة ذات أولوية","نافذة ضمان أطول"]}',
    'recommended', 3, false, true
  );

-- Sample service ladder (Basic / Fast / VIP) on Steam Shared
DELETE FROM product_variants WHERE product_id = 'b0000000-0000-4000-8000-000000000002';

INSERT INTO product_variants (
  product_id, name, price_cents, compare_at_cents, offer_label,
  benefits, plan_highlight, sort_order, is_default, is_active
) VALUES
  (
    'b0000000-0000-4000-8000-000000000002',
    '{"en":"Basic","ar":"أساسي"}',
    999, null, null,
    '{"en":["Standard queue","Email support"],"ar":["طابور قياسي","دعم بالبريد"]}',
    'none', 0, true, true
  ),
  (
    'b0000000-0000-4000-8000-000000000002',
    '{"en":"Fast","ar":"سريع"}',
    1499, 1999, null,
    '{"en":["Priority handling","Faster delivery window"],"ar":["معالجة ذات أولوية","نافذة تسليم أسرع"]}',
    'mostPopular', 1, false, true
  ),
  (
    'b0000000-0000-4000-8000-000000000002',
    '{"en":"VIP","ar":"VIP"}',
    2499, 2999, null,
    '{"en":["Top priority","Dedicated support","Longer warranty"],"ar":["أولوية قصوى","دعم مخصص","ضمان أطول"]}',
    'recommended', 2, false, true
  );

-- Demo commerce fields on seed products (after columns exist)
UPDATE products SET
  availability_status = 'available_now',
  trust_badges = '["instantDelivery","warranty","securePayment"]'::jsonb,
  extra_fee_type = 'none',
  extra_fee_value = 0
WHERE id = 'b0000000-0000-4000-8000-000000000001';

UPDATE products SET
  delivery_mode = 'manual',
  availability_status = 'limited_availability',
  trust_badges = '["manualSupport","verifiedService","warranty"]'::jsonb,
  manual_daily_slot_limit = 8,
  manual_slots_remaining = 8,
  manual_slots_date = (timezone('utc', now()))::date
WHERE id = 'b0000000-0000-4000-8000-000000000002';

INSERT INTO product_related (product_id, related_product_id, sort_order) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 0),
  ('b0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 1)
ON CONFLICT DO NOTHING;

INSERT INTO coupons (code, coupon_type, value, min_order_cents, max_discount_cents, usage_limit, is_active) VALUES
  ('WELCOME10', 'percent', 10, 500, 500, 100, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO product_reviews (product_id, author_name, rating, body, locale, sort_order, is_approved) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'Alex M.', 5, 'Verification delivered within 48 hours. Support answered quickly.', 'en', 0, true),
  ('b0000000-0000-4000-8000-000000000001', 'Sara K.', 5, 'Smooth process from checkout to badge activation.', 'en', 1, true),
  ('b0000000-0000-4000-8000-000000000001', 'Omar H.', 4, 'Good service; follow the setup guide closely.', 'en', 2, true),
  ('b0000000-0000-4000-8000-000000000001', 'نورة أ.', 5, 'تسليم سريع ودعم ممتاز بالعربية.', 'ar', 0, true),
  ('b0000000-0000-4000-8000-000000000002', 'Mike T.', 5, 'Steam credentials worked instantly after payment.', 'en', 0, true),
  ('b0000000-0000-4000-8000-000000000003', 'Lina P.', 4, 'Spotify code redeemed without issues.', 'en', 0, true)
ON CONFLICT DO NOTHING;

-- Migration 20250529000000 sets is_approved default FALSE — keep demo reviews visible
UPDATE product_reviews
SET is_approved = true
WHERE product_id IN (
  'b0000000-0000-4000-8000-000000000001',
  'b0000000-0000-4000-8000-000000000002',
  'b0000000-0000-4000-8000-000000000003'
);

INSERT INTO store_reviews (author_name, rating, body, locale, sort_order, is_approved) VALUES
  ('Jordan L.', 5, 'Best digital store I have used — fast delivery and clear checkout.', 'en', 0, true),
  ('Maya R.', 4, 'Great variety of products. Support replied within an hour.', 'en', 1, true),
  ('كريم س.', 5, 'تجربة ممتازة ودعم سريع بالعربية.', 'ar', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO exchange_rates (base_currency, target_currency, rate) VALUES
  ('USD', 'EUR', 0.92),
  ('USD', 'SAR', 3.75),
  ('USD', 'AED', 3.67),
  ('USD', 'EGP', 48.5)
ON CONFLICT (base_currency, target_currency) DO UPDATE SET rate = EXCLUDED.rate;
