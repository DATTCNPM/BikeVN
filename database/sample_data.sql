-- BikeVN Database Sample Data (Seed)
-- Updated with complete vehicle fields and UUID primary keys
-- Created: 2024

USE bikevn_db;

-- ========================================
-- SAMPLE DATA - users (UUID primary keys)
-- ========================================
INSERT INTO users (id, name, email, password_hash, phone, cccd_number, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Admin BikeVN', 'admin@bikevn.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0987654321', '001234567890', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'Nguyen Van A', 'nguyena@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0901234567', '001234567891', 'employee'),
('550e8400-e29b-41d4-a716-446655440003', 'Tran Thi B', 'tranb@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0902345678', '001234567892', 'user'),
('550e8400-e29b-41d4-a716-446655440004', 'Pham Van C', 'phamc@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0903456789', '001234567893', 'user'),
('550e8400-e29b-41d4-a716-446655440005', 'Le Thi D', 'led@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0904567890', '001234567894', 'user'),
('550e8400-e29b-41d4-a716-446655440006', 'Hoang Van E', 'hoange@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0905678901', '001234567895', 'user');

-- ========================================
-- SAMPLE DATA - branches (UUID primary keys)
-- ========================================
INSERT INTO branches (id, name, address, lat, lng, status) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'Chi nhanh Tp Ho Chi Minh', '123 Nguyen Hue, District 1, HCMC', 10.77588, 106.70183, 'active'),
('550e8400-e29b-41d4-a716-446655440102', 'Chi nhanh Ha Noi', '456 Tran Hung Dao, Hoan Kiem, Hanoi', 21.02774, 105.84159, 'active'),
('550e8400-e29b-41d4-a716-446655440103', 'Chi nhanh Da Nang', '789 Tran Phu, Hai Chau, Da Nang', 16.06778, 108.22083, 'active'),
('550e8400-e29b-41d4-a716-446655440104', 'Chi nhanh Can Tho', '321 Mau Than, Ninh Kieu, Can Tho', 10.03000, 105.78670, 'inactive');

-- ========================================
-- SAMPLE DATA - vehicles (Complete with all new fields)
-- ========================================
INSERT INTO vehicles (id, name, brand, model, license_plate, color, year, price_per_day, engine_capacity, vehicle_type, mileage, image_url, description, status, current_branch_id) VALUES

-- HCMC Branch
('550e8400-e29b-41d4-a716-446655440201', 'Honda Wave 110', 'Honda', 'Wave 110', '74A-12345', 'Red', 2023, 150000, 110, 'fuel', 5000, '["http://bikevn.com/images/wave110-1.jpg", "http://bikevn.com/images/wave110-2.jpg"]', 'Economical daily rider with excellent fuel efficiency', 'available', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440202', 'Yamaha Exciter 150', 'Yamaha', 'Exciter 150', '74A-12346', 'Blue', 2023, 250000, 150, 'fuel', 8000, '["http://bikevn.com/images/exciter-1.jpg"]', 'Sporty performance bike with modern design', 'available', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440203', 'Harley-Davidson Street 750', 'Harley-Davidson', 'Street 750', '74A-12347', 'Black', 2022, 800000, 750, 'fuel', 12000, '["http://bikevn.com/images/harley-1.jpg"]', 'Premium cruiser with iconic design', 'available', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440204', 'Honda SH 150', 'Honda', 'SH 150', '74A-12348', 'Silver', 2023, 300000, 150, 'fuel', 3000, '["http://bikevn.com/images/sh150-1.jpg"]', 'Premium scooter with comfort and style', 'unavailable', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440205', 'Suzuki Raider 150', 'Suzuki', 'Raider 150', '74A-12349', 'Green', 2023, 200000, 150, 'fuel', 6000, '["http://bikevn.com/images/raider-1.jpg"]', 'Rugged sport bike for adventure seekers', 'maintenance', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440206', 'Royal Enfield Classic 350', 'Royal Enfield', 'Classic 350', '74A-12350', 'Brown', 2022, 450000, 350, 'fuel', 15000, '["http://bikevn.com/images/enfield-1.jpg"]', 'Classic retro styling with excellent comfort', 'available', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440207', 'Aprilia SR160', 'Aprilia', 'SR160', '74A-12351', 'White', 2023, 180000, 160, 'fuel', 4000, '["http://bikevn.com/images/aprilia-1.jpg"]', 'Italian scooter with modern features', 'available', '550e8400-e29b-41d4-a716-446655440101'),

-- Hanoi Branch
('550e8400-e29b-41d4-a716-446655440208', 'Honda Dream', 'Honda', 'Dream', '29A-54321', 'Red', 2023, 120000, 110, 'fuel', 2000, '["http://bikevn.com/images/dream-1.jpg"]', 'Best-selling daily commuter bike', 'available', '550e8400-e29b-41d4-a716-446655440102'),
('550e8400-e29b-41d4-a716-446655440209', 'Yamaha NVX 155', 'Yamaha', 'NVX 155', '29A-54322', 'Orange', 2023, 280000, 155, 'fuel', 5500, '["http://bikevn.com/images/nvx-1.jpg"]', 'Modern maxi scooter with ABS technology', 'available', '550e8400-e29b-41d4-a716-446655440102'),
('550e8400-e29b-41d4-a716-446655440210', 'Honda CB150R', 'Honda', 'CB150R', '29A-54323', 'Black', 2023, 320000, 150, 'fuel', 7000, '["http://bikevn.com/images/cb150r-1.jpg"]', 'Naked sport bike with aggressive styling', 'available', '550e8400-e29b-41d4-a716-446655440102'),
('550e8400-e29b-41d4-a716-446655440211', 'Vespa Primavera 150', 'Vespa', 'Primavera 150', '29A-54324', 'Cream', 2022, 400000, 150, 'fuel', 10000, '["http://bikevn.com/images/vespa-1.jpg"]', 'Iconic Italian scooter with timeless design', 'available', '550e8400-e29b-41d4-a716-446655440102'),
('550e8400-e29b-41d4-a716-446655440212', 'Bajaj Pulsar 150', 'Bajaj', 'Pulsar 150', '29A-54325', 'Gray', 2023, 160000, 150, 'fuel', 4500, '["http://bikevn.com/images/pulsar-1.jpg"]', 'Budget-friendly sport bike', 'available', '550e8400-e29b-41d4-a716-446655440102'),

-- Da Nang Branch
('550e8400-e29b-41d4-a716-446655440213', 'Honda Air Blade', 'Honda', 'Air Blade', '92A-78901', 'Gold', 2023, 180000, 125, 'fuel', 3500, '["http://bikevn.com/images/airblade-1.jpg"]', 'Premium scooter with smooth ride', 'available', '550e8400-e29b-41d4-a716-446655440103'),
('550e8400-e29b-41d4-a716-446655440214', 'Kawasaki Ninja 400', 'Kawasaki', 'Ninja 400', '92A-78902', 'Green', 2022, 500000, 400, 'fuel', 18000, '["http://bikevn.com/images/ninja-1.jpg"]', 'Entry-level sport bike from legendary brand', 'available', '550e8400-e29b-41d4-a716-446655440103'),
('550e8400-e29b-41d4-a716-446655440215', 'Ducati Monster 659', 'Ducati', 'Monster 659', '92A-78903', 'Red', 2021, 900000, 659, 'fuel', 22000, '["http://bikevn.com/images/ducati-1.jpg"]', 'Premium Italian sport bike', 'maintenance', '550e8400-e29b-41d4-a716-446655440103'),
('550e8400-e29b-41d4-a716-446655440216', 'SYM VF 200', 'SYM', 'VF 200', '92A-78904', 'Silver', 2023, 200000, 200, 'fuel', 6500, '["http://bikevn.com/images/symvf-1.jpg"]', 'Spacious scooter for comfortable riding', 'available', '550e8400-e29b-41d4-a716-446655440103'),

-- Can Tho Branch
('550e8400-e29b-41d4-a716-446655440217', 'Honda Future', 'Honda', 'Future', '77A-13579', 'Red', 2023, 140000, 110, 'fuel', 2500, '["http://bikevn.com/images/future-1.jpg"]', 'Reliable daily commuter bike', 'available', '550e8400-e29b-41d4-a716-446655440104'),
('550e8400-e29b-41d4-a716-446655440218', 'Yamaha Sirius', 'Yamaha', 'Sirius', '77A-13580', 'Blue', 2023, 130000, 110, 'fuel', 3000, '["http://bikevn.com/images/sirius-1.jpg"]', 'Fuel-efficient commuter with modern features', 'available', '550e8400-e29b-41d4-a716-446655440104'),
('550e8400-e29b-41d4-a716-446655440219', 'Honda Blade', 'Honda', 'Blade', '77A-13581', 'Black', 2022, 160000, 110, 'fuel', 8000, '["http://bikevn.com/images/blade-1.jpg"]', 'Compact sport bike for city riding', 'unavailable', '550e8400-e29b-41d4-a716-446655440104');

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
-- TEST QUERIES FOR VERIFICATION
-- ========================================

-- Verify all tables have data
-- SELECT 'users' AS table_name, COUNT(*) AS record_count FROM users
-- UNION ALL
-- SELECT 'branches', COUNT(*) FROM branches
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

-- View active bookings
-- SELECT * FROM vw_active_bookings;

-- View monthly revenue
-- SELECT * FROM vw_monthly_revenue;

-- View vehicle availability
-- SELECT * FROM vw_vehicle_availability;

-- ========================================
-- END OF SEED DATA
-- ========================================
