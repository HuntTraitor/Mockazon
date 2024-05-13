DROP TABLE IF EXISTS request;

DROP TABLE IF EXISTS vendor;

DROP TABLE IF EXISTS shopper;

DROP TABLE IF EXISTS administrator;

DROP TABLE IF EXISTS account;

CREATE TABLE account(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb); -- Will be removed --
CREATE TABLE administrator(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb); -- Will be removed --

CREATE TABLE shopper(
    id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    data jsonb
);

CREATE TABLE vendor(
    id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    data jsonb
);

CREATE TABLE request(
    id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data jsonb
);