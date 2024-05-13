-- General Data --
INSERT INTO
    account (data)
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
    account (data)
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
            'shopper',
            'suspended',
            false
        )
    );

INSERT INTO
    account (data)
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
            'shopper',
            'suspended',
            false
        )
    );

INSERT INTO
    account (data)
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
    account (data)
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

-- Approve / Reject Test Data --
INSERT INTO
    account (id, data)
VALUES
    (
        'ce1186e7-a1f2-4bff-bbfc-b33641fe5ecd',
        jsonb_build_object(
            'email',
            'approve@email.com',
            'pwhash',
            crypt('pass', '87'),
            'name',
            'Approve Test',
            'username',
            'approve',
            'role',
            'shopper',
            'suspended',
            false
        )
    );

INSERT INTO
    request (account_id)
VALUES
    ('ce1186e7-a1f2-4bff-bbfc-b33641fe5ecd');