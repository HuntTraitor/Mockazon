DELETE FROM account;
INSERT INTO account(data) VALUES (jsonb_build_object('email', 'lteixeir@ucsc.edu', 'pwhash', crypt('ltdpw', '87'), 'role', 'vendor'));
INSERT INTO account(data) VALUES (jsonb_build_object('email', 'htratar@ucsc.edu', 'pwhash', crypt('wow1234', '87'), 'role', 'vendor'));
INSERT INTO account(data) VALUES (jsonb_build_object('email', 'elkrishn@ucsc.edu', 'pwhash', crypt('elk', '87'), 'role', 'admin'));
