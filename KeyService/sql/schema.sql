DROP TABLE IF EXISTS api_key;
CREATE TABLE api_key(key UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), vendor_id UUID, requested boolean, active boolean);