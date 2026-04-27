-- BikeVN Database Sample Data (Seed)
-- Test data for development and testing
-- Created: 2024

USE bikevn_db;

-- ========================================
-- SAMPLE DATA - users
-- ========================================
INSERT INTO users (name, email, password_hash, phone, cccd_number, role) VALUES
('Admin BikeVN', 'admin@bikevn.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0987654321', '001234567890', 'admin'),
('Nguyen Van A', 'nguyena@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0901234567', '001234567891', 'employee'),
('Tran Thi B', 'tranb@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0902345678', '001234567892', 'user'),
('Pham Van C', 'phamc@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0903456789', '001234567893', 'user'),
('Le Thi D', 'led@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0904567890', '001234567894', 'user'),
('Hoang Van E', 'hoange@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopq', '0905678901', '001234567895', 'user');

-- ========================================
-- SAMPLE DATA - branches
-- ========================================
INSERT INTO branches (name, address, lat, lng, status) VALUES
('Chi nhanh Tp Ho Chi Minh', '123 Nguyen Hue, District 1, HCMC', 10.77588, 106.70183, 'active'),
('Chi nhanh Ha Noi', '456 Tran Hung Dao, Hoan Kiem, Hanoi', 21.02774, 105.84159, 'active'),
('Chi nhanh Da Nang', '789 Tran Phu, Hai Chau, Da Nang', 16.06778, 108.22083, 'active'),
('Chi nhanh Can Tho', '321 Mau Than, Ninh Kieu, Can Tho', 10.03000, 105.78670, 'inactive');

-- ========================================
-- SAMPLE DATA - vehicles
-- ========================================
INSERT INTO vehicles (name, vehicle_type, price, status, current_branch_id) VALUES
-- HCMC Branch
('Honda Wave 110', 'scooter', 150000, 'available', 1),
('Yamaha Exciter', 'sport', 250000, 'available', 1),
('Harley-Davidson Street 750', 'cruiser', 800000, 'available', 1),
('Honda SH 150', 'scooter', 300000, 'unavailable', 1),
('Suzuki Raider', 'sport', 200000, 'maintenance', 1),
('Royal Enfield Classic 350', 'cruiser', 450000, 'available', 1),
('Aprilia SR160', 'scooter', 180000, 'available', 1),

-- Hanoi Branch
('Honda Dream', 'scooter', 120000, 'available', 2),
('Yamaha NVX', 'sport', 280000, 'available', 2),
('Honda CB150R', 'sport', 320000, 'available', 2),
('Vespa Primavera', 'scooter', 400000, 'available', 2),
('Bajaj Pulsar', 'sport', 160000, 'available', 2),

-- Da Nang Branch
('Honda Air Blade', 'scooter', 180000, 'available', 3),
('Kawasaki Ninja', 'sport', 500000, 'available', 3),
('Ducati Monster', 'sport', 900000, 'maintenance', 3),
('SYM VF 200', 'scooter', 200000, 'available', 3),

-- Can Tho Branch
('Honda Future', 'scooter', 140000, 'available', 4),
('Yamaha Sirius', 'scooter', 130000, 'available', 4),
('Honda Blade', 'scooter', 160000, 'unavailable', 4);

-- ========================================
-- SAMPLE DATA - bookings
-- ========================================
INSERT INTO bookings (user_id, vehicle_id, pickup_branch_id, return_branch_id, start_time, end_time, actual_return_time, status, total_price) VALUES
-- Recent completed booking
(2, 1, 1, 1, '2024-01-15 08:00:00', '2024-01-15 18:00:00', '2024-01-15 18:15:00', 'completed', 1500000),
(3, 2, 1, 1, '2024-01-16 09:00:00', '2024-01-17 09:00:00', '2024-01-17 09:30:00', 'completed', 500000),

-- Current in-progress booking
(2, 3, 1, 1, '2024-01-20 10:00:00', '2024-01-22 10:00:00', NULL, 'approved', 1600000),

-- Approved booking
(4, 4, 1, 1, '2024-01-25 14:00:00', '2024-01-26 14:00:00', NULL, 'approved', 300000),

-- Pending booking
(5, 5, 2, 2, '2024-02-01 08:00:00', '2024-02-03 08:00:00', NULL, 'pending', 600000),

-- Rejected booking
(3, 6, 1, 1, '2024-01-18 11:00:00', '2024-01-18 18:00:00', NULL, 'rejected', 450000);

-- ========================================
-- SAMPLE DATA - payments
-- ========================================
INSERT INTO payments (booking_id, amount, type, payment_method, status, transaction_code, paid_at) VALUES
(1, 1500000, 'rental', 'credit_card', 'completed', 'TXN001', '2024-01-15 18:30:00'),
(2, 500000, 'rental', 'transfer', 'completed', 'TXN002', '2024-01-17 10:00:00'),
(3, 1600000, 'rental', 'cash', 'completed', NULL, '2024-01-20 11:00:00'),
(4, 300000, 'deposit', 'credit_card', 'pending', 'TXN003', NULL),
(5, 600000, 'rental', 'transfer', 'pending', NULL, NULL),
(6, 450000, 'deposit', 'credit_card', 'refunded', 'TXN004', '2024-01-18 20:00:00');

-- ========================================
-- SAMPLE DATA - vehicle_returns
-- ========================================
INSERT INTO vehicle_returns (booking_id, vehicle_id, return_branch_id, condition_status, damage_description, extra_fee, images) VALUES
(1, 1, 1, 'good', NULL, 0, NULL),
(2, 2, 1, 'fair', 'Minor scratches on side mirror and body', 200000, NULL);

-- ========================================
-- SAMPLE DATA - conversations
-- ========================================
INSERT INTO conversations (created_at) VALUES
(NOW()),
(DATE_SUB(NOW(), INTERVAL 2 DAY)),
(DATE_SUB(NOW(), INTERVAL 5 DAY));

-- ========================================
-- SAMPLE DATA - conversation_members
-- ========================================
INSERT INTO conversation_members (conversation_id, user_id, joined_at) VALUES
-- Conversation 1: User 2 and Admin
(1, 2, NOW()),
(1, 1, NOW()),

-- Conversation 2: User 3 and Admin
(2, 3, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- Conversation 3: User 4, User 5, and Admin
(3, 4, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 5, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 1, DATE_SUB(NOW(), INTERVAL 5 DAY));

-- ========================================
-- SAMPLE DATA - messages
-- ========================================
INSERT INTO messages (conversation_id, sender_id, content, is_read, created_at) VALUES
-- Conversation 1
(1, 2, 'Hello, I want to book a vehicle', FALSE, NOW()),
(1, 1, 'Sure! Which vehicle would you like to rent?', TRUE, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(1, 2, 'I am interested in the Honda Wave', FALSE, DATE_SUB(NOW(), INTERVAL 50 MINUTE)),

-- Conversation 2
(2, 3, 'Is the Yamaha Exciter available for weekend?', TRUE, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 1, 'Yes, it is available! What dates?', TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 3, 'January 27-28. Can I book it?', FALSE, DATE_SUB(NOW(), INTERVAL 23 HOUR)),

-- Conversation 3
(3, 4, 'Hello team, interested in group rental', FALSE, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 5, 'Me too! How many bikes do we need?', FALSE, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 1, 'We have great group rates! Please tell me your requirements', TRUE, DATE_SUB(NOW(), INTERVAL 4 DAY));

-- ========================================
-- SAMPLE DATA - reviews
-- ========================================
INSERT INTO reviews (booking_id, user_id, vehicle_id, rating, comment, created_at) VALUES
(1, 2, 1, 5, 'Excellent service! Vehicle was in perfect condition. Highly recommend!', NOW()),
(2, 3, 2, 4, 'Good experience overall. Staff was helpful. Minor damage noted at return which was fair.', NOW());

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
