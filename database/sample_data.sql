-- BikeVN Database Sample Data (Seed)
-- With normalized vehicle_brands and vehicle_models tables
-- Created: 2024

USE bikevn_db;

-- ========================================
-- SAMPLE DATA - roles
-- ========================================
INSERT INTO roles (name, description, is_active) VALUES
('admin', 'Administrator with full system access', TRUE),
('employee', 'Employee with staff privileges', TRUE),
('user', 'Regular customer user', TRUE),
('manager', 'Branch or department manager', TRUE),
('support', 'Customer support staff', TRUE);

-- ========================================
-- SAMPLE DATA - users (UUID primary keys - without role column)
-- ========================================
INSERT INTO users (id, name, email, password_hash, phone, cccd_number, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Admin BikeVN', 'admin@bikevn.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0987654321', '001234567890', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'Nguyen Van A', 'nguyena@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0901234567', '001234567891', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 'Tran Thi B', 'tranb@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0902345678', '001234567892', TRUE),
('550e8400-e29b-41d4-a716-446655440004', 'Pham Van C', 'phamc@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0903456789', '001234567893', TRUE),
('550e8400-e29b-41d4-a716-446655440005', 'Le Thi D', 'led@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0904567890', '001234567894', TRUE),
('550e8400-e29b-41d4-a716-446655440006', 'Hoang Van E', 'hoange@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0905678901', '001234567895', TRUE);

-- ========================================
-- SAMPLE DATA - user_roles (assign roles to users)
-- ========================================
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by) VALUES
-- Admin user gets admin role
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 1, NOW(), NULL),

-- Employee user gets employee and support roles
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 2, NOW(), '550e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 5, NOW(), '550e8400-e29b-41d4-a716-446655440001'),

-- Regular users get user role
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 3, NOW(), '550e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 3, NOW(), '550e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 3, NOW(), '550e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440006', 3, NOW(), '550e8400-e29b-41d4-a716-446655440001');

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
('550e8400-e29b-41d4-a716-446655440101', 'Chi nhanh TP Ho Chi Minh', '123 Nguyen Hue, District 1, HCMC', 10.77588, 106.70183, 'active'),
('550e8400-e29b-41d4-a716-446655440102', 'Chi nhanh Ha Noi', '456 Tran Hung Dao, Hoan Kiem, Hanoi', 21.02774, 105.84159, 'active'),
('550e8400-e29b-41d4-a716-446655440103', 'Chi nhanh Da Nang', '789 Tran Phu, Hai Chau, Da Nang', 16.06778, 108.22083, 'active'),
('550e8400-e29b-41d4-a716-446655440104', 'Chi nhanh Can Tho', '321 Mau Than, Ninh Kieu, Can Tho', 10.03000, 105.78670, 'inactive');

-- ========================================
-- SAMPLE DATA - vehicles (with brand_id and model_id)
-- ========================================
INSERT INTO vehicles (id, name, brand_id, model_id, license_plate, color, year, price_per_day, vehicle_type, mileage, description, status, current_branch_id) VALUES

-- HCMC Branch
('550e8400-e29b-41d4-a716-446655440201', 'Honda Wave 110 #1', 1, 1, '74A-12345', 'Red', 2023, 150000, 'fuel', 5000, 'Economical daily rider with excellent fuel efficiency', 'available', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440202', 'Yamaha Exciter 150 #1', 2, 8, '74A-12346', 'Blue', 2023, 250000, 'fuel', 8000, 'Sporty performance bike with modern design', 'available', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440203', 'Harley-Davidson Street 750 #1', 5, 17, '74A-12347', 'Black', 2022, 800000, 'fuel', 12000, 'Premium cruiser with iconic design', 'available', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440204', 'Honda SH 150 #1', 1, 6, '74A-12348', 'Silver', 2023, 300000, 'fuel', 3000, 'Premium scooter with comfort and style', 'unavailable', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440205', 'Suzuki Raider 150 #1', 3, 11, '74A-12349', 'Green', 2023, 200000, 'fuel', 6000, 'Rugged sport bike for adventure seekers', 'maintenance', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440206', 'Royal Enfield Classic 350 #1', 9, 19, '74A-12350', 'Brown', 2022, 450000, 'fuel', 15000, 'Classic retro styling with excellent comfort', 'available', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440207', 'Aprilia SR160 #1', 8, 18, '74A-12351', 'White', 2023, 180000, 'fuel', 4000, 'Italian scooter with modern features', 'available', '550e8400-e29b-41d4-a716-446655440101'),

-- Hanoi Branch
('550e8400-e29b-41d4-a716-446655440208', 'Honda Dream #1', 1, 2, '29A-54321', 'Red', 2023, 120000, 'fuel', 2000, 'Best-selling daily commuter bike', 'available', '550e8400-e29b-41d4-a716-446655440102'),
('550e8400-e29b-41d4-a716-446655440209', 'Yamaha NVX 155 #1', 2, 10, '29A-54322', 'Orange', 2023, 280000, 'fuel', 5500, 'Modern maxi scooter with ABS technology', 'available', '550e8400-e29b-41d4-a716-446655440102'),
('550e8400-e29b-41d4-a716-446655440210', 'Honda CB150R #1', 1, 5, '29A-54323', 'Black', 2023, 320000, 'fuel', 7000, 'Naked sport bike with aggressive styling', 'available', '550e8400-e29b-41d4-a716-446655440102'),
('550e8400-e29b-41d4-a716-446655440211', 'Vespa Primavera 150 #1', 7, 16, '29A-54324', 'Cream', 2022, 400000, 'fuel', 10000, 'Iconic Italian scooter with timeless design', 'available', '550e8400-e29b-41d4-a716-446655440102'),
('550e8400-e29b-41d4-a716-446655440212', 'Bajaj Pulsar 150 #1', 10, 20, '29A-54325', 'Gray', 2023, 160000, 'fuel', 4500, 'Budget-friendly sport bike', 'available', '550e8400-e29b-41d4-a716-446655440102'),

-- Da Nang Branch
('550e8400-e29b-41d4-a716-446655440213', 'Honda Air Blade #1', 1, 7, '92A-78901', 'Gold', 2023, 180000, 'fuel', 3500, 'Premium scooter with smooth ride', 'available', '550e8400-e29b-41d4-a716-446655440103'),
('550e8400-e29b-41d4-a716-446655440214', 'Kawasaki Ninja 400 #1', 4, 12, '92A-78902', 'Green', 2022, 500000, 'fuel', 18000, 'Entry-level sport bike from legendary brand', 'available', '550e8400-e29b-41d4-a716-446655440103'),
('550e8400-e29b-41d4-a716-446655440215', 'Ducati Monster 659 #1', 6, 13, '92A-78903', 'Red', 2021, 900000, 'fuel', 22000, 'Premium Italian sport bike', 'maintenance', '550e8400-e29b-41d4-a716-446655440103'),
('550e8400-e29b-41d4-a716-446655440216', 'SYM VF 200 #1', 11, 21, '92A-78904', 'Silver', 2023, 200000, 'fuel', 6500, 'Spacious scooter for comfortable riding', 'available', '550e8400-e29b-41d4-a716-446655440103'),

-- Can Tho Branch
('550e8400-e29b-41d4-a716-446655440217', 'Honda Future #1', 1, 3, '77A-13579', 'Red', 2023, 140000, 'fuel', 2500, 'Reliable daily commuter bike', 'available', '550e8400-e29b-41d4-a716-446655440104'),
('550e8400-e29b-41d4-a716-446655440218', 'Yamaha Sirius #1', 2, 9, '77A-13580', 'Blue', 2023, 130000, 'fuel', 3000, 'Fuel-efficient commuter with modern features', 'available', '550e8400-e29b-41d4-a716-446655440104'),
('550e8400-e29b-41d4-a716-446655440219', 'Honda Blade #1', 1, 4, '77A-13581', 'Black', 2022, 160000, 'fuel', 8000, 'Compact sport bike for city riding', 'unavailable', '550e8400-e29b-41d4-a716-446655440104');

-- ========================================
-- SAMPLE DATA - vehicle_images
-- ========================================
INSERT INTO vehicle_images (id, vehicle_id, image_url, alt_text, display_order, is_primary) VALUES
-- Honda Wave 110 #1
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440201', 'https://bikevn.com/images/wave110-1.jpg', 'Honda Wave 110 front view', 1, TRUE),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440201', 'https://bikevn.com/images/wave110-2.jpg', 'Honda Wave 110 side view', 2, FALSE),

-- Yamaha Exciter 150 #1
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440202', 'https://bikevn.com/images/exciter-1.jpg', 'Yamaha Exciter 150 front view', 1, TRUE),

-- Harley-Davidson Street 750 #1
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440203', 'https://bikevn.com/images/harley-1.jpg', 'Harley-Davidson Street 750 front view', 1, TRUE),

-- Honda SH 150 #1
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440204', 'https://bikevn.com/images/sh150-1.jpg', 'Honda SH 150 front view', 1, TRUE),

-- Suzuki Raider 150 #1
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440205', 'https://bikevn.com/images/raider-1.jpg', 'Suzuki Raider 150 front view', 1, TRUE),

-- Royal Enfield Classic 350 #1
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440206', 'https://bikevn.com/images/enfield-1.jpg', 'Royal Enfield Classic 350 front view', 1, TRUE),

-- Aprilia SR160 #1
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440207', 'https://bikevn.com/images/aprilia-1.jpg', 'Aprilia SR160 front view', 1, TRUE),

-- Honda Dream #1
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440208', 'https://bikevn.com/images/dream-1.jpg', 'Honda Dream front view', 1, TRUE),

-- Yamaha NVX 155 #1
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440209', 'https://bikevn.com/images/nvx-1.jpg', 'Yamaha NVX 155 front view', 1, TRUE),

-- Honda CB150R #1
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440210', 'https://bikevn.com/images/cb150r-1.jpg', 'Honda CB150R front view', 1, TRUE),

-- Vespa Primavera 150 #1
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440211', 'https://bikevn.com/images/vespa-1.jpg', 'Vespa Primavera 150 front view', 1, TRUE),

-- Bajaj Pulsar 150 #1
('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440212', 'https://bikevn.com/images/pulsar-1.jpg', 'Bajaj Pulsar 150 front view', 1, TRUE),

-- Honda Air Blade #1
('650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440213', 'https://bikevn.com/images/airblade-1.jpg', 'Honda Air Blade front view', 1, TRUE),

-- Kawasaki Ninja 400 #1
('650e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440214', 'https://bikevn.com/images/ninja-1.jpg', 'Kawasaki Ninja 400 front view', 1, TRUE),

-- Ducati Monster 659 #1
('650e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440215', 'https://bikevn.com/images/ducati-1.jpg', 'Ducati Monster 659 front view', 1, TRUE),

-- SYM VF 200 #1
('650e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440216', 'https://bikevn.com/images/symvf-1.jpg', 'SYM VF 200 front view', 1, TRUE),

-- Honda Future #1
('650e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440217', 'https://bikevn.com/images/future-1.jpg', 'Honda Future front view', 1, TRUE),

-- Yamaha Sirius #1
('650e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440218', 'https://bikevn.com/images/sirius-1.jpg', 'Yamaha Sirius front view', 1, TRUE),

-- Honda Blade #1
('650e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440219', 'https://bikevn.com/images/blade-1.jpg', 'Honda Blade front view', 1, TRUE);

-- ========================================
-- SAMPLE DATA - bookings (UUID primary keys)
-- ========================================
INSERT INTO bookings (id, user_id, vehicle_id, pickup_branch_id, return_branch_id, start_time, end_time, actual_return_time, status, total_price) VALUES
-- Recent completed booking
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440101', '2024-01-15 08:00:00', '2024-01-15 18:00:00', '2024-01-15 18:15:00', 'completed', 1500000),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440101', '2024-01-16 09:00:00', '2024-01-17 09:00:00', '2024-01-17 09:30:00', 'completed', 500000),

-- Current in-progress booking
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440101', '2024-01-20 10:00:00', '2024-01-22 10:00:00', NULL, 'approved', 1600000),

-- Approved booking
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440101', '2024-01-25 14:00:00', '2024-01-26 14:00:00', NULL, 'approved', 300000),

-- Pending booking
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440102', '2024-02-01 08:00:00', '2024-02-03 08:00:00', NULL, 'pending', 600000),

-- Rejected booking
('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440206', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440101', '2024-01-18 11:00:00', '2024-01-18 18:00:00', NULL, 'rejected', 450000);

-- ========================================
-- SAMPLE DATA - payments (UUID primary keys)
-- ========================================
INSERT INTO payments (id, booking_id, amount, type, payment_method, status, transaction_code, paid_at) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440301', 1500000, 'rental', 'credit_card', 'completed', 'TXN001', '2024-01-15 18:30:00'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440302', 500000, 'rental', 'transfer', 'completed', 'TXN002', '2024-01-17 10:00:00'),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440303', 1600000, 'rental', 'cash', 'completed', NULL, '2024-01-20 11:00:00'),
('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440304', 300000, 'deposit', 'credit_card', 'pending', 'TXN003', NULL),
('550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440305', 600000, 'rental', 'transfer', 'pending', NULL, NULL),
('550e8400-e29b-41d4-a716-446655440406', '550e8400-e29b-41d4-a716-446655440306', 450000, 'deposit', 'credit_card', 'refunded', 'TXN004', '2024-01-18 20:00:00');

-- ========================================
-- SAMPLE DATA - vehicle_returns (UUID primary keys)
-- ========================================
INSERT INTO vehicle_returns (id, booking_id, vehicle_id, return_branch_id, condition_status, damage_description, extra_fee, images) VALUES
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', 'good', NULL, 0, NULL),
('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440101', 'fair', 'Minor scratches on side mirror and body', 200000, NULL);

-- ========================================
-- SAMPLE DATA - conversations (UUID primary keys)
-- ========================================
INSERT INTO conversations (id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440601', NOW()),
('550e8400-e29b-41d4-a716-446655440602', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('550e8400-e29b-41d4-a716-446655440603', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- ========================================
-- SAMPLE DATA - conversation_members (UUID primary keys)
-- ========================================
INSERT INTO conversation_members (id, conversation_id, user_id, joined_at) VALUES
-- Conversation 1: User 2 and Admin
('550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440002', NOW()),
('550e8400-e29b-41d4-a716-446655440702', '550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440001', NOW()),

-- Conversation 2: User 3 and Admin
('550e8400-e29b-41d4-a716-446655440703', '550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440003', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('550e8400-e29b-41d4-a716-446655440704', '550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440001', DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- Conversation 3: User 4, User 5, and Admin
('550e8400-e29b-41d4-a716-446655440705', '550e8400-e29b-41d4-a716-446655440603', '550e8400-e29b-41d4-a716-446655440004', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('550e8400-e29b-41d4-a716-446655440706', '550e8400-e29b-41d4-a716-446655440603', '550e8400-e29b-41d4-a716-446655440005', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('550e8400-e29b-41d4-a716-446655440707', '550e8400-e29b-41d4-a716-446655440603', '550e8400-e29b-41d4-a716-446655440001', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- ========================================
-- SAMPLE DATA - messages (UUID primary keys)
-- ========================================
INSERT INTO messages (id, conversation_id, sender_id, content, is_read, created_at) VALUES
-- Conversation 1
('550e8400-e29b-41d4-a716-446655440801', '550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440002', 'Hello, I want to book a vehicle', FALSE, NOW()),
('550e8400-e29b-41d4-a716-446655440802', '550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440001', 'Sure! Which vehicle would you like to rent?', TRUE, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('550e8400-e29b-41d4-a716-446655440803', '550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440002', 'I am interested in the Honda Wave', FALSE, DATE_SUB(NOW(), INTERVAL 50 MINUTE)),

-- Conversation 2
('550e8400-e29b-41d4-a716-446655440804', '550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440003', 'Is the Yamaha Exciter available for weekend?', TRUE, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('550e8400-e29b-41d4-a716-446655440805', '550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440001', 'Yes, it is available! What dates?', TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('550e8400-e29b-41d4-a716-446655440806', '550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440003', 'January 27-28. Can I book it?', FALSE, DATE_SUB(NOW(), INTERVAL 23 HOUR)),

-- Conversation 3
('550e8400-e29b-41d4-a716-446655440807', '550e8400-e29b-41d4-a716-446655440603', '550e8400-e29b-41d4-a716-446655440004', 'Hello team, interested in group rental', FALSE, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('550e8400-e29b-41d4-a716-446655440808', '550e8400-e29b-41d4-a716-446655440603', '550e8400-e29b-41d4-a716-446655440005', 'Me too! How many bikes do we need?', FALSE, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('550e8400-e29b-41d4-a716-446655440809', '550e8400-e29b-41d4-a716-446655440603', '550e8400-e29b-41d4-a716-446655440001', 'We have great group rates! Please tell me your requirements', TRUE, DATE_SUB(NOW(), INTERVAL 4 DAY));

-- ========================================
-- SAMPLE DATA - reviews (UUID primary keys)
-- ========================================
INSERT INTO reviews (id, booking_id, user_id, vehicle_id, rating, comment, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440901', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440201', 5, 'Excellent service! Vehicle was in perfect condition. Highly recommend!', NOW()),
('550e8400-e29b-41d4-a716-446655440902', '550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440202', 4, 'Good experience overall. Staff was helpful. Minor damage noted at return which was fair.', NOW());

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
