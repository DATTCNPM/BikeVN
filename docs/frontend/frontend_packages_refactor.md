# Refactor Kế Hoạch - Frontend Packages (Đánh giá và cải thiện Package API)

## Nhận xét tình hình hiện tại (So với Backend & Best Practices)

1. **Kiến trúc Monorepo**: Cấu trúc chia tách `frontend/packages/api`, `services`, `types`... rất tốt, phù hợp chuẩn phát triển quy mô lớn.
2. **Cấu hình API Interceptors (Chưa bám sát backend.md)**: Hệ thống Axios (`axiosClient.ts`, `axiosAdmin.ts`, `axiosPublic.ts`) chưa xử lý gói `ApiResponse` một cách tập trung như tài liệu Backend (Backend trả về `code`, `message`, `result`). Hiện tại Interceptor chỉ đơn thuần trả về thẳng `response.data` và mới chỉ handle global cho duy nhất lỗi `401 Unauthenticated`.
3. **Typing ở API Client**: Do interceptor không tự bóc tách `response.data.result`, toàn bộ các định nghĩa API như `authApi.ts` đang bị buộc phải có kiểu trả về là `Promise<ApiResponse<T>>`. Việc này dẫn đến mã lặp lại rất lớn tại các client app.
4. **Mismatched Logic Error**: Các mã lỗi đặc thù (như 1002, 1004, 1017...) chưa được parse một cách chung nhất để notify lỗi ra UI.

## Chấm điểm: 7.0 / 10

## Kế hoạch Refactor cụ thể

### 1. Refactor Axios Interceptors (Tập trung hóa xử lý API Envelope)

Cập nhật cả 3 file `axiosClient.ts`, `axiosAdmin.ts`, `axiosPublic.ts`:

- **Trong `response.use`:** Kiểm tra `data.code === 1000`. Nếu thoả mãn, hãy **`return data.result;`**. Việc này bóc đi lớp vỏ bọc (`Envelope`) không cần thiết lúc component nhận dữ liệu.
- **Nếu `code !== 1000`**: Tức là API chạy thành công 200 OK nhưng phía business logic bị lỗi (VD: sai tài khoản mật khẩu). Lúc này interceptor nên trực tiếp `Promise.reject(new Error(data.message))`. Nên tạo thêm 1 helper `handleLogicError(code, message)` để tự động hiển thị `toast` thân thiện cho Users mà không cần parse lại tại client apps.

### 2. Cập nhật Type Signature trong toàn bộ API Service

Trong `frontend/packages/api/src/**/*.ts`:

- **Trước đây**: `login(payload): Promise<ApiResponse<AuthenticationResponse>>`
- **Sau khi Refactor**: `login(payload): Promise<AuthenticationResponse>` (do Interceptor đã lấy ra phần data.result).

### 3. Đồng bộ đúng Key Request Body User

Tuyệt đối kiểm tra lại các Payload lúc gọi API:

- `POST /user` (Create): Trường mật khẩu phải là `passwordHash`.
- `PUT /user/{id}` (Update): Trường mật khẩu là `password`. Đảm bảo các Types trong `types` package phản ánh đúng điều này.
