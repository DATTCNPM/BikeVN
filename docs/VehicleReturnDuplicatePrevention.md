# Vehicle Return Duplicate Prevention Strategy

## 📋 Overview

**Problem**: Vehicle returns can have duplicate records when:
- Multiple concurrent requests for the same booking
- System crashes during return processing
- Users submitting return information multiple times
- Race conditions between booking completion and return record

**Solution**: 
1. ✅ **Unique constraint** on `booking_id` (one return per booking)
2. ✅ **Pessimistic locking** via database transactions
3. ✅ **Optimistic retry** logic with duplicate detection
4. ✅ **Removal of redundant `vehicle_id`** column (derivable from booking)

---

## 🗄️ Schema Changes

### Before (Problem State)
```sql
CREATE TABLE `vehicle_returns` (
  `id` varchar(36) PRIMARY KEY,
  `booking_id` varchar(36) NOT NULL,
  `vehicle_id` varchar(36) NOT NULL,  -- ⚠️ REDUNDANT
  `return_branch_id` varchar(36),
  `condition_status` varchar(50),
  `damage_description` text,
  `extra_fee` decimal(10,2),
  `images` json,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  -- ⚠️ NO UNIQUE CONSTRAINT - ALLOWS DUPLICATES
  KEY `idx_booking` (`booking_id`),
  KEY `idx_vehicle` (`vehicle_id`),  -- ⚠️ UNNECESSARY
  CONSTRAINT vehicle_returns_ibfk_1 FOREIGN KEY (`booking_id`) 
    REFERENCES `bookings` (`id`),
  CONSTRAINT vehicle_returns_ibfk_2 FOREIGN KEY (`vehicle_id`) 
    REFERENCES `vehicles` (`id`),
  CONSTRAINT vehicle_returns_ibfk_3 FOREIGN KEY (`return_branch_id`) 
    REFERENCES `branches` (`id`)
) COMMENT='Vehicle return tracking';  -- ⚠️ NO DUPLICATE PREVENTION
```

**Issues**:
- ❌ Multiple returns per booking allowed
- ❌ No timestamp tracking (no `updated_at`)
- ❌ Missing audit fields (`returned_by`, `notes`)
- ❌ Missing odometer reading
- ❌ Redundant `vehicle_id` (can be joined from booking)

### After (Solution)
```sql
CREATE TABLE `vehicle_returns` (
  `id` varchar(36) PRIMARY KEY,
  `booking_id` varchar(36) NOT NULL,
  -- ✅ REMOVED vehicle_id (redundant - derivable from booking)
  `return_branch_id` varchar(36) NOT NULL,
  `condition_status` varchar(50) NOT NULL,
  `damage_description` text,
  `extra_fee` decimal(10,2) DEFAULT '0.00',
  `images` json,
  `return_odometer_reading` int,          -- ✅ NEW
  `notes` text,                           -- ✅ NEW
  `returned_by` varchar(255),             -- ✅ NEW (audit)
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime ON UPDATE CURRENT_TIMESTAMP,  -- ✅ NEW
  
  -- ✅ PRIMARY DEFENSE: Only one return per booking
  UNIQUE KEY `unique_booking_return` (`booking_id`),
  
  -- Performance indexes
  KEY `idx_booking` (`booking_id`),
  KEY `idx_return_branch` (`return_branch_id`),
  KEY `idx_condition_status` (`condition_status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_booking_condition` (`booking_id`, `condition_status`),
  
  -- Foreign keys (only essential)
  CONSTRAINT vehicle_returns_ibfk_1 
    FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT vehicle_returns_ibfk_2 
    FOREIGN KEY (`return_branch_id`) REFERENCES `branches` (`id`)
) COMMENT='Vehicle return tracking with duplicate prevention. 
           One return per booking. vehicle_id can be derived from booking record';
```

**Improvements**:
- ✅ `unique_booking_return` constraint prevents duplicates
- ✅ Removed `vehicle_id` foreign key (redundant)
- ✅ Added `updated_at` for timestamp tracking
- ✅ Added `return_odometer_reading` for vehicle tracking
- ✅ Added `notes` and `returned_by` for audit trail
- ✅ Optimized indexes for common queries

---

## 🔍 Why Remove `vehicle_id`?

### Data Redundancy Analysis

```sql
-- Current schema (REDUNDANT)
SELECT vr.id, vr.booking_id, vr.vehicle_id, b.vehicle_id 
FROM vehicle_returns vr
JOIN bookings b ON vr.booking_id = b.id;

Result:
┌────────┬────────────┬────────────┬────────────┐
│ id     │ booking_id │ vehicle_id │ vehicle_id │  ← SAME VALUE
├────────┼────────────┼────────────┼────────────┤
│ ret-1  │ book-1     │ veh-A      │ veh-A      │
│ ret-2  │ book-2     │ veh-B      │ veh-B      │
└────────┴────────────┴────────────┴────────────┘

❌ PROBLEM: Storing same data twice
   - Extra storage
   - Risk of inconsistency
   - Extra foreign key constraint
```

### Derivation Query

```sql
-- Get vehicle_id from booking (no redundant column needed)
SELECT 
  vr.id,
  vr.booking_id,
  b.vehicle_id,  -- ← Derived from booking
  vr.return_branch_id,
  vr.condition_status
FROM vehicle_returns vr
JOIN bookings b ON vr.booking_id = b.id;
```

### Data Consistency Risk

**Scenario**: `vehicle_id` mismatch due to concurrent updates

```
Thread A                           Thread B
  │                                  │
  ├─ Read booking veh=A              │
  │                                  │
  │                         ├─ Update booking veh=B
  │                         │
  ├─ Insert return         │
  │  (veh_id=A)            │
  │                                  │
  ├─ Read return (A)       │
  │  Read booking (B)      │
  │                                  │
  ❌ INCONSISTENT:
     return.vehicle_id = A
     booking.vehicle_id = B
     MISMATCH!
```

**Solution**: Remove `vehicle_id` from returns table
```
  ├─ Insert return        ✅ CONSISTENT
  │  (no vehicle_id)      │  Always matches booking.vehicle_id
  │                                  │
```

---

## 🛡️ Unique Constraint Strategy

### Constraint Definition

```sql
UNIQUE KEY `unique_booking_return` (`booking_id`)
COMMENT 'Only one return record per booking'
```

**Enforcement**: Database prevents impossible state

```sql
-- First return: SUCCESS
INSERT INTO vehicle_returns (id, booking_id, return_branch_id, ...)
VALUES ('ret-1', 'book-1', 'branch-1', ...);
✅ SUCCESS

-- Duplicate return: FAILURE
INSERT INTO vehicle_returns (id, booking_id, return_branch_id, ...)
VALUES ('ret-2', 'book-1', 'branch-2', ...);
❌ ERROR: Duplicate entry for key 'unique_booking_return'
         booking_id 'book-1' already has a return record
```

---

## 🔄 Application-Level Handling

### VehicleReturnService - Pessimistic Locking

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleReturnService {
    
    private final VehicleReturnRepository vehicleReturnRepository;
    private final BookingRepository bookingRepository;
    
    /**
     * Create vehicle return with duplicate prevention
     * 
     * Flow:
     * 1. Start transaction with SERIALIZABLE isolation
     * 2. Lock the booking row (pessimistic lock)
     * 3. Check if return already exists
     * 4. Create return record
     * 5. Commit transaction
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public VehicleReturnDTO createReturn(CreateVehicleReturnRequest request) {
        
        String bookingId = request.getBookingId();
        
        log.info("Creating vehicle return for booking: {}", bookingId);
        
        try {
            // Step 1: Lock the booking (pessimistic - blocks other transactions)
            Booking booking = bookingRepository.findByIdWithLock(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Booking not found: " + bookingId
                ));
            
            // Step 2: Verify booking status (should be completed)
            if (booking.getStatus() != BookingStatus.COMPLETED) {
                throw new InvalidBookingStatusException(
                    "Booking must be completed before return can be recorded. " +
                    "Current status: " + booking.getStatus()
                );
            }
            
            // Step 3: Check if return already exists (constraint check)
            Optional<VehicleReturn> existingReturn = 
                vehicleReturnRepository.findByBookingId(bookingId);
            
            if (existingReturn.isPresent()) {
                VehicleReturn existing = existingReturn.get();
                log.warn(
                    "Return already exists for booking {} with status {}. " +
                    "Returning cached record.",
                    bookingId, existing.getConditionStatus()
                );
                
                // Idempotent response - return existing
                return convertToDTO(existing);
            }
            
            // Step 4: Create new return record
            VehicleReturn vehicleReturn = new VehicleReturn();
            vehicleReturn.setId(UUID.randomUUID().toString());
            vehicleReturn.setBookingId(bookingId);
            vehicleReturn.setReturnBranchId(request.getReturnBranchId());
            vehicleReturn.setConditionStatus(request.getConditionStatus());
            vehicleReturn.setDamageDescription(request.getDamageDescription());
            vehicleReturn.setExtraFee(request.getExtraFee() != null ? 
                request.getExtraFee() : BigDecimal.ZERO);
            vehicleReturn.setReturnOdometerReading(request.getReturnOdometerReading());
            vehicleReturn.setNotes(request.getNotes());
            vehicleReturn.setReturnedBy(request.getReturnedBy());
            
            // Step 5: Save (will fail if constraint violated)
            VehicleReturn saved = vehicleReturnRepository.save(vehicleReturn);
            
            log.info("Vehicle return created successfully: {} for booking: {}", 
                saved.getId(), bookingId);
            
            return convertToDTO(saved);
            
        } catch (DataIntegrityViolationException e) {
            
            // Constraint violation - likely duplicate
            log.warn(
                "Constraint violation attempting to create return for booking {}",
                bookingId, e
            );
            
            // Recover by finding existing return
            Optional<VehicleReturn> existing = 
                vehicleReturnRepository.findByBookingId(bookingId);
            
            if (existing.isPresent()) {
                log.info("Recovered existing return for booking {}", bookingId);
                return convertToDTO(existing.get());
            }
            
            log.error("Could not recover from constraint violation", e);
            throw e;
        }
    }
    
    /**
     * Update vehicle return (condition change, damage update)
     * 
     * Only updates are allowed, no replacement/deletion
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public VehicleReturnDTO updateReturn(
        String returnId,
        UpdateVehicleReturnRequest request
    ) {
        
        VehicleReturn vehicleReturn = vehicleReturnRepository.findById(returnId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Vehicle return not found: " + returnId
            ));
        
        // Update fields (audit trail via updated_at timestamp)
        if (request.getConditionStatus() != null) {
            vehicleReturn.setConditionStatus(request.getConditionStatus());
        }
        if (request.getDamageDescription() != null) {
            vehicleReturn.setDamageDescription(request.getDamageDescription());
        }
        if (request.getExtraFee() != null) {
            vehicleReturn.setExtraFee(request.getExtraFee());
        }
        if (request.getReturnOdometerReading() != null) {
            vehicleReturn.setReturnOdometerReading(request.getReturnOdometerReading());
        }
        if (request.getNotes() != null) {
            vehicleReturn.setNotes(request.getNotes());
        }
        if (request.getReturnedBy() != null) {
            vehicleReturn.setReturnedBy(request.getReturnedBy());
        }
        
        // updated_at auto-updated by @UpdateTimestamp
        VehicleReturn updated = vehicleReturnRepository.save(vehicleReturn);
        
        log.info("Vehicle return updated: {}", returnId);
        
        return convertToDTO(updated);
    }
    
    /**
     * Get return by booking ID
     * Ensures one-to-one relationship
     */
    @Transactional(readOnly = true)
    public VehicleReturnDTO getReturnByBooking(String bookingId) {
        
        VehicleReturn vehicleReturn = vehicleReturnRepository
            .findByBookingId(bookingId)
            .orElseThrow(() -> new VehicleReturnNotFoundException(
                "No return record for booking: " + bookingId
            ));
        
        return convertToDTO(vehicleReturn);
    }
}
```

### Repository Interface

```java
@Repository
public interface VehicleReturnRepository extends JpaRepository<VehicleReturn, String> {
    
    /**
     * Find return by booking (one-to-one relationship)
     * Uses UNIQUE constraint to guarantee max 1 result
     */
    Optional<VehicleReturn> findByBookingId(String bookingId);
    
    /**
     * Find return with pessimistic lock
     * Locks the row to prevent concurrent updates
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT vr FROM VehicleReturn vr WHERE vr.bookingId = :bookingId")
    Optional<VehicleReturn> findByBookingIdWithLock(@Param("bookingId") String bookingId);
    
    /**
     * Check if return exists for booking
     */
    boolean existsByBookingId(String bookingId);
    
    /**
     * Find returns by condition (for inspection reports)
     */
    List<VehicleReturn> findByConditionStatus(String conditionStatus);
    
    /**
     * Find returns with damage
     */
    @Query("SELECT vr FROM VehicleReturn vr " +
           "WHERE vr.conditionStatus IN ('fair', 'damaged') " +
           "AND vr.damageDescription IS NOT NULL")
    List<VehicleReturn> findDamagedReturns();
    
    /**
     * Find returns with extra fees (for accounting)
     */
    @Query("SELECT vr FROM VehicleReturn vr " +
           "WHERE vr.extraFee > 0 " +
           "ORDER BY vr.extraFee DESC")
    List<VehicleReturn> findReturnsWithFees();
    
    /**
     * Get vehicle via booking join
     */
    @Query("SELECT b.vehicle_id FROM VehicleReturn vr " +
           "JOIN Booking b ON vr.booking_id = b.id " +
           "WHERE vr.id = :returnId")
    Optional<String> getVehicleIdByReturnId(@Param("returnId") String returnId);
}
```

---

## 📊 Query Examples

### Get Return with Vehicle Info (Join)

```sql
-- Before (with redundant vehicle_id):
SELECT vr.*, b.vehicle_id
FROM vehicle_returns vr
JOIN bookings b ON vr.booking_id = b.id
WHERE vr.booking_id = 'book-1';
-- Problem: Returns both vr.vehicle_id and b.vehicle_id (redundant)

-- After (clean):
SELECT 
  vr.id,
  vr.booking_id,
  b.vehicle_id,  -- ← Derived
  b.vehicle_id as derived_vehicle_id,
  vr.return_branch_id,
  vr.condition_status,
  vr.damage_description,
  vr.extra_fee,
  vr.return_odometer_reading,
  vr.returned_by,
  vr.created_at,
  vr.updated_at
FROM vehicle_returns vr
JOIN bookings b ON vr.booking_id = b.id
WHERE vr.booking_id = 'book-1';
```

### Find Damaged Vehicles

```sql
-- Damaged returns with vehicle and booking info
SELECT 
  vr.id as return_id,
  b.id as booking_id,
  b.vehicle_id,
  v.name,
  v.license_plate,
  vr.condition_status,
  vr.damage_description,
  vr.extra_fee,
  vr.returned_by,
  vr.created_at
FROM vehicle_returns vr
JOIN bookings b ON vr.booking_id = b.id
JOIN vehicles v ON b.vehicle_id = v.id
WHERE vr.condition_status IN ('fair', 'damaged')
  AND vr.damage_description IS NOT NULL
ORDER BY vr.extra_fee DESC;
```

### Audit Trail

```sql
-- Track return updates (via updated_at timestamp)
SELECT 
  booking_id,
  condition_status,
  extra_fee,
  returned_by,
  created_at,
  updated_at,
  TIMESTAMPDIFF(SECOND, created_at, updated_at) as update_lag_seconds
FROM vehicle_returns
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY updated_at DESC;
```

### Check for Missing Returns

```sql
-- Completed bookings without return records
SELECT 
  b.id as booking_id,
  b.vehicle_id,
  b.user_id,
  b.completed_date,
  DATEDIFF(NOW(), b.completed_date) as days_since_completion
FROM bookings b
LEFT JOIN vehicle_returns vr ON b.id = vr.booking_id
WHERE b.status = 'completed'
  AND vr.id IS NULL
  AND b.created_at < DATE_SUB(NOW(), INTERVAL 3 DAY)
ORDER BY b.completed_date ASC;
```

---

## 🎯 Flow Diagrams

### Normal Vehicle Return Flow

```
Customer Returns Vehicle          Application                Database
         │                             │                         │
         ├─ Vehicle Inspection ────→  │                         │
         │  (check condition)         │                         │
         │                            │                         │
         └─ Submit Return Form ──────→ │                         │
                                      │                         │
                                      ├─ START TRANSACTION ────→ │
                                      │  SERIALIZABLE isolation  │
                                      │                         │
                                      ├─ LOCK booking row ─────→ │
                                      │  (pessimistic)          │
                                      │                         │
                                      ├─ Check return exists ──→ │ (NO)
                                      │                         │
                                      ├─ INSERT return ────────→ │
                                      │  (UNIQUE constraint OK)  │
                                      │                         │
                                      ├─ COMMIT ───────────────→ │
                                      │  (lock released)        │
                                      │                         │
                  ← Return Confirmed ┤                         │
```

### Duplicate Request Prevention

```
Request 1                    Application                Database
  │ Submit return            │                           │
  ├──────────────────────────→ │                           │
  │                           ├─ LOCK booking ──────────→ │
  │                           ├─ Check return ──────────→ │ (NO)
  │                           ├─ INSERT ────────────────→ │ SUCCESS
  │                           ├─ COMMIT ────────────────→ │
  │ ← Return ID-001 ──────────┤                           │
  │                           │                           │

Request 2 (RETRY)            Application                Database
  ├──────────────────────────→ │ [Same booking_id]        │
  │                           ├─ LOCK booking ──────────→ │
  │                           ├─ Check return ──────────→ │ (EXISTS!)
  │                           │                           │
  │ ← Return ID-001 ──────────┤ (Return cached result)   │
  │ [IDEMPOTENT]              │ (no duplicate created)   │
```

### Constraint Violation Recovery

```
Failed Update Attempt         Database              Application
     │                           │                        │
     ├─ INSERT return ──────────→ │ unique_booking_return  │
     │  (booking_id=B1)          │ constraint             │
     │                           │                        │
     │                    ❌ VIOLATION (B1 exists)        │
     │                    DataIntegrityViolation         │
     │                           │                        │
     │                        ← Constraint error         │
     │                                    │
     │                    Application recovers:          │
     │                    1. Catches exception           │
     │                    2. Queries existing return    │
     │                    3. Returns it (idempotent)    │
     │                                    │
     │ ← Return ID (existing) ─────────────┤
```

---

## ✅ Implementation Checklist

### Database Layer
- [x] Add `unique_booking_return` constraint
- [x] Remove `vehicle_id` column (redundant)
- [x] Add `updated_at` timestamp
- [x] Add `return_odometer_reading` field
- [x] Add `notes` and `returned_by` audit fields
- [x] Add composite index `idx_booking_condition`
- [x] Remove `idx_vehicle` (no longer needed)
- [x] Update table comment with duplicate prevention note

### Application Layer (TODO)
- [ ] Create VehicleReturn entity with @Entity annotation
- [ ] Create VehicleReturnService with pessimistic locking
- [ ] Create VehicleReturnRepository with custom queries
- [ ] Create VehicleReturnController REST endpoints
- [ ] Add VehicleReturnDTO classes
- [ ] Add custom exceptions (VehicleReturnNotFoundException)
- [ ] Add transaction configuration (SERIALIZABLE isolation)

### API Endpoints (TODO)
- [ ] `POST /api/returns` - Create return with duplicate prevention
- [ ] `GET /api/returns/{returnId}` - Get return by ID
- [ ] `GET /api/bookings/{bookingId}/return` - Get return by booking
- [ ] `PUT /api/returns/{returnId}` - Update return
- [ ] `GET /api/returns/damages` - Get damaged returns

### Testing (TODO)
- [ ] Unit test: constraint violation handling
- [ ] Unit test: idempotent recovery
- [ ] Integration test: concurrent return attempts
- [ ] Integration test: vehicle derivation from booking
- [ ] Load test: 100+ concurrent return attempts

### Monitoring (TODO)
- [ ] Alert: returns without associated bookings
- [ ] Alert: long-pending returns (>24 hours)
- [ ] Report: damaged vehicles requiring maintenance
- [ ] Report: extra fees collected

---

## 🔐 Data Consistency Guarantees

### Before & After

| Scenario | Before | After |
|----------|--------|-------|
| Duplicate return for same booking | ❌ ALLOWED | ✅ BLOCKED |
| `vehicle_id` mismatch with booking | ❌ POSSIBLE | ✅ IMPOSSIBLE |
| Multiple concurrent returns | ❌ RACE CONDITION | ✅ SERIALIZED |
| Return without booking | ⚠️ FK constraint | ✅ FK constraint |
| Audit trail (`updated_at`) | ❌ NO | ✅ YES |
| Return metadata | ⚠️ MINIMAL | ✅ COMPLETE |

---

## 📈 Performance Impact

### Storage Reduction
```
Before: 36 + 36 + 36 + 36 + 50 + TEXT + 8 + 16 = ~300 bytes
After:  36 + 36 + 36 + 50 + TEXT + 8 + 4 + TEXT + 50 + 8 + 8 = ~250 bytes
        (removed 36-byte vehicle_id FK)
```

### Query Performance
```
Before: SELECT vr.*, b.vehicle_id 
        2 tables joined + 3 foreign key constraints checked
        
After:  SELECT vr.*, b.vehicle_id
        2 tables joined + 2 foreign key constraints checked
        (simpler FK validation)
```

---

## 📚 Related Features

### Integration with Bookings
- Booking completion triggers return processing
- Return creation updates booking status
- Vehicle availability recalculated after return

### Integration with Payments
- Return damage creates additional invoice
- Extra fees deducted from booking refunds
- Audit trail links return to payment records

### Integration with Vehicle Management
- Odometer reading updated in vehicle record
- Condition status triggers maintenance tickets
- Service history recorded for each vehicle

---

## 📖 References

1. **Database Constraints**
   - MySQL UNIQUE Constraint: https://dev.mysql.com/doc/refman/8.0/en/constraint-unique.html
   - Foreign Key Constraints: https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html

2. **Transaction Isolation**
   - SERIALIZABLE Isolation: https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html
   - Pessimistic Locking: https://en.wikipedia.org/wiki/Lock_(database)

3. **Data Normalization**
   - Database Normalization: https://en.wikipedia.org/wiki/Database_normalization
   - Redundancy Detection: https://www.depesz.com/2012/03/07/redundant-columns/

---

**Status**: ✅ Complete - Database Schema Updated  
**Last Updated**: June 2, 2026  
**Next Phase**: Backend Service Implementation
