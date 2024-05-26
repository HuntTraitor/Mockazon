INSERT INTO vendor_order (product_id, shopper_id, vendor_id, data) VALUES ('9b6978e7-94f0-44a3-afe4-96c8ed6e179d', 'a43deae2-5f8f-4c91-abbf-6f77d6f5b078', 'e3c5a0f2-7d18-42c9-b0f4-85951d850360', '{"purchaseDate": "2024-05-01", "quantity": "3", "shipped": false, "delivered": false}');
INSERT INTO vendor_order (product_id, shopper_id, vendor_id, data) VALUES ('4d8f2a69-24a6-4e6f-8b5b-8cb9f1d02d30', '6fd9bc0b-e7bf-4e97-b1c3-2225678a5c9c', 'e6c06ded-bcb3-468c-812f-b3b54b173f2b', '{"purchaseDate": "2024-05-02", "quantity": "1", "shipped": true, "delivered": false}');
INSERT INTO vendor_order (product_id, shopper_id, vendor_id, data) VALUES ('31ef4f4e-58d7-4b20-844b-e72aab928637', '4056d1a9-7ee4-4b5b-8f25-d5b471d05801', 'b4044c07-866c-4b5d-9b76-d4da0d1599b2', '{"purchaseDate": "2024-05-03", "quantity": "5", "shipped": false, "delivered": true}');
INSERT INTO vendor_order (product_id, shopper_id, vendor_id, data) VALUES ('c337a8d1-c5b4-4b85-bc8f-668b2ec4e1fb', 'bbfe3405-aa1a-4859-b80f-936321aba8b8', '0c3778a7-d850-4dcc-a97b-87aac9f6e8f3', '{"purchaseDate": "2024-05-04", "quantity": "2", "shipped": true, "delivered": true}');
INSERT INTO vendor_order (product_id, shopper_id, vendor_id, data) VALUES ('5f04d5e8-7e6c-46ef-aa5c-02acf4af2f21', 'f067f4e8-c8b7-44d5-97af-0996b04acb65', 'f8c316b1-7dcc-4fa7-8a49-a4e689abf637', '{"purchaseDate": "2024-05-05", "quantity": "8", "shipped": true, "delivered": false}');

INSERT INTO shopping_cart_item(product_id, shopper_id) VALUES ('d1c689b1-b7a7-4100-8b2d-309908b444f5', 'f067f4e8-c8b7-44d5-97af-0996b04acb65');

-- Shopper Order Sample data
INSERT INTO shopper_order(id, shopper_id, data) VALUES ('3f993f63-2b6c-4628-9f51-b46425ca80f1', '89f5cbfb-40a9-470d-ac8f-99e0416c6234', '{"createdAt": "2024-05-08T00:00:00Z", "paymentMethod": "Mastercard", "paymentDigits": "2451", "subtotal": "49.97", "tax": "10.27", "total": "60.24", "shippingAddress": {"name": "Evan Metcalf", "addressLine1": "1234 Elm St", "country": "USA", "city": "Santa Cruz", "state": "CA", "postalCode": "95060"}, "shipped": false, "delivered": false, "deliveryTime": "2024-07-30T02:15:01.123Z"}');
INSERT INTO shopper_order(id, shopper_id, data) VALUES ('4f993f63-2b6c-4628-9f51-b46425ca80f2', '89f5cbfb-40a9-470d-ac8f-99e0416c6234', '{"createdAt": "2024-06-10T00:00:00Z", "paymentMethod": "Visa", "paymentDigits": "1234", "subtotal": "79.99", "tax": "16.50", "total": "96.49", "shippingAddress": {"name": "Evan Metcalf", "addressLine1": "1234 Elm St", "country": "USA", "city": "Santa Cruz", "state": "CA", "postalCode": "95060"}, "shipped": false, "delivered": false, "deliveryTime": "2024-07-30T02:15:01.123Z"}');
INSERT INTO shopper_order(id, shopper_id, data) VALUES ('5f993f63-2b6c-4628-9f51-b46425ca80f3', '89f5cbfb-40a9-470d-ac8f-99e0416c6234', '{"createdAt": "2024-07-12T00:00:00Z", "paymentMethod": "Amex", "paymentDigits": "5678", "subtotal": "120.00", "tax": "24.80", "total": "144.80", "shippingAddress": {"name": "Evan Metcalf", "addressLine1": "1234 Elm St", "country": "USA", "city": "Santa Cruz", "state": "CA", "postalCode": "95060"}, "shipped": false, "delivered": false, "deliveryTime": "2024-07-30T02:15:01.123Z"}');
INSERT INTO shopper_order(id, shopper_id, data) VALUES ('6f993f63-2b6c-4628-9f51-b46425ca80f4', '89f5cbfb-40a9-470d-ac8f-99e0416c6234', '{"createdAt": "2024-08-14T00:00:00Z", "paymentMethod": "Discover", "paymentDigits": "9012", "subtotal": "45.00", "tax": "9.30", "total": "54.30", "shippingAddress": {"name": "Evan Metcalf", "addressLine1": "1234 Elm St", "country": "USA", "city": "Santa Cruz", "state": "CA", "postalCode": "95060"}, "shipped": false, "delivered": false, "deliveryTime": "2024-07-30T02:15:01.123Z"}');

--Order data for hunter
INSERT INTO shopper_order(id, shopper_id, data) VALUES ('90a687ba-3d5f-4799-9961-054b547ce1c8', 'c3353dbe-1903-42a6-ac6f-ab8133f73c7a', '{"createdAt": "2024-08-14T00:00:00Z", "paymentMethod": "Discover", "paymentDigits": "9012", "subtotal": "45.00", "tax": "9.30", "total": "54.30", "shippingAddress": {"name": "Hunter Tratar", "addressLine1": "434 Dufour st", "country": "USA", "city": "Santa Cruz", "state": "CA", "postalCode": "95060"}, "shipped": false, "delivered": false, "deliveryTime": "2024-07-30T02:15:01.123Z"}');
INSERT INTO order_product(order_id, product_id) VALUES ('90a687ba-3d5f-4799-9961-054b547ce1c8', '7064701e-dee7-46c8-a755-da5bf727539c');
INSERT INTO order_product(order_id, product_id) VALUES ('90a687ba-3d5f-4799-9961-054b547ce1c8', 'd1c689b1-b7a7-4100-8b2d-309908b444f5');



INSERT INTO order_product(order_id, product_id) VALUES ('3f993f63-2b6c-4628-9f51-b46425ca80f1', 'd1c689b1-b7a7-4100-8b2d-309908b444f5');
INSERT INTO order_product(order_id, product_id) VALUES ('3f993f63-2b6c-4628-9f51-b46425ca80f1', '7064701e-dee7-46c8-a755-da5bf727539c');

INSERT INTO order_product(order_id, product_id) VALUES ('4f993f63-2b6c-4628-9f51-b46425ca80f2', '7064701e-dee7-46c8-a755-da5bf727539c');

INSERT INTO order_product(order_id, product_id) VALUES ('5f993f63-2b6c-4628-9f51-b46425ca80f3', '7064701e-dee7-46c8-a755-da5bf727539c');

INSERT INTO order_product(order_id, product_id) VALUES ('6f993f63-2b6c-4628-9f51-b46425ca80f4', '7064701e-dee7-46c8-a755-da5bf727539c');
INSERT INTO order_product(order_id, product_id) VALUES ('6f993f63-2b6c-4628-9f51-b46425ca80f4', '7064701e-dee7-46c8-a755-da5bf727539c');