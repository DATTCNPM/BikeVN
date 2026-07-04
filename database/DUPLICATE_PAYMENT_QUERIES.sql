-- ============================================
-- DUPLICATE PAYMENT PREVENTION - SQL QUERIES
-- ============================================
-- Useful queries for testing, monitoring, and debugging
-- the duplicate payment prevention system

-- ========================================
-- 1. VERIFY CONSTRAINT CREATION
-- ========================================

-- Check if all constraints exist
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'payments'
  AND CONSTRAINT_SCHEMA = 'bikevn_db'
ORDER BY CONSTRAINT_NAME;

-- Check unique constraints specifically
SELECT 
    CONSTRAINT_NAME,
    COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'payments'
  AND CONSTRAINT_SCHEMA = 'bikevn_db'
  AND CONSTRAINT_NAME LIKE 'unique%'
ORDER BY CONSTRAINT_NAME;

-- ========================================
-- 2. PAYMENT STATUS OVERVIEW
-- ========================================

-- Count payments by status
SELECT 
    status,
    COUNT(*) as count,
    SUM(amount) as total_amount
FROM payments
GROUP BY status
ORDER BY count DESC;

-- Count payments by type
SELECT 
    type,
    status,
    COUNT(*) as count,
    SUM(amount) as total_amount
FROM payments
GROUP BY type, status
ORDER BY type, status;

-- ========================================
-- 3. BOOKING & PAYMENT RECONCILIATION
-- ========================================

-- Check booking payment status (critical query)
SELECT 
    b.id as booking_id,
    b.user_id,
    b.status as booking_status,
    b.total_price,
    MAX(CASE WHEN p.type = 'rental' THEN p.status ELSE NULL END) as rental_status,
    MAX(CASE WHEN p.type = 'rental' THEN p.amount ELSE NULL END) as rental_amount,
    MAX(CASE WHEN p.type = 'extra_fee' THEN p.status ELSE NULL END) as extra_fee_status,
    MAX(CASE WHEN p.type = 'extra_fee' THEN p.amount ELSE NULL END) as extra_fee_amount,
    COUNT(p.id) as payment_count,
    b.created_at
FROM bookings b
LEFT JOIN payments p ON b.id = p.booking_id
GROUP BY b.id
ORDER BY b.created_at DESC;

-- Payments that don't match booking amount
SELECT 
    p.id,
    p.booking_id,
    b.total_price as booking_amount,
    p.amount as payment_amount,
    p.type,
    p.status,
    ABS(b.total_price - p.amount) as difference
FROM payments p
JOIN bookings b ON p.booking_id = b.id
WHERE (p.type = 'rental' AND p.amount != b.total_price)
ORDER BY p.created_at DESC;

-- ========================================
-- 4. DUPLICATE DETECTION QUERIES
-- ========================================

-- Find duplicate transaction codes
SELECT 
    transaction_code,
    COUNT(*) as count,
    GROUP_CONCAT(id SEPARATOR ', ') as payment_ids,
    GROUP_CONCAT(status SEPARATOR ', ') as statuses,
    GROUP_CONCAT(booking_id SEPARATOR ', ') as booking_ids
FROM payments
WHERE transaction_code IS NOT NULL
GROUP BY transaction_code
HAVING count > 1
ORDER BY count DESC;

-- Find duplicate idempotency keys
SELECT 
    idempotency_key,
    COUNT(*) as count,
    GROUP_CONCAT(id SEPARATOR ', ') as payment_ids,
    GROUP_CONCAT(status SEPARATOR ', ') as statuses,
    GROUP_CONCAT(booking_id SEPARATOR ', ') as booking_ids
FROM payments
WHERE idempotency_key IS NOT NULL
GROUP BY idempotency_key
HAVING count > 1
ORDER BY count DESC;

-- Find bookings with multiple payments of same type
SELECT 
    booking_id,
    type,
    COUNT(*) as count,
    GROUP_CONCAT(id SEPARATOR ', ') as payment_ids,
    GROUP_CONCAT(status SEPARATOR ', ') as statuses,
    GROUP_CONCAT(DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') SEPARATOR ', ') as created_times
FROM payments
GROUP BY booking_id, type
HAVING count > 1
ORDER BY booking_id, type;

-- ========================================
-- 5. IDEMPOTENCY KEY ANALYSIS
-- ========================================

-- Check for NULL idempotency keys (should be minimal)
SELECT 
    COUNT(*) as payments_without_idempotency_key
FROM payments
WHERE idempotency_key IS NULL;

-- Idempotency key statistics
SELECT 
    'Total payments' as metric,
    COUNT(*) as value
FROM payments
UNION ALL
SELECT 
    'With idempotency key',
    COUNT(*)
FROM payments
WHERE idempotency_key IS NOT NULL
UNION ALL
SELECT 
    'Without idempotency key',
    COUNT(*)
FROM payments
WHERE idempotency_key IS NULL
UNION ALL
SELECT 
    'Duplicate idempotency keys',
    COUNT(*)
FROM (
    SELECT idempotency_key
    FROM payments
    WHERE idempotency_key IS NOT NULL
    GROUP BY idempotency_key
    HAVING COUNT(*) > 1
) duplicate_idempotency_keys;

-- ========================================
-- 6. TRANSACTION CODE ANALYSIS
-- ========================================

-- Check for NULL transaction codes (expected for cash payments)
SELECT 
    payment_method,
    COUNT(*) as count,
    SUM(CASE WHEN transaction_code IS NULL THEN 1 ELSE 0 END) as without_code,
    SUM(CASE WHEN transaction_code IS NOT NULL THEN 1 ELSE 0 END) as with_code
FROM payments
GROUP BY payment_method;

-- Transaction codes that should exist (non-cash payments)
SELECT 
    p.id,
    p.payment_method,
    p.transaction_code,
    p.status,
    'MISSING_CODE' as issue
FROM payments p
WHERE p.payment_method IN ('credit_card', 'transfer')
  AND p.transaction_code IS NULL
ORDER BY p.created_at DESC;

-- ========================================
-- 7. TIMING & CONCURRENCY ANALYSIS
-- ========================================

-- Find payments created within same second (potential race condition)
SELECT 
    DATE_FORMAT(p1.created_at, '%Y-%m-%d %H:%i:%s') as second,
    COUNT(*) as payments_in_second,
    GROUP_CONCAT(DISTINCT booking_id SEPARATOR ', ') as booking_ids
FROM payments p1
GROUP BY DATE_FORMAT(p1.created_at, '%Y-%m-%d %H:%i:%s')
HAVING COUNT(*) > 1
ORDER BY second DESC;

-- Find bookings with payments created very close together
SELECT 
    p.booking_id,
    COUNT(*) as payment_count,
    MIN(p.created_at) as first_payment,
    MAX(p.created_at) as last_payment,
    TIMESTAMPDIFF(SECOND, MIN(p.created_at), MAX(p.created_at)) as seconds_apart,
    GROUP_CONCAT(p.type SEPARATOR ', ') as types,
    GROUP_CONCAT(p.status SEPARATOR ', ') as statuses
FROM payments p
GROUP BY p.booking_id
HAVING COUNT(*) > 1
ORDER BY seconds_apart ASC;

-- ========================================
-- 8. PENDING PAYMENTS (RISK ANALYSIS)
-- ========================================

-- Pending payments that are too old (should be completed or failed)
SELECT 
    p.id,
    p.booking_id,
    p.type,
    p.amount,
    p.payment_method,
    p.transaction_code,
    p.created_at,
    TIMESTAMPDIFF(MINUTE, p.created_at, NOW()) as minutes_pending
FROM payments p
WHERE p.status = 'pending'
  AND p.created_at < DATE_SUB(NOW(), INTERVAL 30 MINUTE)
ORDER BY p.created_at ASC;

-- Bookings with incomplete payments
SELECT 
    b.id as booking_id,
    b.status as booking_status,
    GROUP_CONCAT(CONCAT(p.type, ':', p.status) SEPARATOR '; ') as payment_status,
    b.created_at,
    TIMESTAMPDIFF(HOUR, b.created_at, NOW()) as hours_old
FROM bookings b
LEFT JOIN payments p ON b.id = p.booking_id
WHERE b.status IN ('pending', 'approved')
  AND NOT EXISTS (
    SELECT 1 FROM payments p2 
    WHERE p2.booking_id = b.id 
      AND p2.type = 'rental' 
      AND p2.status = 'completed'
  )
GROUP BY b.id
ORDER BY b.created_at DESC;

-- ========================================
-- 9. FAILED PAYMENT ANALYSIS
-- ========================================

-- Failed payments and their bookings
SELECT 
    p.id,
    p.booking_id,
    b.status as booking_status,
    p.type,
    p.amount,
    p.payment_method,
    p.status,
    p.created_at,
    p.transaction_code
FROM payments p
JOIN bookings b ON p.booking_id = b.id
WHERE p.status = 'failed'
ORDER BY p.created_at DESC;

-- Count failed payments by payment method
SELECT 
    payment_method,
    COUNT(*) as failed_count,
    SUM(amount) as failed_amount,
    AVG(TIMESTAMPDIFF(MINUTE, created_at, NOW())) as avg_minutes_old
FROM payments
WHERE status = 'failed'
GROUP BY payment_method
ORDER BY failed_count DESC;

-- ========================================
-- 10. DATA QUALITY CHECKS
-- ========================================

-- Check for NULL required fields
SELECT 
    'NULL booking_id' as issue, COUNT(*) as count FROM payments WHERE booking_id IS NULL
UNION ALL
SELECT 'NULL amount', COUNT(*) FROM payments WHERE amount IS NULL
UNION ALL
SELECT 'NULL type', COUNT(*) FROM payments WHERE type IS NULL
UNION ALL
SELECT 'NULL payment_method', COUNT(*) FROM payments WHERE payment_method IS NULL
UNION ALL
SELECT 'NULL status', COUNT(*) FROM payments WHERE status IS NULL
ORDER BY count DESC;

-- Check for invalid amounts
SELECT 
    p.id,
    p.booking_id,
    p.amount,
    b.total_price,
    p.type,
    'AMOUNT_MISMATCH' as issue
FROM payments p
JOIN bookings b ON p.booking_id = b.id
WHERE p.type = 'rental'
  AND p.amount != b.total_price
ORDER BY p.created_at DESC;

-- ========================================
-- 11. AUDIT TRAIL QUERIES
-- ========================================

-- Payment history for specific booking
SELECT 
    p.id,
    p.type,
    p.amount,
    p.payment_method,
    p.status,
    p.transaction_code,
    p.idempotency_key,
    p.created_at,
    p.updated_at,
    TIMESTAMPDIFF(SECOND, p.created_at, p.updated_at) as seconds_to_complete
FROM payments p
WHERE p.booking_id = 'BOOKING_ID_HERE'
ORDER BY p.created_at;

-- All state transitions for a payment
SELECT 
    p.id,
    p.booking_id,
    p.type,
    p.status,
    p.created_at,
    p.updated_at,
    CASE 
        WHEN p.created_at = p.updated_at THEN 'Created'
        ELSE 'Modified'
    END as change_type
FROM payments p
ORDER BY p.booking_id, p.created_at;

-- ========================================
-- 12. REFUND ANALYSIS
-- ========================================

-- Refunded payments
SELECT 
    p.id,
    p.booking_id,
    b.status as booking_status,
    p.type,
    p.amount,
    p.status,
    p.transaction_code,
    p.created_at,
    p.updated_at
FROM payments p
JOIN bookings b ON p.booking_id = b.id
WHERE p.status = 'refunded'
ORDER BY p.updated_at DESC;

-- Refunds by reason (requires additional refund_reason column)
SELECT 
    p.type,
    COUNT(*) as refund_count,
    SUM(p.amount) as refund_amount
FROM payments p
WHERE p.status = 'refunded'
GROUP BY p.type
ORDER BY refund_amount DESC;

-- ========================================
-- 13. PERFORMANCE ANALYSIS
-- ========================================

-- Index usage statistics
SELECT 
    OBJECT_NAME as index_name,
    COUNT_READ,
    COUNT_WRITE,
    COUNT_READ + COUNT_WRITE as total_operations
FROM PERFORMANCE_SCHEMA.TABLE_IO_WAITS_SUMMARY_BY_INDEX_USAGE
WHERE OBJECT_SCHEMA = 'bikevn_db'
  AND OBJECT_NAME = 'payments'
ORDER BY total_operations DESC;

-- Table size
SELECT 
    TABLE_NAME,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) as size_mb,
    TABLE_ROWS
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'bikevn_db'
  AND TABLE_NAME = 'payments';

-- ========================================
-- 14. CONSTRAINT VERIFICATION (Test Queries)
-- ========================================

-- Test duplicate transaction code (should FAIL)
-- INSERT INTO payments (id, booking_id, amount, type, payment_method, branch_id, transaction_code, status)
-- VALUES (UUID(), 'existing-booking-id', 500000, 'rental', 'credit_card', 'existing-branch-id', 'TXN001', 'pending');
-- Expected: Duplicate entry for key 'unique_transaction_code'

-- Test duplicate booking_type (should FAIL)
-- INSERT INTO payments (id, booking_id, amount, type, payment_method, branch_id, status, idempotency_key)
-- VALUES (UUID(), 'existing-booking-id', 500000, 'rental', 'credit_card', 'existing-branch-id', 'pending', UUID());
-- Expected: Duplicate entry for key 'unique_booking_type'

-- Test duplicate idempotency_key (should FAIL)
-- INSERT INTO payments (id, booking_id, amount, type, payment_method, branch_id, status, idempotency_key)
-- VALUES (UUID(), 'different-booking', 500000, 'rental', 'credit_card', 'existing-branch-id', 'pending', 'existing-idem-key');
-- Expected: Duplicate entry for key 'unique_idempotency_key'

-- ========================================
-- 15. MAINTENANCE QUERIES
-- ========================================

-- Rebuild indexes (if fragmented)
-- OPTIMIZE TABLE payments;

-- Check table integrity
-- CHECK TABLE payments;

-- Analyze table statistics
-- ANALYZE TABLE payments;

-- Delete old test/failed payments (USE WITH CAUTION)
-- DELETE FROM payments
-- WHERE status IN ('failed')
--   AND created_at < DATE_SUB(NOW(), INTERVAL 90 DAY)
--   AND payment_method = 'cash';  -- Only delete non-gateway payments

-- Archive completed payments to history table (if needed)
-- INSERT INTO payments_archive
-- SELECT * FROM payments
-- WHERE status = 'completed'
--   AND created_at < DATE_SUB(NOW(), INTERVAL 180 DAY);

-- ========================================
-- END OF QUERY REFERENCE
-- ========================================
