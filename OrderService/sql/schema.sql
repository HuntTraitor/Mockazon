DROP TABLE IF EXISTS vendor_order CASCADE;
CREATE TABLE vendor_order(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), product_id UUID, shopper_id UUID, vendor_id UUID, data jsonb);

DROP TABLE IF EXISTS shopping_cart_item CASCADE;
CREATE TABLE shopping_cart_item(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), shopper_id UUID, product_id UUID, data jsonb);
