-- BikeVN Database Sample Data (Seed)
-- With normalized vehicle_brands and vehicle_models tables
-- Created: 2024

USE bikevn_db;

-- ========================================
-- SAMPLE DATA - roles
-- ========================================
INSERT INTO roles (id, name, description) VALUES
('ac079c2d-da6c-4462-88d6-e025f58c2844', 'employee', 'Employee with staff privileges'),
('f8ed61b2-add4-4a7c-9d16-7a97fe78dc58', 'manager', 'Branch or department manager'),
('093317a1-ab50-4e65-be85-ee6e0d442729', 'support', 'Customer support staff');

-- ========================================
-- SAMPLE DATA - users (UUID primary keys - without role column)
-- ========================================
INSERT INTO users (id, name, email, password_hash, phone, cccd_number, is_active) VALUES
('32481aa5-1c15-4efc-8e79-a947f44719f6', 'Nguyen Van A', 'nguyena@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0901234567', '001234567891', 1),
('00a58e19-6462-4045-93fe-870e604b9311', 'Tran Thi B', 'tranb@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0902345678', '001234567892', 1),
('40039cd5-dc03-48c4-95b8-75061f18a7f0', 'Pham Van C', 'phamc@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0903456789', '001234567893', 1),
('2de6c709-2b0e-4bd5-8ab5-8b28f75ada6e', 'Le Thi D', 'led@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0904567890', '001234567894', 1),
('f6869750-0ec9-49a6-a6e8-0a70d4b9e7f7', 'Hoang Van E', 'hoange@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0905678901', '001234567895', 1);

-- ========================================
-- SAMPLE DATA - users_roles (assign roles to users)
-- ========================================
INSERT INTO users_roles (user_id, role_id) VALUES
-- Admin user gets admin role
('c815d217-8e21-46ee-9b53-79fc6cf81a84', '7ded611a-4d31-4be6-ab6e-05fa063ed04a'),

-- Employee user gets employee and support roles
('32481aa5-1c15-4efc-8e79-a947f44719f6', 'ac079c2d-da6c-4462-88d6-e025f58c2844'),
('32481aa5-1c15-4efc-8e79-a947f44719f6', '093317a1-ab50-4e65-be85-ee6e0d442729'),

-- Regular users get user role
('00a58e19-6462-4045-93fe-870e604b9311', 'c8d017a3-848c-45cf-886d-8c8c0c1c47fa'),
('40039cd5-dc03-48c4-95b8-75061f18a7f0', 'c8d017a3-848c-45cf-886d-8c8c0c1c47fa'),
('2de6c709-2b0e-4bd5-8ab5-8b28f75ada6e', 'c8d017a3-848c-45cf-886d-8c8c0c1c47fa'),
('f6869750-0ec9-49a6-a6e8-0a70d4b9e7f7', 'c8d017a3-848c-45cf-886d-8c8c0c1c47fa');

-- ========================================
-- SAMPLE DATA - vehicle_brands
-- ========================================
INSERT INTO vehicle_brands (name, country, created_at) VALUES
('Honda', 'Japan', NOW()),
('Yamaha', 'Japan', NOW()),
('Suzuki', 'Japan', NOW()),
('Kawasaki', 'Japan', NOW()),
('Harley-Davidson', 'USA', NOW()),
('Ducati', 'Italy', NOW()),
('Vespa', 'Italy', NOW()),
('Aprilia', 'Italy', NOW()),
('Royal Enfield', 'India', NOW()),
('Bajaj', 'India', NOW()),
('SYM', 'Taiwan', NOW());

-- ========================================
-- SAMPLE DATA - vehicle_models
-- ========================================
INSERT INTO vehicle_models (brand_id, name, engine_capacity, year_from, year_to, created_at) VALUES
(1, 'Wave 110', 110, 2020, 2024, NOW()),
(1, 'Dream', 110, 2020, 2024, NOW()),
(1, 'Future', 110, 2020, 2024, NOW()),
(1, 'Blade', 110, 2020, 2024, NOW()),
(1, 'CB150R', 150, 2021, 2024, NOW()),
(1, 'SH 150', 150, 2020, 2024, NOW()),
(1, 'Air Blade', 125, 2020, 2024, NOW()),
(2, 'Exciter 150', 150, 2021, 2024, NOW()),
(2, 'Sirius', 110, 2020, 2024, NOW()),
(2, 'NVX 155', 155, 2021, 2024, NOW()),
(3, 'Raider 150', 150, 2020, 2024, NOW()),
(4, 'Ninja 400', 400, 2018, 2024, NOW()),
(6, 'Monster 659', 659, 2015, 2024, NOW()),
(5, 'Street 750', 750, 2014, 2024, NOW()),
(7, 'Primavera 150', 150, 2013, 2024, NOW()),
(8, 'SR160', 160, 2017, 2024, NOW()),
(5, 'Street 500', 500, 2015, 2024, NOW()),
(8, 'Tuono 300', 300, 2016, 2024, NOW()),
(9, 'Classic 350', 350, 2009, 2024, NOW()),
(10, 'Pulsar 150', 150, 2019, 2024, NOW()),
(11, 'VF 200', 200, 2018, 2024, NOW());

-- ========================================
-- SAMPLE DATA - branches
-- ========================================
INSERT INTO branches (id, name, address, lat, lng, status) VALUES
('42ce84a3-e54f-415d-b707-a8a818c00a9c', 'Chi nhanh TP Ho Chi Minh', '123 Nguyen Hue, District 1, HCMC', 10.77588, 106.70183, 'active'),
('e58c1884-0ded-477d-a0e6-7a7cb8099771', 'Chi nhanh Ha Noi', '456 Tran Hung Dao, Hoan Kiem, Hanoi', 21.02774, 105.84159, 'active'),
('6e2fcdd0-e38b-485a-a168-4836f9b02fbe', 'Chi nhanh Da Nang', '789 Tran Phu, Hai Chau, Da Nang', 16.06778, 108.22083, 'active'),
('8ffb93d8-6e47-4114-a67e-b870919ab33b', 'Chi nhanh Can Tho', '321 Mau Than, Ninh Kieu, Can Tho', 10.03000, 105.78670, 'inactive');

-- ========================================
-- SAMPLE DATA - vehicles (with brand_id and model_id)
-- ========================================
INSERT INTO vehicles (id, name, brand_id, model_id, license_plate, color, year, price_per_day, vehicle_type, mileage, description, status, current_branch_id) VALUES

-- HCMC Branch
('d5403559-06fe-4645-ad52-948e166e79c1', 'Honda Wave 110 #1', 1, 1, '74A-12345', 'Red', 2023, 150000, 'fuel', 5000, 'Economical daily rider with excellent fuel efficiency', 'available', '42ce84a3-e54f-415d-b707-a8a818c00a9c'),
('d4b90570-5e9a-46fe-a951-0606895e851a', 'Yamaha Exciter 150 #1', 2, 8, '74A-12346', 'Blue', 2023, 250000, 'fuel', 8000, 'Sporty performance bike with modern design', 'available', '42ce84a3-e54f-415d-b707-a8a818c00a9c'),
('70ea36da-3678-4498-a434-778e44935de5', 'Harley-Davidson Street 750 #1', 5, 17, '74A-12347', 'Black', 2022, 800000, 'fuel', 12000, 'Premium cruiser with iconic design', 'available', '42ce84a3-e54f-415d-b707-a8a818c00a9c'),
('5fcdb03c-42f2-4af4-a135-a5295ab42da0', 'Honda SH 150 #1', 1, 6, '74A-12348', 'Silver', 2023, 300000, 'fuel', 3000, 'Premium scooter with comfort and style', 'unavailable', '42ce84a3-e54f-415d-b707-a8a818c00a9c'),
('784e9a83-2aa7-488f-91bd-34c523b3abeb', 'Suzuki Raider 150 #1', 3, 11, '74A-12349', 'Green', 2023, 200000, 'fuel', 6000, 'Rugged sport bike for adventure seekers', 'maintenance', '42ce84a3-e54f-415d-b707-a8a818c00a9c'),
('d1e3d3b6-31f1-4d52-9d42-bd5eda4d73a1', 'Royal Enfield Classic 350 #1', 9, 19, '74A-12350', 'Brown', 2022, 450000, 'fuel', 15000, 'Classic retro styling with excellent comfort', 'available', '42ce84a3-e54f-415d-b707-a8a818c00a9c'),
('88d68588-6694-4c89-9384-df4c5cbd63fc', 'Aprilia SR160 #1', 8, 18, '74A-12351', 'White', 2023, 180000, 'fuel', 4000, 'Italian scooter with modern features', 'available', '42ce84a3-e54f-415d-b707-a8a818c00a9c'),

-- Hanoi Branch
('65afb455-0a21-423a-8114-da94f9df7d96', 'Honda Dream #1', 1, 2, '29A-54321', 'Red', 2023, 120000, 'fuel', 2000, 'Best-selling daily commuter bike', 'available', 'e58c1884-0ded-477d-a0e6-7a7cb8099771'),
('d7322875-e214-471c-a38b-4a0a77251628', 'Yamaha NVX 155 #1', 2, 10, '29A-54322', 'Orange', 2023, 280000, 'fuel', 5500, 'Modern maxi scooter with ABS technology', 'available', 'e58c1884-0ded-477d-a0e6-7a7cb8099771'),
('21eb518d-6098-488d-8b06-148b51a00f9f', 'Honda CB150R #1', 1, 5, '29A-54323', 'Black', 2023, 320000, 'fuel', 7000, 'Naked sport bike with aggressive styling', 'available', 'e58c1884-0ded-477d-a0e6-7a7cb8099771'),
('585336c2-15ec-4ac4-a5a2-8e49eb8a542e', 'Vespa Primavera 150 #1', 7, 16, '29A-54324', 'Cream', 2022, 400000, 'fuel', 10000, 'Iconic Italian scooter with timeless design', 'available', 'e58c1884-0ded-477d-a0e6-7a7cb8099771'),
('4c251719-cf97-4d4e-92d9-f262d923d820', 'Bajaj Pulsar 150 #1', 10, 20, '29A-54325', 'Gray', 2023, 160000, 'fuel', 4500, 'Budget-friendly sport bike', 'available', 'e58c1884-0ded-477d-a0e6-7a7cb8099771'),

-- Da Nang Branch
('846b0a2b-60b7-420a-b058-8476d1d52484', 'Honda Air Blade #1', 1, 7, '92A-78901', 'Gold', 2023, 180000, 'fuel', 3500, 'Premium scooter with smooth ride', 'available', '6e2fcdd0-e38b-485a-a168-4836f9b02fbe'),
('b0bc5707-94f1-479c-90a5-9ecc5afbe4bd', 'Kawasaki Ninja 400 #1', 4, 12, '92A-78902', 'Green', 2022, 500000, 'fuel', 18000, 'Entry-level sport bike from legendary brand', 'available', '6e2fcdd0-e38b-485a-a168-4836f9b02fbe'),
('5933f90b-8c79-4f9c-b2a3-9e5a345d82e6', 'Ducati Monster 659 #1', 6, 13, '92A-78903', 'Red', 2021, 900000, 'fuel', 22000, 'Premium Italian sport bike', 'maintenance', '6e2fcdd0-e38b-485a-a168-4836f9b02fbe'),
('d942c0ac-f14a-40d6-8440-aaf95506b484', 'SYM VF 200 #1', 11, 21, '92A-78904', 'Silver', 2023, 200000, 'fuel', 6500, 'Spacious scooter for comfortable riding', 'available', '6e2fcdd0-e38b-485a-a168-4836f9b02fbe'),

-- Can Tho Branch
('26005a40-e204-4b93-b65d-3a50a64d46b7', 'Honda Future #1', 1, 3, '77A-13579', 'Red', 2023, 140000, 'fuel', 2500, 'Reliable daily commuter bike', 'available', '8ffb93d8-6e47-4114-a67e-b870919ab33b'),
('c369d758-0ae1-465a-8093-7fa1137c8cac', 'Yamaha Sirius #1', 2, 9, '77A-13580', 'Blue', 2023, 130000, 'fuel', 3000, 'Fuel-efficient commuter with modern features', 'available', '8ffb93d8-6e47-4114-a67e-b870919ab33b'),
('4967f25e-3507-47e3-9924-1e4b35dbf155', 'Honda Blade #1', 1, 4, '77A-13581', 'Black', 2022, 160000, 'fuel', 8000, 'Compact sport bike for city riding', 'unavailable', '8ffb93d8-6e47-4114-a67e-b870919ab33b');

-- ========================================
-- SAMPLE DATA - vehicle_images
-- ========================================
INSERT INTO vehicle_images (id, vehicle_id, image_url, alt_text, display_order, is_primary) VALUES
-- Honda Wave 110 #1
('52a59877-e715-4196-8dd8-36df0ce692bc', 'd5403559-06fe-4645-ad52-948e166e79c1', 'https://bikevn.com/images/wave110-1.jpg', 'Honda Wave 110 front view', 1, TRUE),
('eeb5e3d0-bf57-4619-b690-dd6ad3a76fec', 'd5403559-06fe-4645-ad52-948e166e79c1', 'https://bikevn.com/images/wave110-2.jpg', 'Honda Wave 110 side view', 2, FALSE),

-- Yamaha Exciter 150 #1
('888b73ed-1a34-4560-99e1-6f4040dea881', 'd4b90570-5e9a-46fe-a951-0606895e851a', 'https://bikevn.com/images/exciter-1.jpg', 'Yamaha Exciter 150 front view', 1, TRUE),

-- Harley-Davidson Street 750 #1
('af5f4cb5-4a0a-4337-87e7-2a7bb21cc5ba', '70ea36da-3678-4498-a434-778e44935de5', 'https://bikevn.com/images/harley-1.jpg', 'Harley-Davidson Street 750 front view', 1, TRUE),

-- Honda SH 150 #1
('1841b719-5651-4972-b3b4-89b7054f273b', '5fcdb03c-42f2-4af4-a135-a5295ab42da0', 'https://bikevn.com/images/sh150-1.jpg', 'Honda SH 150 front view', 1, TRUE),

-- Suzuki Raider 150 #1
('3f5b1365-003e-40a8-9a72-45a653df6b58', '784e9a83-2aa7-488f-91bd-34c523b3abeb', 'https://bikevn.com/images/raider-1.jpg', 'Suzuki Raider 150 front view', 1, TRUE),

-- Royal Enfield Classic 350 #1
('24915e98-17c7-44e4-a060-4c55e2c1252e', 'd1e3d3b6-31f1-4d52-9d42-bd5eda4d73a1', 'https://bikevn.com/images/enfield-1.jpg', 'Royal Enfield Classic 350 front view', 1, TRUE),

-- Aprilia SR160 #1
('199b37c4-4e7c-40c5-a9c5-be09eac8ce06', '88d68588-6694-4c89-9384-df4c5cbd63fc', 'https://bikevn.com/images/aprilia-1.jpg', 'Aprilia SR160 front view', 1, TRUE),

-- Honda Dream #1
('75ddc7fe-5eb2-49fd-b164-1b911a4a411b', '65afb455-0a21-423a-8114-da94f9df7d96', 'https://bikevn.com/images/dream-1.jpg', 'Honda Dream front view', 1, TRUE),

-- Yamaha NVX 155 #1
('05073e25-f59e-465f-8252-056accf04f56', 'd7322875-e214-471c-a38b-4a0a77251628', 'https://bikevn.com/images/nvx-1.jpg', 'Yamaha NVX 155 front view', 1, TRUE),

-- Honda CB150R #1
('53209045-9df5-442e-b274-00a374f7574c', '21eb518d-6098-488d-8b06-148b51a00f9f', 'https://bikevn.com/images/cb150r-1.jpg', 'Honda CB150R front view', 1, TRUE),

-- Vespa Primavera 150 #1
('9da30c95-6947-466f-a62e-69a31070141b', '585336c2-15ec-4ac4-a5a2-8e49eb8a542e', 'https://bikevn.com/images/vespa-1.jpg', 'Vespa Primavera 150 front view', 1, TRUE),

-- Bajaj Pulsar 150 #1
('22af2438-88cb-4109-a6f1-0543fcdad282', '4c251719-cf97-4d4e-92d9-f262d923d820', 'https://bikevn.com/images/pulsar-1.jpg', 'Bajaj Pulsar 150 front view', 1, TRUE),

-- Honda Air Blade #1
('f257fe52-8675-4bb4-bb39-353b64f1f421', '846b0a2b-60b7-420a-b058-8476d1d52484', 'https://bikevn.com/images/airblade-1.jpg', 'Honda Air Blade front view', 1, TRUE),

-- Kawasaki Ninja 400 #1
('66d17e8d-6607-4006-85ae-030cf60a5ee2', 'b0bc5707-94f1-479c-90a5-9ecc5afbe4bd', 'https://bikevn.com/images/ninja-1.jpg', 'Kawasaki Ninja 400 front view', 1, TRUE),

-- Ducati Monster 659 #1
('bc8f01f3-764e-441e-9802-e2647b77a7f5', '5933f90b-8c79-4f9c-b2a3-9e5a345d82e6', 'https://bikevn.com/images/ducati-1.jpg', 'Ducati Monster 659 front view', 1, TRUE),

-- SYM VF 200 #1
('80e7d446-8cf9-48e8-a7c8-62871fc00738', 'd942c0ac-f14a-40d6-8440-aaf95506b484', 'https://bikevn.com/images/symvf-1.jpg', 'SYM VF 200 front view', 1, TRUE),

-- Honda Future #1
('7075e63b-d700-4165-a671-f338f87f903b', '26005a40-e204-4b93-b65d-3a50a64d46b7', 'https://bikevn.com/images/future-1.jpg', 'Honda Future front view', 1, TRUE),

-- Yamaha Sirius #1
('96f35a5b-4621-4992-ac0e-5b0a3136e22c', 'c369d758-0ae1-465a-8093-7fa1137c8cac', 'https://bikevn.com/images/sirius-1.jpg', 'Yamaha Sirius front view', 1, TRUE),

-- Honda Blade #1
('4345a58b-e4b3-4ab8-ac79-e186d56e49d0', '4967f25e-3507-47e3-9924-1e4b35dbf155', 'https://bikevn.com/images/blade-1.jpg', 'Honda Blade front view', 1, TRUE);

-- ========================================
-- SAMPLE DATA - bookings (UUID primary keys)
-- ========================================
INSERT INTO bookings (id, user_id, vehicle_id, pickup_branch_id, return_branch_id, start_time, end_time, actual_return_time, status, total_price) VALUES
-- Recent completed booking
('d68cc7f7-a578-4efb-baaa-6ab8f72be8fa', '32481aa5-1c15-4efc-8e79-a947f44719f6', 'd5403559-06fe-4645-ad52-948e166e79c1', '42ce84a3-e54f-415d-b707-a8a818c00a9c', '42ce84a3-e54f-415d-b707-a8a818c00a9c', '2024-01-15 08:00:00', '2024-01-15 18:00:00', '2024-01-15 18:15:00', 'completed', 1500000),
('46c3f037-57ef-4bd2-ba74-d075e18c96f1', '00a58e19-6462-4045-93fe-870e604b9311', 'd4b90570-5e9a-46fe-a951-0606895e851a', '42ce84a3-e54f-415d-b707-a8a818c00a9c', '42ce84a3-e54f-415d-b707-a8a818c00a9c', '2024-01-16 09:00:00', '2024-01-17 09:00:00', '2024-01-17 09:30:00', 'completed', 500000),

-- Current in-progress booking
('2e6d884a-1d71-4651-902e-361d3711b632', '32481aa5-1c15-4efc-8e79-a947f44719f6', '70ea36da-3678-4498-a434-778e44935de5', '42ce84a3-e54f-415d-b707-a8a818c00a9c', '42ce84a3-e54f-415d-b707-a8a818c00a9c', '2024-01-20 10:00:00', '2024-01-22 10:00:00', NULL, 'approved', 1600000),

-- Approved booking
('6af7ca78-7529-4d8d-8e07-d825cec4ed3e', '40039cd5-dc03-48c4-95b8-75061f18a7f0', '5fcdb03c-42f2-4af4-a135-a5295ab42da0', '42ce84a3-e54f-415d-b707-a8a818c00a9c', '42ce84a3-e54f-415d-b707-a8a818c00a9c', '2024-01-25 14:00:00', '2024-01-26 14:00:00', NULL, 'approved', 300000),

-- Pending booking
('8e980655-1c5c-4dc2-9c0c-bb9226218476', '2de6c709-2b0e-4bd5-8ab5-8b28f75ada6e', '784e9a83-2aa7-488f-91bd-34c523b3abeb', 'e58c1884-0ded-477d-a0e6-7a7cb8099771', 'e58c1884-0ded-477d-a0e6-7a7cb8099771', '2024-02-01 08:00:00', '2024-02-03 08:00:00', NULL, 'pending', 600000),

-- Rejected booking
('46a80466-6fce-4592-b44d-9d6df1d54fee', '00a58e19-6462-4045-93fe-870e604b9311', 'd1e3d3b6-31f1-4d52-9d42-bd5eda4d73a1', '42ce84a3-e54f-415d-b707-a8a818c00a9c', '42ce84a3-e54f-415d-b707-a8a818c00a9c', '2024-01-18 11:00:00', '2024-01-18 18:00:00', NULL, 'rejected', 450000);

-- ========================================
-- SAMPLE DATA - payments (UUID primary keys)
-- ========================================
INSERT INTO payments (id, booking_id, amount, type, payment_method, status, transaction_code, paid_at) VALUES
('1be094c5-c813-4dd5-bfd0-da3725cf7548', 'd68cc7f7-a578-4efb-baaa-6ab8f72be8fa', 1500000, 'rental', 'credit_card', 'completed', 'TXN001', '2024-01-15 18:30:00'),
('bea5e207-a453-4695-a2e9-d1a01da067d8', '46c3f037-57ef-4bd2-ba74-d075e18c96f1', 500000, 'rental', 'transfer', 'completed', 'TXN002', '2024-01-17 10:00:00'),
('b44d22f8-4ef6-4d2a-bac9-259f42afd195', '2e6d884a-1d71-4651-902e-361d3711b632', 1600000, 'rental', 'cash', 'completed', NULL, '2024-01-20 11:00:00'),
('5324521c-f023-4b82-b4f2-41520ce996f4', '6af7ca78-7529-4d8d-8e07-d825cec4ed3e', 300000, 'deposit', 'credit_card', 'pending', 'TXN003', NULL),
('7f2b7d60-746e-4ca5-8510-79e26a114781', '8e980655-1c5c-4dc2-9c0c-bb9226218476', 600000, 'rental', 'transfer', 'pending', NULL, NULL),
('4f4a17b3-f4c3-4834-9d21-dc2e1f1e5e85', '46a80466-6fce-4592-b44d-9d6df1d54fee', 450000, 'deposit', 'credit_card', 'refunded', 'TXN004', '2024-01-18 20:00:00');

-- ========================================
-- SAMPLE DATA - vehicle_returns (UUID primary keys)
-- ========================================
INSERT INTO vehicle_returns (id, booking_id, vehicle_id, return_branch_id, condition_status, damage_description, extra_fee, images) VALUES
('bb320338-2250-4adc-80a5-d697e2894e89', 'd68cc7f7-a578-4efb-baaa-6ab8f72be8fa', 'd5403559-06fe-4645-ad52-948e166e79c1', '42ce84a3-e54f-415d-b707-a8a818c00a9c', 'good', NULL, 0, NULL),
('1cda3da3-b534-45ed-8440-f86f36537672', '46c3f037-57ef-4bd2-ba74-d075e18c96f1', 'd4b90570-5e9a-46fe-a951-0606895e851a', '42ce84a3-e54f-415d-b707-a8a818c00a9c', 'fair', 'Minor scratches on side mirror and body', 200000, NULL);

-- ========================================
-- SAMPLE DATA - conversations (UUID primary keys)
-- ========================================
INSERT INTO conversations (id, created_at) VALUES
('46da2c35-b7b0-4a6f-9ce9-461a0f6ebc5a', NOW()),
('50b672cb-6559-4dd8-8908-9bda53bab347', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('9b95a351-89fa-4d8f-822e-b1c921f264f4', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- ========================================
-- SAMPLE DATA - conversation_members (UUID primary keys)
-- ========================================
INSERT INTO conversation_members (id, conversation_id, user_id, joined_at) VALUES
-- Conversation 1: User 2 and Admin
('2bd687b6-a4d4-478a-b4e7-7e06c9513676', '46da2c35-b7b0-4a6f-9ce9-461a0f6ebc5a', '32481aa5-1c15-4efc-8e79-a947f44719f6', NOW()),
('b4545ac3-3298-4715-9ed6-df869452f912', '46da2c35-b7b0-4a6f-9ce9-461a0f6ebc5a', 'c815d217-8e21-46ee-9b53-79fc6cf81a84', NOW()),

-- Conversation 2: User 3 and Admin
('78d268c0-0bd0-4449-906a-82112d24bd0f', '50b672cb-6559-4dd8-8908-9bda53bab347', '00a58e19-6462-4045-93fe-870e604b9311', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('86eabfdd-870c-4181-9c0b-21352854c1e3', '50b672cb-6559-4dd8-8908-9bda53bab347', 'c815d217-8e21-46ee-9b53-79fc6cf81a84', DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- Conversation 3: User 4, User 5, and Admin
('9dad095d-2c4f-4de5-883a-cd2f915cda2f', '9b95a351-89fa-4d8f-822e-b1c921f264f4', '40039cd5-dc03-48c4-95b8-75061f18a7f0', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('dd8b5719-0165-40f7-b627-02ef70acd0e8', '9b95a351-89fa-4d8f-822e-b1c921f264f4', '2de6c709-2b0e-4bd5-8ab5-8b28f75ada6e', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('72e93f47-0dfb-44e9-926c-84e70a4fd9be', '9b95a351-89fa-4d8f-822e-b1c921f264f4', 'c815d217-8e21-46ee-9b53-79fc6cf81a84', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- ========================================
-- SAMPLE DATA - messages (UUID primary keys)
-- ========================================
INSERT INTO messages (id, conversation_id, sender_id, content, is_read, created_at) VALUES
-- Conversation 1
('645cc032-70f5-4031-9d95-587468b99e76', '46da2c35-b7b0-4a6f-9ce9-461a0f6ebc5a', '32481aa5-1c15-4efc-8e79-a947f44719f6', 'Hello, I want to book a vehicle', FALSE, NOW()),
('d45552bf-480d-4b8e-bf31-573348779852', '46da2c35-b7b0-4a6f-9ce9-461a0f6ebc5a', 'c815d217-8e21-46ee-9b53-79fc6cf81a84', 'Sure! Which vehicle would you like to rent?', TRUE, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('e5f4ad9a-fef6-40dc-8967-a75c734b6f75', '46da2c35-b7b0-4a6f-9ce9-461a0f6ebc5a', '32481aa5-1c15-4efc-8e79-a947f44719f6', 'I am interested in the Honda Wave', FALSE, DATE_SUB(NOW(), INTERVAL 50 MINUTE)),

-- Conversation 2
('85f0b50b-363c-4556-a017-79798dced734', '50b672cb-6559-4dd8-8908-9bda53bab347', '00a58e19-6462-4045-93fe-870e604b9311', 'Is the Yamaha Exciter available for weekend?', TRUE, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('13d86a2b-9c0d-41e6-9981-513b3bb83e47', '50b672cb-6559-4dd8-8908-9bda53bab347', 'c815d217-8e21-46ee-9b53-79fc6cf81a84', 'Yes, it is available! What dates?', TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('66da11e0-fab6-4b03-a5dd-63e5db21c711', '50b672cb-6559-4dd8-8908-9bda53bab347', '00a58e19-6462-4045-93fe-870e604b9311', 'January 27-28. Can I book it?', FALSE, DATE_SUB(NOW(), INTERVAL 23 HOUR)),

-- Conversation 3
('98019a55-c6b2-4dc6-9d14-c26449e5d24a', '9b95a351-89fa-4d8f-822e-b1c921f264f4', '40039cd5-dc03-48c4-95b8-75061f18a7f0', 'Hello team, interested in group rental', FALSE, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('60df9026-2a06-4f14-bf30-f799197b803e', '9b95a351-89fa-4d8f-822e-b1c921f264f4', '2de6c709-2b0e-4bd5-8ab5-8b28f75ada6e', 'Me too! How many bikes do we need?', FALSE, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('60ce150b-f394-4676-b61e-4fb26dade47b', '9b95a351-89fa-4d8f-822e-b1c921f264f4', 'c815d217-8e21-46ee-9b53-79fc6cf81a84', 'We have great group rates! Please tell me your requirements', TRUE, DATE_SUB(NOW(), INTERVAL 4 DAY));

-- ========================================
-- SAMPLE DATA - reviews (UUID primary keys)
-- ========================================
INSERT INTO reviews (id, booking_id, user_id, vehicle_id, rating, comment, created_at) VALUES
('69c33f90-4927-459d-89fb-f87e92d7ad51', 'd68cc7f7-a578-4efb-baaa-6ab8f72be8fa', '32481aa5-1c15-4efc-8e79-a947f44719f6', 'd5403559-06fe-4645-ad52-948e166e79c1', 5, 'Excellent service! Vehicle was in perfect condition. Highly recommend!', NOW()),
('c52d3984-ea60-4ab7-a388-5243593f1a5d', '46c3f037-57ef-4bd2-ba74-d075e18c96f1', '00a58e19-6462-4045-93fe-870e604b9311', 'd4b90570-5e9a-46fe-a951-0606895e851a', 4, 'Good experience overall. Staff was helpful. Minor damage noted at return which was fair.', NOW());

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Verify all tables have data
-- SELECT 'users' AS table_name, COUNT(*) AS record_count FROM users
-- UNION ALL
-- SELECT 'branches', COUNT(*) FROM branches
-- UNION ALL
-- SELECT 'vehicle_brands', COUNT(*) FROM vehicle_brands
-- UNION ALL
-- SELECT 'vehicle_models', COUNT(*) FROM vehicle_models
-- UNION ALL
-- SELECT 'vehicles', COUNT(*) FROM vehicles
-- UNION ALL
-- SELECT 'bookings', COUNT(*) FROM bookings
-- UNION ALL
-- SELECT 'payments', COUNT(*) FROM payments
-- UNION ALL
-- SELECT 'vehicle_returns', COUNT(*) FROM vehicle_returns
-- UNION ALL
-- SELECT 'conversations', COUNT(*) FROM conversations
-- UNION ALL
-- SELECT 'conversation_members', COUNT(*) FROM conversation_members
-- UNION ALL
-- SELECT 'messages', COUNT(*) FROM messages
-- UNION ALL
-- SELECT 'reviews', COUNT(*) FROM reviews;

-- View vehicles with brand and model info
-- SELECT v.id, v.name, vb.name AS brand, vm.name AS model, vm.engine_capacity, v.price_per_day, v.status
-- FROM vehicles v
-- JOIN vehicle_brands vb ON v.brand_id = vb.id
-- JOIN vehicle_models vm ON v.model_id = vm.id
-- ORDER BY vb.name, vm.name;

-- ========================================
-- END OF SEED DATA
-- ========================================
