DROP TABLE IF EXISTS "order" CASCADE;
CREATE TABLE "order"(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), product_id UUID, account_id UUID, data jsonb);