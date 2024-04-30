DELETE FROM account;
INSERT INTO account(data) VALUES (jsonb_build_object('email', 'lteixeir@ucsc.edu', 'pwhash', crypt('ltdpw', '87'), 'role', 'vendor'));