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
  phone - VARCHAR(20), NULLABLE
  role - ENUM('user', 'admin'), DEFAULT 'user'
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP
  updated_at - DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)
  UNIQUE (email)
  INDEX (role)

Sample Data Needed:
  - 2 admin users (for management)
  - 3-5 regular users (for bookings)

===========================================
TABLE 2: vehicles
===========================================

Purpose: Store motorcycle/vehicle information

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  name - VARCHAR(100), NOT NULL
  price - DECIMAL(10,2), NOT NULL
  description - TEXT, NULLABLE
  status - ENUM('available', 'unavailable', 'maintenance'), DEFAULT 'available'
  lat - DECIMAL(10,8), NOT NULL (latitude for Google Maps)
  lng - DECIMAL(11,8), NOT NULL (longitude for Google Maps)
  owner_id - INT, NOT NULL, FOREIGN KEY (users.id)
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP
  updated_at - DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)
  FOREIGN KEY (owner_id) REFERENCES users(id)
  INDEX (status)
  INDEX (price)
  INDEX (lat, lng) for nearby search

Sample Data Needed:
  - 15-20 vehicles with different prices
  - Various locations in city (different lat/lng)
  - Mix of statuses (available, maintenance)

===========================================
TABLE 3: bookings
===========================================

Purpose: Store booking/rental information

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  user_id - INT, NOT NULL, FOREIGN KEY (users.id)
  vehicle_id - INT, NOT NULL, FOREIGN KEY (vehicles.id)
  start_date - DATE, NOT NULL
  end_date - DATE, NOT NULL
  status - ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled'), DEFAULT 'pending'
  total_price - DECIMAL(10,2), NOT NULL
  notes - TEXT, NULLABLE
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP
  updated_at - DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)
  FOREIGN KEY (user_id) REFERENCES users(id)
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
  INDEX (status)
  INDEX (user_id)
  INDEX (vehicle_id)
  INDEX (start_date, end_date) for overlap checking

Sample Data Needed:
  - 5-10 bookings with different date ranges
  - Include overlapping dates (for testing conflict detection)
  - Include various statuses (pending, approved, completed)

===========================================
TABLE 4: messages
===========================================

Purpose: Store chat messages between users

Fields:
  id - INT, PRIMARY KEY, AUTO INCREMENT
  sender_id - INT, NOT NULL, FOREIGN KEY (users.id)
  receiver_id - INT, NOT NULL, FOREIGN KEY (users.id)
  content - TEXT, NOT NULL
  is_read - BOOLEAN, DEFAULT FALSE
  created_at - DATETIME, DEFAULT CURRENT_TIMESTAMP

Indexes:
  PRIMARY KEY (id)
  FOREIGN KEY (sender_id) REFERENCES users(id)
  FOREIGN KEY (receiver_id) REFERENCES users(id)
  INDEX (sender_id)
  INDEX (receiver_id)
  INDEX (created_at)

Sample Data Needed:
  - 10+ messages between different user pairs
  - Mix of read and unread messages

===========================================
TABLE 5: reviews (OPTIONAL)
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
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
  FOREIGN KEY (user_id) REFERENCES users(id)
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
  INDEX (vehicle_id)
  INDEX (rating)

Sample Data Needed:
  - 3-5 reviews for different vehicles
  - Different rating values (1-5)

===========================================
RELATIONSHIPS DIAGRAM
===========================================

users (1) --- (N) vehicles
users (1) --- (N) bookings
vehicles (1) --- (N) bookings
users (1) --- (N) messages
users (1) --- (N) reviews
bookings (1) --- (N) reviews

===========================================
KEY CONSTRAINTS & RULES
===========================================

1. users table
   - email must be unique
   - password must be hashed (never store plain text)
   - role determines if user can create/manage vehicles

2. vehicles table
   - price must be positive decimal
   - lat/lng must be valid coordinates (not null)
   - owner_id must reference existing user
   - status controls availability for booking

3. bookings table
   - start_date must be before end_date
   - cannot overlap with existing approved/pending bookings
   - total_price calculated from vehicle price and duration
   - user_id and vehicle_id must be valid

4. messages table
   - sender_id and receiver_id must be different
   - content cannot be empty
   - created_at tracks when message sent

5. reviews table
   - Only for completed bookings
   - rating must be between 1 and 5
   - one review per booking

===========================================
IMPORTANT QUERIES NEEDED
===========================================

1. Check booking overlap
   SELECT COUNT(*) FROM bookings 
   WHERE vehicle_id = ? 
   AND status IN ('approved', 'pending')
   AND start_date <= ? 
   AND end_date >= ?

2. Find nearby vehicles
   SELECT id, name, price, lat, lng 
   FROM vehicles 
   WHERE status = 'available'
   AND calculate_distance(lat, lng, ?, ?) <= ?

3. Get user messages
   SELECT * FROM messages 
   WHERE (sender_id = ? OR receiver_id = ?) 
   ORDER BY created_at DESC

4. Get user bookings
   SELECT * FROM bookings 
   WHERE user_id = ? 
   ORDER BY created_at DESC

5. Get vehicle reviews and average rating
   SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
   FROM reviews 
   WHERE vehicle_id = ?
