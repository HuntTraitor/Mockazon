-- Roles: [admin, vendor, shopper]
-- approved vs. is_vendor

-- General Data --
INSERT INTO account (data) VALUES (jsonb_build_object('email', 'addelros@ucsc.edu', 'name', 'Alfonso Del Rosario', 'username', 'addelros', 'role', 'vendor'));
INSERT INTO account (data) VALUES (jsonb_build_object('email', 'evmetcal@ucsc.edu', 'name', 'Evan Metcalf', 'username', 'evmetcal', 'role', 'shopper'));
INSERT INTO account (data) VALUES (jsonb_build_object('email', 'lteixeir@ucsc.edu', 'name', 'Lukas Teixeira Döpcke', 'username', 'lteixeir', 'role', 'admin'));

-- Approve / Reject Test Data --
INSERT INTO account (id, data) VALUES ('ce1186e7-a1f2-4bff-bbfc-b33641fe5ecd', jsonb_build_object('email', 'approve@email.com', 'name', 'Approve Test', 'username', 'approve', 'role', 'shopper', 'suspended', false)); 
INSERT INTO request (account_id) VALUES ('ce1186e7-a1f2-4bff-bbfc-b33641fe5ecd');