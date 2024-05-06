DROP TABLE IF EXISTS vendor_order CASCADE;
CREATE TABLE vendor_order(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), product_id UUID, shopper_id UUID, vendor_id UUID, data jsonb);