-- Roles: [admin, vendor, shopper]
INSERT INTO user_account (data) VALUES (jsonb_build_object('email', 'addelros@ucsc.edu', 'name', 'Alfonso Del Rosario', 'username', 'addelros', 'role', 'vendor'));
INSERT INTO user_account (data) VALUES (jsonb_build_object('email', 'evmetcal@ucsc.edu', 'name', 'Evan Metcalf', 'username', 'evmetcal', 'role', 'shopper'));
INSERT INTO user_account (data) VALUES (jsonb_build_object('email', 'lteixeir@ucsc.edu', 'name', 'Lukas Teixeira Döpcke', 'username', '	lteixeir', 'role', 'admin'));