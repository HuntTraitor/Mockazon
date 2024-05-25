-- Admin Data --
INSERT INTO
    administrator (data)
VALUES
    (
        jsonb_build_object(
            'email',
            'addelros@ucsc.edu',
            'pwhash',
            crypt('pass', '87'),
            'name',
            'Alfonso Del Rosario',
            'username',
            'addelros',
            'role',
            'admin',
            'suspended',
            false
        )
    );

INSERT INTO
    administrator (data)
VALUES
    (
        jsonb_build_object(
            'email',
            'evmetcal@ucsc.edu',
            'pwhash',
            crypt('pass', '87'),
            'name',
            'Evan Metcalf',
            'username',
            'evmetcal',
            'role',
            'admin',
            'suspended',
            false
        )
    );

INSERT INTO
    administrator (data)
VALUES
    (
        jsonb_build_object(
            'email',
            'tryles@ucsc.edu',
            'pwhash',
            crypt('pass', '87'),
            'name',
            'Trevor Ryles',
            'username',
            'tryles',
            'role',
            'admin',
            'suspended',
            false
        )
    );

INSERT INTO
    administrator (data)
VALUES
    (
        jsonb_build_object(
            'email',
            'lteixeir@ucsc.edu',
            'pwhash',
            crypt('pass', '87'),
            'name',
            'Lukas Teixeira Döpcke',
            'username',
            'lteixeir',
            'role',
            'admin',
            'suspended',
            false
        )
    );

INSERT INTO
    administrator (data)
VALUES
    (
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
            'admin',
            'suspended',
            false
        )
    );

INSERT INTO
    administrator (data)
VALUES
    (
        jsonb_build_object(
            'email',
            'elkrishn@ucsc.edu',
            'pwhash',
            crypt('pass', '87'),
            'name',
            'Eesha',
            'username',
            'elkrishn',
            'role',
            'admin',
            'suspended',
            false
        )
    );

-- Vendor Data --
INSERT INTO
    vendor (data)
VALUES
    (
        jsonb_build_object(
            'email',
            'addelros@ucsc.edu',
            'pwhash',
            crypt('pass', '87'),
            'name',
            'Alfonso Del Rosario',
            'username',
            'addelros',
            'role',
            'vendor',
            'suspended',
            false
        )
    );

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

-- Shopper Data --
INSERT INTO
    shopper(data)
VALUES
    (
        jsonb_build_object(
            'sub',
            'pass',
            'email',
            'addelros@ucsc.edu',
            'name',
            'Alfonso Del Rosario',
            'username',
            'addelros',
            'role',
            'shopper',
            'suspended',
            false
        )
    );

-- Request Data --
INSERT INTO
    request (data)
VALUES
    (
        jsonb_build_object(
            'email',
            'request@ucsc.edu',
            'pwhash',
            crypt('pass', '87'),
            'name',
            'request',
            'username',
            'request',
            'role',
            'vendor',
            'suspended',
            false
        )
    );

--- Shopper Data ---
-- FIXME: We don't want order history as a table here. We have orders in the order service,
-- so you can get the order history by querying that. You cannot store json for this type of data,
-- because you can imagine it's just going to grow and grow and become a mess. That's why you have
-- relationals dbs with rows
INSERT INTO
    shopper (data)
VALUES
    (
        jsonb_build_object(
        'email', 'evan.metcalf3@gmail.com',
        'pwhash', crypt('pass', '87'),
        'sub',
        'pass1',
        'name', 'Evan Metcalf',
        'username', 'Nave Flactem',
        'role', 'shopper',
        'suspended', false,
        'shippingInfo', jsonb_build_array(
            jsonb_build_object(
                'name', 'Evan Metcalf',
                'addressLine1', '1234 Elm St',
                'country', 'USA',
                'city', 'Santa Cruz',
                'state', 'CA',
                'postalCode', '95060'
            ),
            jsonb_build_object(
                'name', 'Evan Metcalf',
                'addressLine1', '5678 Oak St',
                'country', 'USA',
                'city', 'Santa Cruz',
                'state', 'CA',
                'postalCode', '95060'
            )
        ),
        'orderHistory', jsonb_build_array(
            jsonb_build_object(
                'id', '1',
                'createdAt', '2021-03-01T00:00:00Z',
                'shippingAddress', jsonb_build_object(
                    'name', 'Evan Metcalf',
                    'addressLine1', '1234 Elm St',
                    'country', 'USA',
                    'city', 'Santa Cruz',
                    'state', 'CA',
                    'postalCode', '95060'
                ),
                'paymentMethod', 'Credit Card',
                'subtotal', 49.97,
                'totalBeforeTax', 49.97,
                'tax', 0,
                'total', 49.97

            ),
            jsonb_build_object(
                'id', '2',
                'createdAt', '2021-03-15T00:00:00Z',
                'shippingAddress', jsonb_build_object(
                    'name', 'Evan Metcalf',
                    'addressLine1', '5678 Oak St',
                    'country', 'USA',
                    'city', 'Santa Cruz',
                    'state', 'CA',
                    'postalCode', '95060'
                ),
                'paymentMethod', 'PayPal',
                'subtotal', 77.96,
                'totalBeforeTax', 77.96,
                'tax', 0,
                'total', 77.96
            )
        )
    )
);
