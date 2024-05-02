INSERT INTO product (id, vendor_id, data, active) VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '{"name": "Active Product"}', TRUE);
INSERT INTO product (id, vendor_id, data, active) VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '{"name": "Inactive Product"}', FALSE);

INSERT INTO product(id, vendor_id, data, active) VALUES ('d1c689b1-b7a7-4100-8b2d-309908b444f5', '81c689b1-b7a7-4100-8b2d-309908b444f5', jsonb_build_object('name','The Great Gatsby','price',12.99,'stock',100), TRUE);
INSERT INTO product(vendor_id, data, active) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f5', jsonb_build_object('name','Car', 'price', 10000.00, 'stock', 10), TRUE);
INSERT INTO product(vendor_id, data, active) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f5', jsonb_build_object('name','House', 'price', 100000.00, 'stock', 1), TRUE);