# Backend Integration Guide for Frontend

Tài liệu này cung cấp đầy đủ thông tin về backend hiện tại (Spring Boot) để Frontend (React/Vue/Angular) có thể kết nối và tích hợp chính xác.

## 1. Thông tin cấu hình cơ bản (Base Configuration)

- **Base URL:** `http://localhost:8080` (Cổng mặc định là 8080, có thể thay đổi qua biến môi trường `PORT`).
- **CORS Configuration:** Đã được cấu hình để cho phép nguồn `http://localhost:5173` gọi tất cả API (`/**`). Bạn có thể sử dụng các phương thức GET, POST, PUT, DELETE... với các header tùy ý và có hỗ trợ gửi credentials (cookies/auth headers).
- **Cơ sở dữ liệu:** MySQL (host: `localhost`, cổng mặc định: `3306`, DB: `bikevn_db`, user: `bikevn_user`, pass: `bikevn_pass`). Tất cả đều có thể cấu hình qua biến môi trường (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`...).

## 2. Chuẩn Dữ liệu trả về (Response Wrapper)

Tất cả các API trả về data đều được wrap trong một object chung là `ApiResponse<T>`. Frontend khi fetch dữ liệu cần truy cập vào `response.data.result` để lấy thông tin thực tế.

Cấu trúc JSON trả về mặc định:
```json
{
  "code": 1000, // code = 1000 mang ý nghĩa request thành công
  "message": "Thông báo (nếu có)",
  "result": {
    // Dữ liệu thực tế trả về nằm ở đây (có thể là Object hoặc Array)
  }
}
```
*Lưu ý: Nếu một thuộc tính là null, nó sẽ bị bỏ qua trong response.*

## 3. Cơ chế Xác thực (Authentication & Authorization)

Backend sử dụng **JWT (JSON Web Token)** để bảo mật các API.
- Token được lấy khi gọi API Login.
- Để gọi các API yêu cầu xác thực, Frontend cần gắn token vào header `Authorization` với định dạng:
  ```
  Authorization: Bearer <your_jwt_token>
  ```

### Các Endpoint Không Cần Xác Thực (Public Endpoints)
Dựa theo cấu hình Security, các endpoint sau đây được phép truy cập tự do:
**Method POST:**
- `/auth/login`
- `/auth/logout`
- `/auth/introspect`
- `/user` (API đăng ký user mới)
- `/role`
- `/permission`

**Method GET:**
- `/branch` (Lấy danh sách tất cả chi nhánh)
- `/branch/**` (Lấy chi tiết 1 chi nhánh)

---

## 4. Danh sách các API Endpoints Chính

### 4.1. Authentication (Xác thực) - `/auth`

* **POST `/auth/login`**: Đăng nhập.
  * **Request Body:** `{ "email": "user@example.com", "password": "yourpassword" }`
  * **Response (`result`):** `{ "token": "...", "authenticated": true }`

* **POST `/auth/logout`**: Đăng xuất.
  * **Request Body:** `{ "token": "jwt_token_here" }`
  * **Response:** Chỉ trả về message (thành công).

* **POST `/auth/introspect`**: Kiểm tra token còn hợp lệ hay không.
  * **Request Body:** `{ "token": "jwt_token_here" }`
  * **Response:** `{ "valid": true/false }`

### 4.2. User (Người dùng) - `/user`

* **POST `/user`**: Tạo người dùng mới (Customer).
* **POST `/user/employee`**: Tạo tài khoản nhân viên (Employee).
  * **Request Body (cho cả 2):**
    ```json
    {
      "name": "Tên người dùng",
      "email": "email@example.com",
      "passwordHash": "mật_khẩu_đặt", 
      "phone": "Số điện thoại",
      "cccdNumber": "Số CCCD"
    }
    ```
  * **Response (`result`):** Trả về thông tin User đã tạo.

* **GET `/user`**: Lấy danh sách tất cả user (Cần JWT).
* **GET `/user/myInfo`**: Lấy thông tin user hiện tại (đang đăng nhập) (Cần JWT).
* **GET `/user/{userId}`**: Lấy thông tin 1 user cụ thể (Cần JWT).
* **PUT `/user/{userId}`**: Cập nhật thông tin user (Cần JWT).
* **DELETE `/user/{userId}`**: Xóa user (Cần JWT).

**Cấu trúc UserResponse trả về:**
```json
{
  "id": "uuid-string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "cccdNumber": "string"
}
```

### 4.3. Vehicle (Xe cho thuê) - `/vehicle`

Tất cả các API Vehicle đều **cần JWT**. Lưu ý: Vehicle DTO hiện tại **KHÔNG** chứa trường lưu trữ hình ảnh (`imageUrl`).

* **POST `/vehicle`**: Thêm xe mới.
  * **Request Body (VehicleCreationRequest):**
    ```json
    {
      "name": "Tên xe",
      "brandId": 1, // ID của hãng xe (Integer)
      "modelId": 1, // ID của dòng xe (Integer)
      "licensePlate": "51A-12345",
      "color": "Đen",
      "year": 2024,
      "pricePerDay": 150000, 
      "vehicleType": "fuel", // "fuel" hoặc "electric" (Chữ thường)
      "mileage": 10000,
      "description": "Xe mới",
      "status": "available", // "available", "unavailable", "maintenance" (Chữ thường)
      "currentBranchId": "uuid-của-chi-nhánh"
    }
    ```

* **GET `/vehicle`**: Lấy danh sách tất cả xe.
* **GET `/vehicle/{vehicleId}`**: Lấy thông tin chi tiết xe.
* **PUT `/vehicle/{vehicleId}`**: Cập nhật thông tin xe.
  * **Lưu ý:** Gần đây đã sửa bug thiếu `@RequestBody` nên API này giờ hoạt động bình thường.
* **DELETE `/vehicle/{vehicleId}`**: Xóa xe.

**Cấu trúc VehicleResponse trả về:**
```json
{
  "id": "uuid-string",
  "name": "string",
  "brandId": 1,
  "modelId": 1,
  "licensePlate": "string",
  "color": "string",
  "year": 2024,
  "pricePerDay": 150000,
  "vehicleType": "fuel",
  "mileage": 10000,
  "description": "string",
  "status": "available",
  "currentBranchId": "uuid-của-chi-nhánh",
  "createdAt": "2024-05-28T10:00:00",
  "updatedAt": "2024-05-28T10:00:00"
}
```

### 4.4. Branch (Chi nhánh) - `/branch`

Quản lý chi nhánh. Các API GET là Public. POST/PUT/DELETE yêu cầu JWT.

* **POST `/branch`**: Thêm chi nhánh mới.
  * **Request Body (BranchCreationRequest):**
    ```json
    {
      "name": "Tên chi nhánh",
      "address": "Địa chỉ",
      "lat": 10.762622, // BigDecimal
      "lng": 106.660172, // BigDecimal
      "status": "active" // "active" hoặc "inactive"
    }
    ```

* **GET `/branch`**: Lấy danh sách tất cả chi nhánh (Public).
* **GET `/branch/{branchId}`**: Lấy thông tin chi tiết chi nhánh (Public).
* **PUT `/branch/{branchId}`**: Cập nhật thông tin chi nhánh.
  * **Request Body (BranchUpdateRequest):** Giống hệt BranchCreationRequest.
* **DELETE `/branch/{branchId}`**: Xóa chi nhánh.

**Cấu trúc BranchResponse trả về:**
```json
{
  "id": "uuid-string",
  "name": "string",
  "address": "string",
  "lat": 10.762622,
  "lng": 106.660172,
  "status": "active"
}
```

## 5. Lưu ý dành cho Frontend
- Các enum truyền thống như `RoleEnum` thường nhận string in hoa (VD: `"ADMIN"`, `"USER"`). Tuy nhiên, **riêng các trường `vehicleType` và `status` của xe đã được backend đổi thành string chữ thường** (VD: `"fuel"`, `"electric"`, `"available"`, `"maintenance"`). Tương tự, `status` của Branch cũng là chữ thường (`"active"`, `"inactive"`). Frontend cần chú ý map chính xác kiểu chữ (case-sensitive) khi gửi Request.
- Việc xử lý Validation Error (VD: Mật khẩu ngắn, tên để trống...) sẽ làm cho `ApiResponse` trả về `code` khác 1000 kèm theo `message` giải thích chi tiết, frontend cần bắt (catch) và hiển thị thông báo thân thiện cho user dựa theo biến `code` hoặc `message`.
