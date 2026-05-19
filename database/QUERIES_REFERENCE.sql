-- BikeVN Database - SQL Queries Reference
-- ========================================
-- 
-- Common SQL queries for application development and testing.
-- All queries tested with sample data and updated for new schema.
-- 
-- Last Updated: 2024
-- Schema Version: 2.0 (UUID primary keys, complete vehicle fields)

-- ========================================
-- USER MANAGEMENT QUERIES
-- ========================================

-- 1. Get User by Email
SELECT * FROM users WHERE email = 'nguyena@email.com';

-- 2. Get User by CCCD (National ID)
SELECT * FROM users WHERE cccd_number = '001234567891';

-- 3. Get All Admins
SELECT * FROM users WHERE role = 'admin';

-- 4. Count Users by Role
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- 5. Get User with Recent Bookings
SELECT u.*, b.id as booking_id, b.status, b.total_price
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id
WHERE u.id = '550e8400-e29b-41d4-a716-446655440002'
ORDER BY b.created_at DESC;

-- ========================================
-- BRANCH QUERIES
-- ========================================

-- 1. Get All Active Branches
SELECT * FROM branches WHERE status = 'active' ORDER BY name;

-- 2. Get Branches with Vehicle Count
SELECT b.*, COUNT(v.id) as vehicle_count
FROM branches b
LEFT JOIN vehicles v ON b.id = v.current_branch_id
GROUP BY b.id
ORDER BY vehicle_count DESC;

-- 3. Find Nearest Branch to Coordinates (HCMC: 10.77588, 106.70183)
SELECT * FROM branches
WHERE status = 'active'
ORDER BY SQRT(POW(lat - 10.77588, 2) + POW(lng - 106.70183, 2))
LIMIT 5;

-- 4. Get Branch Details with Active Vehicles
SELECT b.name, b.address, COUNT(v.id) as total_vehicles,
       SUM(CASE WHEN v.status = 'available' THEN 1 ELSE 0 END) as available_count
FROM branches b
LEFT JOIN vehicles v ON b.id = v.current_branch_id
GROUP BY b.id;

-- ========================================
-- VEHICLE QUERIES
-- ========================================

-- 1. Get All Available Vehicles
SELECT * FROM vehicles WHERE status = 'available' ORDER BY price_per_day ASC;

-- 2. Get Available Vehicles by Type (fuel/electric)
SELECT * FROM vehicles
WHERE status = 'available' AND vehicle_type = 'fuel'
ORDER BY price_per_day ASC;

-- 3. Get Vehicles by Branch with Complete Info
SELECT v.id, v.name, v.brand, v.model, v.license_plate, v.color, v.year, 
       v.engine_capacity, v.vehicle_type, v.price_per_day, v.mileage, v.status
FROM vehicles v
JOIN branches b ON v.current_branch_id = b.id
WHERE b.id = '550e8400-e29b-41d4-a716-446655440101'
ORDER BY v.price_per_day;

-- 4. Get Vehicles in Maintenance
SELECT * FROM vehicles WHERE status = 'maintenance';

-- 5. Get Vehicle Price Range by Type (fuel/electric)
SELECT vehicle_type,
       MIN(price_per_day) as min_price,
       MAX(price_per_day) as max_price,
       AVG(price_per_day) as avg_price,
       COUNT(*) as total_count
FROM vehicles
GROUP BY vehicle_type
ORDER BY avg_price DESC;

-- 6. Find Vehicles Available for Date Range
SELECT v.id, v.name, v.brand, v.model, v.vehicle_type, v.price_per_day, b.name as branch
FROM vehicles v
JOIN branches b ON v.current_branch_id = b.id
WHERE v.status = 'available'
  AND v.id NOT IN (
    SELECT vehicle_id FROM bookings
    WHERE status IN ('pending', 'approved', 'completed')
    AND start_time < '2024-02-05 10:00:00'
    AND end_time > '2024-02-01 08:00:00'
  )
ORDER BY v.price_per_day;

-- 7. Get Vehicle Details with Description
SELECT v.id, v.name, v.brand, v.model, v.license_plate, v.color, v.year,
       v.engine_capacity, v.vehicle_type, v.price_per_day, v.mileage, 
       v.description, v.image_url, v.status
FROM vehicles v
WHERE v.id = '550e8400-e29b-41d4-a716-446655440201';

-- ========================================
-- BOOKING QUERIES
-- ========================================

-- 1. Get All Completed Bookings
SELECT * FROM bookings WHERE status = 'completed' ORDER BY created_at DESC;

-- 2. Get User's Bookings with Vehicle Details
SELECT b.*, v.name as vehicle_name, v.brand, v.model, v.license_plate,
       u.name as user_name, b_pickup.name as pickup_branch, b_return.name as return_branch
FROM bookings b
JOIN vehicles v ON b.vehicle_id = v.id
JOIN users u ON b.user_id = u.id
JOIN branches b_pickup ON b.pickup_branch_id = b_pickup.id
JOIN branches b_return ON b.return_branch_id = b_return.id
WHERE b.user_id = '550e8400-e29b-41d4-a716-446655440002'
ORDER BY b.start_time DESC;

-- 3. Get Booking Details with Full Info
SELECT b.id, b.status, b.start_time, b.end_time, b.actual_return_time, b.total_price,
       u.name as user_name, u.phone as user_phone,
       v.name as vehicle_name, v.brand, v.model, v.vehicle_type, v.price_per_day,
       b_pickup.name as pickup_branch, b_return.name as return_branch
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
JOIN branches b_pickup ON b.pickup_branch_id = b_pickup.id
JOIN branches b_return ON b.return_branch_id = b_return.id
WHERE b.id = '550e8400-e29b-41d4-a716-446655440301';

-- 4. Check for Booking Conflicts
SELECT COUNT(*) as conflicts
FROM bookings
WHERE vehicle_id = '550e8400-e29b-41d4-a716-446655440201'
  AND status IN ('pending', 'approved', 'completed')
  AND (
    (start_time < '2024-02-05 10:00:00' AND end_time > '2024-02-05 08:00:00')
    OR (start_time = '2024-02-05 08:00:00')
  );

-- 5. Get Bookings by Status
SELECT status, COUNT(*) as count, SUM(total_price) as total_revenue
FROM bookings
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY status;

-- 6. Find Completed Bookings with Reviews
SELECT b.id, b.start_time, b.end_time, b.total_price,
       u.name as user_name,
       v.name as vehicle_name, v.brand, v.model,
       r.rating, r.comment
FROM bookings b
LEFT JOIN reviews r ON b.id = r.booking_id
JOIN users u ON b.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
WHERE b.status = 'completed'
ORDER BY b.end_time DESC;

-- 7. Get Bookings with Late Returns (status = 'completed' with actual_return_time > end_time)
SELECT b.id, b.user_id, u.name, u.phone, b.vehicle_id, v.name,
       b.end_time, b.actual_return_time,
       TIMESTAMPDIFF(HOUR, b.end_time, b.actual_return_time) as hours_late
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
WHERE b.status = 'completed'
  AND b.actual_return_time > b.end_time
ORDER BY hours_late DESC;

-- ========================================
-- PAYMENT QUERIES
-- ========================================

-- 1. Get Payments by Status
SELECT status, COUNT(*) as count, SUM(amount) as total_amount
FROM payments
GROUP BY status;

-- 2. Get Payments by Type (deposit/rental)
SELECT type, COUNT(*) as count, SUM(amount) as total_amount
FROM payments
GROUP BY type;

-- 3. Get Pending Payments
SELECT p.id, p.amount, p.type, p.payment_method, p.created_at,
       u.name as user_name, u.email, u.phone,
       v.name as vehicle_name, v.brand, v.model,
       b.start_time, b.end_time
FROM payments p
JOIN bookings b ON p.booking_id = b.id
JOIN users u ON b.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
WHERE p.status = 'pending'
ORDER BY p.created_at ASC;

-- 4. Get Revenue by Payment Method
SELECT payment_method, COUNT(*) as transaction_count, SUM(amount) as total_amount
FROM payments
WHERE status = 'completed'
  AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY payment_method
ORDER BY total_amount DESC;

-- 5. Get Failed Payments
SELECT p.id, p.amount, p.payment_method, p.created_at,
       u.name, u.email
FROM payments p
JOIN bookings b ON p.booking_id = b.id
JOIN users u ON b.user_id = u.id
WHERE p.status = 'failed'
ORDER BY p.created_at DESC;

-- 6. Get Refunded Payments
SELECT p.id, p.amount, p.type, p.payment_method, p.created_at,
       b.status as booking_status,
       u.name, u.email
FROM payments p
JOIN bookings b ON p.booking_id = b.id
JOIN users u ON b.user_id = u.id
WHERE p.status = 'refunded'
ORDER BY p.created_at DESC;

-- ========================================
-- VEHICLE RETURN QUERIES
-- ========================================

-- 1. Get All Returned Vehicles
SELECT vr.*, v.name as vehicle_name, v.brand, v.model, v.license_plate,
       u.name as user_name,
       b.start_time, b.end_time, br.name as return_branch
FROM vehicle_returns vr
JOIN bookings b ON vr.booking_id = b.id
JOIN users u ON b.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
JOIN branches br ON vr.return_branch_id = br.id
ORDER BY vr.created_at DESC;

-- 2. Get Vehicles with Damage Reports
SELECT vr.*, v.name as vehicle_name, v.brand, v.model,
       u.name as user_name,
       b.total_price, vr.extra_fee
FROM vehicle_returns vr
JOIN bookings b ON vr.booking_id = b.id
JOIN users u ON b.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
WHERE vr.condition_status IN ('damaged', 'fair')
ORDER BY vr.created_at DESC;

-- 3. Calculate Total Damage Claims (from extra_fee field)
SELECT SUM(extra_fee) as total_damage_fees,
       COUNT(*) as damage_count
FROM vehicle_returns
WHERE extra_fee > 0
  AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- 4. Get Return Summary by Vehicle
SELECT v.id, v.name, v.brand, v.model, COUNT(vr.id) as return_count,
       SUM(vr.extra_fee) as total_fees,
       AVG(vr.extra_fee) as avg_fee
FROM vehicles v
LEFT JOIN bookings b ON v.id = b.vehicle_id
LEFT JOIN vehicle_returns vr ON b.id = vr.booking_id
WHERE vr.id IS NOT NULL
GROUP BY v.id
ORDER BY total_fees DESC;

-- ========================================
-- MESSAGING QUERIES
-- ========================================

-- 1. Get Recent Conversations for User
SELECT c.id, COUNT(m.id) as message_count, MAX(m.created_at) as last_message,
       COUNT(CASE WHEN m.is_read = FALSE THEN 1 END) as unread_count
FROM conversations c
JOIN conversation_members cm ON c.id = cm.conversation_id
LEFT JOIN messages m ON c.id = m.conversation_id
WHERE cm.user_id = '550e8400-e29b-41d4-a716-446655440002'
GROUP BY c.id
ORDER BY last_message DESC;

-- 2. Get Unread Messages for User
SELECT m.id, m.content, m.created_at, m.sender_id,
       u.name as sender_name,
       c.id as conversation_id
FROM messages m
JOIN conversations c ON m.conversation_id = c.id
JOIN conversation_members cm ON c.id = cm.conversation_id
JOIN users u ON m.sender_id = u.id
WHERE cm.user_id = '550e8400-e29b-41d4-a716-446655440002' AND m.is_read = FALSE
  AND m.sender_id != '550e8400-e29b-41d4-a716-446655440002'
ORDER BY m.created_at DESC;

-- 3. Mark Messages as Read for Conversation
UPDATE messages
SET is_read = TRUE
WHERE conversation_id = '550e8400-e29b-41d4-a716-446655440601'
  AND sender_id != '550e8400-e29b-41d4-a716-446655440002';

-- 4. Get Conversation Details
SELECT c.id, COUNT(cm.id) as member_count, COUNT(m.id) as message_count,
       MAX(m.created_at) as last_message
FROM conversations c
LEFT JOIN conversation_members cm ON c.id = cm.conversation_id
LEFT JOIN messages m ON c.id = m.conversation_id
WHERE c.id = '550e8400-e29b-41d4-a716-446655440601'
GROUP BY c.id;

-- 5. Get All Messages in Conversation (Ordered by Time)
SELECT m.id, u.name as sender_name, m.content, m.is_read, m.created_at
FROM messages m
JOIN users u ON m.sender_id = u.id
WHERE m.conversation_id = '550e8400-e29b-41d4-a716-446655440601'
ORDER BY m.created_at ASC;

-- 6. Get Conversation Members
SELECT cm.id, u.name, u.email, u.phone, cm.joined_at
FROM conversation_members cm
JOIN users u ON cm.user_id = u.id
WHERE cm.conversation_id = '550e8400-e29b-41d4-a716-446655440601'
ORDER BY cm.joined_at ASC;

-- ========================================
-- REVIEW QUERIES
-- ========================================

-- 1. Get All Reviews with Complete Info
SELECT r.*, u.name as user_name, u.email,
       v.name as vehicle_name, v.brand, v.model, v.license_plate,
       b.start_time, b.end_time
FROM reviews r
JOIN bookings b ON r.booking_id = b.id
JOIN users u ON r.user_id = u.id
JOIN vehicles v ON r.vehicle_id = v.id
ORDER BY r.created_at DESC;

-- 2. Get Average Rating by Vehicle
SELECT v.id, v.name, v.brand, v.model, 
       ROUND(AVG(r.rating), 2) as avg_rating, 
       COUNT(r.id) as review_count,
       SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END) as five_star_count
FROM vehicles v
LEFT JOIN bookings b ON v.id = b.vehicle_id
LEFT JOIN reviews r ON b.id = r.booking_id
GROUP BY v.id
HAVING COUNT(r.id) > 0
ORDER BY avg_rating DESC;

-- 3. Get 5-Star Reviews
SELECT r.*, u.name as user_name, v.name as vehicle_name
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN vehicles v ON r.vehicle_id = v.id
WHERE r.rating = 5 
ORDER BY r.created_at DESC;

-- 4. Get Low Ratings (1-2 stars)
SELECT r.*, u.name as user_name, v.name as vehicle_name, v.brand, v.model
FROM reviews r
JOIN bookings b ON r.booking_id = b.id
JOIN users u ON r.user_id = u.id
JOIN vehicles v ON r.vehicle_id = v.id
WHERE r.rating <= 2
ORDER BY r.created_at DESC;

-- 5. Get Reviews Without Comments
SELECT r.*, u.name as user_name, v.name as vehicle_name
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN vehicles v ON r.vehicle_id = v.id
WHERE r.comment IS NULL
ORDER BY r.created_at DESC;

-- 6. Count Reviews by Rating
SELECT rating, COUNT(*) as count,
       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reviews), 2) as percentage
FROM reviews
GROUP BY rating
ORDER BY rating DESC;

-- ========================================
-- ANALYTICS & REPORTING QUERIES
-- ========================================

-- 1. Monthly Revenue Report
SELECT DATE_TRUNC(MONTH, b.created_at) as month,
       COUNT(b.id) as total_bookings,
       SUM(b.total_price) as monthly_revenue,
       AVG(b.total_price) as avg_booking_value
FROM bookings b
WHERE b.status = 'completed'
GROUP BY DATE_TRUNC(MONTH, b.created_at)
ORDER BY month DESC;

-- 2. Revenue by Vehicle Type (fuel/electric)
SELECT v.vehicle_type, COUNT(b.id) as bookings, SUM(b.total_price) as revenue,
       AVG(b.total_price) as avg_booking_value,
       COUNT(DISTINCT b.user_id) as unique_customers
FROM bookings b
JOIN vehicles v ON b.vehicle_id = v.id
WHERE b.status = 'completed'
GROUP BY v.vehicle_type
ORDER BY revenue DESC;

-- 3. Top Customers by Revenue
SELECT u.id, u.name, u.email, u.phone, 
       COUNT(b.id) as bookings, 
       SUM(b.total_price) as total_spent,
       AVG(b.total_price) as avg_booking
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id AND b.status = 'completed'
GROUP BY u.id
ORDER BY total_spent DESC
LIMIT 10;

-- 4. Vehicle Utilization Rate
SELECT v.id, v.name, v.brand, v.model, v.vehicle_type,
       COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
       COUNT(b.id) as total_bookings,
       ROUND((COUNT(CASE WHEN b.status = 'completed' THEN 1 END) / NULLIF(COUNT(b.id), 0) * 100), 2) as completion_rate
FROM vehicles v
LEFT JOIN bookings b ON v.id = b.vehicle_id
GROUP BY v.id
ORDER BY completion_rate DESC;

-- 5. Branch Performance Analysis
SELECT b.id, b.name, b.address,
       COUNT(v.id) as total_vehicles,
       COUNT(CASE WHEN v.status = 'available' THEN 1 END) as available,
       COUNT(b2.id) as total_bookings,
       SUM(b2.total_price) as total_revenue,
       ROUND(AVG(b2.total_price), 2) as avg_booking
FROM branches b
LEFT JOIN vehicles v ON b.id = v.current_branch_id
LEFT JOIN bookings b2 ON v.id = b2.vehicle_id AND b2.status = 'completed'
GROUP BY b.id
ORDER BY total_revenue DESC;

-- 6. Daily Revenue Report (Last 30 Days)
SELECT DATE(b.created_at) as date,
       COUNT(*) as total_bookings,
       SUM(b.total_price) as revenue,
       AVG(b.total_price) as avg_booking,
       COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed,
       COUNT(CASE WHEN b.status = 'pending' THEN 1 END) as pending,
       COUNT(CASE WHEN b.status = 'approved' THEN 1 END) as approved
FROM bookings b
WHERE DATE(b.created_at) >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(b.created_at)
ORDER BY date DESC;

-- ========================================
-- MAINTENANCE QUERIES
-- ========================================

-- 1. Check Database Size
SELECT table_name,
       ROUND(((data_length + index_length) / 1024 / 1024), 2) as size_mb
FROM information_schema.tables
WHERE table_schema = 'bikevn_db'
ORDER BY size_mb DESC;

-- 2. Show All Indexes
SELECT table_name, index_name, column_name, seq_in_index
FROM information_schema.statistics
WHERE table_schema = 'bikevn_db'
ORDER BY table_name, index_name, seq_in_index;

-- 3. Check Unique Constraint Violations (Email)
SELECT email, COUNT(*) as count FROM users GROUP BY email HAVING count > 1;

-- 4. Check Unique Constraint Violations (CCCD)
SELECT cccd_number, COUNT(*) as count FROM users GROUP BY cccd_number HAVING count > 1;

-- 5. Check Unique Constraint Violations (License Plate)
SELECT license_plate, COUNT(*) as count FROM vehicles GROUP BY license_plate HAVING count > 1;

-- 6. Find Missing Foreign Key References (Bookings)
SELECT b.id FROM bookings b
WHERE b.user_id NOT IN (SELECT id FROM users)
   OR b.vehicle_id NOT IN (SELECT id FROM vehicles)
   OR b.pickup_branch_id NOT IN (SELECT id FROM branches)
   OR b.return_branch_id NOT IN (SELECT id FROM branches);

-- 7. Find Missing Foreign Key References (Payments)
SELECT p.id FROM payments p
WHERE p.booking_id NOT IN (SELECT id FROM bookings);

-- 8. Find Missing Foreign Key References (Reviews)
SELECT r.id FROM reviews r
WHERE r.booking_id NOT IN (SELECT id FROM bookings)
   OR r.user_id NOT IN (SELECT id FROM users)
   OR r.vehicle_id NOT IN (SELECT id FROM vehicles);

-- 9. Optimize All Tables
OPTIMIZE TABLE users, branches, vehicles, bookings, payments,
              vehicle_returns, conversations, conversation_members,
              messages, reviews;

-- 10. Analyze All Tables
ANALYZE TABLE users, branches, vehicles, bookings, payments,
             vehicle_returns, conversations, conversation_members,
             messages, reviews;

-- ========================================
-- TRANSACTION EXAMPLES
-- ========================================

-- 1. Create Booking Transaction (Atomic Operation)
-- Creates booking, payment deposit, and updates vehicle status
START TRANSACTION;

-- Generate UUIDs: you should generate these in application code
SET @booking_id = UUID();
SET @payment_id = UUID();
SET @user_id = '550e8400-e29b-41d4-a716-446655440003';
SET @vehicle_id = '550e8400-e29b-41d4-a716-446655440201';
SET @pickup_branch_id = '550e8400-e29b-41d4-a716-446655440101';
SET @return_branch_id = '550e8400-e29b-41d4-a716-446655440101';

INSERT INTO bookings (id, user_id, vehicle_id, pickup_branch_id, return_branch_id, 
                     start_time, end_time, status, total_price)
VALUES (@booking_id, @user_id, @vehicle_id, @pickup_branch_id, @return_branch_id,
        '2024-02-15 08:00:00', '2024-02-15 18:00:00', 'pending', 1500000);

INSERT INTO payments (id, booking_id, amount, type, payment_method, status)
VALUES (@payment_id, @booking_id, 300000, 'deposit', 'credit_card', 'pending');

COMMIT;

-- 2. Complete Booking Transaction (Atomic Operation)
-- Marks booking as completed, records vehicle return, and updates vehicle status
START TRANSACTION;

SET @booking_id = '550e8400-e29b-41d4-a716-446655440301';
SET @vehicle_id = '550e8400-e29b-41d4-a716-446655440201';
SET @return_branch_id = '550e8400-e29b-41d4-a716-446655440101';

UPDATE bookings 
SET status = 'completed', actual_return_time = NOW() 
WHERE id = @booking_id;

INSERT INTO vehicle_returns (id, booking_id, vehicle_id, return_branch_id, 
                            condition_status, damage_description, extra_fee)
VALUES (UUID(), @booking_id, @vehicle_id, @return_branch_id, 
        'good', NULL, 0);

UPDATE vehicles 
SET current_branch_id = @return_branch_id, mileage = mileage + 150
WHERE id = @vehicle_id;

COMMIT;

-- 3. Refund Transaction (Atomic Operation)
-- Updates payment status to refunded and booking to cancelled
START TRANSACTION;

SET @payment_id = '550e8400-e29b-41d4-a716-446655440406';

UPDATE payments 
SET status = 'refunded', paid_at = NOW() 
WHERE id = @payment_id;

UPDATE bookings 
SET status = 'cancelled' 
WHERE id = (SELECT booking_id FROM payments WHERE id = @payment_id);

COMMIT;

-- 4. Record Damage and Extra Fees (Atomic Operation)
START TRANSACTION;

SET @booking_id = '550e8400-e29b-41d4-a716-446655440302';
SET @vehicle_id = '550e8400-e29b-41d4-a716-446655440202';

-- Update vehicle return with damage info
UPDATE vehicle_returns
SET condition_status = 'fair', 
    damage_description = 'Minor scratches on side mirror and body',
    extra_fee = 200000
WHERE booking_id = @booking_id;

-- Create additional payment for damage
INSERT INTO payments (id, booking_id, amount, type, payment_method, status)
VALUES (UUID(), @booking_id, 200000, 'rental', 'credit_card', 'pending');

COMMIT;

-- 5. Approve Booking and Process Payment (Atomic Operation)
START TRANSACTION;

SET @booking_id = '550e8400-e29b-41d4-a716-446655440305';

UPDATE bookings 
SET status = 'approved' 
WHERE id = @booking_id;

UPDATE payments 
SET status = 'completed', paid_at = NOW() 
WHERE booking_id = @booking_id AND type = 'rental';

COMMIT;

-- ========================================
-- END OF QUERIES REFERENCE
-- ========================================
