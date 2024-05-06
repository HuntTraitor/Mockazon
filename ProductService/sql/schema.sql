DROP TABLE IF EXISTS product CASCADE; 
DROP TABLE IF EXISTS review CASCADE; 
DROP TABLE IF EXISTS product_review CASCADE;
CREATE TABLE product (id UUID DEFAULT gen_random_uuid() UNIQUE, vendor_id UUID, active BOOLEAN DEFAULT TRUE, created TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC'), posted TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC'), data jsonb, PRIMARY KEY(id, vendor_id));
CREATE TABLE review (id UUID DEFAULT gen_random_uuid() UNIQUE, reviewer_id UUID UNIQUE, created TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC'), posted TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC'), data jsonb, PRIMARY KEY(id, reviewer_id));
CREATE TABLE product_review (product_id UUID REFERENCES product(id), reviewer_id UUID REFERENCES review(reviewer_id), PRIMARY KEY(product_id, reviewer_id), UNIQUE (product_id, reviewer_id));
