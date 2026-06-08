# BikeVN Database - Entity Relationship Diagram (ERD) v4.0

**Schema Version**: 4.0 (Full RBAC with Permissions, Pessimistic Locking, Token Invalidation, Duplicate Payment Prevention)  
**Last Updated**: 2026-06-04  
**Status**: ✅ Production Ready  
**Total Tables**: 19 | **Total FK**: 26 | **Total Indexes**: 65+

---

## 📊 System Overview

### Architecture Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                        BIKEVN SYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─── AUTHENTICATION & AUTHORIZATION ──────────────────────┐   │
│  │ ┌─────────────┐  ┌────────────────┐  ┌───────────┐    │   │
│  │ │ permissions │→ │role_permissions│← │   roles   │    │   │
│  │ └─────────────┘  └────────────────┘  └───────────┘    │   │
│  │                          ↑                              │   │
│  │                  ┌───────────────┐                      │   │
│  │                  │  users_roles  │← ─── users           │   │
│  │                  └───────────────┘                      │   │
│  │                                                          │   │
│  │ ┌─────────────────────────────┐                         │   │
│  │ │      invalidate_token       │  (JWT blacklist)        │   │
│  │ └─────────────────────────────┘                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─── VEHICLE MANAGEMENT (NORMALIZED) ─────────────────────┐   │
│  │ ┌──────────────┐  ┌──────────────┐                    │   │
│  │ │vehicle_brands│→ │vehicle_models│                    │   │
│  │ └──────────────┘  └──────────────┘                    │   │
│  │         ↓                   ↓                           │   │
│  │ ┌──────────────────────────────────┐                   │   │
│  │ │            vehicles              │                   │   │
│  │ └──────────────────────────────────┘                   │   │
│  │         ↓                                               │   │
│  │ ┌──────────────────────────────────┐                   │   │
│  │ │        vehicle_images            │                   │   │
│  │ └──────────────────────────────────┘                   │   │
│  │         ↓                                               │   │
│  │ ┌──────────────────────────────────┐                   │   │
│  │ │           branches               │                   │   │
│  │ └──────────────────────────────────┘                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─── BOOKING & RENTAL SYSTEM ──────────────────────────────┐  │
│  │ ┌──────────────┐  ┌──────────────┐  ┌─────────────┐   │  │
│  │ │   bookings   │→ │   payments   │  │booking_locks│   │  │
│  │ └──────────────┘  └──────────────┘  └─────────────┘   │  │
│  │         ↓                                               │  │
│  │ ┌──────────────────────────────────┐                   │  │
│  │ │       vehicle_returns            │                   │  │
│  │ └──────────────────────────────────┘                   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─── COMMUNICATION SYSTEM ─────────────────────────────┐      │
│  │ ┌──────────────┐  ┌────────────────────┐            │      │
│  │ │conversations │→ │conversation_members│            │      │
│  │ └──────────────┘  └────────────────────┘            │      │
│  │         ↓                                             │      │
│  │ ┌──────────────────────────────────┐                 │      │
│  │ │           messages               │                 │      │
│  │ └──────────────────────────────────┘                 │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  ┌─── FEEDBACK & REVIEWS ───────────────────────────────┐      │
│  │ ┌──────────────────────────────────┐                 │      │
│  │ │            reviews               │                 │      │
│  │ └──────────────────────────────────┘                 │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 TABLE 1: roles

**Purpose**: Define system roles for RBAC (Role-Based Access Control)

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `name` - VARCHAR(255) NOT NULL UNIQUE COMMENT 'Role name (e.g., ADMIN, USER, EMPLOYEE)'
- `description` - VARCHAR(255) COMMENT 'Role description'

> **⚠️ Breaking Change vs v3.0**: `id` changed from `INT AUTO_INCREMENT` to `VARCHAR(36)` UUID. Field `created_at` removed.

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY name (name)

**Relationships**:
- (1) roles ← (N) users_roles
- (1) roles ← (N) role_permissions

---

## 📊 TABLE 2: permissions

**Purpose**: Fine-grained permission definitions for RBAC (new in v4.0)

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `name` - VARCHAR(255) NOT NULL UNIQUE COMMENT 'Permission name (e.g., BOOKING_CREATE, VEHICLE_MANAGE)'
- `description` - VARCHAR(255) COMMENT 'Permission description'

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY UKpnvtwliis6p05pn6i3ndjrqt2 (name)

**Relationships**:
- (1) permissions ← (N) role_permissions

---

## 📊 TABLE 3: role_permissions

**Purpose**: Map roles to permissions (many-to-many) — new in v4.0

**Fields**:
- `role_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to roles'
- `permission_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to permissions'

**Indexes**:
- PRIMARY KEY (role_id, permission_id)
- FOREIGN KEY fk_rp_role (role_id) REFERENCES roles(id) ON DELETE CASCADE
- FOREIGN KEY fk_rp_permission (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
- KEY permission_id (permission_id)

**Relationships**:
- (N) role_permissions → (1) roles
- (N) role_permissions → (1) permissions

---

## 📊 TABLE 4: users

**Purpose**: Store user accounts, authentication, and profile information

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `name` - VARCHAR(255) COMMENT 'Full name'
- `email` - VARCHAR(255) UNIQUE COMMENT 'Email address'
- `password_hash` - VARCHAR(255) NOT NULL COMMENT 'Hashed password'
- `phone` - VARCHAR(255) COMMENT 'Phone number'
- `cccd_number` - VARCHAR(255) UNIQUE COMMENT 'National ID number'
- `is_active` - TINYINT(1) DEFAULT 1 COMMENT 'Account active status'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

> **⚠️ Change vs v3.0**: `name`, `email`, `phone`, `cccd_number` changed to `VARCHAR(255)` nullable (DEFAULT NULL). `NOT NULL` + length constraints were loosened.

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY unique_email (email)
- UNIQUE KEY unique_cccd (cccd_number)
- INDEX idx_is_active (is_active)
- INDEX idx_created_at (created_at)

**Relationships**:
- (1) users ← (N) users_roles
- (1) users ← (N) bookings
- (1) users ← (N) booking_locks
- (1) users ← (N) conversation_members
- (1) users ← (N) messages (as sender)
- (1) users ← (N) reviews

---

## 📊 TABLE 5: users_roles

**Purpose**: Map users to roles (many-to-many join table)

> **⚠️ Breaking Change vs v3.0**: Table renamed from `user_roles` to `users_roles`. Primary key changed to composite `(user_id, role_id)`. Fields `id`, `assigned_at`, `assigned_by` removed. `role_id` changed to `VARCHAR(36)` (UUID).

**Fields**:
- `user_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to users'
- `role_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to roles'
- `branch_id` - VARCHAR(36) COMMENT 'Branch where this role applies (FK)'

**Indexes**:
- PRIMARY KEY (user_id, role_id)
- FOREIGN KEY fk_user (user_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY fk_role (role_id) REFERENCES roles(id) ON DELETE CASCADE
- FOREIGN KEY fk_ur_branch (branch_id) REFERENCES branches(id) ON DELETE SET NULL
- INDEX idx_user (user_id)
- INDEX idx_role (role_id)
- INDEX idx_branch_id (branch_id)

**Constraints**:
- Composite PK prevents duplicate user-role assignments
- Both FK use CASCADE: removing user/role removes assignment

**Relationships**:
- (N) users_roles → (1) users
- (N) users_roles → (1) roles
- (N) users_roles → (1) branches

---

## 📊 TABLE 6: invalidate_token

**Purpose**: JWT token blacklist for logout/invalidation (new in v4.0)

**Fields**:
- `id` - VARCHAR(255) PRIMARY KEY COMMENT 'Token JTI or full JWT string'
- `expiry_time` - DATETIME(6) COMMENT 'Token expiry time (microsecond precision)'

**Indexes**:
- PRIMARY KEY (id)

**Business Logic**:
- On logout: insert token into this table
- On request: check if token's JTI exists → reject if found
- Cleanup: purge rows where `expiry_time < NOW()` periodically

**Relationships**: None (standalone security table)

---

## 📊 TABLE 7: branches

**Purpose**: Store rental branch/station information and locations

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `name` - VARCHAR(255) COMMENT 'Branch name (nullable)'
- `address` - VARCHAR(255) NOT NULL COMMENT 'Full address'
- `lat` - DECIMAL(10,8) NOT NULL COMMENT 'Latitude coordinate'
- `lng` - DECIMAL(11,8) NOT NULL COMMENT 'Longitude coordinate'
- `status` - ENUM('active', 'inactive') DEFAULT 'active'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

> **⚠️ Change vs v3.0**: `name` changed to `VARCHAR(255)` nullable.

**Sample Data**: 4 branches (HCMC, Hanoi, Da Nang, Can Tho)

**Indexes**:
- PRIMARY KEY (id)
- INDEX idx_status (status)
- INDEX idx_location (lat, lng) **[for geospatial queries]**

**Relationships**:
- (1) branches ← (N) vehicles
- (1) branches ← (N) bookings (pickup_branch_id)
- (1) branches ← (N) bookings (return_branch_id)
- (1) branches ← (N) vehicle_returns

---

## 📊 TABLE 8: vehicle_brands

**Purpose**: Motorcycle manufacturer/brand master data (normalized)

**Fields**:
- `id` - INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Auto-increment primary key'
- `name` - VARCHAR(255) NOT NULL UNIQUE COMMENT 'Brand name'
- `country` - VARCHAR(255) COMMENT 'Country of origin'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

**Sample Data**: 11 brands (Honda, Yamaha, Suzuki, Kawasaki, Harley-Davidson, Ducati, Vespa, Aprilia, Royal Enfield, Bajaj, SYM)

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY name (name)
- UNIQUE KEY UK68rb2my2c20nl27sclkn9apob (name) *(JPA-generated duplicate)*
- INDEX idx_name (name)

**Relationships**:
- (1) vehicle_brands ← (N) vehicle_models
- (1) vehicle_brands ← (N) vehicles

---

## 📊 TABLE 9: vehicle_models

**Purpose**: Motorcycle model master data (normalized, linked to brands)

**Fields**:
- `id` - INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Auto-increment primary key'
- `brand_id` - INT NOT NULL COMMENT 'Foreign key to vehicle_brands'
- `name` - VARCHAR(255) NOT NULL COMMENT 'Model name'
- `engine_capacity` - INT NOT NULL COMMENT 'Engine capacity in cc'
- `year_from` - INT COMMENT 'Production year start'
- `year_to` - INT COMMENT 'Production year end'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

**Sample Data**: 21 models

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_model_brand (brand_id) REFERENCES vehicle_brands(id) ON DELETE RESTRICT
- UNIQUE KEY unique_brand_model (brand_id, name) **[prevents duplicate models within brand]**
- INDEX idx_brand_id (brand_id)
- INDEX idx_name (name)

**Relationships**:
- (N) vehicle_models → (1) vehicle_brands
- (1) vehicle_models ← (N) vehicles

---

## 📊 TABLE 10: vehicles

**Purpose**: Vehicle inventory with real-time status and location tracking

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `name` - VARCHAR(255) COMMENT 'Vehicle display name (nullable)'
- `brand_id` - INT NOT NULL COMMENT 'Foreign key to vehicle_brands'
- `model_id` - INT NOT NULL COMMENT 'Foreign key to vehicle_models'
- `license_plate` - VARCHAR(20) NOT NULL UNIQUE COMMENT 'License plate number'
- `color` - VARCHAR(255) COMMENT 'Vehicle color (nullable)'
- `year` - INT NOT NULL COMMENT 'Manufacturing year'
- `price_per_day` - DECIMAL(10,2) NOT NULL COMMENT 'Price per day in VND'
- `vehicle_type` - ENUM('fuel', 'electric') NOT NULL
- `mileage` - INT DEFAULT 0 COMMENT 'Current mileage in km'
- `description` - VARCHAR(255) COMMENT 'Vehicle description (nullable)'
- `status` - ENUM('available', 'unavailable', 'maintenance') DEFAULT 'available'
- `current_branch_id` - VARCHAR(36) NOT NULL COMMENT 'Current location'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

> **⚠️ Change vs v3.0**: `name`, `color`, `description` changed to `VARCHAR(255)` nullable. `description` changed from `TEXT` to `VARCHAR(255)`.

**Sample Data**: 19 vehicles across 4 branches

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_vehicle_brand (brand_id) REFERENCES vehicle_brands(id) ON DELETE RESTRICT
- FOREIGN KEY fk_vehicle_model (model_id) REFERENCES vehicle_models(id) ON DELETE RESTRICT
- FOREIGN KEY fk_vehicle_branch (current_branch_id) REFERENCES branches(id) ON DELETE CASCADE
- UNIQUE KEY unique_license_plate (license_plate)
- INDEX idx_brand_id (brand_id)
- INDEX idx_model_id (model_id)
- INDEX idx_status (status)
- INDEX idx_price_per_day (price_per_day)
- INDEX idx_vehicle_type (vehicle_type)
- INDEX idx_current_branch_id (current_branch_id)

**Relationships**:
- (N) vehicles → (1) vehicle_brands
- (N) vehicles → (1) vehicle_models
- (N) vehicles → (1) branches
- (1) vehicles ← (N) booking_locks
- (1) vehicles ← (N) bookings
- (1) vehicles ← (N) vehicle_images
- (1) vehicles ← (N) reviews

---

## 📊 TABLE 11: vehicle_images

**Purpose**: Store multiple images per vehicle

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `vehicle_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to vehicles'
- `image_url` - VARCHAR(500) NOT NULL COMMENT 'Image URL/path'
- `alt_text` - VARCHAR(255) COMMENT 'Alternative text for accessibility'
- `display_order` - INT DEFAULT 0 COMMENT 'Display order (0=first)'
- `is_primary` - TINYINT(1) DEFAULT 0 COMMENT 'Primary/thumbnail image'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

> **⚠️ Change vs v3.0**: Column renamed `url` → `image_url`. Extended to `VARCHAR(500)`. Added `idx_display_order` index.

**Sample Data**: 20 images

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_vi_vehicle (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
- INDEX idx_vehicle_id (vehicle_id)
- INDEX idx_is_primary (is_primary)
- INDEX idx_display_order (display_order)

**Relationships**:
- (N) vehicle_images → (1) vehicles

---

## 📊 TABLE 12: booking_locks

**Purpose**: Pessimistic lock table to prevent concurrent booking conflicts (new in v4.0)

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `vehicle_id` - VARCHAR(36) NOT NULL COMMENT 'Vehicle being locked'
- `user_id` - VARCHAR(36) NOT NULL COMMENT 'User who holds the lock'
- `start_time` - DATETIME NOT NULL COMMENT 'Lock period start'
- `end_time` - DATETIME NOT NULL COMMENT 'Lock period end'
- `lock_acquired_at` - DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'When lock was acquired'
- `lock_expires_at` - DATETIME NOT NULL COMMENT 'Lock expiration (auto-release TTL)'
- `status` - ENUM('active', 'released', 'expired') DEFAULT 'active'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- INDEX idx_vehicle_id (vehicle_id)
- INDEX idx_user_id (user_id)
- INDEX idx_status (status)
- INDEX idx_lock_expires_at (lock_expires_at)
- INDEX idx_vehicle_time_status (vehicle_id, status, start_time, end_time) **[conflict detection]**

**Business Logic**:
```
1. User initiates booking → acquire lock (TTL: 5-10 minutes)
2. System checks for active locks on same vehicle/period
3. If no conflict → proceed to create booking
4. Lock released/expired → cleanup background job
5. On booking confirmed → release lock manually
```

**Relationships**:
- (N) booking_locks → (1) vehicles
- (N) booking_locks → (1) users

---

## 📊 TABLE 13: bookings

**Purpose**: Rental booking records with comprehensive status tracking and optimistic locking

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `user_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to users'
- `vehicle_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to vehicles'
- `pickup_branch_id` - VARCHAR(36) NOT NULL COMMENT 'Pickup branch'
- `return_branch_id` - VARCHAR(36) NOT NULL COMMENT 'Return branch (can differ from pickup)'
- `start_time` - DATETIME NOT NULL COMMENT 'Booking start'
- `end_time` - DATETIME NOT NULL COMMENT 'Booking end'
- `actual_return_time` - DATETIME DEFAULT NULL COMMENT 'Actual vehicle return time'
- `total_price` - DECIMAL(10,2) NOT NULL COMMENT 'Total price in VND'
- `status` - ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending'
- `version` - INT DEFAULT 0 COMMENT 'Optimistic locking version for concurrency control'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

> **⚠️ Change vs v3.0**: Added `version` field for optimistic locking. Added 2 composite indexes for concurrent booking detection.

**Sample Data**: 6 bookings with various statuses

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_booking_user (user_id) REFERENCES users(id) ON DELETE RESTRICT
- FOREIGN KEY fk_booking_vehicle (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT
- FOREIGN KEY fk_booking_pickup (pickup_branch_id) REFERENCES branches(id) ON DELETE RESTRICT
- FOREIGN KEY fk_booking_return (return_branch_id) REFERENCES branches(id) ON DELETE RESTRICT
- KEY fk_booking_pickup_branch (pickup_branch_id)
- KEY fk_booking_return_branch (return_branch_id)
- INDEX idx_user_id (user_id)
- INDEX idx_vehicle_id (vehicle_id)
- INDEX idx_status (status)
- INDEX idx_start_time (start_time)
- INDEX idx_end_time (end_time)
- INDEX idx_user_vehicle (user_id, vehicle_id)
- INDEX idx_vehicle_status_time (vehicle_id, status, start_time, end_time) **[concurrent booking check]**
- INDEX idx_active_bookings (vehicle_id, status, start_time) **[active/pending bookings]**

**Status Transitions**:
```
pending → approved / rejected / cancelled
approved → completed / cancelled
completed → (final, can review)
rejected / cancelled → (final)
```

**Relationships**:
- (N) bookings → (1) users
- (N) bookings → (1) vehicles
- (N) bookings → (1) branches (pickup)
- (N) bookings → (1) branches (return)
- (1) bookings ← (N) payments
- (1) bookings ← (1) vehicle_returns (unique)
- (1) bookings ← (1) reviews (unique)

---

## 📊 TABLE 14: payments

**Purpose**: Payment transaction tracking with duplicate prevention

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `booking_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to bookings'
- `amount` - DECIMAL(10,2) NOT NULL COMMENT 'Amount in VND'
- `type` - ENUM('rental', 'extra_fee','unspecified') NOT NULL COMMENT 'rental (upfront) or extra_fee  (at return), unspecified' 
- `payment_method` - VARCHAR(50) NOT NULL COMMENT 'credit_card, cash, transfer, e_wallet'
- `status` - ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending'
- `transaction_code` - VARCHAR(100) UNIQUE COMMENT 'External gateway transaction ID'
- `idempotency_key` - VARCHAR(100) UNIQUE COMMENT 'Idempotency key for duplicate request prevention'
- `branch_id` - VARCHAR(36) NOT NULL COMMENT 'Branch that processed this payment (FK)'
- `paid_at` - DATETIME COMMENT 'When payment was processed'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

> **⚠️ Change vs v3.0**: Added `idempotency_key` field + `updated_at`. Added UNIQUE on `(booking_id, type)` preventing duplicate payment types per booking. Added composite index `idx_booking_status_type`.

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_payment_booking (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT
- FOREIGN KEY fk_payment_branch (branch_id) REFERENCES branches(id) ON DELETE RESTRICT
- UNIQUE KEY unique_transaction_code (transaction_code) **[prevent duplicate transactions]**
- UNIQUE KEY unique_booking_type (booking_id, type) **[one payment type per booking]**
- UNIQUE KEY unique_idempotency_key (idempotency_key) **[prevent duplicate API requests]**
- INDEX idx_booking_id (booking_id)
- INDEX idx_branch_id (branch_id)
- INDEX idx_status (status)
- INDEX idx_type (type)
- INDEX idx_created_at (created_at)

**Relationships**:
- (N) payments → (1) bookings
- (N) payments → (1) branches

---

## 📊 TABLE 15: vehicle_returns

**Purpose**: Track vehicle condition on return with comprehensive audit fields

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `booking_id` - VARCHAR(36) NOT NULL UNIQUE COMMENT 'Foreign key to bookings (one return per booking)'
- `return_branch_id` - VARCHAR(36) NOT NULL COMMENT 'Where vehicle was returned'
- `condition_status` - VARCHAR(50) NOT NULL COMMENT 'excellent, good, fair, damaged'
- `damage_description` - TEXT COMMENT 'Detailed damage description'
- `extra_fee` - DECIMAL(10,2) DEFAULT 0 COMMENT 'Damage/late fees in VND'
- `images` - JSON COMMENT 'Return condition photos (URL array)'
- `return_odometer_reading` - INT COMMENT 'Odometer reading at return'
- `notes` - TEXT COMMENT 'Additional notes about the return process'
- `employee_id` - VARCHAR(36) NOT NULL COMMENT 'Staff handled return (FK to users)'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

> **⚠️ Breaking Change vs v3.0**: Field `vehicle_id` removed (derive from `booking_id`). Added `return_odometer_reading`, `notes`, `returned_by`, `updated_at`. Added UNIQUE constraint on `booking_id`. Added `idx_condition_status`, `idx_created_at`, `idx_booking_condition`.

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_return_booking (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT
- FOREIGN KEY fk_return_branch (return_branch_id) REFERENCES branches(id) ON DELETE RESTRICT
- FOREIGN KEY fk_return_employee (employee_id) REFERENCES users(id) ON DELETE RESTRICT
- UNIQUE KEY unique_booking_return (booking_id) **[only one return per booking]**
- INDEX idx_booking (booking_id)
- INDEX idx_return_branch (return_branch_id)
- INDEX idx_condition_status (condition_status)
- INDEX idx_created_at (created_at)
- INDEX idx_booking_condition (booking_id, condition_status) **[damage assessment queries]**

**Relationships**:
- (1) vehicle_returns → (1) bookings (unique)
- (N) vehicle_returns → (1) branches
- (N) vehicle_returns → (1) users (staff)

---

## 📊 TABLE 16: conversations

**Purpose**: Group chats between users and admin/support

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

**Sample Data**: 3 conversations

**Indexes**:
- PRIMARY KEY (id)
- INDEX idx_created_at (created_at)

**Relationships**:
- (1) conversations ← (N) conversation_members
- (1) conversations ← (N) messages

---

## 📊 TABLE 17: conversation_members

**Purpose**: Map users to conversations (who is in which chat group)

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `conversation_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to conversations'
- `user_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to users'
- `joined_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

**Sample Data**: 7 memberships

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_cm_conversation (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
- FOREIGN KEY fk_cm_user (user_id) REFERENCES users(id) ON DELETE CASCADE
- UNIQUE KEY unique_member (conversation_id, user_id) **[user can't join same conversation twice]**
- INDEX idx_conversation (conversation_id)
- INDEX idx_user (user_id)

**Relationships**:
- (N) conversation_members → (1) conversations
- (N) conversation_members → (1) users

---

## 📊 TABLE 18: messages

**Purpose**: Store chat messages in conversations

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `conversation_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to conversations'
- `sender_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to users (who sent)'
- `content` - TEXT NOT NULL COMMENT 'Message content'
- `is_read` - TINYINT(1) DEFAULT 0 COMMENT 'Read status'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

**Sample Data**: 9 messages

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_msg_conversation (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
- FOREIGN KEY fk_msg_sender (sender_id) REFERENCES users(id) ON DELETE CASCADE
- INDEX idx_conversation (conversation_id)
- INDEX idx_sender (sender_id)
- INDEX idx_created_at (created_at)
- INDEX idx_is_read (is_read)

**Relationships**:
- (N) messages → (1) conversations
- (N) messages → (1) users (as sender)

---

## 📊 TABLE 19: reviews

**Purpose**: User feedback and ratings for completed bookings

**Fields**:
- `id` - VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key'
- `booking_id` - VARCHAR(36) NOT NULL UNIQUE COMMENT 'Foreign key to bookings (one review per booking)'
- `user_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to users'
- `vehicle_id` - VARCHAR(36) NOT NULL COMMENT 'Foreign key to vehicles'
- `rating` - INT NOT NULL COMMENT 'Rating 1-5, CHECK constraint'
- `comment` - TEXT COMMENT 'Optional review comment'
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

**Sample Data**: 2 reviews

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY fk_review_booking (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
- FOREIGN KEY fk_review_user (user_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY fk_review_vehicle (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
- UNIQUE KEY unique_booking_review (booking_id) **[one review per booking]**
- INDEX idx_user (user_id)
- INDEX idx_vehicle (vehicle_id)
- INDEX idx_rating (rating)
- CHECK CONSTRAINT check_rating (rating >= 1 AND rating <= 5)

**Relationships**:
- (N) reviews → (1) bookings (unique)
- (N) reviews → (1) users
- (N) reviews → (1) vehicles

---

## 🔗 COMPLETE RELATIONSHIP DIAGRAM

### Relationship Matrix
```
roles (1) ←────────── (N) users_roles
      └─── (1) ←─── (N) role_permissions

permissions (1) ←────────── (N) role_permissions

users (1) ←────────── (N) users_roles
      ├─── (1) ←─── (N) bookings
      ├─── (1) ←─── (N) booking_locks
      ├─── (1) ←─── (N) conversation_members
      ├─── (1) ←─── (N) messages (as sender)
      └─── (1) ←─── (N) reviews

branches (1) ←────────── (N) vehicles
         ├─── (1) ←─── (N) bookings (pickup)
         ├─── (1) ←─── (N) bookings (return)
         ├─── (1) ←─── (N) vehicle_returns
         └─── (1) ←─── (N) users_roles

roles (1) ←────────── (N) users_roles
      └─── (1) ←─── (N) role_permissions

bookings (1) ←────────── (N) payments
         ├─── (1:1) ←── (1) vehicle_returns (unique)
         └─── (1:1) ←── (1) reviews (unique)

conversations (1) ←────────── (N) conversation_members
              └─── (1) ←─── (N) messages
```

### Foreign Key Summary (26 FK total)
| FK # | From Table | Column | To Table | On Delete | Purpose |
|------|-----------|--------|----------|-----------|---------|
| 1 | users_roles | user_id | users | CASCADE | User role assignment |
| 2 | users_roles | role_id | roles | CASCADE | Role reference |
| 3 | role_permissions | role_id | roles | CASCADE | Permission assignment |
| 4 | role_permissions | permission_id | permissions | CASCADE | Permission reference |
| 5 | vehicles | brand_id | vehicle_brands | RESTRICT | Brand reference |
| 6 | vehicles | model_id | vehicle_models | RESTRICT | Model reference |
| 7 | vehicles | current_branch_id | branches | CASCADE | Vehicle location |
| 8 | vehicle_images | vehicle_id | vehicles | CASCADE | Vehicle photos |
| 9 | vehicle_models | brand_id | vehicle_brands | RESTRICT | Brand relationship |
| 10 | booking_locks | vehicle_id | vehicles | CASCADE | Lock target |
| 11 | booking_locks | user_id | users | CASCADE | Lock holder |
| 12 | bookings | user_id | users | RESTRICT | Booking owner |
| 13 | bookings | vehicle_id | vehicles | RESTRICT | Booked vehicle |
| 14 | bookings | pickup_branch_id | branches | RESTRICT | Pickup location |
| 15 | bookings | return_branch_id | branches | RESTRICT | Return location |
| 16 | payments | booking_id | bookings | RESTRICT | Payment for booking |
| 17 | vehicle_returns | booking_id | bookings | RESTRICT | Return tracking |
| 18 | vehicle_returns | return_branch_id | branches | RESTRICT | Return location |
| 19 | conversation_members | conversation_id | conversations | CASCADE | Chat membership |
| 20 | conversation_members | user_id | users | CASCADE | Member reference |
| 21 | messages | conversation_id | conversations | CASCADE | Message in chat |
| 22 | messages | sender_id | users | CASCADE | Message sender |
| 23 | reviews | booking_id | bookings | CASCADE | Review for booking |
| 24 | reviews | user_id | users | CASCADE | Reviewer |
| 25 | reviews | vehicle_id | vehicles | CASCADE | Vehicle rated |

---

## 📊 DATABASE STATISTICS

| Table | Fields | FK | Unique Keys | Indexes | Sample Records |
|-------|--------|----|-------------|---------|----------------|
| roles | 3 | 0 | 1 (name) | 1 | 3+ |
| permissions | 3 | 0 | 1 (name) | 1 | N/A |
| role_permissions | 2 | 2 | PK composite | 1 | N/A |
| users | 9 | 0 | 2 (email, cccd) | 4 | 6 |
| users_roles | 2 | 2 | PK composite | 1 | 7+ |
| invalidate_token | 2 | 0 | 0 | 1 | dynamic |
| branches | 7 | 0 | 0 | 2 | 4 |
| vehicle_brands | 4 | 0 | 1 (name) | 1 | 11 |
| vehicle_models | 7 | 1 | 1 (brand+name) | 2 | 21 |
| vehicles | 15 | 3 | 1 (license_plate) | 6 | 19 |
| vehicle_images | 7 | 1 | 0 | 3 | 20 |
| booking_locks | 10 | 2 | 0 | 5 | dynamic |
| bookings | 13 | 4 | 0 | 8 | 6 |
| payments | 11 | 1 | 3 (tx_code, booking+type, idempotency) | 5 | 6 |
| vehicle_returns | 12 | 2 | 1 (booking_id) | 5 | 2 |
| conversations | 2 | 0 | 0 | 1 | 3 |
| conversation_members | 4 | 2 | 1 (conv+user) | 2 | 7 |
| messages | 6 | 2 | 0 | 4 | 9 |
| reviews | 7 | 3 | 1 (booking_id) | 3 | 2 |
| **TOTAL** | **130** | **29** | **15+** | **57+** | **123+** |

---

## ✅ KEY DESIGN CHANGES v4.0 (vs v3.0)

### 1. **Full RBAC with Permissions (New)**
- ✅ Thêm bảng `permissions` (fine-grained permission definitions)
- ✅ Thêm bảng `role_permissions` (role ↔ permission mapping)
- ✅ `roles.id` đổi sang UUID `VARCHAR(36)` (Spring Security compatible)
- ✅ `user_roles` → đổi tên thành `users_roles`, đơn giản hóa thành composite PK

### 2. **JWT Token Invalidation (New)**
- ✅ Thêm bảng `invalidate_token` (JWT blacklist on logout)
- ✅ `expiry_time` với microsecond precision (`DATETIME(6)`)
- ✅ Hỗ trợ stateless auth với khả năng thu hồi token

### 3. **Pessimistic Locking for Bookings (New)**
- ✅ Thêm bảng `booking_locks` (TTL-based vehicle slot lock)
- ✅ Ngăn double-booking trong concurrent requests
- ✅ Kết hợp với `version` field ở `bookings` (optimistic locking)

### 4. **Duplicate Payment Prevention (Enhanced)**
- ✅ Thêm `idempotency_key` UNIQUE trong `payments`
- ✅ UNIQUE `(booking_id, type)` — chỉ 1 deposit + 1 rental mỗi booking
- ✅ UNIQUE `transaction_code` — không trùng mã giao dịch gateway
- ✅ Thêm `updated_at` để audit payment changes

### 5. **Vehicle Returns (Refactored)**
- ✅ Loại bỏ `vehicle_id` (derive từ `booking.vehicle_id` — đỡ redundant)
- ✅ Thêm `return_odometer_reading`, `notes`, `returned_by` (staff audit)
- ✅ UNIQUE `booking_id` — chỉ 1 return record mỗi booking

### 6. **Schema Loosening (Pragmatic)**
- ✅ Nhiều field VARCHAR đổi nullable để linh hoạt với ORM (JPA/Hibernate)
- ✅ `vehicle_images.url` → `image_url` (clearer naming)

---

## 🛡️ SECURE LOGICAL LAYER (Views)

Để đảm bảo bảo mật và tránh nhầm lẫn dữ liệu giữa các loại đối tượng (Khách hàng/Nhân viên) mà không làm thay đổi cấu trúc bảng gốc, dự án sử dụng các **Business Views**:

1. **`view_customers`**: Lấy thông tin khách hàng (Đã lọc theo Role).
2. **`view_staff`**: Lấy thông tin nhân viên & quản lý (Đã JOIN sẵn chi nhánh).
3. **`view_managers`**: Chỉ lấy thông tin quản lý chi nhánh.

> **💡 Best Practice**: Khuyến khích lập trình viên truy vấn qua các View này thay vì query trực tiếp bảng `users` để đảm bảo tính chính xác 100%.

---

## 🕒 BUSINESS RULES (v5.0 simplified)

### 1. Booking & Pricing
- **Payment Stage**: 100% Upfront (Full Rental).
- **Price Calculation**: `days * price_per_day`.
- **Status Flow**: `pending` → `approved` (after full payment).

### 2. Vehicle Return & Extra Fees
- **Correct Branch**: No extra fee.
- **Wrong Branch (One-way)**: Fixed surcharge **50,000 VND**.
- **Late Return**: Surcharge **250,000 VND / Day**.
- **Damage**: Manual entry based on staff assessment.
- **Settlement**: If extra fees exist, a new payment (type: `extra_fee`) is created. Booking becomes `completed` only when both physical return and extra payments are finished.

---

### 1. Check Vehicle Availability (with Lock Check)
```sql
-- Step 1: Check active booking locks
SELECT COUNT(*) FROM booking_locks
WHERE vehicle_id = ?
  AND status = 'active'
  AND lock_expires_at > NOW()
  AND start_time < ?        -- requested end
  AND end_time > ?;         -- requested start

-- Step 2: Check confirmed bookings
SELECT COUNT(*) FROM bookings
WHERE vehicle_id = ?
  AND status IN ('pending', 'approved')
  AND start_time < ?
  AND end_time > ?
  AND id != ?;
```

### 2. Get User's Effective Permissions
```sql
SELECT DISTINCT p.name
FROM users u
JOIN users_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.id = ?
  AND u.is_active = 1;
```

### 3. Calculate Total Booking Price
```sql
SELECT
  DATEDIFF(end_time, start_time) as days,
  v.price_per_day,
  (DATEDIFF(end_time, start_time) * v.price_per_day) as total_price
FROM bookings b
JOIN vehicles v ON b.vehicle_id = v.id
WHERE b.id = ?;
```

### 4. Find Available Vehicles by Criteria
```sql
SELECT v.*, vi.image_url as thumbnail
FROM vehicles v
LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id AND vi.is_primary = 1
WHERE v.current_branch_id = ?
  AND v.status = 'available'
  AND v.vehicle_type = ?
  AND v.price_per_day BETWEEN ? AND ?
  AND NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE vehicle_id = v.id
      AND status IN ('pending', 'approved')
      AND start_time < ?
      AND end_time > ?
  )
ORDER BY v.price_per_day ASC;
```

### 5. Get Vehicle Ratings & Reviews
```sql
SELECT
  v.id, v.name,
  COUNT(r.id) as review_count,
  ROUND(AVG(r.rating), 1) as avg_rating
FROM vehicles v
LEFT JOIN reviews r ON v.id = r.vehicle_id
GROUP BY v.id
ORDER BY avg_rating DESC;
```

### 6. Cleanup Expired Tokens & Locks
```sql
-- JWT blacklist cleanup
DELETE FROM invalidate_token WHERE expiry_time < NOW();

-- Expired booking locks
UPDATE booking_locks SET status = 'expired'
WHERE status = 'active' AND lock_expires_at < NOW();
```

---

### 3. Financial Handling for One-way Rentals (Pick A - Return B)

Trường hợp khách hàng lấy xe tại **Chi nhánh A** và trả tại **Chi nhánh B**:
- **Thanh toánRental Fee**: Gán cho **Chi nhánh A** (người xuất xe).
- **Thanh toán Phụ phí**: Các khoản phí phát sinh lúc trả xe (hư hỏng, trễ hạn) được thực hiện tại **Chi nhánh B** (người nhận xe).
- **Trình tự**: `view_staff` tại Chi nhánh B sẽ dùng thông tin từ `bookings` để đối soát và tạo bản ghi `payments` mới gắn với `branch_id` của mình.

---

## 🔐 DATA INTEGRITY RULES

### Mandatory Constraints
1. **UNIQUE email**: One account per email
2. **UNIQUE cccd_number**: One account per National ID
3. **UNIQUE license_plate**: No duplicate vehicle plates
4. **UNIQUE (brand_id, name)** in vehicle_models: No duplicate models per brand
5. **UNIQUE (conversation_id, user_id)**: No duplicate membership
6. **UNIQUE booking_id** in reviews: One review per booking
7. **UNIQUE booking_id** in vehicle_returns: One return per booking
8. **UNIQUE (booking_id, type)** in payments: One deposit + one rental per booking
9. **UNIQUE transaction_code** in payments: No duplicate gateway transactions
10. **UNIQUE idempotency_key** in payments: No duplicate API requests
11. **CHECK (rating >= 1 AND rating <= 5)**: Valid rating range

### Referential Integrity
- **RESTRICT**: Prevent deletion if children exist (users, vehicles, bookings, branches)
- **CASCADE**: Delete children when parent deleted (conversations, vehicle images, reviews, token/lock cleanup)

---

## 📈 Query Performance Optimization

### Critical Indexes
- `bookings(vehicle_id, status, start_time, end_time)` — overlap detection
- `bookings(vehicle_id, status, start_time)` — active booking query
- `booking_locks(vehicle_id, status, start_time, end_time)` — lock conflict detection
- `vehicles(current_branch_id, status, price_per_day)` — vehicle search
- `vehicle_images(vehicle_id, is_primary)` — thumbnail query
- `payments(booking_id, status, type)` — payment status checks
- `messages(conversation_id, created_at)` — message chronology
- `booking_locks(lock_expires_at)` — TTL cleanup job

---

## 📝 Related Documentation

- **Schema Definition**: `database/schema.sql` — Complete CREATE TABLE statements (MySQL 8.0.46)
- **Sample Data**: `database/sample_data.sql` — 128+ records for testing
- **Query Reference**: `database/QUERIES_REFERENCE.sql` — 65+ documented queries
- **Concurrent Booking**: `database/CONCURRENT_BOOKING_QUERIES.sql` — Locking strategies
- **Duplicate Payment**: `database/DUPLICATE_PAYMENT_QUERIES.sql` — Idempotency handling
- **Database Setup**: `docker/docker-compose.yml` — Docker deployment

---

## 📋 Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2024 | Initial schema with 10 tables |
| v2.0 | 2024 | Added UUID keys, improved structure |
| v3.0 | 2026-05-18 | RBAC system, normalized vehicle catalog, vehicle images, 15 tables |
| v4.0 | 2026-06-04 | Full RBAC with permissions, JWT invalidation, booking_locks, payment idempotency, vehicle_returns refactor |

---

**ERD Last Updated**: 2026-06-04  
**Schema Version**: 4.0  
**Status**: ✅ Production Ready  
**Total Tables**: 19 | **Total FK**: 25 | **Total Indexes**: 57+  
**Sample Data**: 123+ records