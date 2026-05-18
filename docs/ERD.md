# BikeVN Database - Entity Relationship Diagram (ERD)

**Schema Version**: 2.0 (UUID Primary Keys, Complete Vehicle Fields)  
**Last Updated**: 2024  
**Status**: ✅ Production Ready

---

## 📊 TABLE 1: users

**Purpose**: Store user information and authentication

**Fields**:
- `id` - VARCHAR(36), PRIMARY KEY, UUID
- `name` - VARCHAR(100), NOT NULL
- `email` - VARCHAR(100), NOT NULL, UNIQUE
- `password_hash` - VARCHAR(255), NOT NULL
- `phone` - VARCHAR(20), NOT NULL
- `cccd_number` - VARCHAR(20), NOT NULL, UNIQUE (National ID for identity verification)
- `role` - ENUM('user', 'employee', 'admin'), DEFAULT 'user'
- `created_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY unique_email (email)
- UNIQUE KEY unique_cccd (cccd_number)
- INDEX idx_role (role)
- INDEX idx_created_at (created_at)

---

## 📊 TABLE 2: branches

**Purpose**: Store rental branch/location information

**Fields**:
- `id` - VARCHAR(36), PRIMARY KEY, UUID
- `name` - VARCHAR(100), NOT NULL
- `address` - VARCHAR(255), NOT NULL
- `lat` - DECIMAL(10,8), NOT NULL (Latitude coordinate)
- `lng` - DECIMAL(11,8), NOT NULL (Longitude coordinate)
- `status` - ENUM('active', 'inactive'), DEFAULT 'active'
- `created_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**Indexes**:
- PRIMARY KEY (id)
- INDEX idx_status (status)
- INDEX idx_location (lat, lng)

---

## 📊 TABLE 3: vehicles

**Purpose**: Store motorcycle/vehicle inventory information

**Fields**:
- `id` - VARCHAR(36), PRIMARY KEY, UUID
- `name` - VARCHAR(100), NOT NULL (Vehicle model/name)
- `brand` - VARCHAR(100), NOT NULL (Honda, Yamaha, Harley-Davidson, etc.)
- `model` - VARCHAR(100), NOT NULL (e.g., Wave 110, Exciter 150)
- `license_plate` - VARCHAR(20), NOT NULL, UNIQUE (License plate number)
- `color` - VARCHAR(50), NOT NULL (e.g., Red, Blue, Black)
- `year` - INT, NOT NULL (Manufacturing year)
- `price_per_day` - DECIMAL(10,2), NOT NULL (Price per day in VND)
- `engine_capacity` - INT, NOT NULL (Engine capacity in cc)
- `vehicle_type` - ENUM('fuel', 'electric'), NOT NULL (Fuel type)
- `mileage` - INT, DEFAULT 0 (Current mileage in km)
- `image_url` - JSON (Array of image URLs)
- `description` - TEXT (Vehicle description and features)
- `status` - ENUM('available', 'unavailable', 'maintenance'), DEFAULT 'available'
- `current_branch_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (branches.id)
- `created_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_vehicle_branch (current_branch_id) REFERENCES branches(id) ON DELETE RESTRICT
- UNIQUE KEY unique_license_plate (license_plate)
- INDEX idx_status (status)
- INDEX idx_price_per_day (price_per_day)
- INDEX idx_vehicle_type (vehicle_type)
- INDEX idx_current_branch_id (current_branch_id)

---

## 📊 TABLE 4: bookings

**Purpose**: Store booking/rental information

**Fields**:
- `id` - VARCHAR(36), PRIMARY KEY, UUID
- `user_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (users.id)
- `vehicle_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (vehicles.id)
- `pickup_branch_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (branches.id) - Branch where vehicle is picked up
- `return_branch_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (branches.id) - Branch where vehicle is returned
- `start_time` - DATETIME, NOT NULL (Booking start date/time)
- `end_time` - DATETIME, NOT NULL (Booking end date/time)
- `actual_return_time` - DATETIME, NULLABLE (Actual vehicle return date/time)
- `total_price` - DECIMAL(10,2), NOT NULL (Total booking price in VND)
- `status` - ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled'), DEFAULT 'pending'
- `created_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_booking_user (user_id) REFERENCES users(id) ON DELETE RESTRICT
- FOREIGN KEY fk_booking_vehicle (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT
- FOREIGN KEY fk_booking_pickup_branch (pickup_branch_id) REFERENCES branches(id) ON DELETE RESTRICT
- FOREIGN KEY fk_booking_return_branch (return_branch_id) REFERENCES branches(id) ON DELETE RESTRICT
- INDEX idx_user_id (user_id)
- INDEX idx_vehicle_id (vehicle_id)
- INDEX idx_status (status)
- INDEX idx_start_time (start_time)
- INDEX idx_end_time (end_time)
- INDEX idx_user_vehicle (user_id, vehicle_id)

---

## 📊 TABLE 5: payments

**Purpose**: Store payment transactions for bookings

**Fields**:
- `id` - VARCHAR(36), PRIMARY KEY, UUID
- `booking_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (bookings.id)
- `amount` - DECIMAL(10,2), NOT NULL (Payment amount in VND)
- `type` - ENUM('deposit', 'rental'), NOT NULL (Payment type: deposit or rental)
- `payment_method` - VARCHAR(50), NOT NULL (e.g., credit_card, cash, transfer)
- `status` - ENUM('pending', 'completed', 'failed', 'refunded'), DEFAULT 'pending'
- `transaction_code` - VARCHAR(100), NULLABLE (External transaction code)
- `paid_at` - DATETIME, NULLABLE (Actual payment date/time)
- `created_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_payment_booking (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT
- INDEX idx_booking_id (booking_id)
- INDEX idx_status (status)
- INDEX idx_type (type)
- INDEX idx_created_at (created_at)

---

## 📊 TABLE 6: vehicle_returns

**Purpose**: Store vehicle return tracking and condition information

**Fields**:
- `id` - VARCHAR(36), PRIMARY KEY, UUID
- `booking_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (bookings.id)
- `vehicle_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (vehicles.id)
- `return_branch_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (branches.id)
- `condition_status` - VARCHAR(50), NOT NULL (Vehicle condition: excellent, good, fair, damaged)
- `damage_description` - TEXT, NULLABLE (Description of damage if any)
- `extra_fee` - DECIMAL(10,2), DEFAULT 0 (Any additional fees for damage or late return)
- `images` - JSON (Return condition photos as JSON array of URLs)
- `created_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_return_booking (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT
- FOREIGN KEY fk_return_vehicle (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT
- FOREIGN KEY fk_return_branch (return_branch_id) REFERENCES branches(id) ON DELETE RESTRICT
- INDEX idx_booking (booking_id)
- INDEX idx_vehicle (vehicle_id)
- INDEX idx_return_branch (return_branch_id)

---

## 📊 TABLE 7: conversations

**Purpose**: Store conversation groups between users (1-on-1 or group chat)

**Fields**:
- `id` - VARCHAR(36), PRIMARY KEY, UUID
- `created_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP

**Indexes**:
- PRIMARY KEY (id)
- INDEX idx_created_at (created_at)

---

## 📊 TABLE 8: conversation_members

**Purpose**: Store members of each conversation

**Fields**:
- `id` - VARCHAR(36), PRIMARY KEY, UUID
- `conversation_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (conversations.id)
- `user_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (users.id)
- `joined_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_cm_conversation (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
- FOREIGN KEY fk_cm_user (user_id) REFERENCES users(id) ON DELETE CASCADE
- UNIQUE KEY unique_member (conversation_id, user_id)
- INDEX idx_conversation (conversation_id)
- INDEX idx_user (user_id)

---

## 📊 TABLE 9: messages

**Purpose**: Store chat messages in conversations

**Fields**:
- `id` - VARCHAR(36), PRIMARY KEY, UUID
- `conversation_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (conversations.id)
- `sender_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (users.id)
- `content` - TEXT, NOT NULL
- `is_read` - BOOLEAN, DEFAULT FALSE
- `created_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_msg_conversation (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
- FOREIGN KEY fk_msg_sender (sender_id) REFERENCES users(id) ON DELETE CASCADE
- INDEX idx_conversation (conversation_id)
- INDEX idx_sender (sender_id)
- INDEX idx_created_at (created_at)
- INDEX idx_is_read (is_read)

---

## 📊 TABLE 10: reviews

**Purpose**: Store user reviews for completed bookings

**Fields**:
- `id` - VARCHAR(36), PRIMARY KEY, UUID
- `booking_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (bookings.id)
- `user_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (users.id)
- `vehicle_id` - VARCHAR(36), NOT NULL, FOREIGN KEY (vehicles.id)
- `rating` - INT, NOT NULL (Rating 1-5 stars, must be between 1 and 5)
- `comment` - TEXT, NULLABLE (Optional review comment)
- `created_at` - DATETIME, DEFAULT CURRENT_TIMESTAMP

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_review_booking (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
- FOREIGN KEY fk_review_user (user_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY fk_review_vehicle (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
- UNIQUE KEY unique_booking_review (booking_id)
- INDEX idx_user (user_id)
- INDEX idx_vehicle (vehicle_id)
- INDEX idx_rating (rating)
- CONSTRAINT check_rating CHECK (rating >= 1 AND rating <= 5)

---

## 🔗 RELATIONSHIP DIAGRAM

### Entity Relationships

```
users (1) --- (N) bookings
├─ 1 user can have many bookings

users (1) --- (N) conversation_members
├─ 1 user can be member of many conversations

users (1) --- (N) messages (as sender)
├─ 1 user can send many messages

users (1) --- (N) reviews
├─ 1 user can write many reviews

branches (1) --- (N) vehicles
├─ 1 branch can have many vehicles

branches (1) --- (N) bookings (pickup)
├─ 1 branch can be pickup location for many bookings

branches (1) --- (N) bookings (return)
├─ 1 branch can be return location for many bookings

branches (1) --- (N) vehicle_returns
├─ 1 branch can receive many vehicle returns

vehicles (1) --- (N) bookings
├─ 1 vehicle can have many bookings

bookings (1) --- (N) payments
├─ 1 booking can have multiple payments (deposit + rental)

bookings (1) --- (N) vehicle_returns
├─ 1 booking has exactly 1 vehicle return (after completion)

bookings (1) --- (N) reviews
├─ 1 booking can have exactly 1 review (from booking_id UNIQUE constraint)

conversations (1) --- (N) conversation_members
├─ 1 conversation can have many members

conversations (1) --- (N) messages
├─ 1 conversation can have many messages
```

### Foreign Key Dependencies

**11 Foreign Keys Total**:
1. bookings.user_id → users.id
2. bookings.vehicle_id → vehicles.id
3. bookings.pickup_branch_id → branches.id
4. bookings.return_branch_id → branches.id
5. payments.booking_id → bookings.id
6. vehicle_returns.booking_id → bookings.id
7. vehicle_returns.vehicle_id → vehicles.id
8. vehicle_returns.return_branch_id → branches.id
9. conversation_members.conversation_id → conversations.id
10. conversation_members.user_id → users.id
11. messages.conversation_id → conversations.id
12. messages.sender_id → users.id
13. reviews.booking_id → bookings.id
14. reviews.user_id → users.id
15. reviews.vehicle_id → vehicles.id
16. vehicles.current_branch_id → branches.id

---

## ✅ KEY CONSTRAINTS & VALIDATION RULES

### 1. users Table
- **email**: Must be UNIQUE (one email per account)
- **cccd_number**: Must be UNIQUE (verified National ID number)
- **password_hash**: Always hashed, never store plain text
- **phone**: Required for contact purposes
- **role**: ENUM('user', 'employee', 'admin')
  - user: Regular customer
  - employee: Rental staff member
  - admin: System administrator
- **Constraint**: All timestamps auto-managed

### 2. branches Table
- **lat/lng**: Must be valid decimal coordinates
- **status**: Controls whether branch can accept bookings
  - active: Branch is operational
  - inactive: Branch is closed/not accepting bookings
- **Constraint**: Location index for geospatial queries

### 3. vehicles Table
- **license_plate**: Must be UNIQUE (no duplicate plate numbers)
- **price_per_day**: Must be positive decimal (VND)
- **vehicle_type**: ENUM('fuel', 'electric')
- **engine_capacity**: Stored in cc (cubic centimeters)
- **mileage**: Current kilometers (tracked for maintenance)
- **brand**: Manufacturer (Honda, Yamaha, Ducati, etc.)
- **model**: Specific model name
- **status**: Booking availability
  - available: Ready for booking
  - unavailable: Not available (booked or reserved)
  - maintenance: In maintenance/repair
- **Constraint**: current_branch_id tracks physical location

### 4. bookings Table
- **start_time < end_time**: Booking duration validation
- **No overlaps**: Cannot book same vehicle for overlapping time periods (for pending/approved/completed bookings)
- **pickup_branch_id ≠ return_branch_id**: Can be different (one-way rental)
- **actual_return_time**: NULL until vehicle is returned
- **status** transitions:
  - pending → approved/rejected
  - approved → completed/cancelled
  - completed → (final, can have review)
  - cancelled → (final, cannot have review)
- **Constraint**: Vehicle availability check before approval

### 5. payments Table
- **type**: ENUM('deposit', 'rental')
  - deposit: Initial security deposit (usually refundable)
  - rental: Main rental payment
- **payment_method**: Examples: 'credit_card', 'cash', 'transfer', 'e_wallet'
- **status** transitions:
  - pending → completed/failed
  - failed → (can retry)
  - completed → refunded (if needed)
  - refunded → (final)
- **transaction_code**: External payment gateway identifier
- **paid_at**: Timestamp when payment was actually processed
- **Constraint**: One booking can have multiple payments (deposit + rental)

### 6. vehicle_returns Table
- **condition_status**: Values: 'excellent', 'good', 'fair', 'damaged'
- **extra_fee**: Additional charges for:
  - Damage (if condition_status = 'damaged' or 'fair')
  - Late return (if actual_return_time > end_time in bookings)
  - Mileage overages (if mileage exceeds limit)
- **images**: JSON array of return condition photos
- **Constraint**: Created after booking completion

### 7. conversations Table
- **Type**: Can be 1-on-1 or group chat
- **Constraint**: created_at tracks conversation start time

### 8. conversation_members Table
- **UNIQUE(conversation_id, user_id)**: Prevents duplicate membership
- **joined_at**: When user joined the conversation
- **Constraint**: ON DELETE CASCADE - removing member removes their membership record

### 9. messages Table
- **conversation_id**: Links message to conversation
- **sender_id**: User who sent the message
- **is_read**: Tracks message read status per conversation
- **Constraint**: ON DELETE CASCADE - removing sender keeps messages but links to NULL

### 10. reviews Table
- **Only for completed bookings**: booking.status = 'completed'
- **rating**: ENUM(1,2,3,4,5) with CHECK constraint
- **vehicle_id**: Allows filtering/sorting reviews by vehicle
- **UNIQUE(booking_id)**: Only one review per booking
- **Constraint**: Must have valid booking, user, and vehicle references

---

## 📊 DATABASE STATISTICS

| Table | Fields | FK Count | Indexes | Sample Records |
|-------|--------|----------|---------|--|
| users | 9 | 0 | 3 | 6 |
| branches | 7 | 0 | 2 | 4 |
| vehicles | 17 | 1 | 4 | 19 |
| bookings | 11 | 4 | 6 | 6 |
| payments | 8 | 1 | 4 | 6 |
| vehicle_returns | 8 | 3 | 3 | 2 |
| conversations | 2 | 0 | 1 | 3 |
| conversation_members | 4 | 2 | 2 | 7 |
| messages | 6 | 2 | 4 | 9 |
| reviews | 7 | 3 | 3 | 2 |
| **TOTAL** | **79** | **16** | **32** | **64** |

---

## 🔄 Data Flow Examples

### Example 1: Complete Booking Flow
```
1. User creates booking (bookings table)
   - status = 'pending'
   
2. Admin approves booking (bookings update)
   - status = 'approved'
   
3. User makes payment (payments table)
   - type = 'deposit'
   - status = 'completed'
   
4. User picks up vehicle
   - (no DB change, but tracks in booking.start_time)
   
5. User returns vehicle (vehicle_returns table)
   - condition_status = 'good'
   - extra_fee = 0 (if no damage)
   
6. Booking marked completed (bookings update)
   - status = 'completed'
   - actual_return_time = now()
   
7. Final payment processed (payments table)
   - type = 'rental'
   - status = 'completed'
   
8. User writes review (reviews table)
   - rating = 5
   - comment = "Great service!"
```

### Example 2: Damage Claim Flow
```
1. Vehicle returned with damage (vehicle_returns table)
   - condition_status = 'damaged'
   - damage_description = "Dent on left side"
   - extra_fee = 500000 (VND)
   
2. Additional payment created (payments table)
   - type = 'rental'
   - amount = 500000
   - status = 'pending' (awaiting payment)
   
3. User pays for damage
   - payments.status = 'completed'
   - payments.paid_at = now()
```

### Example 3: Communication Flow
```
1. User needs help, admin starts conversation (conversations table)
   
2. Both users join conversation (conversation_members table)
   - user_id = customer
   - user_id = admin
   
3. Messages exchanged (messages table)
   - sender_id = customer: "When can I pick up?"
   - sender_id = admin: "Any time after 9 AM"
   - is_read tracking maintained
```

---

## 🚀 Performance Considerations

### Indexes for Common Queries
- **User Lookups**: idx_role, idx_created_at
- **Vehicle Search**: idx_status, idx_price_per_day, idx_vehicle_type
- **Booking Queries**: idx_user_id, idx_vehicle_id, idx_status, idx_start_time
- **Location-based**: idx_location (branches)
- **Message Reading**: idx_is_read, idx_created_at

### Query Optimization Strategies
1. Use indexed fields in WHERE clauses
2. Avoid SELECT * - specify needed columns
3. Use LIMIT for pagination
4. Consider denormalization for frequently accessed aggregates
5. Archive old bookings/messages after 1 year

---

## 📝 Notes
   - One review per booking (UNIQUE booking_id)
   - Cannot create review until booking is completed

===========================================
IMPORTANT QUERIES NEEDED
===========================================

1. Check booking overlap for vehicle
   SELECT COUNT(*) FROM bookings 
   WHERE vehicle_id = ? 
   AND status IN ('pending', 'approved')
   AND start_time < ? 
   AND end_time > ?

2. Find available vehicles by branch
   SELECT v.id, v.name, v.price, v.lat, v.lng 
   FROM vehicles v
   WHERE v.current_branch_id = ? 
   AND v.status = 'available'

3. Get conversation between two users
   SELECT * FROM messages 
   WHERE (user1_id = ? AND user2_id = ?) 
   OR (user1_id = ? AND user2_id = ?)
   ORDER BY created_at DESC

4. Get unread message count for user
   SELECT COUNT(*) FROM messages 
   WHERE user2_id = ? 
   AND is_read = FALSE

5. Calculate total price for booking
   SELECT SUM(amount) as total 
   FROM payments 
   WHERE booking_id = ? 
   AND status = 'completed'

6. Get vehicle return history
   SELECT * FROM vehicle_returns 
   WHERE vehicle_id = ? 
   ORDER BY created_at DESC

7. Get user booking history
   SELECT b.id, b.status, b.start_time, b.end_time, b.actual_return_time,
          b.total_price, v.id as vehicle_id, v.name as vehicle_name, 
          b1.name as pickup_branch, b2.name as return_branch,
          r.rating, r.comment
   FROM bookings b
   JOIN vehicles v ON b.vehicle_id = v.id
   JOIN branches b1 ON b.pickup_branch_id = b1.id
   JOIN branches b2 ON b.return_branch_id = b2.id
   LEFT JOIN reviews r ON b.id = r.booking_id
   WHERE b.user_id = ? 
   ORDER BY b.created_at DESC

8. Get booking status count for user
   SELECT 
     SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
     SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
     SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
     SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count
   FROM bookings
   WHERE user_id = ?

9. Validate review can be created (booking must be completed)
   SELECT COUNT(*) FROM bookings 
   WHERE id = ? 
   AND status = 'completed'

10. Get all reviews for completed bookings
   SELECT r.* FROM reviews r
   JOIN bookings b ON r.booking_id = b.id
   WHERE b.status = 'completed'
   ORDER BY r.created_at DESC
