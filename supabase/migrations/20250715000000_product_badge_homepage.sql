-- Homepage Most Requested badges from client brief
ALTER TYPE product_badge_type ADD VALUE IF NOT EXISTS 'recommended';
ALTER TYPE product_badge_type ADD VALUE IF NOT EXISTS 'bestValue';
ALTER TYPE product_badge_type ADD VALUE IF NOT EXISTS 'fastDelivery';
