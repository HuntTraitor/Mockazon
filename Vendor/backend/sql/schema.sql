DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS vendor CASCADE;
CREATE TABLE vendor(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);
CREATE TABLE product(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid());
CREATE TABLE "order"(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), product_id UUID REFERENCES product(id), data jsonb);