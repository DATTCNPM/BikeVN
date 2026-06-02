# Concurrent Booking Control Strategy

## Overview
BikeVN implements a multi-layered concurrency control strategy to prevent double-booking issues when multiple users attempt to book the same vehicle for overlapping time periods.

## Problem Statement
Without proper concurrency control, the following scenario can occur:
1. User A checks vehicle X availability: `2024-02-01 08:00 to 2024-02-01 18:00` → Available ✓
2. User B checks vehicle X availability: `2024-02-01 08:00 to 2024-02-01 18:00` → Available ✓
3. User A submits booking → Database saved
4. User B submits booking → Database saved (CONFLICT! Same vehicle, overlapping times)

## Solution Architecture

### Layer 1: Database Level (Pessimistic Locking)

#### Booking Locks Table
```sql
CREATE TABLE booking_locks (
  id VARCHAR(36) PRIMARY KEY,
  vehicle_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  lock_acquired_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  lock_expires_at DATETIME NOT NULL,  -- TTL: 5-10 minutes
  status ENUM('active', 'released', 'expired') DEFAULT 'active'
)
```

**Purpose**: Reserve a vehicle for a specific time period while user completes booking transaction.

#### Booking Table Enhancements
- **version field**: For optimistic locking as fallback
- **Composite indexes**:
  - `idx_vehicle_status_time`: `(vehicle_id, status, start_time, end_time)`
  - `idx_active_bookings`: `(vehicle_id, status, start_time)`
  
**Purpose**: Fast queries to detect overlapping bookings.

### Layer 2: Application Level (Transaction + Locking)

#### Workflow: Check Availability → Create Lock → Create Booking

```
┌─────────────────────────────────────────────────────────┐
│ 1. REQUEST AVAILABILITY (GET /bookings/check)          │
│    - Query active bookings/locks for vehicle           │
│    - Return available time slots                       │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 2. ACQUIRE LOCK (POST /bookings/reserve)               │
│    - START TRANSACTION                                  │
│    - SELECT ... FROM booking_locks FOR UPDATE          │
│    - Check for conflicts                               │
│    - INSERT into booking_locks with TTL                │
│    - COMMIT                                            │
│    - Return lock_id + expiration_time                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 3. CONFIRM BOOKING (POST /bookings/create)             │
│    - START TRANSACTION                                  │
│    - SELECT ... FROM bookings FOR UPDATE               │
│    - Verify lock still active                          │
│    - INSERT into bookings                              │
│    - UPDATE booking_locks SET status='released'        │
│    - COMMIT                                            │
└─────────────────────────────────────────────────────────┘
```

### Layer 3: SQL Queries for Conflict Detection

#### Query 1: Check Overlapping Active Bookings
```sql
-- Check if vehicle has conflicting pending/approved bookings
SELECT COUNT(*) as conflict_count 
FROM bookings 
WHERE vehicle_id = ?
  AND status IN ('pending', 'approved')
  AND (
    -- Overlapping time check: 
    -- New booking [start_time, end_time] conflicts with existing [existing_start, existing_end]
    -- if: start_time < existing_end AND end_time > existing_start
    start_time < ? AND end_time > ?  -- ? = new booking end_time, new booking start_time
  );
```

#### Query 2: Check Conflicting Locks
```sql
-- Check if any active locks exist for the time period
SELECT COUNT(*) as lock_count
FROM booking_locks
WHERE vehicle_id = ?
  AND status = 'active'
  AND lock_expires_at > NOW()
  AND (
    start_time < ? AND end_time > ?
  );
```

#### Query 3: Acquire Lock with Pessimistic Locking
```sql
-- Pessimistic lock: Lock the rows while checking
BEGIN;
  SELECT id, vehicle_id FROM bookings 
  WHERE vehicle_id = ? 
    AND status IN ('pending', 'approved')
    AND start_time < ? AND end_time > ?
  FOR UPDATE;  -- Block other transactions
  
  -- If result is empty, proceed to create lock
  INSERT INTO booking_locks (id, vehicle_id, user_id, start_time, end_time, lock_expires_at, status)
  VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE), 'active');
COMMIT;
```

## Implementation Checklist

### Backend (Spring Boot)

#### 1. Create Lock Service
```java
@Service
public class BookingLockService {
    // Acquire pessimistic lock
    public BookingLock acquireLock(String vehicleId, LocalDateTime startTime, LocalDateTime endTime, String userId) {
        // Use @Transactional with isolation level SERIALIZABLE
        // Check conflicts using pessimistic lock (SELECT ... FOR UPDATE)
        // Create lock record with 10-minute TTL
    }
    
    // Check availability (reads from both bookings and locks)
    public boolean isAvailable(String vehicleId, LocalDateTime startTime, LocalDateTime endTime) {
        // Query overlapping bookings
        // Query overlapping locks
        // Return true if no conflicts
    }
    
    // Release lock after booking confirmation
    public void releaseLock(String lockId) {
        // Update lock status to 'released'
    }
    
    // Cleanup expired locks (background job)
    public void cleanupExpiredLocks() {
        // Delete locks where lock_expires_at < NOW()
    }
}
```

#### 2. Update Booking Service
```java
@Service
public class BookingService {
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Booking createBooking(BookingRequest request) {
        // 1. Acquire lock (pessimistic)
        BookingLock lock = bookingLockService.acquireLock(
            request.getVehicleId(),
            request.getStartTime(),
            request.getEndTime(),
            request.getUserId()
        );
        
        // 2. Create booking within same transaction
        Booking booking = new Booking();
        // ... set fields
        bookingRepository.save(booking);
        
        // 3. Release lock
        bookingLockService.releaseLock(lock.getId());
        
        return booking;
    }
}
```

#### 3. Add API Endpoints
```java
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    // Check availability without locking
    @GetMapping("/check-availability")
    public AvailabilityResponse checkAvailability(
        @RequestParam String vehicleId,
        @RequestParam LocalDateTime startTime,
        @RequestParam LocalDateTime endTime
    ) {
        boolean available = bookingService.isAvailable(vehicleId, startTime, endTime);
        return new AvailabilityResponse(available);
    }
    
    // Reserve slot (acquire lock)
    @PostMapping("/reserve")
    public ReservationResponse reserve(@RequestBody ReservationRequest request) {
        BookingLock lock = bookingLockService.acquireLock(
            request.getVehicleId(),
            request.getStartTime(),
            request.getEndTime(),
            request.getUserId()
        );
        return new ReservationResponse(lock.getId(), lock.getLockExpiresAt());
    }
    
    // Confirm booking
    @PostMapping
    public BookingResponse createBooking(@RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return new BookingResponse(booking);
    }
}
```

### Database Maintenance

#### 1. Add Scheduled Job to Cleanup Expired Locks
```java
@Component
public class BookingLockCleanupScheduler {
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void cleanupExpiredLocks() {
        bookingLockService.cleanupExpiredLocks();
    }
}
```

#### 2. Monitor Active Locks
```sql
-- View current active locks
SELECT 
    bl.id,
    bl.vehicle_id,
    bl.user_id,
    bl.start_time,
    bl.end_time,
    bl.lock_expires_at,
    TIMEDIFF(bl.lock_expires_at, NOW()) as remaining_time
FROM booking_locks bl
WHERE bl.status = 'active'
  AND bl.lock_expires_at > NOW()
ORDER BY bl.lock_expires_at ASC;
```

## Concurrency Isolation Levels

### Why SERIALIZABLE?
- **Level**: `SERIALIZABLE`
- **Benefit**: Prevents phantom reads, ensures no overlapping bookings
- **Trade-off**: Slightly higher latency (~10-50ms per transaction)
- **Alternative**: `REPEATABLE_READ` + explicit row-level locks

### Transaction Properties
```properties
# In application.yaml
spring:
  jpa:
    hibernate:
      jdbc:
        batch_size: 10
    properties:
      hibernate:
        jdbc:
          fetch_size: 50
        order_inserts: true
        order_updates: true
```

## Conflict Resolution

### If Lock Acquisition Fails
1. **Cause**: Vehicle already locked by another user
2. **Response**: HTTP 409 Conflict
3. **Message**: "Vehicle is being reserved by another user. Try again in 30 seconds."

### If Booking Creation Fails After Lock
1. **Cause**: Lock expired or was released by another transaction
2. **Response**: HTTP 410 Gone
3. **Message**: "Reservation expired. Please reserve again."

## Performance Optimization

### Index Strategy
| Index | Purpose | Query |
|-------|---------|-------|
| `idx_vehicle_status_time` | Find overlapping bookings | Check conflicts before lock |
| `idx_active_bookings` | Get active bookings for vehicle | Quick availability check |
| `idx_vehicle_id` (locks) | Find locks by vehicle | Check existing locks |
| `idx_lock_expires_at` | Cleanup expired locks | Periodic maintenance |

### Query Optimization Tips
1. **Use covering indexes** to avoid table lookups
2. **Limit result sets** to 1000 rows max
3. **Cache availability** with 30-second TTL
4. **Monitor slow queries** > 100ms

## Monitoring & Alerting

### Metrics to Track
```sql
-- Lock contention ratio
SELECT 
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_locks,
    COUNT(*) as total_locks,
    ROUND(COUNT(CASE WHEN status = 'active' THEN 1 END) * 100.0 / COUNT(*), 2) as contention_percent
FROM booking_locks
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR);

-- Booking conflict rate
SELECT 
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
    COUNT(*) as total_bookings,
    ROUND(COUNT(CASE WHEN status = 'rejected' THEN 1 END) * 100.0 / COUNT(*), 2) as rejection_rate
FROM bookings
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR);

-- Transaction duration
SHOW PROCESSLIST;  -- Monitor long-running transactions
```

### Alert Thresholds
- Lock contention > 20% → Investigate hot vehicles
- Booking rejection rate > 5% → System overload
- Long transaction > 30s → Potential deadlock

## Testing Strategy

### Unit Tests
```java
@Test
public void testConcurrentBookingSameVehicle() {
    // Simulate 10 concurrent booking attempts
    // Only 1 should succeed, 9 should fail
}

@Test
public void testLockExpiration() {
    // Create lock with 1-minute TTL
    // Wait 1+ minute
    // Verify lock is marked as expired
}
```

### Integration Tests
```java
@Test
@Transactional
public void testBookingLockWithPessimisticLocking() {
    // Use TestRestTemplate for concurrent requests
    // Verify database consistency
}
```

### Load Tests
```bash
# Apache JMeter scenario
# 100 concurrent users attempting to book same vehicle
# Measure: success rate, conflict rate, avg response time
```

## Migration Path

### Phase 1: Deploy Code
- Add `booking_locks` table
- Add indexes to `bookings`
- Deploy service with new logic

### Phase 2: Enable Locking
- Start using pessimistic locks for new bookings
- Keep old bookings working without locks

### Phase 3: Verify
- Monitor conflict rates
- Check performance metrics
- Rollback if needed

## References
- [MySQL Row-Level Locking](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html)
- [Spring Transactional](https://spring.io/blog/2015/12/10/spring-data-jpa-pitfalls-common-mistakes-and-how-to-avoid-them)
- [Optimistic vs Pessimistic Locking](https://vladmihalcea.com/optimistic-locking-version-jpa/)
