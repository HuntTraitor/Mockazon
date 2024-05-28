DELETE FROM api_key;
INSERT INTO api_key(key, vendor_id, active, blacklisted) VALUES ('bf582726-1927-4604-8d94-7f1540a7eb37', '4f061f79-e0e8-48ff-a2ac-0a56a8ad5f0e', true, false);
INSERT INTO api_key(vendor_id, active, blacklisted) VALUES ('4f061f79-e0e8-48ff-a2ac-0a56a8ad5f0e', true, false);
INSERT INTO api_key(vendor_id, active, blacklisted) VALUES ('4f061f79-e0e8-48ff-a2ac-0a56a8ad5f0e', false, false);
INSERT INTO api_key(vendor_id, active, blacklisted) VALUES ('4f061f79-e0e8-48ff-a2ac-0a56a8ad5f0e', false, true);

-- MuscleTech
INSERT INTO api_key(key, vendor_id, active, blacklisted) VALUES ('dafd37a9-714d-4629-a87d-611d4d79df00', 'a4213cf8-c2e4-4424-8688-0907a6c58fd2', true, false);

-- Ordinary
INSERT INTO api_key(key, vendor_id, active, blacklisted) VALUES ('f1b1b1b1-714d-4629-a87d-611d4d79df01', 'a4213cf8-c2e4-4424-8688-0907a6c58fd3', true, false);

-- Colgate
INSERT INTO api_key(key, vendor_id, active, blacklisted) VALUES ('f1b1b1b1-714d-4629-a87d-611d4d79df02', 'a4213cf8-c2e4-4424-8688-0907a6c58fd4', true, false);