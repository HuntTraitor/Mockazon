INSERT INTO product(id, vendor_id, data, active) VALUES ('d1c689b1-b7a7-4100-8b2d-309908b444f5', '78b9467a-8029-4c1f-afd9-ea56932c3f46', jsonb_set(jsonb_build_object('name','The Great Gatsby','price', (12.99)::NUMERIC), '{properties}', jsonb_build_object('author', 'F. Scott Fitzgerald')), TRUE);
INSERT INTO product(vendor_id, data, active) VALUES ('78b9467a-8029-4c1f-afd9-ea56932c3f45', jsonb_set(jsonb_build_object('name','Car', 'price', (10000.00)::NUMERIC), '{properties}', jsonb_build_object('color', 'red')), TRUE);
INSERT INTO product(vendor_id, data, active) VALUES ('78b9467a-8029-4c1f-afd9-ea56932c3f45', jsonb_set(jsonb_build_object('name','House', 'price', (100000.00)::NUMERIC), '{properties}', jsonb_build_object('rooms', 5)), FALSE);

INSERT INTO review(id, reviewer_id, data) VALUES ('bc28df39-37d5-40d8-8c53-123f735672ed', '5a85526a-ef59-4d5e-8fa1-f7a2afe2ae75', jsonb_build_object('rating', 5, 'comment', 'Great book!'));
INSERT INTO review(reviewer_id, data) VALUES ('b8fa99e6-f7e7-4b81-83cf-225bd1fc344b', jsonb_build_object('rating', 4, 'comment', 'Good book!'));

INSERT INTO product_review(product_id, reviewer_id) VALUES ('d1c689b1-b7a7-4100-8b2d-309908b444f5', '5a85526a-ef59-4d5e-8fa1-f7a2afe2ae75');
INSERT INTO product_review(product_id, reviewer_id) VALUES ('d1c689b1-b7a7-4100-8b2d-309908b444f5', 'b8fa99e6-f7e7-4b81-83cf-225bd1fc344b');