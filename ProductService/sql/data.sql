INSERT INTO vendor(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b442f5', jsonb_build_object('email','anna@books.com','name','Anna Admin','pwhash',crypt('annaadmin','cs'),'roles','["admin"]'));

INSERT INTO product(id, vendor_id, data) VALUES ('d1c689b1-b7a7-4100-8b2d-309908b444f5', '81c689b1-b7a7-4100-8b2d-309908b444f5', jsonb_build_object('name','The Great Gatsby','price',12.99,'stock',100));
INSERT INTO product(vendor_id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f5', jsonb_build_object('name','Car', 'price', 10000.00, 'stock', 10));
INSERT INTO product(vendor_id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f5', jsonb_build_object('name','House', 'price', 100000.00, 'stock', 1));