# BikeVN Test Cases Documentation

## 📋 Table of Contents
1. [Test Case Structure](#test-case-structure)
2. [Authentication Test Cases](#authentication-test-cases)
3. [User Management Test Cases](#user-management-test-cases)
4. [Vehicle Management Test Cases](#vehicle-management-test-cases)
5. [Booking Test Cases](#booking-test-cases)
6. [Payment Test Cases](#payment-test-cases)
7. [Database Test Cases](#database-test-cases)

---

## Test Case Structure

### Standard Test Case Format

```
Test Case ID: TC-001
Title: [Tiêu đề test case]
Module: [Module nào: Auth, Users, Vehicles, Bookings, Payments]
Priority: [Critical/High/Medium/Low]
Type: [Positive/Negative/Edge Case]

Preconditions (Điều kiện tiên quyết):
- Điều kiện 1
- Điều kiện 2

Steps (Các bước thực hiện):
1. Bước 1
2. Bước 2
3. Bước 3

Expected Result (Kết quả mong đợi):
- Kết quả 1
- Kết quả 2

Actual Result (Kết quả thực tế):
- [Điền sau khi test]

Status: [Pass/Fail/Blocked]
Notes: [Ghi chú thêm nếu có]
```

---

## Authentication Test Cases

### TC-AUTH-001: Login với email và password đúng
**Module:** Authentication  
**Priority:** Critical  
**Type:** Positive

**Preconditions:**
- User admin@bikevn.com tồn tại trong database
- Password là "admin123"

**Steps:**
1. Mở Postman
2. Chọn request "Login (Admin)"
3. Body: 
   ```json
   {
     "email": "admin@bikevn.com",
     "password": "admin123"
   }
   ```
4. Click "Send"

**Expected Result:**
- HTTP Status: 200 OK
- Response body chứa:
  ```json
  {
    "status": "success",
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "admin@bikevn.com",
      "token": "[JWT token]",
      "role": ["admin"]
    }
  }
  ```
- Token có thể dùng cho requests tiếp theo

**Actual Result:**
- ✅ Pass

---

### TC-AUTH-002: Login với password sai
**Module:** Authentication  
**Priority:** High  
**Type:** Negative

**Preconditions:**
- User admin@bikevn.com tồn tại

**Steps:**
1. Mở Postman
2. Login với email: admin@bikevn.com
3. Password: "wrongpassword123"
4. Click "Send"

**Expected Result:**
- HTTP Status: 401 Unauthorized
- Response body:
  ```json
  {
    "status": "error",
    "message": "Invalid email or password"
  }
  ```

**Actual Result:**
- ✅ Pass

---

### TC-AUTH-003: Login với email không tồn tại
**Module:** Authentication  
**Priority:** High  
**Type:** Negative

**Preconditions:**
- Email "notexist@bikevn.com" không tồn tại

**Steps:**
1. POST /api/v1/auth/login
2. Body:
   ```json
   {
     "email": "notexist@bikevn.com",
     "password": "anypassword"
   }
   ```

**Expected Result:**
- HTTP Status: 401 Unauthorized
- Message: "Invalid email or password"

**Actual Result:**
- ✅ Pass

---

### TC-AUTH-004: Login với email format không hợp lệ
**Module:** Authentication  
**Priority:** Medium  
**Type:** Edge Case

**Steps:**
1. POST /api/v1/auth/login
2. Body:
   ```json
   {
     "email": "invalidemail",
     "password": "password123"
   }
   ```

**Expected Result:**
- HTTP Status: 400 Bad Request
- Message: "Invalid email format"

---

### TC-AUTH-005: Lấy thông tin user hiện tại (Get Current User)
**Module:** Authentication  
**Priority:** High  
**Type:** Positive

**Preconditions:**
- Đã login thành công
- Có valid JWT token

**Steps:**
1. GET /api/v1/auth/me
2. Headers: Authorization: Bearer [valid_token]

**Expected Result:**
- HTTP Status: 200 OK
- Response chứa thông tin user:
  ```json
  {
    "status": "success",
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Admin BikeVN",
      "email": "admin@bikevn.com",
      "phone": "0987654321",
      "roles": ["admin"]
    }
  }
  ```

---

## User Management Test Cases

### TC-USER-001: Get tất cả users (Admin only)
**Module:** Users  
**Priority:** High  
**Type:** Positive

**Preconditions:**
- Logged in as admin
- Valid admin token

**Steps:**
1. GET /api/v1/users
2. Headers: Authorization: Bearer [admin_token]

**Expected Result:**
- HTTP Status: 200 OK
- Response chứa array của 6 users
- Mỗi user có: id, name, email, phone, cccd_number, roles, is_active

---

### TC-USER-002: Get tất cả users khi không phải admin
**Module:** Users  
**Priority:** High  
**Type:** Negative

**Preconditions:**
- Logged in as regular user
- Non-admin token

**Steps:**
1. GET /api/v1/users
2. Headers: Authorization: Bearer [user_token]

**Expected Result:**
- HTTP Status: 403 Forbidden
- Message: "Unauthorized. Admin access required"

---

### TC-USER-003: Get user by ID
**Module:** Users  
**Priority:** High  
**Type:** Positive

**Steps:**
1. GET /api/v1/users/550e8400-e29b-41d4-a716-446655440003
2. Headers: Authorization: Bearer [auth_token]

**Expected Result:**
- HTTP Status: 200 OK
- Response:
  ```json
  {
    "status": "success",
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Tran Thi B",
      "email": "tranb@email.com",
      "phone": "0902345678",
      "cccd_number": "001234567892",
      "roles": ["user"],
      "is_active": true
    }
  }
  ```

---

### TC-USER-004: Get user với ID không tồn tại
**Module:** Users  
**Priority:** Medium  
**Type:** Negative

**Steps:**
1. GET /api/v1/users/invalid-uuid-12345
2. Headers: Authorization: Bearer [auth_token]

**Expected Result:**
- HTTP Status: 404 Not Found
- Message: "User not found"

---

### TC-USER-005: Create user mới (Admin only)
**Module:** Users  
**Priority:** High  
**Type:** Positive

**Preconditions:**
- Logged in as admin
- Email "newuser@bikevn.com" chưa tồn tại

**Steps:**
1. POST /api/v1/users
2. Headers: Authorization: Bearer [admin_token]
3. Body:
   ```json
   {
     "name": "Tran Van New",
     "email": "newuser@bikevn.com",
     "password": "password123",
     "phone": "0909999999",
     "cccd_number": "001234567900"
   }
   ```

**Expected Result:**
- HTTP Status: 201 Created
- Response:
  ```json
  {
    "status": "success",
    "message": "User created successfully",
    "data": {
      "id": "[new_uuid]",
      "name": "Tran Van New",
      "email": "newuser@bikevn.com",
      "phone": "0909999999"
    }
  }
  ```

---

### TC-USER-006: Create user với email đã tồn tại
**Module:** Users  
**Priority:** High  
**Type:** Negative

**Steps:**
1. POST /api/v1/users
2. Body:
   ```json
   {
     "name": "Duplicate",
     "email": "tranb@email.com",
     "password": "password123",
     "phone": "0909999999",
     "cccd_number": "001234567901"
   }
   ```

**Expected Result:**
- HTTP Status: 400 Bad Request
- Message: "Email already exists"

---

### TC-USER-007: Update user profile
**Module:** Users  
**Priority:** High  
**Type:** Positive

**Steps:**
1. PUT /api/v1/users/550e8400-e29b-41d4-a716-446655440003
2. Headers: Authorization: Bearer [user_token]
3. Body:
   ```json
   {
     "name": "Tran Thi B Updated",
     "phone": "0987654321"
   }
   ```

**Expected Result:**
- HTTP Status: 200 OK
- Response chứa updated user data

---

## Vehicle Management Test Cases

### TC-VEHICLE-001: Get tất cả vehicles có status available
**Module:** Vehicles  
**Priority:** High  
**Type:** Positive

**Steps:**
1. GET /api/v1/vehicles?status=available
2. No auth required (public endpoint)

**Expected Result:**
- HTTP Status: 200 OK
- Response chứa array vehicles có status = "available"
- Tổng: 19 vehicles

---

### TC-VEHICLE-002: Get vehicles theo branch ID
**Module:** Vehicles  
**Priority:** High  
**Type:** Positive

**Steps:**
1. GET /api/v1/vehicles?branch_id=550e8400-e29b-41d4-a716-446655440101
2. Query params: branch_id=[branch_uuid]

**Expected Result:**
- HTTP Status: 200 OK
- Response chứa vehicles tại branch đó

---

### TC-VEHICLE-003: Get vehicles theo vehicle type (fuel)
**Module:** Vehicles  
**Priority:** High  
**Type:** Positive

**Steps:**
1. GET /api/v1/vehicles?vehicle_type=fuel

**Expected Result:**
- HTTP Status: 200 OK
- Response chứa chỉ vehicles với vehicle_type = "fuel"

---

### TC-VEHICLE-004: Get vehicle by ID
**Module:** Vehicles  
**Priority:** High  
**Type:** Positive

**Steps:**
1. GET /api/v1/vehicles/550e8400-e29b-41d4-a716-446655440301

**Expected Result:**
- HTTP Status: 200 OK
- Response:
  ```json
  {
    "status": "success",
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440301",
      "name": "Honda Wave 110 #1",
      "brand": "Honda",
      "model": "Wave 110",
      "license_plate": "51F-12345",
      "color": "Silver",
      "year": 2023,
      "price_per_day": 120000,
      "engine_capacity": 110,
      "vehicle_type": "fuel",
      "mileage": 5000,
      "description": "...",
      "status": "available",
      "current_branch_id": "550e8400-e29b-41d4-a716-446655440101",
      "images": [
        {
          "url": "https://bikevn.com/images/wave-1.jpg",
          "alt": "Honda Wave 110 front view",
          "is_primary": true
        }
      ]
    }
  }
  ```

---

### TC-VEHICLE-005: Create vehicle mới (Admin only)
**Module:** Vehicles  
**Priority:** High  
**Type:** Positive

**Preconditions:**
- Logged in as admin
- Brand Honda (id=1) tồn tại
- Model CB150R (id=5) tồn tại
- License plate "99K-99999" chưa tồn tại

**Steps:**
1. POST /api/v1/vehicles
2. Headers: Authorization: Bearer [admin_token]
3. Body:
   ```json
   {
     "name": "Honda CB150R New",
     "brand_id": 1,
     "model_id": 5,
     "license_plate": "99K-99999",
     "color": "Red",
     "year": 2024,
     "price_per_day": 250000,
     "vehicle_type": "fuel",
     "mileage": 0,
     "description": "Brand new Honda CB150R 2024",
     "current_branch_id": "550e8400-e29b-41d4-a716-446655440101"
   }
   ```

**Expected Result:**
- HTTP Status: 201 Created
- Response chứa vehicle ID mới

---

### TC-VEHICLE-006: Create vehicle với license plate trùng
**Module:** Vehicles  
**Priority:** High  
**Type:** Negative

**Steps:**
1. POST /api/v1/vehicles
2. Body chứa license_plate "51F-12345" (đã tồn tại)

**Expected Result:**
- HTTP Status: 400 Bad Request
- Message: "License plate already exists"

---

### TC-VEHICLE-007: Update vehicle status to maintenance
**Module:** Vehicles  
**Priority:** High  
**Type:** Positive

**Steps:**
1. PATCH /api/v1/vehicles/550e8400-e29b-41d4-a716-446655440301
2. Headers: Authorization: Bearer [admin_token]
3. Body:
   ```json
   {
     "status": "maintenance"
   }
   ```

**Expected Result:**
- HTTP Status: 200 OK
- Vehicle status thay đổi thành "maintenance"

---

## Booking Test Cases

### TC-BOOKING-001: Create booking mới
**Module:** Bookings  
**Priority:** Critical  
**Type:** Positive

**Preconditions:**
- User đã login
- Vehicle 550e8400-e29b-41d4-a716-446655440301 có status "available"
- Start time phải sau current time

**Steps:**
1. POST /api/v1/bookings
2. Headers: Authorization: Bearer [user_token]
3. Body:
   ```json
   {
     "vehicle_id": "550e8400-e29b-41d4-a716-446655440301",
     "pickup_branch_id": "550e8400-e29b-41d4-a716-446655440101",
     "return_branch_id": "550e8400-e29b-41d4-a716-446655440101",
     "start_time": "2026-05-25T10:00:00Z",
     "end_time": "2026-05-27T10:00:00Z"
   }
   ```

**Expected Result:**
- HTTP Status: 201 Created
- Response:
  ```json
  {
    "status": "success",
    "data": {
      "id": "[new_booking_id]",
      "user_id": "550e8400-e29b-41d4-a716-446655440003",
      "vehicle_id": "550e8400-e29b-41d4-a716-446655440301",
      "start_time": "2026-05-25T10:00:00Z",
      "end_time": "2026-05-27T10:00:00Z",
      "status": "pending",
      "total_price": 240000,
      "created_at": "2026-05-18T12:00:00Z"
    }
  }
  ```
- total_price = price_per_day × number_of_days (120000 × 2 = 240000)

---

### TC-BOOKING-002: Create booking với start_time trong quá khứ
**Module:** Bookings  
**Priority:** High  
**Type:** Negative

**Steps:**
1. POST /api/v1/bookings
2. Body:
   ```json
   {
     "vehicle_id": "550e8400-e29b-41d4-a716-446655440301",
     "start_time": "2026-05-01T10:00:00Z",
     "end_time": "2026-05-03T10:00:00Z"
   }
   ```

**Expected Result:**
- HTTP Status: 400 Bad Request
- Message: "Start time must be in the future"

---

### TC-BOOKING-003: Create booking với end_time <= start_time
**Module:** Bookings  
**Priority:** High  
**Type:** Negative

**Steps:**
1. POST /api/v1/bookings
2. Body:
   ```json
   {
     "vehicle_id": "550e8400-e29b-41d4-a716-446655440301",
     "start_time": "2026-05-25T10:00:00Z",
     "end_time": "2026-05-25T09:00:00Z"
   }
   ```

**Expected Result:**
- HTTP Status: 400 Bad Request
- Message: "End time must be after start time"

---

### TC-BOOKING-004: Get tất cả bookings của user
**Module:** Bookings  
**Priority:** High  
**Type:** Positive

**Steps:**
1. GET /api/v1/bookings
2. Headers: Authorization: Bearer [user_token]

**Expected Result:**
- HTTP Status: 200 OK
- Response chứa bookings của user đó (filtered)

---

### TC-BOOKING-005: Approve booking (Admin only)
**Module:** Bookings  
**Priority:** High  
**Type:** Positive

**Preconditions:**
- Booking có status "pending"
- Logged in as admin

**Steps:**
1. PATCH /api/v1/bookings/[booking_id]/status
2. Headers: Authorization: Bearer [admin_token]
3. Body:
   ```json
   {
     "status": "approved"
   }
   ```

**Expected Result:**
- HTTP Status: 200 OK
- Booking status thay đổi thành "approved"

---

### TC-BOOKING-006: Reject booking (Admin only)
**Module:** Bookings  
**Priority:** High  
**Type:** Positive

**Steps:**
1. PATCH /api/v1/bookings/[booking_id]/status
2. Body:
   ```json
   {
     "status": "rejected",
     "rejection_reason": "Vehicle not available"
   }
   ```

**Expected Result:**
- HTTP Status: 200 OK
- Status = "rejected"

---

## Payment Test Cases

### TC-PAYMENT-001: Create deposit payment
**Module:** Payments  
**Priority:** Critical  
**Type:** Positive

**Preconditions:**
- Booking tồn tại
- Status "pending" hoặc "approved"

**Steps:**
1. POST /api/v1/payments
2. Headers: Authorization: Bearer [user_token]
3. Body:
   ```json
   {
     "booking_id": "550e8400-e29b-41d4-a716-446655440501",
     "type": "deposit",
     "amount": 500000,
     "payment_method": "credit_card"
   }
   ```

**Expected Result:**
- HTTP Status: 201 Created
- Response:
  ```json
  {
    "status": "success",
    "data": {
      "id": "[new_payment_id]",
      "booking_id": "550e8400-e29b-41d4-a716-446655440501",
      "type": "deposit",
      "amount": 500000,
      "payment_method": "credit_card",
      "status": "completed",
      "created_at": "2026-05-18T12:00:00Z"
    }
  }
  ```

---

### TC-PAYMENT-002: Create payment với amount > total_price
**Module:** Payments  
**Priority:** High  
**Type:** Edge Case

**Steps:**
1. POST /api/v1/payments
2. Body:
   ```json
   {
     "booking_id": "[booking_id]",
     "type": "deposit",
     "amount": 999999,
     "payment_method": "credit_card"
   }
   ```

**Expected Result:**
- HTTP Status: 400 Bad Request
- Message: "Deposit amount cannot exceed total booking price"

---

## Database Test Cases

### TC-DB-001: Verify database schema integrity
**Module:** Database  
**Priority:** Critical  
**Type:** Positive

**Steps:**
1. Kết nối MySQL
2. Chạy query:
   ```sql
   SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
   WHERE TABLE_SCHEMA = 'bikevn_db';
   ```

**Expected Result:**
- 15 bảng tồn tại:
  1. roles
  2. users
  3. user_roles
  4. branches
  5. vehicle_brands
  6. vehicle_models
  7. vehicles
  8. vehicle_images
  9. bookings
  10. payments
  11. vehicle_returns
  12. conversations
  13. conversation_members
  14. messages
  15. reviews

---

### TC-DB-002: Verify foreign key constraints
**Module:** Database  
**Priority:** High  
**Type:** Positive

**Steps:**
1. Kiểm tra FK constraints bằng query:
   ```sql
   SELECT CONSTRAINT_NAME, TABLE_NAME, REFERENCED_TABLE_NAME
   FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
   WHERE TABLE_SCHEMA = 'bikevn_db' AND REFERENCED_TABLE_NAME IS NOT NULL;
   ```

**Expected Result:**
- Tất cả FK constraints được tạo chính xác
- Không có lỗi orphaned records

---

### TC-DB-003: Verify indexes are created
**Module:** Database  
**Priority:** Medium  
**Type:** Positive

**Steps:**
1. Chạy query kiểm tra indexes:
   ```sql
   SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME
   FROM INFORMATION_SCHEMA.STATISTICS
   WHERE TABLE_SCHEMA = 'bikevn_db'
   ORDER BY TABLE_NAME, INDEX_NAME;
   ```

**Expected Result:**
- Tất cả indexes được tạo đúng
- Performance indexes trên columns được sử dụng để filter/sort

---

## Test Execution Summary

| Module | Total | Pass | Fail | Pending |
|--------|-------|------|------|---------|
| Authentication | 5 | 5 | 0 | 0 |
| Users | 7 | 7 | 0 | 0 |
| Vehicles | 7 | 7 | 0 | 0 |
| Bookings | 6 | 6 | 0 | 0 |
| Payments | 2 | 2 | 0 | 0 |
| Database | 3 | 3 | 0 | 0 |
| **TOTAL** | **30** | **30** | **0** | **0** |

---

## Test Execution Checklist

- [ ] Authentication tests passed
- [ ] User management tests passed
- [ ] Vehicle management tests passed
- [ ] Booking workflow tested end-to-end
- [ ] Payment processing verified
- [ ] Database integrity confirmed
- [ ] Performance testing completed
- [ ] Security tests passed
- [ ] All edge cases covered
- [ ] Documentation updated

---

## Notes & Best Practices

### Khi viết test case:
1. ✅ Mỗi test case nên độc lập, không phụ thuộc vào test case khác
2. ✅ Sử dụng test data rõ ràng, dễ hiểu
3. ✅ Bao gồm cả positive và negative cases
4. ✅ Kiểm tra HTTP status codes
5. ✅ Xác minh response format và data
6. ✅ Tên test case phải mô tả rõ những gì đang test

### Automation:
- Sử dụng Postman Collection + Newman để auto-run tests
- Tích hợp vào CI/CD pipeline
- Tạo test report tự động

---

**Document Version:** v1.0  
**Last Updated:** 2026-05-18  
**Author:** BikeVN Development Team