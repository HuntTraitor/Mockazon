DELETE FROM shopper;
DELETE FROM vendor;
DELETE FROM request;

-- Admin Test Data -- 
INSERT INTO shopper(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f5', jsonb_build_object( 'email', 'shopper@email.com', 'pwhash', crypt('pass', '87'), 'name', 'shopper account 1', 'username', 'shopperaccount', 'role', 'shopper', 'suspended', false));
INSERT INTO vendor(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f6', jsonb_build_object( 'email', 'vendor@email.com', 'pwhash', crypt('pass', '87'), 'name', 'vendor account 1', 'username', 'vendoraccount', 'role', 'vendor', 'suspended', false));
INSERT INTO
    vendor (id, data)
VALUES
    (
        '4f061f79-e0e8-48ff-a2ac-0a56a8ad5f0e',
        jsonb_build_object(
            'email',
            'htratar@ucsc.edu',
            'pwhash',
            crypt('pass', '87'),
            'name',
            'Hunter Tratar',
            'username',
            'huntertratar',
            'role',
            'vendor',
            'suspended',
            false
        )
    );
INSERT INTO request(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f7', jsonb_build_object( 'email', 'request1@email.com', 'pwhash', crypt('pass', '87'), 'name', 'request account 1', 'username', 'requestaccount1', 'role', 'vendor', 'suspended', false));
INSERT INTO request(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f8', jsonb_build_object( 'email', 'request2@email.com', 'pwhash', crypt('pass', '87'), 'name', 'request account 2', 'username', 'requestaccount2', 'role', 'vendor', 'suspended', false));

-- Login Test Data --
INSERT INTO administrator(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f9', jsonb_build_object( 'email', 'anna@books.com', 'pwhash', crypt('annaadmin', '87'), 'name', 'Anna', 'username', 'annaadmin', 'role', 'admin', 'suspended', false));
INSERT INTO vendor(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f3', jsonb_build_object( 'email', 'victor@books.com', 'pwhash', crypt('victorvendor', '87'), 'name', 'Victor', 'username', 'victorvendor', 'role', 'vendor', 'suspended', false));
INSERT INTO shopper(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f1', jsonb_build_object( 'email', 'shirly@books.com', 'pwhash', crypt('shirlyshopper', '87'), 'name', 'Shirly', 'username', 'shirlyshopper', 'role', 'shopper', 'suspended', false, 'sub', 'testsub'));

--- Shopper Data ---
INSERT INTO shopper (data) VALUES (jsonb_build_object('email', 'testuser@gmail.com', 'pwhash', crypt('pass', '87'), 'sub', 'pass2', 'name', 'Test User', 'username', 'testuser', 'role', 'shopper', 'suspended', false, 'shippingInfo', jsonb_build_array(jsonb_build_object('addressLine1', '1234 Elm St', 'city', 'Santa Cruz', 'state', 'CA', 'postalCode', '95060', 'country', 'USA'), jsonb_build_object('addressLine1', '5678 Oak St', 'city', 'Santa Cruz', 'state', 'CA', 'postalCode', '95060', 'country', 'USA'))));

