DELETE FROM shopper;
DELETE FROM vendor;
DELETE FROM request;

-- Admin Test Data -- 
INSERT INTO shopper(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f5', jsonb_build_object( 'email', 'shopper@email.com', 'pwhash', crypt('pass', '87'), 'name', 'shopper account 1', 'username', 'shopperaccount', 'role', 'shopper', 'suspended', false));
INSERT INTO vendor(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f6', jsonb_build_object( 'email', 'vendor@email.com', 'pwhash', crypt('pass', '87'), 'name', 'vendor account 1', 'username', 'vendoraccount', 'role', 'vendor', 'suspended', false));
INSERT INTO request(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f7', jsonb_build_object( 'email', 'request1@email.com', 'pwhash', crypt('pass', '87'), 'name', 'request account 1', 'username', 'requestaccount1', 'role', 'vendor', 'suspended', false));
INSERT INTO request(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f8', jsonb_build_object( 'email', 'request2@email.com', 'pwhash', crypt('pass', '87'), 'name', 'request account 2', 'username', 'requestaccount2', 'role', 'vendor', 'suspended', false));

-- Login Test Data --
INSERT INTO administrator(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f9', jsonb_build_object( 'email', 'anna@books.com', 'pwhash', crypt('annaadmin', '87'), 'name', 'Anna', 'username', 'annaadmin', 'role', 'admin', 'suspended', false));
