# Backend Integration Guide for Frontend

Tài liệu này cung cấp đầy đủ thông tin về backend hiện tại (Spring Boot) để Frontend (React/Vue/Angular chạy ở cổng `5173`) có thể kết nối và tích hợp mượt mà.

## 1. Thông tin cấu hình cơ bản (Base Configuration)

- **Base URL:** `http://localhost:8080` (Backend chạy ở cổng 8080).
- **CORS Configuration:** Đã được cấu hình để cho phép nguồn `http://localhost:5173` gọi API. Bạn có thể sử dụng các phương thức GET, POST, PUT, DELETE... với các header tùy ý và có hỗ trợ gửi credentials (cookies/auth headers).
- **Cơ sở dữ liệu:** MySQL (`bikevn_db` - cổng `3307`).

## 2. Chuẩn Dữ liệu trả về (Response Wrapper)

Tất cả các API trả về data đều được wrap trong một object chung là `ApiResponse<T>`. Frontend khi fetch dữ liệu cần truy cập vào `response.data.result` để lấy thông tin thực tế.

Cấu trúc JSON trả về mặc định:
```json
{
  "code": 1000, // code = 1000 thường mang ý nghĩa thành công
  "message": "Thông báo (nếu có)",
  "result": {
    // Dữ liệu thực tế trả về nằm ở đây (có thể là Object hoặc Array)
  }
}
```
*Lưu ý: Nếu một thuộc tính là null, nó sẽ bị bỏ qua trong response (nhờ cấu hình `@JsonInclude(JsonInclude.Include.NON_NULL)`).*

## 3. Cơ chế Xác thực (Authentication & Authorization)

Backend sử dụng **JWT (JSON Web Token)** để bảo mật các API.
- Token được lấy khi gọi API Login.
- Để gọi các API yêu cầu xác thực (Authenticated), Frontend cần gắn token vào header `Authorization` với định dạng:
  ```
  Authorization: Bearer <your_jwt_token>
  ```

### Các Endpoint Không Cần Xác Thực (Public Endpoints - Method POST)
Dựa theo cấu hình Security, các endpoint với phương thức **POST** sau đây được phép truy cập tự do:
- `/auth/login`
- `/auth/logout`
- `/auth/introspect`
- `/user` (API đăng ký user mới)
- `/role`
- `/permission`
*(Các method khác như GET trên các endpoint này vẫn yêu cầu xác thực).*

---

## 4. Danh sách các API Endpoints Chính

### 4.1. Authentication (Xác thực) - `/auth`

* **POST `/auth/login`**: Đăng nhập.
  * **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
  * **Response (`result`):**
    ```json
    {
      "token": "eyJhbG...",
      "authenticated": true
    }
    ```

* **POST `/auth/logout`**: Đăng xuất.
  * **Request Body:** `{ "token": "jwt_token_here" }`
  * **Response:** Chỉ trả về message (thành công).

* **POST `/auth/introspect`**: Kiểm tra token còn hợp lệ hay không.
  * **Request Body:** `{ "token": "jwt_token_here" }`
  * **Response:** `{ "valid": true/false }`

### 4.2. User (Người dùng) - `/user`

* **POST `/user`**: Tạo người dùng mới (Đăng ký).
  * **Request Body:**
    ```json
    {
      "name": "Tên người dùng",
      "email": "email@example.com",
      "passwordHash": "mật_khẩu_đặt", // tối thiểu 6 ký tự
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

Tất cả các API Vehicle đều **cần JWT**.

* **POST `/vehicle`**: Thêm xe mới.
  * **Request Body:**
    ```json
    {
      "name": "Tên xe",
      "licensePlate": "Biển số",
      "color": "Màu sắc",
      "year": 2023,
      "pricePerDay": 150000, // Kiểu số thập phân
      "vehicleType": "SCOOTER", // (Enum: Cần check thêm các giá trị enum)
      "mileage": 10000,
      "description": "Mô tả",
      "status": "AVAILABLE", // (Enum: StatusVehicleEnum)
      "currentBranchId": "id-của-chi-nhánh"
    }
    ```

* **GET `/vehicle`**: Lấy danh sách tất cả xe.
* **GET `/vehicle/{vehicleId}`**: Lấy thông tin chi tiết xe.
* **PUT `/vehicle/{vehicleId}`**: Cập nhật thông tin xe.
* **DELETE `/vehicle/{vehicleId}`**: Xóa xe.

**Cấu trúc VehicleResponse trả về:**
```json
{
  "id": "uuid-string",
  "name": "string",
  "licensePlate": "string",
  "color": "string",
  "year": 2023,
  "pricePerDay": 150000,
  "vehicleType": "SCOOTER",
  "mileage": 10000,
  "description": "string",
  "status": "AVAILABLE",
  "createdAt": "2023-10-20T10:00:00",
  "updatedAt": "2023-10-20T10:00:00"
}
```

## 5. Lưu ý dành cho Frontend
- Các enum như `VehicleType`, `StatusVehicleEnum`, `RoleEnum` sẽ nhận các string có giá trị tương ứng bên backend (VD: `"ADMIN"`, `"USER"`, `"AVAILABLE"`...). Frontend nên sử dụng đúng định dạng in hoa này khi truyền vào request body.
- Việc xử lý Validation Error (VD: Mật khẩu ngắn, tên để trống...) sẽ làm cho `ApiResponse` trả về `code` khác 1000 kèm theo `message` giải thích chi tiết, frontend cần bắt (catch) và hiển thị thân thiện cho user dựa theo biến `code` hoặc `message`.
