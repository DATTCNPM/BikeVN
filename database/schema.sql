CREATE DATABASE bikevn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bikevn_db;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cccd_number VARCHAR(20) NOT NULL COMMENT 'National ID number for identity verification',
  role ENUM('user', 'employee', 'admin') DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_email (email),
  UNIQUE KEY unique_cccd (cccd_number),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User accounts and authentication';

CREATE TABLE branches (
  id INT PRIMARY KEY AUTO_INCREMENT,
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

CREATE TABLE vehicles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT 'Vehicle model/name',
  vehicle_type VARCHAR(50) NOT NULL COMMENT 'Type: scooter, sport, cruiser, etc',
  price DECIMAL(10,2) NOT NULL COMMENT 'Price per day in VND',
  status ENUM('available', 'unavailable', 'maintenance') DEFAULT 'available',
  current_branch_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_vehicle_branch (current_branch_id) REFERENCES branches(id) ON DELETE RESTRICT,
  INDEX idx_status (status),
  INDEX idx_vehicle_type (vehicle_type),
  INDEX idx_branch (current_branch_id)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Motorcycle/vehicle inventory';

CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  pickup_branch_id INT NOT NULL COMMENT 'Branch where vehicle is picked up',
  return_branch_id INT NOT NULL COMMENT 'Branch where vehicle is returned',
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

CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
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

CREATE TABLE vehicle_returns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  return_branch_id INT NOT NULL,
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

CREATE TABLE conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chat conversations';

CREATE TABLE conversation_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY fk_cm_conversation (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY fk_cm_user (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_member (conversation_id, user_id),
  INDEX idx_conversation (conversation_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Conversation membership';

CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
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


CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  user_id INT NOT NULL,
  vehicle_id INT NOT NULL,
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



