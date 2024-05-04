DROP TABLE IF EXISTS account;
CREATE TABLE account(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);
CREATE UNIQUE INDEX idx_unique_sub ON account((data->>'sub'));
CREATE UNIQUE INDEX idx_unique_email ON account((data->>'email'));

