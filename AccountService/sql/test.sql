-- Roles: [admin, vendor, shopper]
INSERT INTO user_account (data) VALUES (jsonb_build_object('email', 'anna@books.com', 'name', 'Anna Admin', 'username', 'annaadmin', 'role', 'admin'));
