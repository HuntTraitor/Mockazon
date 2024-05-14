DELETE FROM shopper;
DELETE FROM vendor;
INSERT INTO shopper(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f5', jsonb_build_object( 'email', 'shopper@email.com', 'pwhash', crypt('pass', '87'), 'name', 'shopper account 1', 'username', 'shopperaccount', 'role', 'shopper', 'suspended', false));
INSERT INTO vendor(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f6', jsonb_build_object( 'email', 'vendor@email.com', 'pwhash', crypt('pass', '87'), 'name', 'vendor account 1', 'username', 'vendoraccount', 'role', 'vendor', 'suspended', false));
