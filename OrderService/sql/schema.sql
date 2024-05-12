DROP TABLE IF EXISTS vendor_order CASCADE;
CREATE TABLE vendor_order(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), product_id UUID, shopper_id UUID, vendor_id UUID, data jsonb);

DROP TABLE IF EXISTS shopping_cart CASCADE;
CREATE TABLE shopping_cart(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), product_id UUID, shopper_id UUID, vendor_id UUID, data jsonb, CONSTRAINT unique_shopper UNIQUE (shopper_id));
