INSERT INTO product VALUES (gen_random_uuid());
INSERT INTO "order"(product, data) VALUES ((SELECT id FROM product), jsonb_build_object('ordered', 'date'));