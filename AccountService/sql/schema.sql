DROP TABLE IF EXISTS user_account;
CREATE TABLE user_account(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);