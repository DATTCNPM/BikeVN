CREATE DATABASE IF NOT EXISTS bikevn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bikevn_db;

-- Tắt kiểm tra khóa ngoại để xóa bảng cũ cho sạch nếu cần
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reviews, messages, conversation_members, conversations, vehicle_returns, payments, bookings, vehicles, branches, users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Bảng Users
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cccd_number VARCHAR(20) NOT NULL,
  role ENUM('user', 'employee', 'admin') DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_email (email),
  UNIQUE KEY unique_cccd (cccd_number),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng Branches
CREATE TABLE branches (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng Vehicles
CREATE TABLE vehicles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status ENUM('available', 'unavailable', 'maintenance') DEFAULT 'available',
  current_branch_id VARCHAR(36) NOT NULL, -- Đã sửa từ INT sang VARCHAR(36)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY fk_vehicle_branch (current_branch_id) REFERENCES branches(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng Bookings
CREATE TABLE bookings (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL, -- Đã sửa
  vehicle_id VARCHAR(36) NOT NULL, -- Đã sửa
  pickup_branch_id VARCHAR(36) NOT NULL, -- Đã sửa
  return_branch_id VARCHAR(36) NOT NULL, -- Đã sửa
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  actual_return_time DATETIME,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY fk_booking_user (user_id) REFERENCES users(id),
  FOREIGN KEY fk_booking_vehicle (vehicle_id) REFERENCES vehicles(id),
  FOREIGN KEY fk_booking_pickup_branch (pickup_branch_id) REFERENCES branches(id),
  FOREIGN KEY fk_booking_return_branch (return_branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng Payments
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  booking_id VARCHAR(36) NOT NULL, -- Đã sửa
  amount DECIMAL(10,2) NOT NULL,
  type ENUM('deposit', 'rental') NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  transaction_code VARCHAR(100),
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY fk_payment_booking (booking_id) REFERENCES bookings(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng Vehicle Returns
CREATE TABLE vehicle_returns (
  id VARCHAR(36) PRIMARY KEY,
  booking_id VARCHAR(36) NOT NULL, -- Đã sửa
  vehicle_id VARCHAR(36) NOT NULL, -- Đã sửa
  return_branch_id VARCHAR(36) NOT NULL, -- Đã sửa
  condition_status VARCHAR(50) NOT NULL,
  damage_description TEXT,
  extra_fee DECIMAL(10,2) DEFAULT 0,
  images JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY fk_return_booking (booking_id) REFERENCES bookings(id),
  FOREIGN KEY fk_return_vehicle (vehicle_id) REFERENCES vehicles(id),
  FOREIGN KEY fk_return_branch (return_branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Bảng Conversations
CREATE TABLE conversations (
  id VARCHAR(36) PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bảng Conversation Members
CREATE TABLE conversation_members (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL, -- Đã sửa
  user_id VARCHAR(36) NOT NULL, -- Đã sửa
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY fk_cm_conversation (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY fk_cm_user (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_member (conversation_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Bảng Messages
CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL, -- Đã sửa
  sender_id VARCHAR(36) NOT NULL, -- Đã sửa
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY fk_msg_conversation (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY fk_msg_sender (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Bảng Reviews
CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY,
  booking_id VARCHAR(36) NOT NULL, -- Đã sửa
  user_id VARCHAR(36) NOT NULL, -- Đã sửa
  vehicle_id VARCHAR(36) NOT NULL, -- Đã sửa
  rating INT NOT NULL,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY fk_review_booking (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY fk_review_user (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY fk_review_vehicle (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  CONSTRAINT check_rating CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;