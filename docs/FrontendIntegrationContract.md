# TÀI LIỆU TÍCH HỢP HỆ THỐNG BACKEND (BIKEVN)
> Tài liệu hướng dẫn chi tiết dành riêng cho Frontend Developer để tích hợp API mà không cần đọc mã nguồn Backend.

---

## 📌 MỤC LỤC
1. [Thông tin chung & Cấu hình môi trường](#1-thông-tin-chung--cấu-hình-môi-trường)
2. [Quy chuẩn giao tiếp API (API Protocol)](#2-quy-chuẩn-giao-tiếp-api-api-protocol)
3. [Danh sách các Enum hệ thống (System Enums)](#3-danh-sách-các-enum-hệ-thống-system-enums)
4. [Danh sách mã lỗi chi tiết (Error Code Reference)](#4-danh-sách-mã-lỗi-chi-tiết-error-code-reference)
5. [Tài liệu chi tiết API Endpoints](#5-tài-liệu-chi-tiết-api-endpoints)
    - [Authentication Controller (`/auth`)](#51-authentication-controller-auth)
    - [User Controller (`/user`)](#52-user-controller-user)
    - [Vehicle Controller (`/vehicle`)](#53-vehicle-controller-vehicle)
    - [Booking Controller (`/booking`)](#54-booking-controller-booking)
    - [Payment Controller (`/payments`)](#55-payment-controller-payments)
    - [Branch Controller (`/branch`)](#56-branch-controller-branch)
    - [Vehicle Brand Controller (`/brand`)](#57-vehicle-brand-controller-brand)
    - [Vehicle Model Controller (`/model`)](#58-vehicle-model-controller-model)
    - [Role & Permission Controller (`/role`, `/permission`)](#59-role--permission-controller-role-permission)
6. [Mẫu cấu hình API Client trên Frontend (Axios Interceptors)](#6-mẫu-cấu-hình-api-client-trên-frontend-axios-interceptors)

---

## 1. THÔNG TIN CHUNG & CẤU HÌNH MÔI TRƯỜNG

### Môi trường chạy cục bộ (Local Development)
* **Base URL mặc định:** `http://localhost:8080`
* **Cấu hình CORS (Được phép gọi API từ các cổng sau):**
  * `http://localhost:5173` (Dành cho **User Client**)
  * `http://localhost:5174` (Dành cho **Admin Portal**)
  * `http://localhost:5175` (Dành cho **Employee Portal**)
* **Thư mục lưu trữ hình ảnh tải lên (Static Uploads):**
  * Backend cấu hình tải hình ảnh tĩnh qua endpoint: `/uploads/**`
  * Đường dẫn tuyệt đối để hiển thị hình ảnh trên giao diện:
    `http://localhost:8080/uploads/{tên_file_ảnh}`

> [!IMPORTANT]
> **Tài khoản Admin mặc định chạy thử (Seed Data):**
> * **Email:** `admin@gmail.com`
> * **Mật khẩu:** `admin`
> * **Vai trò (Role):** `admin`

---

## 2. QUY CHUẨN GIAO TIẾP API (API PROTOCOL)

### 2.1 Định dạng Response chung (ApiResponse Envelope)
Tất cả các API của hệ thống đều trả về một cấu trúc dữ liệu chuẩn như dưới đây (kể cả khi thành công hoặc gặp lỗi):

```json
{
  "code": 1000,
  "message": "Thông điệp thành công hoặc mô tả lỗi (nếu có)",
  "result": { ... } // Payload dữ liệu thực tế (đối tượng hoặc danh sách), sẽ bằng null hoặc không xuất hiện nếu code != 1000
}
```

* **Thành công:** `code` luôn trả về **`1000`**. Dữ liệu thực tế nằm trong trường `result`.
* **Thất bại:** `code` trả về mã lỗi cụ thể (xem ở bảng lỗi mục 4). Trường `result` thường là `null` hoặc không có.

### 2.2 Cơ chế Xác thực (Authentication)
* Hệ thống sử dụng **JWT (JSON Web Token)** để bảo mật.
* Sau khi đăng nhập thành công qua `/auth/login`, bạn nhận được một `token`.
* **Cách gửi token từ Frontend:** Đính kèm token vào tiêu đề HTTP (Request Headers) của mỗi yêu cầu cần xác thực dưới dạng:
  ```http
  Authorization: Bearer <your_jwt_token>
  ```

---

## 3. DANH SÁCH CÁC ENUM HỆ THỐNG (SYSTEM ENUMS)
Frontend cần gửi chính xác các chuỗi ký tự sau khi tương tác với dữ liệu dạng lựa chọn:

### 3.1 RoleEnum (Vai trò người dùng)
* `user`: Khách hàng thuê xe.
* `admin`: Quản trị viên hệ thống.
* `employee`: Nhân viên cửa hàng/chi nhánh.

### 3.2 BookingStatus (Trạng thái đơn thuê xe)
* `pending`: Đơn đặt mới đang chờ duyệt/chờ xử lý.
* `approved`: Đơn đã được duyệt, xe sẵn sàng bàn giao.
* `rejected`: Đơn bị từ chối duyệt.
* `completed`: Đơn hoàn tất thành công (khách đã trả xe đầy đủ).
* `cancelled`: Đơn đã bị hủy bởi khách hoặc nhân viên.

### 3.3 BookingLockEnum (Trạng thái khóa xe tạm thời lúc đặt)
* `active`: Khóa đang có hiệu lực (đang giữ xe cho khách thanh toán).
* `released`: Khóa đã được giải phóng (hủy hoặc hoàn tất giao dịch).
* `expired`: Khóa hết hạn giữ xe.

### 3.4 BranchStatus (Trạng thái chi nhánh)
* `active`: Đang hoạt động.
* `inactive`: Tạm dừng hoạt động.

### 3.5 PaymentStatus (Trạng thái giao dịch thanh toán)
* `pending`: Chờ người dùng thanh toán.
* `completed`: Thanh toán thành công.
* `failed`: Thanh toán thất bại.

### 3.6 PaymentType (Loại thanh toán)
* `deposit`: Tiền đặt cọc xe.
* `rental`: Tiền thuê xe thực tế.

### 3.7 StatusVehicleEnum (Trạng thái xe máy)
* `available`: Sẵn sàng cho thuê.
* `unavailable`: Không sẵn sàng (đang được thuê hoặc bị khóa tạm thời).
* `maintenance`: Đang bảo trì, sửa chữa.

### 3.8 VehicleType (Loại động cơ xe)
* `fuel`: Xe chạy xăng.
* `electric`: Xe chạy điện.

---

## 4. DANH SÁCH MÃ LỖI CHI TIẾT (ERROR CODE REFERENCE)
Khi nhận phản hồi có `code != 1000`, Frontend đối chiếu mã `code` này để hiển thị thông báo lỗi thân thiện cho khách hàng:

| Mã lỗi (`code`) | Thông điệp lỗi hệ thống | HTTP Status | Giải thích / Gợi ý xử lý ở Frontend |
| :--- | :--- | :--- | :--- |
| **9999** | Uncategorized Exception | `500 Internal Server Error` | Lỗi máy chủ không xác định. Hiển thị: "Lỗi hệ thống, vui lòng thử lại sau." |
| **1001** | Invalid key | `400 Bad Request` | Khoá truyền vào không hợp lệ. |
| **1002** | User existed | `400 Bad Request` | Email đã được đăng ký trước đó. Hiển thị: "Email này đã tồn tại trên hệ thống." |
| **1003** | User not existed | `404 Not Found` | Không tìm thấy người dùng. Hiển thị: "Tài khoản không tồn tại." |
| **1004** | Invalid password | `400 Bad Request` | Mật khẩu không chính xác khi đăng nhập. |
| **1005** | Vehicle not existed | `404 Not Found` | Xe không tồn tại trong hệ thống. |
| **1006** | Brand not existed | `404 Not Found` | Hãng xe không tồn tại. |
| **1007** | Model not existed | `404 Not Found` | Dòng xe không tồn tại. |
| **1008** | Branch not existed | `404 Not Found` | Chi nhánh không tồn tại. |
| **1009** | Branch existed | `400 Bad Request` | Tên hoặc thông tin chi nhánh đã tồn tại. |
| **1010** | Model existed | `400 Bad Request` | Dòng xe đã tồn tại. |
| **1011** | Brand existed | `400 Bad Request` | Hãng xe đã tồn tại. |
| **1012** | File upload failed | `400 Bad Request` | Lỗi tải ảnh lên máy chủ (sai định dạng, quá dung lượng...). |
| **1013** | Invalid time | `400 Bad Request` | Khoảng thời gian đặt thuê xe không hợp lệ (ví dụ: ngày kết thúc trước ngày bắt đầu). |
| **1014** | Booking not found / Payment not found / Payment expired | `404 Not Found` hoặc `400` | Không tìm thấy đơn đặt xe / Giao dịch thanh toán hoặc Giao dịch đã hết hạn. |
| **1015** | Booking completed | `400 Bad Request` | Đơn thuê xe đã hoàn thành, không thể thao tác thêm. |
| **1016** | duplicate payment | `400 Bad Request` | Đơn này đã được thanh toán rồi, không thực hiện lại. |
| **1017** | conflict booking time | `400 Bad Request` | Xe đã bị người khác đặt trùng trong khoảng thời gian này. Hiển thị: "Xe đã có lịch bận trong thời gian bạn chọn." |
| **1018** | vehicle already locked | `403 Forbidden` | Xe đang được khóa giữ chỗ cho phiên đặt của người khác. |
| **1019** | lock not found | `404 Not Found` | Không tìm thấy thông tin phiên khóa giữ chỗ xe. |
| **1020** | booking expired | `400 Bad Request` | Đơn đặt xe đã quá hạn thanh toán đặt cọc nên bị hủy. |
| **1021** | payment completed | `400 Bad Request` | Giao dịch thanh toán đã hoàn thành. |
| **5555** | Unauthenticated | `401 Unauthorized` | Token không hợp lệ hoặc đã hết hạn. **Frontend cần điều hướng người dùng về trang Đăng nhập.** |
| **5050** | You don't have permission | `403 Forbidden` | Tài khoản không có quyền gọi API này (Ví dụ: `user` gọi API của `admin`). |
| **5055** | %s already exists | `400 Bad Request` | Dữ liệu trùng lặp trong cơ sở dữ liệu. |

---

## 5. TÀI LIỆU CHI TIẾT API ENDPOINTS

### 5.1 Authentication Controller (`/auth`)
*Nhóm API quản lý đăng nhập, kiểm tra và đăng xuất.*

#### 🔓 POST `/auth/login` (Công khai - Public)
* Đăng nhập hệ thống để lấy Token.
* **Request Body (`AuthenticationRequest`):**
  ```json
  {
    "email": "user@gmail.com",
    "password": "mypassword"
  }
  ```
* **Response `result` (`AuthenticationResponse`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
    "authenticated": true
  }
  ```

#### 🔓 POST `/auth/logout` (Công khai - Public)
* Đăng xuất hệ thống (hủy token ở backend).
* **Request Body (`LogoutRequest`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
  }
  ```
* **Response:** Chỉ trả về `code` và `message` thành công (không có trường `result`).

#### 🔓 POST `/auth/introspect` (Công khai - Public)
* Kiểm tra nhanh xem Token còn hạn và hợp lệ hay không.
* **Request Body (`IntrospectRequest`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
  }
  ```
* **Response `result` (`IntrospectResponse`):**
  ```json
  {
    "valid": true // hoặc false nếu hết hạn/không hợp lệ
  }
  ```

#### 🔓 GET `/auth/test` (Công khai - Public)
* Dùng để kiểm tra nhanh kết nối giữa Frontend và Backend.
* **Response:** Trả về chuỗi `"Test controller ok!"` (Dạng text thuần).

---

### 5.2 User Controller (`/user`)
*Quản lý tài khoản người dùng, nhân viên và thông tin cá nhân.*

> [!WARNING]
> **Lưu ý đặc biệt quan trọng về tên trường mật khẩu:**
> * Khi **Tạo tài khoản** (`POST /user`), trường mật khẩu bắt buộc phải đặt tên là: **`passwordHash`**
> * Khi **Cập nhật tài khoản** (`PUT /user/{userId}`), trường mật khẩu bắt buộc phải đặt tên là: **`password`**

#### 🔓 POST `/user` (Công khai - Public)
* Đăng ký tài khoản khách hàng mới.
* **Request Body (`UserCreationRequest`):**
  ```json
  {
    "name": "Nguyen Van A",
    "email": "nva@gmail.com",
    "passwordHash": "123456", // Độ dài tối thiểu 6 ký tự
    "phone": "0987654321",
    "cccdNumber": "012345678901"
  }
  ```
* **Response `result` (`UserResponse`):**
  ```json
  {
    "id": "e83a79d0-1e5b-4229-87a4-bb9e14a1c5d3", // UUID String
    "name": "Nguyen Van A",
    "email": "nva@gmail.com",
    "phone": "0987654321",
    "cccdNumber": "012345678901"
  }
  ```

#### 🔒 POST `/user/employee` (Yêu cầu Token - Quyền Admin)
* Tạo mới tài khoản nhân viên.
* **Request Body (`UserCreationRequest`):** (Cấu trúc giống Đăng ký User).
* **Response `result` (`UserResponse`):** Chi tiết nhân viên vừa tạo.

#### 🔒 GET `/user` (Yêu cầu Token)
* Lấy danh sách toàn bộ người dùng trong hệ thống.
* **Response `result`:** `List<UserResponse>` (Mảng các đối tượng User).

#### 🔒 GET `/user/myInfo` (Yêu cầu Token)
* Lấy thông tin cá nhân của tài khoản đang đăng nhập (dựa trên JWT gửi kèm trong header).
* **Response `result` (`UserResponse`):** Thông tin người dùng hiện tại.

#### 🔒 GET `/user/{userId}` (Yêu cầu Token)
* Lấy thông tin chi tiết một người dùng bất kỳ qua ID.
* **Response `result` (`UserResponse`).**

#### 🔒 PUT `/user/{userId}` (Yêu cầu Token)
* Cập nhật thông tin cá nhân.
* **Request Body (`UserUpdateRequest`):**
  ```json
  {
    "name": "Nguyen Van A Cập Nhật",
    "email": "nva_new@gmail.com",
    "password": "newpassword123", // Chú ý: Ở đây là "password", không phải "passwordHash"
    "phone": "0987654322",
    "cccdNumber": "012345678901"
  }
  ```
* **Response `result` (`UserResponse`).**

#### 🔒 DELETE `/user/{userId}` (Yêu cầu Token - Quyền Admin)
* Xóa người dùng khỏi hệ thống.
* **Response:** Trả về thông điệp `"User Deleted"`.

---

### 5.3 Vehicle Controller (`/vehicle`)
*Quản lý danh sách xe máy và hình ảnh đi kèm.*

#### 🔓 GET `/vehicle` (Công khai - Public)
* Lấy danh sách tất cả các xe đang có trong hệ thống (bao gồm cả mảng hình ảnh đính kèm của mỗi xe).
* **Response `result`:** Mảng chứa nhiều đối tượng `VehicleResponse`.
  ```json
  [
    {
      "id": "v-uuid-1",
      "name": "Honda Vision 2023",
      "brandId": 1,
      "modelId": 2,
      "licensePlate": "29D1-12345",
      "color": "Đỏ Đen",
      "year": 2023,
      "pricePerDay": 150000.00,
      "vehicleType": "fuel",
      "mileage": 12000,
      "description": "Xe chạy êm, tiết kiệm xăng",
      "status": "available",
      "currentBranchId": "branch-uuid-1",
      "images": [
        {
          "id": "img-uuid-1",
          "vehicleId": "v-uuid-1",
          "imageUrl": "/uploads/vision2023_primary.jpg",
          "altText": "Honda Vision 2023 Mặt trước",
          "displayOrder": 1,
          "isPrimary": true,
          "createdAt": "2026-06-07T10:00:00"
        }
      ],
      "createdAt": "2026-06-07T09:00:00",
      "updatedAt": "2026-06-07T09:30:00"
    }
  ]
  ```

#### 🔓 GET `/vehicle/{vehicleId}` (Công khai - Public)
* Chi tiết một chiếc xe cụ thể qua ID.
* **Response `result` (`VehicleResponse`).**

#### 🔒 POST `/vehicle` (Yêu cầu Token - Quyền Admin/Employee)
* Tạo mới một xe máy.
* **Request Body (`VehicleCreationRequest`):**
  ```json
  {
    "name": "Honda Air Blade 160",
    "brandId": 1,
    "modelId": 3,
    "licensePlate": "29E1-99999",
    "color": "Xám Xi Măng",
    "year": 2024,
    "pricePerDay": 200000.00,
    "vehicleType": "fuel",
    "mileage": 1500,
    "description": "Xe thể thao mạnh mẽ",
    "status": "available",
    "currentBranchId": "branch-uuid-1"
  }
  ```
* **Response `result` (`VehicleResponse`).**

#### 🔒 PUT `/vehicle/{vehicleId}` (Yêu cầu Token - Quyền Admin/Employee)
* Cập nhật thông tin xe máy.
* **Request Body (`VehicleUpdateRequest`):**
  > [!NOTE]
  > Khác với lúc tạo, API Cập nhật xe **không** nhận thuộc tính `currentBranchId`. Chi nhánh hiện tại của xe được cập nhật thông qua quá trình bàn giao nhận xe ở Đơn thuê.
  ```json
  {
    "name": "Honda Air Blade 160 Cập Nhật",
    "brandId": 1,
    "modelId": 3,
    "licensePlate": "29E1-99999",
    "color": "Đen Nhám",
    "year": 2024,
    "pricePerDay": 220000.00,
    "vehicleType": "fuel",
    "mileage": 2000,
    "description": "Xe thể thao đã được bảo dưỡng",
    "status": "available"
  }
  ```
* **Response `result` (`VehicleResponse`).**

#### 🔒 DELETE `/vehicle/{vehicleId}` (Yêu cầu Token - Quyền Admin)
* Xoá xe khỏi hệ thống.
* **Response:** Thông điệp `"Vehicle deleted"`.

---

#### 🖼️ CÁC API QUẢN LÝ ẢNH XE MÁY (`/vehicle/{vehicleId}/images`)
Các API chỉnh sửa ảnh cần được gửi dưới dạng **`multipart/form-data`**:

##### 🔒 POST `/vehicle/{vehicleId}/images` (Yêu cầu Token)
* Thêm một hình ảnh mới cho xe.
* **Request Headers:** `Content-Type: multipart/form-data`
* **Form-Data Params:**
  * `file`: Tệp tin ảnh thực tế (Required - Multipart File)
  * `altText`: Chuỗi mô tả ảnh (Optional - String)
  * `displayOrder`: Thứ tự hiển thị của ảnh (Optional - Integer)
  * `isPrimary`: Đặt làm ảnh đại diện chính hiển thị ngoài danh sách (Optional - Boolean, e.g. `true`/`false`)
* **Response `result` (`VehicleImageResponse`):** Đối tượng ảnh vừa lưu, bao gồm trường `imageUrl` dùng để hiển thị ảnh trên frontend.

##### 🔓 GET `/vehicle/{vehicleId}/images` (Công khai - Public)
* Lấy danh sách toàn bộ ảnh của một xe cụ thể.
* **Response `result`:** Mảng `List<VehicleImageResponse>`.

##### 🔒 PUT `/vehicle/{vehicleId}/images/{imageId}` (Yêu cầu Token)
* Cập nhật thông tin hoặc thay thế tệp ảnh cũ.
* **Request Headers:** `Content-Type: multipart/form-data`
* **Form-Data Params:**
  * `file`: Tệp tin ảnh mới (Optional - gửi nếu muốn thay thế ảnh)
  * `altText`: Mô tả mới (Optional)
  * `displayOrder`: Thứ tự mới (Optional)
  * `isPrimary`: Có đặt làm ảnh chính hay không (Optional)
* **Response `result` (`VehicleImageResponse`).**

##### 🔒 DELETE `/vehicle/{vehicleId}/images/{imageId}` (Yêu cầu Token)
* Xoá ảnh của xe.
* **Response:** Thông điệp `"Vehicle image deleted"`.

---

### 5.4 Booking Controller (`/booking`)
*Quản lý toàn bộ vòng đời thuê xe (đặt giữ xe, duyệt, hủy).*

#### 🔒 POST `/booking` (Yêu cầu Token)
* Tạo đơn thuê xe mới (hệ thống sẽ kiểm tra trùng lịch và tự động tính tổng tiền ở backend).
* **Request Body (`BookingCreationRequest`):**
  ```json
  {
    "userId": "e83a79d0-1e5b-4229-87a4-bb9e14a1c5d3",
    "vehicleId": "v-uuid-1",
    "pickupBranchId": "branch-uuid-1",
    "returnBranchId": "branch-uuid-2",
    "startTime": "2026-06-10T08:00:00", // Định dạng chuỗi ISO-8601
    "endTime": "2026-06-12T17:00:00"
  }
  ```
* **Response `result` (`BookingResponse`):**
  ```json
  {
    "id": "booking-uuid-99",
    "userId": "e83a79d0-1e5b-4229-87a4-bb9e14a1c5d3",
    "vehicleId": "v-uuid-1",
    "pickupBranchId": "branch-uuid-1",
    "returnBranchId": "branch-uuid-2",
    "startTime": "2026-06-10T08:00:00",
    "endTime": "2026-06-12T17:00:00",
    "actualReturnTime": null, // Sẽ được cập nhật khi hoàn tất trả xe
    "totalPrice": 350000.00, // Tự động tính dựa vào đơn giá xe và thời gian đặt
    "status": "pending", // Enum BookingStatus
    "createdAt": "2026-06-07T16:00:00",
    "updatedAt": "2026-06-07T16:00:00"
  }
  ```

#### 🔒 GET `/booking/{id}` (Yêu cầu Token)
* Xem chi tiết một đơn thuê xe cụ thể.
* **Response `result` (`BookingResponse`).**

#### 🔒 GET `/booking` (Yêu cầu Token)
* Lấy danh sách tất cả các đơn thuê xe của toàn hệ thống (Dành cho Admin/Nhân viên).
* **Response `result`:** Mảng `List<BookingResponse>`.

#### 🔒 GET `/booking/user/{userId}` (Yêu cầu Token)
* Lấy danh sách lịch sử thuê xe của một khách hàng cụ thể.
* **Response `result`:** Mảng `List<BookingResponse>`.

#### 🔒 POST `/booking/{id}/cancel` (Yêu cầu Token)
* Hủy đơn thuê xe.
* **Response:** Thông điệp `"Booking canceled"`.

---

### 5.5 Payment Controller (`/payments`)
*Xử lý thanh toán hoá đơn bằng phương thức giả lập quét mã QR ngân hàng.*

#### 🔒 POST `/payments` (Yêu cầu Token)
* Tạo phiên thanh toán mới cho đơn đặt xe. Trả về thông tin tài khoản ngân hàng và dữ liệu mã QR để Frontend hiển thị cho khách quét thanh toán.
* **Request Body (`PaymentCreationRequest`):**
  ```json
  {
    "bookingId": "booking-uuid-99",
    "amount": 100000.00, // Số tiền muốn thanh toán
    "paymentMethod": "Bank Transfer", // Thường truyền "Bank Transfer" hoặc "QR"
    "transactionCode": "TX1029384", // Mã tham chiếu (nếu có)
    "idempotencyKey": "unique-uuid-key-to-avoid-duplicate" // UUID ngẫu nhiên để tránh lỗi submit 2 lần trùng lặp
  }
  ```
* **Response `result` (`PaymentResponse`):**
  ```json
  {
    "id": "pm-uuid-123",
    "bookingId": "booking-uuid-99",
    "amount": 100000.00,
    "type": "deposit", // 'deposit' (đặt cọc) hoặc 'rental' (thanh toán thuê)
    "paymentMethod": "Bank Transfer",
    "status": "pending", // Enum PaymentStatus
    "bankName": "VietinBank", // Thông tin cấu hình nhận tiền của hệ thống
    "bankAccount": "10987654321",
    "accountName": "CONG TY TNHH BIKEVN",
    "transferContent": "BIKEVN booking-uuid-99",
    "qrContent": "00020101021238540010A000000727...", // Chuỗi VietQR thô. Dùng thư viện ở frontend (như qrcode.react) để vẽ QR từ chuỗi này
    "createdAt": "2026-06-07T16:05:00"
  }
  ```

#### 🔒 GET `/payments` (Yêu cầu Token - Quyền Admin/Employee)
* Phân trang danh sách toàn bộ các giao dịch thanh toán trong hệ thống.
* **Các tham số truy vấn (Query Params):**
  * `status`: Lọc theo trạng thái giao dịch (`pending`, `completed`, `failed` - Không bắt buộc)
  * `page`: Trang hiện tại (Mặc định: `0` - trang đầu)
  * `size`: Số lượng bản ghi trên một trang (Mặc định: `10`)
* **Response `result` (`Page<PaymentResponse>`):**
  Hệ thống trả về đối tượng phân trang chuẩn của Spring Boot:
  ```json
  {
    "content": [
      { "id": "pm-uuid-123", "bookingId": "booking-uuid-99", "amount": 100000.00, ... }
    ],
    "pageable": { ... },
    "totalPages": 5,
    "totalElements": 48,
    "last": false,
    "size": 10,
    "number": 0,
    "numberOfElements": 10,
    "first": true,
    "empty": false
  }
  ```

#### 🔒 GET `/payments/{id}` (Yêu cầu Token)
* Xem chi tiết một giao dịch thanh toán cụ thể.
* **Response `result` (`PaymentResponse`).**

#### 🔒 POST `/payments/{id}/confirm` (Yêu cầu Token - Cổng giả lập biến động số dư)
* API dùng để giả lập khi ngân hàng gửi thông báo đã nhận được tiền. Sử dụng ở các màn hình quản lý của Admin/Nhân viên hoặc dùng để Mock giao dịch thanh toán thành công trên Frontend.
* **Đường dẫn chứa tham số:** `/payments/{id}/confirm?transactionCode=MÃ_GIAO_DỊCH_NHÀ_MẠNG`
* **Response:** Chỉ trả về thông điệp `"Confirm!!!"`.

---

### 5.6 Branch Controller (`/branch`)
*Xem danh sách các điểm thuê/trả xe của hệ thống.*

#### 🔓 GET `/branch` (Công khai - Public)
* Lấy danh sách toàn bộ các chi nhánh/địa điểm của hệ thống.
* **Response `result`:** Mảng `List<BranchResponse>`.
  ```json
  [
    {
      "id": "branch-uuid-1",
      "name": "Chi nhánh Quận 1",
      "address": "120 Lê Lợi, Bến Thành, Quận 1, TP. HCM",
      "lat": 10.771234,
      "lng": 106.691234,
      "status": "active"
    }
  ]
  ```

#### 🔓 GET `/branch/{branchId}` (Công khai - Public)
* Xem chi tiết một chi nhánh qua ID.
* **Response `result` (`BranchResponse`).**

#### 🔒 POST `/branch` (Yêu cầu Token - Quyền Admin)
* Tạo mới chi nhánh.
* **Request Body (`BranchCreationRequest`):**
  ```json
  {
    "name": "Chi nhánh Cầu Giấy",
    "address": "234 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội",
    "lat": 21.036231,
    "lng": 105.790123,
    "status": "active" // Enum BranchStatus
  }
  ```
* **Response `result` (`BranchResponse`).**

#### 🔒 PUT `/branch/{branchId}` (Yêu cầu Token - Quyền Admin)
* Cập nhật thông tin chi nhánh.
* **Request Body (`BranchUpdateRequest`):** (Cấu trúc tương tự tạo mới).
* **Response `result` (`BranchResponse`).**

#### 🔒 DELETE `/branch/{branchId}` (Yêu cầu Token - Quyền Admin)
* Xóa chi nhánh.
* **Response:** Thông điệp `"Branch deleted"`.

---

### 5.7 Vehicle Brand Controller (`/brand`)
*Quản lý hãng sản xuất xe (Ví dụ: Honda, Yamaha).*

#### 🔓 GET `/brand` (Công khai - Public)
* Lấy danh sách toàn bộ hãng xe.
* **Response `result`:** Mảng `List<VehicleBrandResponse>`.
  ```json
  [
    {
      "id": 1, // Kiểu Integer tự tăng (Auto increment)
      "name": "Honda",
      "country": "Japan",
      "createdAt": "2026-06-07T09:00:00"
    }
  ]
  ```

#### 🔓 GET `/brand/{brandId}` (Công khai - Public)
* Lấy thông tin chi tiết hãng xe qua ID.
* **Response `result` (`VehicleBrandResponse`).**

#### 🔒 POST `/brand` (Yêu cầu Token - Quyền Admin)
* Tạo hãng xe mới.
* **Request Body (`VehicleBrandCreationRequest`):**
  ```json
  {
    "name": "Yamaha",
    "country": "Japan"
  }
  ```
* **Response `result` (`VehicleBrandResponse`).**

#### 🔒 PUT `/brand/{brandId}` (Yêu cầu Token - Quyền Admin)
* Cập nhật thông tin hãng xe.
* **Request Body (`VehicleBrandUpdateRequest`):**
  ```json
  {
    "name": "Yamaha Motor Việt Nam",
    "country": "Japan"
  }
  ```
* **Response `result` (`VehicleBrandResponse`).**

#### 🔒 DELETE `/brand/{brandId}` (Yêu cầu Token - Quyền Admin)
* Xóa hãng xe.
* **Response:** Thông điệp `"Brand deleted"`.

---

### 5.8 Vehicle Model Controller (`/model`)
*Quản lý dòng xe (Ví dụ: Vision, Air Blade, Exciter).*

#### 🔓 GET `/model` (Công khai - Public)
* Lấy toàn bộ danh sách các dòng xe.
* **Response `result`:** Mảng `List<VehicleModelResponse>`.
  ```json
  [
    {
      "id": 1, // Kiểu Integer tự tăng
      "brandId": 1,
      "name": "Vision",
      "engineCapacity": 110, // dung tích xi lanh
      "yearFrom": 2020,
      "yearTo": 2024,
      "createdAt": "2026-06-07T09:00:00"
    }
  ]
  ```

#### 🔓 GET `/model/{modelId}` (Công khai - Public)
* Lấy thông tin dòng xe qua ID.
* **Response `result` (`VehicleModelResponse`).**

#### 🔒 POST `/model` (Yêu cầu Token - Quyền Admin)
* Tạo mới dòng xe.
* **Request Body (`VehicleModelCreationRequest`):**
  ```json
  {
    "brandId": 1,
    "name": "Air Blade 125",
    "engineCapacity": 125,
    "yearFrom": 2021,
    "yearTo": 2024
  }
  ```
* **Response `result` (`VehicleModelResponse`).**

#### 🔒 PUT `/model/{modelId}` (Yêu cầu Token - Quyền Admin)
* Cập nhật dòng xe.
* **Request Body (`VehicleModelUpdateRequest`):** (Cấu trúc tương tự tạo mới).
* **Response `result` (`VehicleModelResponse`).**

#### 🔒 DELETE `/model/{modelId}` (Yêu cầu Token - Quyền Admin)
* Xóa dòng xe.
* **Response:** Thông điệp `"Model deleted"`.

---

### 5.9 Role & Permission Controller (`/role`, `/permission`)
*Dành riêng cho trang Admin quản lý phân quyền.*

#### 🔒 API Permissions (`/permission`)
* **POST `/permission`**: Tạo quyền năng mới.
  * Request Body: `{ "name": "DELETE_VEHICLE", "description": "Quyền xoá xe máy" }`
* **GET `/permission`**: Lấy danh sách toàn bộ quyền năng có trong hệ thống.
* **DELETE `/permission/{permissionName}`**: Xoá một quyền năng.

#### 🔒 API Roles (`/role`)
* **POST `/role`**: Tạo vai trò và gán quyền cho vai trò đó.
  * Request Body:
    ```json
    {
      "name": "employee",
      "description": "Nhân viên cửa hàng",
      "permissions": ["CREATE_VEHICLE", "UPDATE_VEHICLE"]
    }
    ```
* **GET `/role`**: Lấy danh sách các vai trò (bao gồm mảng permissions tương ứng).
* **DELETE `/role/{roleName}`**: Xoá một vai trò khỏi hệ thống.

---

## 6. MẪU CẤU HÌNH API CLIENT TRÊN FRONTEND (AXIOS INTERCEPTORS)

Dưới đây là mã nguồn gợi ý cấu hình Axios viết bằng Javascript để giúp bạn tự động gắn Token và xử lý mã lỗi tập trung (Centralized Error Handling) dựa theo thiết kế của Backend:

```javascript
import axios from 'axios';

// 1. Tạo instance của Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 2. Request Interceptor: Tự động đính kèm JWT Token vào Header của mỗi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token'); // Hoặc lấy từ Cookie / Redux Store
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Xử lý đóng gói phong bì ApiResponse và phân loại mã lỗi
apiClient.interceptors.response.use(
  (response) => {
    const apiResponse = response.data;
    
    // Đối chiếu theo thiết kế ApiResponse chung
    if (apiResponse.code === 1000) {
      // Thành công: Trả trực tiếp dữ liệu thực tế ở trường result ra cho component sử dụng
      return apiResponse.result;
    } else {
      // Trường hợp trả về 200 OK nhưng code bên trong lại báo lỗi logic nghiệp vụ
      handleLogicError(apiResponse.code, apiResponse.message);
      return Promise.reject(new Error(apiResponse.message || 'Logic Error'));
    }
  },
  (error) => {
    // Xử lý các mã lỗi HTTP hệ thống (401, 403, 500...)
    if (error.response) {
      const httpStatus = error.response.status;
      const apiResponse = error.response.data;
      
      switch (httpStatus) {
        case 401:
          console.error("Token hết hạn hoặc không hợp lệ. Đang chuyển về Đăng nhập...");
          localStorage.removeItem('jwt_token');
          window.location.href = '/login';
          break;
        case 403:
          alert("Bạn không có quyền thực hiện chức năng này!");
          break;
        case 400:
        case 404:
          // Xử lý lỗi logic được gửi từ ExceptionHandler của Backend
          if (apiResponse && apiResponse.code) {
            handleLogicError(apiResponse.code, apiResponse.message);
          } else {
            alert(error.message || "Yêu cầu không hợp lệ!");
          }
          break;
        case 500:
          alert("Lỗi máy chủ hệ thống! Vui lòng thử lại sau.");
          break;
        default:
          alert(`Đã xảy ra lỗi ngoài ý muốn (HTTP ${httpStatus})`);
      }
    } else {
      alert("Mất kết nối tới máy chủ! Vui lòng kiểm tra lại mạng.");
    }
    return Promise.reject(error);
  }
);

// Hàm phụ hiển thị thông báo lỗi thân thiện dựa trên mã code lỗi nghiệp vụ
function handleLogicError(code, serverMessage) {
  switch (code) {
    case 1002:
      alert("Email đăng ký đã tồn tại trong hệ thống!");
      break;
    case 1003:
      alert("Tài khoản hoặc email không tồn tại!");
      break;
    case 1004:
      alert("Mật khẩu không chính xác!");
      break;
    case 1017:
      alert("Khoảng thời gian này xe đã có khách đặt trước. Vui lòng chọn xe khác hoặc đổi lịch trình!");
      break;
    case 1018:
      alert("Xe hiện đang được một khách hàng khác thao tác thanh toán giữ chỗ!");
      break;
    default:
      alert(`Lỗi nghiệp vụ (${code}): ${serverMessage}`);
  }
}

export default apiClient;
```

---
*(Tài liệu này được biên soạn tự động dựa trên cấu trúc mã nguồn thực tế của BikeVN.)*
