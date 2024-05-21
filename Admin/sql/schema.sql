DROP TABLE IF EXISTS request;

DROP TABLE IF EXISTS vendor;

DROP TABLE IF EXISTS shopper;

DROP TABLE IF EXISTS administrator;

CREATE TABLE administrator(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);

CREATE TABLE shopper(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);

CREATE TABLE vendor(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);

CREATE TABLE request(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, data jsonb);
