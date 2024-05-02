DROP TABLE IF EXISTS product CASCADE;
CREATE TABLE product(id UUID DEFAULT gen_random_uuid(), vendor_id UUID, active BOOLEAN DEFAULT TRUE, data jsonb, PRIMARY KEY(id, vendor_id));