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
    vendor (data)
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