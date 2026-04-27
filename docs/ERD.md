DATABASE TABLES STRUCTURE - BIKEVN

===========================================
TABLE 1: users
===========================================

Purpose: Store user information and authentication

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  name - VARCHAR(100), NOT NULL
  email - VARCHAR(100), NOT NULL, UNIQUE
  password_hash - VARCHAR(255), NOT NULL
  phone - VARCHAR(20), NOT NULL
  cccd_number - VARCHAR(20), NOT NULL, UNIQUE
  role - ENUM('user', 'admin'), DEFAULT 'user'
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP
  updated_at - DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)
  UNIQUE (email)
  UNIQUE (cccd_number)
  INDEX (role)

===========================================
TABLE 2: branches
===========================================

Purpose: Store rental branch/location information

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  name - VARCHAR(100), NOT NULL
  address - VARCHAR(255), NOT NULL
  lat - DECIMAL(10,8), NOT NULL
  lng - DECIMAL(11,8), NOT NULL
  status - ENUM('active', 'inactive'), DEFAULT 'active'
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)
  INDEX (status)
  INDEX (lat, lng)

===========================================
TABLE 3: vehicles
===========================================

Purpose: Store motorcycle/vehicle information

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  name - VARCHAR(100), NOT NULL
  vehicle_type - VARCHAR(50), NOT NULL
  price - DECIMAL(10,2), NOT NULL
  status - ENUM('available', 'unavailable', 'maintenance'), DEFAULT 'available'
  current_branch_id - INT, NOT NULL, FOREIGN KEY (branches.id)
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP
  updated_at - DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)
  FOREIGN KEY (current_branch_id) REFERENCES branches(id)
  INDEX (status)
  INDEX (price)
  INDEX (lat, lng)

===========================================
TABLE 4: bookings
===========================================

Purpose: Store booking/rental information

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  user_id - INT, NOT NULL, FOREIGN KEY (users.id)
  vehicle_id - INT, NOT NULL, FOREIGN KEY (vehicles.id)
  pickup_branch_id - INT, NOT NULL, FOREIGN KEY (branches.id)
  return_branch_id - INT, NOT NULL, FOREIGN KEY (branches.id)
  start_time - DATETIME, NOT NULL
  end_time - DATETIME, NOT NULL
  actual_return_time - DATETIME, NULLABLE
  total_price - DECIMAL(10,2), NOT NULL
  status - ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled'), DEFAULT 'pending'
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP
  updated_at - DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)
  FOREIGN KEY (user_id) REFERENCES users(id)
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
  FOREIGN KEY (pickup_branch_id) REFERENCES branches(id)
  FOREIGN KEY (return_branch_id) REFERENCES branches(id)
  INDEX (status)
  INDEX (user_id)
  INDEX (vehicle_id)
  INDEX (user_id, vehicle_id)
  INDEX (start_time, end_time)

===========================================
TABLE 5: payments
===========================================

Purpose: Store payment information for bookings

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  booking_id - INT, NOT NULL, FOREIGN KEY (bookings.id)
  amount - DECIMAL(10,2), NOT NULL
  type - ENUM('deposit', 'rental'), NOT NULL
  payment_method - VARCHAR(50), NOT NULL
  status - ENUM('pending', 'completed', 'failed', 'refunded'), DEFAULT 'pending'
  transaction_code - VARCHAR(100), NULLABLE
  paid_at - DATETIME, NULLABLE
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
  INDEX (status)
  INDEX (type)

===========================================
TABLE 6: vehicle_returns
===========================================

Purpose: Store vehicle return/condition information

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  booking_id - INT, NOT NULL, FOREIGN KEY (bookings.id)
  vehicle_id - INT, NOT NULL, FOREIGN KEY (vehicles.id)
  return_branch_id - INT, NOT NULL, FOREIGN KEY (branches.id)
  condition_status - VARCHAR(50), NOT NULL
  damage_description - TEXT, NULLABLE
  extra_fee - DECIMAL(10,2), DEFAULT 0
  images - JSON, NULLABLE
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
  FOREIGN KEY (return_branch_id) REFERENCES branches(id)

===========================================
TABLE 7: conversations
===========================================

Purpose: Store conversation groups between users

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)

===========================================
TABLE 8: conversation_members
===========================================

Purpose: Store members of each conversation

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  conversation_id - INT, NOT NULL, FOREIGN KEY (conversations.id)
  user_id - INT, NOT NULL, FOREIGN KEY (users.id)
  joined_at - DATETIME, DEFAULT CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
  FOREIGN KEY (user_id) REFERENCES users(id)
  INDEX (conversation_id)
  INDEX (user_id)
  UNIQUE (conversation_id, user_id)

===========================================
TABLE 9: messages
===========================================

Purpose: Store chat messages in conversations

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  conversation_id - INT, NOT NULL, FOREIGN KEY (conversations.id)
  sender_id - INT, NOT NULL, FOREIGN KEY (users.id)
  content - TEXT, NOT NULL
  is_read - BOOLEAN, DEFAULT FALSE
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP

Indexes:  
  PRIMARY KEY (id)
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
  FOREIGN KEY (sender_id) REFERENCES users(id)
  INDEX (conversation_id)
  INDEX (sender_id)
  INDEX (created_at)
  INDEX (is_read)

===========================================
TABLE 10: reviews
===========================================

Purpose: Store user reviews for completed bookings

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  booking_id - INT, NOT NULL, FOREIGN KEY (bookings.id)
  user_id - INT, NOT NULL, FOREIGN KEY (users.id)
  vehicle_id - INT, NOT NULL, FOREIGN KEY (vehicles.id)
  rating - INT, NOT NULL (1-5)
  comment - TEXT, NULLABLE
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)
  UNIQUE (booking_id)
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
  FOREIGN KEY (user_id) REFERENCES users(id)
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
  INDEX (vehicle_id)
  INDEX (rating)

===========================================
RELATIONSHIPS DIAGRAM
===========================================

users (1) --- (N) bookings
users (1) --- (N) conversation_members
users (1) --- (N) messages (as sender)
users (1) --- (N) reviews
branches (1) --- (N) vehicles
branches (1) --- (N) bookings (pickup)
branches (1) --- (N) bookings (return)
branches (1) --- (N) vehicle_returns
vehicles (1) --- (N) bookings
bookings (1) --- (N) payments
bookings (1) --- (N) vehicle_returns
bookings (1) --- (N) reviews
conversations (1) --- (N) conversation_members
conversations (1) --- (N) messages

===========================================
KEY CONSTRAINTS & RULES
===========================================

1. users table
   - email must be unique
   - cccd_number must be unique (verified by admin directly)
   - password must be hashed (never store plain text)
   - phone is required for contact
   - role determines user type (user or admin)

2. branches table
   - lat/lng must be valid coordinates
   - status controls branch availability

3. vehicles table
   - price must be positive decimal
   - vehicle_type examples: Honda SH, Air Blade, Wave, Lead, ...
   - current_branch_id tracks vehicle location
   - status controls availability for booking

4. bookings table
   - start_time must be before end_time
   - cannot overlap with existing approved/pending bookings for same vehicle
   - pickup_branch_id and return_branch_id can be different
   - actual_return_time null until vehicle returned

5. payments table
   - type can be deposit or rental
   - status tracks payment state
   - transaction_code unique identifier from payment gateway

6. vehicle_returns table
   - Created after vehicle return
   - extra_fee can be 0 if no damage
   - images stored as JSON array of URLs

7. conversations table
   - Đại diện cho một group chat
   - Có thể là 1-on-1 hoặc group chat
   - created_at tracks khi conversation bắt đầu

8. conversation_members table
   - Lưu các member của conversation
   - UNIQUE (conversation_id, user_id) để một user không join 2 lần
   - joined_at tracks khi user join conversation

9. messages table (refactored)
   - Tách riêng từ conversations (cũ)
   - conversation_id link đến conversation
   - sender_id là người gửi tin nhắn
   - is_read tracks đã đọc chưa

10. reviews table
   - Only for completed bookings (booking.status = 'completed')
   - rating must be 1-5
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
