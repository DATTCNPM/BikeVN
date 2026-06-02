-- ========================================
-- CONCURRENT BOOKING CONTROL - SQL QUERIES
-- ========================================
-- Useful queries for checking booking conflicts, managing locks, and monitoring

USE bikevn_db;

-- ========================================
-- 1. CHECK AVAILABILITY QUERIES
-- ========================================

-- Query 1a: Check if vehicle has conflicting ACTIVE/PENDING bookings
-- Usage: Before creating new booking, check for overlaps
SELECT 
    b.id,
    b.user_id,
    b.vehicle_id,
    b.start_time,
    b.end_time,
    b.status,
    b.created_at
FROM bookings b
WHERE b.vehicle_id = '<<VEHICLE_ID>>'
  AND b.status IN ('pending', 'approved')
  AND (
    -- Time overlap check: new booking [?start, ?end] conflicts if:
    -- existing_start < new_end AND existing_end > new_start
    b.start_time < '<<END_TIME>>'
    AND b.end_time > '<<START_TIME>>'
  )
ORDER BY b.start_time ASC;

-- Query 1b: Check if vehicle has ACTIVE LOCKS (reservations)
SELECT 
    bl.id,
    bl.user_id,
    bl.vehicle_id,
    bl.start_time,
    bl.end_time,
    bl.lock_expires_at,
    bl.status,
    TIMEDIFF(bl.lock_expires_at, NOW()) as remaining_time
FROM booking_locks bl
WHERE bl.vehicle_id = '<<VEHICLE_ID>>'
  AND bl.status = 'active'
  AND bl.lock_expires_at > NOW()
  AND (
    bl.start_time < '<<END_TIME>>'
    AND bl.end_time > '<<START_TIME>>'
  )
ORDER BY bl.lock_expires_at ASC;

-- Query 1c: Get available time slots for a vehicle (next 7 days)
SELECT 
    v.id,
    v.name,
    v.current_branch_id,
    '2024-01-15 08:00:00' as available_from,
    '2024-01-15 18:00:00' as available_until,
    v.price_per_day
FROM vehicles v
WHERE v.id = '<<VEHICLE_ID>>'
  AND NOT EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.vehicle_id = v.id
      AND b.status IN ('pending', 'approved')
      AND b.start_time < DATE_ADD(NOW(), INTERVAL 7 DAY)
      AND b.end_time > NOW()
  )
  AND NOT EXISTS (
    SELECT 1 FROM booking_locks bl
    WHERE bl.vehicle_id = v.id
      AND bl.status = 'active'
      AND bl.lock_expires_at > NOW()
  );

-- ========================================
-- 2. LOCK MANAGEMENT QUERIES
-- ========================================

-- Query 2a: View ALL ACTIVE LOCKS currently held
SELECT 
    bl.id,
    bl.vehicle_id,
    bl.user_id,
    u.name as user_name,
    bl.start_time,
    bl.end_time,
    bl.lock_acquired_at,
    bl.lock_expires_at,
    bl.status,
    TIMEDIFF(bl.lock_expires_at, NOW()) as remaining_time,
    CASE 
        WHEN bl.lock_expires_at < NOW() THEN 'EXPIRED'
        WHEN TIMEDIFF(bl.lock_expires_at, NOW()) < '00:01:00' THEN 'EXPIRING SOON'
        ELSE 'ACTIVE'
    END as urgency
FROM booking_locks bl
LEFT JOIN users u ON bl.user_id = u.id
WHERE bl.status = 'active'
ORDER BY bl.lock_expires_at ASC;

-- Query 2b: View LOCKS by specific USER
SELECT 
    bl.id,
    bl.vehicle_id,
    bl.user_id,
    bl.start_time,
    bl.end_time,
    bl.lock_expires_at,
    bl.status,
    TIMEDIFF(bl.lock_expires_at, NOW()) as time_left
FROM booking_locks bl
WHERE bl.user_id = '<<USER_ID>>'
  AND bl.status = 'active'
ORDER BY bl.lock_expires_at DESC;

-- Query 2c: View LOCKS by specific VEHICLE
SELECT 
    bl.id,
    bl.user_id,
    u.name as user_name,
    bl.start_time,
    bl.end_time,
    bl.lock_expires_at,
    bl.status
FROM booking_locks bl
LEFT JOIN users u ON bl.user_id = u.id
WHERE bl.vehicle_id = '<<VEHICLE_ID>>'
  AND bl.status = 'active'
  AND bl.lock_expires_at > NOW()
ORDER BY bl.lock_expires_at ASC;

-- Query 2d: RELEASE/EXPIRE a specific lock (manual cleanup)
UPDATE booking_locks
SET status = 'released',
    updated_at = NOW()
WHERE id = '<<LOCK_ID>>'
  AND status = 'active';

-- Query 2e: CLEANUP EXPIRED LOCKS (run periodically)
UPDATE booking_locks
SET status = 'expired',
    updated_at = NOW()
WHERE lock_expires_at < NOW()
  AND status = 'active';

-- Verify cleanup
SELECT COUNT(*) as expired_count FROM booking_locks WHERE status = 'expired' AND lock_expires_at < NOW();

-- ========================================
-- 3. BOOKING CONFLICT DETECTION
-- ========================================

-- Query 3a: Find ALL CONFLICTING BOOKINGS (for analysis)
SELECT 
    b1.id as booking_1_id,
    b1.user_id as user_1,
    b1.start_time as booking_1_start,
    b1.end_time as booking_1_end,
    b1.status as status_1,
    '---' as separator,
    b2.id as booking_2_id,
    b2.user_id as user_2,
    b2.start_time as booking_2_start,
    b2.end_time as booking_2_end,
    b2.status as status_2,
    TIMEDIFF(
        LEAST(b1.end_time, b2.end_time),
        GREATEST(b1.start_time, b2.start_time)
    ) as overlap_duration
FROM bookings b1
INNER JOIN bookings b2 ON b1.vehicle_id = b2.vehicle_id
WHERE b1.id < b2.id  -- Avoid duplicate pairs
  AND b1.status IN ('pending', 'approved')
  AND b2.status IN ('pending', 'approved')
  AND b1.start_time < b2.end_time
  AND b1.end_time > b2.start_time
ORDER BY b1.vehicle_id, b1.start_time;

-- Query 3b: Check SPECIFIC BOOKING for conflicts
SELECT 
    b.id,
    b.user_id,
    b.vehicle_id,
    b.start_time,
    b.end_time,
    b.status,
    (
        SELECT COUNT(*)
        FROM bookings b2
        WHERE b2.vehicle_id = b.vehicle_id
          AND b2.id != b.id
          AND b2.status IN ('pending', 'approved')
          AND b2.start_time < b.end_time
          AND b2.end_time > b.start_time
    ) as conflicting_booking_count
FROM bookings b
WHERE b.id = '<<BOOKING_ID>>';

-- ========================================
-- 4. PERFORMANCE MONITORING
-- ========================================

-- Query 4a: LOCK CONTENTION RATIO (high = many users waiting)
SELECT 
    COUNT(CASE WHEN bl.status = 'active' AND bl.lock_expires_at > NOW() THEN 1 END) as active_locks,
    COUNT(*) as total_locks,
    ROUND(
        COUNT(CASE WHEN bl.status = 'active' AND bl.lock_expires_at > NOW() THEN 1 END) * 100.0
        / NULLIF(COUNT(*), 0),
        2
    ) as contention_percent,
    NOW() as checked_at
FROM booking_locks bl
WHERE bl.created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR);

-- Query 4b: BOOKING STATISTICS (last 24 hours)
SELECT 
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count,
    ROUND(
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) * 100.0
        / NULLIF(COUNT(*), 0),
        2
    ) as rejection_rate_percent
FROM bookings
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- Query 4c: VEHICLE-WISE BOOKING LOAD
SELECT 
    v.id,
    v.name,
    COUNT(b.id) as total_bookings,
    COUNT(CASE WHEN b.status IN ('pending', 'approved') THEN 1 END) as active_bookings,
    COUNT(CASE WHEN bl.id IS NOT NULL THEN 1 END) as active_locks,
    ROUND(v.price_per_day, 0) as price_per_day
FROM vehicles v
LEFT JOIN bookings b ON v.id = b.vehicle_id
LEFT JOIN booking_locks bl ON v.id = bl.vehicle_id AND bl.status = 'active' AND bl.lock_expires_at > NOW()
GROUP BY v.id, v.name
ORDER BY active_bookings DESC, active_locks DESC;

-- Query 4d: PEAK HOURS ANALYSIS
SELECT 
    HOUR(b.created_at) as booking_hour,
    COUNT(*) as booking_count,
    COUNT(CASE WHEN b.status = 'rejected' THEN 1 END) as rejected_count,
    ROUND(
        COUNT(CASE WHEN b.status = 'rejected' THEN 1 END) * 100.0
        / NULLIF(COUNT(*), 0),
        2
    ) as rejection_rate_percent
FROM bookings b
WHERE b.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY HOUR(b.created_at)
ORDER BY booking_hour;

-- Query 4e: LOCK RELEASE TIME (how long users keep locks)
SELECT 
    ROUND(AVG(TIMEDIFF(bl.updated_at, bl.lock_acquired_at))) as avg_lock_duration,
    ROUND(MIN(TIMEDIFF(bl.updated_at, bl.lock_acquired_at))) as min_lock_duration,
    ROUND(MAX(TIMEDIFF(bl.updated_at, bl.lock_acquired_at))) as max_lock_duration,
    COUNT(*) as total_released_locks
FROM booking_locks bl
WHERE bl.status IN ('released', 'expired')
  AND bl.updated_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- ========================================
-- 5. DATA CONSISTENCY CHECKS
-- ========================================

-- Query 5a: Check for ORPHANED LOCKS (no corresponding booking)
SELECT 
    bl.id,
    bl.user_id,
    bl.vehicle_id,
    bl.lock_acquired_at,
    bl.lock_expires_at,
    bl.status
FROM booking_locks bl
LEFT JOIN bookings b ON bl.user_id = b.user_id 
  AND bl.vehicle_id = b.vehicle_id
  AND b.start_time = bl.start_time
  AND b.end_time = bl.end_time
WHERE bl.status = 'released'
  AND b.id IS NULL
  AND bl.updated_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR);

-- Query 5b: Check BOOKING without corresponding lock (older bookings)
SELECT 
    b.id,
    b.user_id,
    b.vehicle_id,
    b.start_time,
    b.end_time,
    b.status,
    COUNT(bl.id) as matching_locks
FROM bookings b
LEFT JOIN booking_locks bl ON b.vehicle_id = bl.vehicle_id
  AND b.user_id = bl.user_id
  AND b.start_time = bl.start_time
  AND b.end_time = bl.end_time
WHERE b.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY b.id
HAVING matching_locks = 0
ORDER BY b.created_at DESC;

-- Query 5c: VERIFY FOREIGN KEY INTEGRITY
-- Count bookings with valid references
SELECT 
    (SELECT COUNT(*) FROM bookings) as total_bookings,
    (SELECT COUNT(*) FROM bookings WHERE user_id IN (SELECT id FROM users)) as valid_user_fk,
    (SELECT COUNT(*) FROM bookings WHERE vehicle_id IN (SELECT id FROM vehicles)) as valid_vehicle_fk,
    (SELECT COUNT(*) FROM bookings WHERE pickup_branch_id IN (SELECT id FROM branches)) as valid_pickup_fk,
    (SELECT COUNT(*) FROM bookings WHERE return_branch_id IN (SELECT id FROM branches)) as valid_return_fk;

-- ========================================
-- 6. MAINTENANCE QUERIES
-- ========================================

-- Query 6a: FORCE CLEANUP (if cleanup scheduler fails)
-- This will mark all truly expired locks as expired
UPDATE booking_locks
SET status = 'expired',
    updated_at = NOW()
WHERE status = 'active'
  AND lock_expires_at < NOW();

SELECT ROW_COUNT() as locks_expired;

-- Query 6b: RESET PROBLEMATIC BOOKINGS (only for testing!)
-- ⚠️ BE CAREFUL: This will delete data!
-- DELETE FROM booking_locks WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 DAY);
-- DELETE FROM bookings WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY) AND status = 'rejected';

-- Query 6c: VACUUM AND OPTIMIZE indexes
-- OPTIMIZE TABLE bookings;
-- OPTIMIZE TABLE booking_locks;

-- ========================================
-- 7. USEFUL AGGREGATE QUERIES
-- ========================================

-- Query 7a: REVENUE SUMMARY (completed bookings)
SELECT 
    COUNT(*) as completed_bookings,
    SUM(total_price) as total_revenue,
    ROUND(AVG(total_price), 2) as avg_booking_value,
    MIN(total_price) as min_booking,
    MAX(total_price) as max_booking
FROM bookings
WHERE status = 'completed'
  AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Query 7b: VEHICLE UTILIZATION (% time booked)
SELECT 
    v.id,
    v.name,
    ROUND(
        SUM(
            TIMEDIFF(
                LEAST(b.end_time, DATE_ADD(NOW(), INTERVAL 7 DAY)),
                GREATEST(b.start_time, NOW())
            )
        ) / (7 * 24 * 60 * 60) * 100,
        2
    ) as utilization_percent_7days
FROM vehicles v
LEFT JOIN bookings b ON v.id = b.vehicle_id 
  AND b.status IN ('pending', 'approved', 'completed')
  AND b.start_time < DATE_ADD(NOW(), INTERVAL 7 DAY)
  AND b.end_time > NOW()
GROUP BY v.id, v.name
ORDER BY utilization_percent_7days DESC;

-- Query 7c: USER BOOKING HISTORY
SELECT 
    u.id,
    u.name,
    COUNT(b.id) as total_bookings,
    COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
    COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) as cancelled_bookings,
    ROUND(AVG(b.total_price), 2) as avg_booking_value
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id
GROUP BY u.id, u.name
HAVING COUNT(b.id) > 0
ORDER BY total_bookings DESC;

-- ========================================
-- END OF CONCURRENT BOOKING CONTROL QUERIES
-- ========================================
