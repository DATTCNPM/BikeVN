# Refactor Kế Hoạch - Frontend Client Web (Đánh giá và cải thiện App Dành Cho Người Dùng)

## Nhận xét tình hình hiện tại (So với Backend & Best Practices)

1. **Thiết kế tính năng khá hoàn thiện**: Client Web sử dụng các tool hiện đại như TailwindCSS v4, React Hook Form, Zod schema (`@repo/schemas`), Tanstack Query... rất mạnh mẽ. Cấu trúc feature base khá đồng bộ với Admin.
2. **Issue Tương tự phía Admin**: Giống hệt ứng dụng Admin, Client App dính lỗi lặp lại code kiểm tra `code !== 1000`. Cụ thể trong `features/auth/useLogin.ts` đang có đoạn manual throw error nếu `response.code !== 1000`. Điều này đi ngược lại với triết lý Don't Repeat Yourself (DRY).
3. **Cấu trúc dữ liệu components (Prop Drilling)**: Có vài component phải xử lý chọc sâu vào `.result` (Ví dụ thay vì `data.user` thì lại là `data.result.user`).

## Chấm điểm: 7.5 / 10 (Cao hơn Admin một chút do UI/UX logic tốt)

## Kế hoạch Refactor cụ thể

### 1. Refactor toàn bộ Mutations và Queries

Sắp tới toàn diện xoá bỏ logic validation mã lỗi `1000` thông qua React Query (giống cách làm ở Admin). Cập nhật `useLogin`, `useRegister`, `useUpdateProfile` bớt đi từ 3-4 dòng logic thừa.

- Component (UI) khi tương tác chỉ cần đọc trực tiếp `data.field` (không còn `.result.field`).

### 2. Form Error Handle & Logic Global Toast

- Client App sử dụng kịch bản xử lý đặt xe (Booking), thanh toán. Đặc biệt dễ gặp các mã do trùng lịch như 1017 (conflict booking time) hay 1018 (xe bị khóa do thanh toán).
- Đưa các mã lỗi này vào config chung ở Custom Hook Global báo Toast (hoặc `sonner`).
- **Ví dụ**: Nếu users cố đặt xe nhưng có ng khác nhanh tay hơn (Lỗi 1017). Users không cần phải rườm rà nhận thông báo console log mà sẽ nổi lên một UI toast Notification Error.
- Catch global error trên file cấu hình `axiosClient.ts`.

### 3. Đồng bộ Mật khẩu

Ở trang Đăng Ký (`Register Page`) và Đăng Nhập (`Login Page`), lưu ý truyền dữ liệu sang phía package theo chuẩn `passwordHash` nếu thực hiện hàm `POST /user` như trong `backend.md`.

### 4. Bóc tách xử lý Ảnh Upload

Client-web nên cấu hình link ảnh triệt để lấy từ biến môi trường `VITE_API_URL`, nối với chuỗi `/uploads/` cho các API list ảnh để tránh lỗi đường dẫn 404 (Missing Link Image). Hạn chế hardcode logic nối base URL ở từng file giao diện hiển thị.
