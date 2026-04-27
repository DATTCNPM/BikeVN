BikeVN Database - SQL Queries Reference
========================================

Common SQL queries for application development and testing.
All queries tested with sample data.

USER MANAGEMENT QUERIES
=======================

1. Get User by Email
SELECT * FROM users WHERE email = 'nguyena@email.com';

2. Get User by CCCD (National ID)
SELECT * FROM users WHERE cccd_number = '001234567891';

3. Get All Admins
SELECT * FROM users WHERE role = 'admin';

4. Count Users by Role
SELECT role, COUNT(*) as count FROM users GROUP BY role;

5. Get User with Recent Bookings
SELECT u.*, b.id as booking_id, b.status, b.total_price
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id
WHERE u.id = 2
ORDER BY b.created_at DESC;

BRANCH QUERIES
==============

1. Get All Active Branches
SELECT * FROM branches WHERE status = 'active' ORDER BY name;

2. Get Branches with Vehicle Count
SELECT b.*, COUNT(v.id) as vehicle_count
FROM branches b
LEFT JOIN vehicles v ON b.id = v.current_branch_id
GROUP BY b.id
ORDER BY vehicle_count DESC;

3. Find Nearest Branch to Coordinates
SELECT * FROM branches
WHERE status = 'active'
ORDER BY SQRT(POW(lat - 10.77588, 2) + POW(lng - 106.70183, 2))
LIMIT 5;

4. Get Branch Details with Active Vehicles
SELECT b.name, b.address, COUNT(v.id) as total_vehicles,
       SUM(CASE WHEN v.status = 'available' THEN 1 ELSE 0 END) as available_count
FROM branches b
LEFT JOIN vehicles v ON b.id = v.current_branch_id
GROUP BY b.id;

VEHICLE QUERIES
===============

1. Get All Available Vehicles
SELECT * FROM vehicles WHERE status = 'available' ORDER BY price ASC;

2. Get Available Vehicles by Type
SELECT * FROM vehicles
WHERE status = 'available' AND vehicle_type = 'scooter'
ORDER BY price ASC;

3. Get Vehicles by Branch
SELECT v.id, v.name, v.vehicle_type, v.price, v.status
FROM vehicles v
JOIN branches b ON v.current_branch_id = b.id
WHERE b.id = 1
ORDER BY v.price;

4. Get Vehicles in Maintenance
SELECT * FROM vehicles WHERE status = 'maintenance';

5. Get Vehicle Price Range by Type
SELECT vehicle_type,
       MIN(price) as min_price,
       MAX(price) as max_price,
       AVG(price) as avg_price,
       COUNT(*) as total_count
FROM vehicles
GROUP BY vehicle_type
ORDER BY avg_price DESC;

6. Find Vehicles Available for Date Range
SELECT v.id, v.name, v.vehicle_type, v.price, b.name as branch
FROM vehicles v
JOIN branches b ON v.current_branch_id = b.id
WHERE v.status = 'available'
  AND v.id NOT IN (
    SELECT vehicle_id FROM bookings
    WHERE status IN ('confirmed', 'in_progress', 'pending')
    AND start_time < '2024-01-30 10:00:00'
    AND end_time > '2024-01-25 08:00:00'
  )
ORDER BY v.price;

BOOKING QUERIES
===============

1. Get All Active Bookings
SELECT * FROM vw_active_bookings;

2. Get User's Bookings
SELECT b.*, v.name as vehicle_name, u.name as user_name
FROM bookings b
JOIN vehicles v ON b.vehicle_id = v.id
JOIN users u ON b.user_id = u.id
WHERE b.user_id = 2
ORDER BY b.start_time DESC;

3. Get Booking Details with Full Info
SELECT b.id, b.status, b.start_time, b.end_time, b.total_price,
       u.name as user_name, u.phone as user_phone,
       v.name as vehicle_name, v.vehicle_type,
       br.name as branch_name, br.address
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
JOIN branches br ON v.current_branch_id = br.id
WHERE b.id = 1;

4. Check for Booking Conflicts
SELECT COUNT(*) as conflicts
FROM bookings
WHERE vehicle_id = 1
  AND status IN ('confirmed', 'in_progress', 'pending')
  AND (
    (start_time < '2024-01-25 10:00:00' AND end_time > '2024-01-25 08:00:00')
    OR (start_time = '2024-01-25 08:00:00')
  );

5. Get Bookings by Status
SELECT status, COUNT(*) as count, SUM(total_price) as total_revenue
FROM bookings
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY status;

6. Find Completed Bookings with Reviews
SELECT b.id, b.start_time, b.end_time, b.total_price,
       u.name as user_name,
       v.name as vehicle_name,
       r.rating, r.comment
FROM bookings b
LEFT JOIN reviews r ON b.id = r.booking_id
JOIN users u ON b.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
WHERE b.status = 'completed'
ORDER BY b.end_time DESC;

7. Get Bookings Overdue for Return
SELECT b.id, b.user_id, u.name, u.phone, b.vehicle_id, v.name,
       b.end_time, TIMESTAMPDIFF(HOUR, b.end_time, NOW()) as hours_late
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
WHERE b.status = 'in_progress'
  AND b.end_time < NOW();

PAYMENT QUERIES
===============

1. Get Payments by Status
SELECT status, COUNT(*) as count, SUM(amount) as total_amount
FROM payments
GROUP BY status;

2. Get Pending Payments
SELECT p.id, p.amount, p.created_at,
       u.name as user_name, u.email, u.phone,
       v.name as vehicle_name,
       b.start_time, b.end_time
FROM payments p
JOIN bookings b ON p.booking_id = b.id
JOIN users u ON b.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
WHERE p.status = 'pending'
ORDER BY p.created_at ASC;

3. Get Revenue by Payment Method
SELECT payment_method, COUNT(*) as transaction_count, SUM(amount) as total_amount
FROM payments
WHERE status = 'completed'
  AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY payment_method
ORDER BY total_amount DESC;

4. Get Failed Payments
SELECT p.id, p.amount, p.payment_method, p.created_at,
       u.name, u.email
FROM payments p
JOIN bookings b ON p.booking_id = b.id
JOIN users u ON b.user_id = u.id
WHERE p.status = 'failed'
ORDER BY p.created_at DESC;

5. Get Refunded Payments
SELECT p.id, p.amount, p.payment_method, p.created_at,
       b.status as booking_status,
       u.name, u.email
FROM payments p
JOIN bookings b ON p.booking_id = b.id
JOIN users u ON b.user_id = u.id
WHERE p.status = 'refunded'
ORDER BY p.created_at DESC;

VEHICLE RETURN QUERIES
======================

1. Get All Returned Vehicles
SELECT vr.*, v.name as vehicle_name, u.name as user_name,
       b.start_time, b.end_time, br.name as return_branch
FROM vehicle_returns vr
JOIN bookings b ON vr.booking_id = b.id
JOIN users u ON b.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
JOIN branches br ON vr.return_branch_id = br.id
ORDER BY vr.return_time DESC;

2. Get Vehicles with Damage Reports
SELECT vr.*, v.name as vehicle_name, u.name as user_name,
       b.total_price, vr.extra_fees
FROM vehicle_returns vr
JOIN bookings b ON vr.booking_id = b.id
JOIN users u ON b.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
WHERE vr.damage_noted = TRUE
ORDER BY vr.return_time DESC;

3. Calculate Total Damage Claims
SELECT SUM(extra_fees) as total_damage_fees,
       COUNT(*) as damage_count
FROM vehicle_returns
WHERE damage_noted = TRUE
  AND return_time >= DATE_SUB(NOW(), INTERVAL 30 DAY);

4. Get Return Fees by Vehicle
SELECT v.id, v.name, COUNT(vr.id) as return_count,
       SUM(vr.extra_fees) as total_fees
FROM vehicles v
LEFT JOIN bookings b ON v.id = b.vehicle_id
LEFT JOIN vehicle_returns vr ON b.id = vr.booking_id
WHERE vr.return_time IS NOT NULL
GROUP BY v.id
ORDER BY total_fees DESC;

MESSAGING QUERIES
=================

1. Get Recent Conversations for User
SELECT c.id, COUNT(m.id) as message_count, MAX(m.created_at) as last_message
FROM conversations c
JOIN conversation_members cm ON c.id = cm.conversation_id
LEFT JOIN messages m ON c.id = m.conversation_id
WHERE cm.user_id = 2
GROUP BY c.id
ORDER BY last_message DESC;

2. Get Unread Messages for User
SELECT m.id, m.content, m.created_at, m.sender_id,
       u.name as sender_name,
       c.id as conversation_id
FROM messages m
JOIN conversations c ON m.conversation_id = c.id
JOIN conversation_members cm ON c.id = cm.conversation_id
JOIN users u ON m.sender_id = u.id
WHERE cm.user_id = 2 AND m.is_read = FALSE
  AND m.sender_id != 2
ORDER BY m.created_at DESC;

3. Mark Messages as Read
UPDATE messages
SET is_read = TRUE
WHERE conversation_id = 1
  AND sender_id != 2;

4. Get Conversation Details
SELECT c.id, COUNT(cm.id) as member_count, COUNT(m.id) as message_count,
       MAX(m.created_at) as last_message
FROM conversations c
LEFT JOIN conversation_members cm ON c.id = cm.conversation_id
LEFT JOIN messages m ON c.id = m.conversation_id
WHERE c.id = 1
GROUP BY c.id;

5. Get All Messages in Conversation
SELECT m.id, u.name as sender_name, m.content, m.is_read, m.created_at
FROM messages m
JOIN users u ON m.sender_id = u.id
WHERE m.conversation_id = 1
ORDER BY m.created_at ASC;

6. Get Conversation Members
SELECT cm.id, u.name, u.email, cm.joined_at
FROM conversation_members cm
JOIN users u ON cm.user_id = u.id
WHERE cm.conversation_id = 1
ORDER BY cm.joined_at ASC;

REVIEW QUERIES
==============

1. Get All Reviews
SELECT r.*, u.name as user_name, v.name as vehicle_name, b.start_time, b.end_time
FROM reviews r
JOIN bookings b ON r.booking_id = b.id
JOIN users u ON r.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
ORDER BY r.created_at DESC;

2. Get Average Rating by Vehicle
SELECT v.id, v.name, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
FROM vehicles v
LEFT JOIN bookings b ON v.id = b.vehicle_id
LEFT JOIN reviews r ON b.id = r.booking_id
GROUP BY v.id
HAVING review_count > 0
ORDER BY avg_rating DESC;

3. Get 5-Star Reviews
SELECT * FROM reviews WHERE rating = 5 ORDER BY created_at DESC;

4. Get Low Ratings (1-2 stars)
SELECT r.*, u.name as user_name, v.name as vehicle_name
FROM reviews r
JOIN bookings b ON r.booking_id = b.id
JOIN users u ON r.user_id = u.id
JOIN vehicles v ON b.vehicle_id = v.id
WHERE r.rating <= 2
ORDER BY r.created_at DESC;

5. Get Reviews Without Comments
SELECT * FROM reviews WHERE comment IS NULL;

6. Count Reviews by Rating
SELECT rating, COUNT(*) as count
FROM reviews
GROUP BY rating
ORDER BY rating DESC;

ANALYTICS & REPORTING QUERIES
==============================

1. Revenue by Month
SELECT * FROM vw_monthly_revenue;

2. Revenue by Vehicle Type
SELECT v.vehicle_type, COUNT(b.id) as bookings, SUM(b.total_price) as revenue,
       AVG(b.total_price) as avg_booking_value
FROM bookings b
JOIN vehicles v ON b.vehicle_id = v.id
WHERE b.status = 'completed'
GROUP BY v.vehicle_type
ORDER BY revenue DESC;

3. Top Customers by Revenue
SELECT u.id, u.name, u.email, COUNT(b.id) as bookings, SUM(b.total_price) as total_spent
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id AND b.status = 'completed'
GROUP BY u.id
ORDER BY total_spent DESC
LIMIT 10;

4. Vehicle Utilization Rate
SELECT v.id, v.name, v.vehicle_type,
       COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
       COUNT(b.id) as total_bookings,
       ROUND((COUNT(CASE WHEN b.status = 'completed' THEN 1 END) / COUNT(b.id) * 100), 2) as completion_rate
FROM vehicles v
LEFT JOIN bookings b ON v.id = b.vehicle_id
GROUP BY v.id
ORDER BY completion_rate DESC;

5. Branch Performance
SELECT b.name, COUNT(v.id) as total_vehicles,
       COUNT(CASE WHEN v.status = 'available' THEN 1 END) as available,
       COUNT(b2.id) as total_bookings,
       SUM(b2.total_price) as total_revenue
FROM branches b
LEFT JOIN vehicles v ON b.id = v.current_branch_id
LEFT JOIN bookings b2 ON v.id = b2.vehicle_id AND b2.status = 'completed'
GROUP BY b.id
ORDER BY total_revenue DESC;

6. Daily Revenue Report
SELECT DATE(created_at) as date,
       COUNT(*) as total_bookings,
       SUM(total_price) as revenue,
       AVG(total_price) as avg_booking,
       COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
FROM bookings
WHERE DATE(created_at) >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;

MAINTENANCE QUERIES
===================

1. Check Database Size
SELECT table_name,
       ROUND(((data_length + index_length) / 1024 / 1024), 2) as size_mb
FROM information_schema.tables
WHERE table_schema = 'bikevn_db'
ORDER BY size_mb DESC;

2. Show All Indexes
SELECT * FROM information_schema.statistics
WHERE table_schema = 'bikevn_db'
ORDER BY table_name, seq_in_index;

3. Check Unique Constraint Violations
SELECT email, COUNT(*) as count FROM users GROUP BY email HAVING count > 1;

4. Find Missing Foreign Key References
SELECT b.id FROM bookings b
WHERE b.user_id NOT IN (SELECT id FROM users);

5. Optimize All Tables
OPTIMIZE TABLE users, branches, vehicles, bookings, payments,
              vehicle_returns, conversations, conversation_members,
              messages, reviews;

6. Analyze All Tables
ANALYZE TABLE users, branches, vehicles, bookings, payments,
             vehicle_returns, conversations, conversation_members,
             messages, reviews;

TRANSACTION EXAMPLES
====================

1. Create Booking Transaction (Atomic)
START TRANSACTION;
INSERT INTO bookings (user_id, vehicle_id, start_time, end_time, status, total_price)
VALUES (2, 1, '2024-02-15 08:00:00', '2024-02-15 18:00:00', 'pending', 1500000);

INSERT INTO payments (booking_id, amount, status, payment_method)
VALUES (LAST_INSERT_ID(), 1500000, 'pending', 'credit_card');

COMMIT;

2. Complete Booking Transaction (Atomic)
START TRANSACTION;
UPDATE bookings SET status = 'completed' WHERE id = 1;
INSERT INTO vehicle_returns (booking_id, return_time, return_branch_id, damage_noted)
VALUES (1, NOW(), 1, FALSE);
UPDATE vehicles SET current_branch_id = 1 WHERE id = (SELECT vehicle_id FROM bookings WHERE id = 1);
COMMIT;

3. Refund Transaction (Atomic)
START TRANSACTION;
UPDATE payments SET status = 'refunded' WHERE id = 1;
UPDATE bookings SET status = 'cancelled' WHERE id = (SELECT booking_id FROM payments WHERE id = 1);
COMMIT;
