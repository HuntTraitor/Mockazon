-- Do not delete this table
DROP TABLE IF EXISTS member CASCADE;
CREATE TABLE member(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);

-- Your schema DDL (create table statements etc.) from Assignment 1 goes below here
CREATE UNIQUE INDEX member_email_unq on member((data->>'email'));
-- Your schema DDL (create table statements etc.) from Assignment 1 goes below here
DROP TABLE IF EXISTS post CASCADE;
CREATE TABLE post(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);

DROP TABLE IF EXISTS friend CASCADE;
CREATE TABLE friend(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), requestingFriend uuid REFERENCES member(id) ON DELETE CASCADE, receivingFriend uuid REFERENCES member(id) ON DELETE CASCADE, UNIQUE(requestingFriend, receivingFriend), UNIQUE(receivingFriend, requestingFriend), request boolean default true);
