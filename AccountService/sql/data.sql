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

INSERT INTO
    administrator (data)
VALUES
    (
        jsonb_build_object(
                'email',
                'drharrisonadmin@ucsc.edu',
                'pwhash',
                crypt('pass', '87'),
                'name',
                'Dr. Harrison',
                'username',
                'drharrison',
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
    vendor (data)
VALUES
    (
        jsonb_build_object(
                'email',
                'drharrisonvendor@ucsc.edu',
                'pwhash',
                crypt('pass', '87'),
                'name',
                'Dr. Harrison',
                'username',
                'drharrison',
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

INSERT INTO
    vendor (id, data)
VALUES
    (
        '78b9467a-8029-4c1f-afd9-ea56932c3f45',
        jsonb_build_object(
            'email',
            'vincent@books.com',
            'pwhash',
            crypt('pass', '87'),
            'name',
            'Vincent Vendor',
            'username',
            'vincentvendor',
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
        '89f5cbfb-40a9-470d-ac8f-99e0416c6234',
        jsonb_build_object(
            'email',
            'victor@books.com',
            'pwhash',
            crypt('pass', '87'),
            'name',
            'Victor Vendor',
            'username',
            'victorvendor',
            'role',
            'vendor',
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

-- Shopper Data --
INSERT INTO
    shopper(data)
VALUES
    (
        jsonb_build_object(
            'sub',
            'pass',
            'email',
            'demo@email.com',
            'name',
            'Demo Dominique',
            'username',
            'demodominique',
            'role',
            'shopper',
            'suspended',
            false
        )
    );

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
        'suspended', false
    )
);

INSERT INTO
    shopper (id, data)
VALUES
    (
        '89f5cbfb-40a9-470d-ac8f-99e0416c6234',
        jsonb_build_object(
        'email', 'lteixeir@ucsc.edu',
        'pwhash', crypt('pass', '87'),
        'sub', 'sub',
        'name', 'Lukas Teixeira Döpcke',
        'username', 'lteixeir',
        'role', 'shopper',
        'suspended', false
        )
    );

INSERT INTO
    shopper (id, data)
VALUES
    (
        'c3353dbe-1903-42a6-ac6f-ab8133f73c7a',
        jsonb_build_object(
        'email', 'hunterrrisatratar@gmail.com',
        'pwhash', crypt('pass', '87'),
        'sub', 'sub',
        'name', 'Hunter J Tratar',
        'username', 'htratar',
        'role', 'shopper',
        'suspended', false
        )
    );
