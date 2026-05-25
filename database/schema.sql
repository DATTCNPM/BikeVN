-- BikeVN Database Schema - Complete and Unified
-- All primary keys use UUID (VARCHAR(36)) for consistency
-- This is the AUTHORITATIVE schema file

CREATE DATABASE IF NOT EXISTS bikevn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bikevn_db;

-- Clean up existing tables (in reverse dependency order)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversation_members;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS vehicle_returns;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS vehicle_images;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS vehicle_models;
DROP TABLE IF EXISTS vehicle_brands;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Roles Table (Normalized)
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Auto-increment primary key',
  name VARCHAR(50) NOT NULL UNIQUE COMMENT 'Role name (admin, employee, user, etc)',
  description VARCHAR(255) COMMENT 'Role description',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Is role active for assignment',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Application roles';

-- 1.1. Users Table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cccd_number VARCHAR(20) NOT NULL COMMENT 'National ID number for identity verification',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'User account status',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_email (email),
  UNIQUE KEY unique_cccd (cccd_number),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User accounts and authentication';

-- 1.2. User Roles Table (Many-to-Many)
CREATE TABLE user_roles (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  user_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to users',
  role_id INT NOT NULL COMMENT 'Foreign key to roles',
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  assigned_by VARCHAR(36) COMMENT 'Admin user who assigned this role',
  
  FOREIGN KEY fk_ur_user (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY fk_ur_role (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_user_role (user_id, role_id),
  INDEX idx_user_id (user_id),
  INDEX idx_role_id (role_id),
  INDEX idx_assigned_at (assigned_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User role assignments (many-to-many)';

-- 2. Branches Table
CREATE TABLE branches (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  lat DECIMAL(10,8) NOT NULL COMMENT 'Latitude coordinate',
  lng DECIMAL(11,8) NOT NULL COMMENT 'Longitude coordinate',
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_status (status),
  INDEX idx_location (lat, lng)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Rental branch locations';

-- 2.1. Vehicle Brands Table (Normalized)
CREATE TABLE vehicle_brands (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Auto-increment primary key',
  name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Brand name (Honda, Yamaha, etc)',
  country VARCHAR(50) COMMENT 'Country of origin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Motorcycle brands';

-- 2.2. Vehicle Models Table (Normalized)
CREATE TABLE vehicle_models (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Auto-increment primary key',
  brand_id INT NOT NULL COMMENT 'Foreign key to vehicle_brands',
  name VARCHAR(100) NOT NULL COMMENT 'Model name (CB500, XJR1300, etc)',
  engine_capacity INT NOT NULL COMMENT 'Engine capacity in cc',
  year_from INT COMMENT 'Production year start',
  year_to INT COMMENT 'Production year end',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_model_brand (brand_id) REFERENCES vehicle_brands(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_brand_model (brand_id, name),
  INDEX idx_brand_id (brand_id),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vehicle models per brand';

-- 3. Vehicles Table
CREATE TABLE vehicles (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  name VARCHAR(100) NOT NULL COMMENT 'Vehicle display name/nickname',
  brand_id INT NOT NULL COMMENT 'Foreign key to vehicle_brands',
  model_id INT NOT NULL COMMENT 'Foreign key to vehicle_models',
  license_plate VARCHAR(20) NOT NULL COMMENT 'License plate number',
  color VARCHAR(50) NOT NULL COMMENT 'Vehicle color',
  year INT NOT NULL COMMENT 'Manufacturing year',
  price_per_day DECIMAL(10,2) NOT NULL COMMENT 'Price per day in VND',  
  vehicle_type ENUM('fuel', 'electric') NOT NULL COMMENT 'Fuel type: fuel or electric',
  mileage INT DEFAULT 0 COMMENT 'Current mileage in km',
  description TEXT COMMENT 'Vehicle description and features',
  status ENUM('available', 'unavailable', 'maintenance') DEFAULT 'available',
  current_branch_id VARCHAR(36) NOT NULL COMMENT 'Current location (branch)',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY fk_vehicle_brand (brand_id) REFERENCES vehicle_brands(id) ON DELETE RESTRICT,
  FOREIGN KEY fk_vehicle_model (model_id) REFERENCES vehicle_models(id) ON DELETE RESTRICT,
  FOREIGN KEY fk_vehicle_branch (current_branch_id) REFERENCES branches(id) ON DELETE CASCADE,
  UNIQUE KEY unique_license_plate (license_plate),
  INDEX idx_brand_id (brand_id),
  INDEX idx_model_id (model_id),  INDEX idx_status (status),
  INDEX idx_price_per_day (price_per_day),
  INDEX idx_vehicle_type (vehicle_type),
  INDEX idx_current_branch_id (current_branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Motorcycle/vehicle inventory';

-- 3.1 Vehicle Images Table (Normalized)
CREATE TABLE vehicle_images (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  vehicle_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to vehicles',
  image_url VARCHAR(500) NOT NULL COMMENT 'Image URL/path',
  alt_text VARCHAR(255) COMMENT 'Alt text for accessibility',
  display_order INT DEFAULT 0 COMMENT 'Order to display images',
  is_primary BOOLEAN DEFAULT FALSE COMMENT 'Primary/thumbnail image',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_image_vehicle (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  INDEX idx_vehicle_id (vehicle_id),
  INDEX idx_is_primary (is_primary),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vehicle images gallery';

-- 4. Bookings Table
CREATE TABLE bookings (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  user_id VARCHAR(36) NOT NULL,
  vehicle_id VARCHAR(36) NOT NULL,
  pickup_branch_id VARCHAR(36) NOT NULL COMMENT 'Branch where vehicle is picked up',
  return_branch_id VARCHAR(36) NOT NULL COMMENT 'Branch where vehicle is returned',
  start_time DATETIME NOT NULL COMMENT 'Booking start date/time',
  end_time DATETIME NOT NULL COMMENT 'Booking end date/time',
  actual_return_time DATETIME COMMENT 'Actual vehicle return date/time',
  total_price DECIMAL(10,2) NOT NULL COMMENT 'Total booking price in VND',
  status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_booking_user (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY fk_booking_vehicle (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
  FOREIGN KEY fk_booking_pickup_branch (pickup_branch_id) REFERENCES branches(id) ON DELETE RESTRICT,
  FOREIGN KEY fk_booking_return_branch (return_branch_id) REFERENCES branches(id) ON DELETE RESTRICT,
  INDEX idx_user_id (user_id),
  INDEX idx_vehicle_id (vehicle_id),
  INDEX idx_status (status),
  INDEX idx_start_time (start_time),
  INDEX idx_end_time (end_time),
  INDEX idx_user_vehicle (user_id, vehicle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Booking/rental records';

-- 5. Payments Table
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  booking_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL COMMENT 'Payment amount in VND',
  type ENUM('deposit', 'rental') NOT NULL COMMENT 'Payment type: deposit or rental',
  payment_method VARCHAR(50) NOT NULL COMMENT 'e.g., credit_card, cash, transfer',
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  transaction_code VARCHAR(100) NULL COMMENT 'External transaction code',
  paid_at DATETIME NULL COMMENT 'Actual payment date/time',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_payment_booking (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT,
  INDEX idx_booking_id (booking_id),
  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Payment transactions';

-- 6. Vehicle Returns Table
CREATE TABLE vehicle_returns (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  booking_id VARCHAR(36) NOT NULL,
  vehicle_id VARCHAR(36) NOT NULL,
  return_branch_id VARCHAR(36) NOT NULL,
  condition_status VARCHAR(50) NOT NULL COMMENT 'Vehicle condition: excellent, good, fair, damaged',
  damage_description TEXT,
  extra_fee DECIMAL(10,2) DEFAULT 0 COMMENT 'Any additional fees (damage, late return)',
  images JSON COMMENT 'Return condition photos (JSON array)',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_return_booking (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT,
  FOREIGN KEY fk_return_vehicle (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
  FOREIGN KEY fk_return_branch (return_branch_id) REFERENCES branches(id) ON DELETE RESTRICT,
  INDEX idx_booking (booking_id),
  INDEX idx_vehicle (vehicle_id),
  INDEX idx_return_branch (return_branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vehicle return tracking';

-- 7. Conversations Table
CREATE TABLE conversations (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chat conversations';

-- 8. Conversation Members Table
CREATE TABLE conversation_members (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  conversation_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_cm_conversation (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY fk_cm_user (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_member (conversation_id, user_id),
  INDEX idx_conversation (conversation_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Conversation membership';

-- 9. Messages Table
CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  conversation_id VARCHAR(36) NOT NULL,
  sender_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_msg_conversation (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY fk_msg_sender (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_conversation (conversation_id),
  INDEX idx_sender (sender_id),
  INDEX idx_created_at (created_at),
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chat messages';

-- 10. Reviews Table
CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  booking_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  vehicle_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL COMMENT 'Rating 1-5 stars',
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_review_booking (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY fk_review_user (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY fk_review_vehicle (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_booking_review (booking_id),
  INDEX idx_user (user_id),
  INDEX idx_vehicle (vehicle_id),
  INDEX idx_rating (rating),
  
  CONSTRAINT check_rating CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Customer reviews and ratings';