# Refactor Kế Hoạch - Frontend Admin (Đánh giá và cải thiện Ứng dụng Admin)

## Nhận xét tình hình hiện tại (So với Backend & Best Practices)

1. **Lặp Logic Kiểm Tra Mã Lỗi**: Bởi vì phần xử lý API gói `frontend/packages/api` chưa bóc tách `ApiResponse`, các hook fetch API trong Admin app hiện nay (ví dụ các hook react-query trong `features/auth`, `features/users`...) vẫn đang dư thừa việc kiểm tra mã `code !== 1000`.
2. **Không khai thác hết React Query**: Do chưa quăng lỗi `Error` tại tầng gọi API, React Query gặp khó khăn trong việc tự động bắt `.catch()` trên `mutation` mà bắt buộc Component phải xử lý thêm logic.
3. **Cấu trúc Thư mục**: Thư mục trong Admin được chia gọn gàng theo feature module (`features/auth`, `features/bookings`, v.v) đúng chuẩn Clean Architecture với React.

## Chấm điểm: 7.0 / 10

## Kế hoạch Refactor cụ thể

### 1. Xóa bỏ logic bóc tách dư thừa tại các React-Query Hooks

- Sau khi `packages/api` đã được sửa, thì tất cả response nhận được về từ các methods thư mục api sẽ trực tiếp là `T` thay vì `ApiResponse<T>`.
- **Tiến hành tìm & xóa**: Cần tìm tất cả các hook, xóa bỏ đoạn code:
  ```typescript
  if (response?.code !== 1000) {
     throw new Error(...);
  }
  return response.result;
  ```
  Thay vào đó hook chỉ cần:
  ```typescript
  const data = await xyzApi.call();
  return data;
  ```

### 2. Quản lý xử lý Notifications (Toast)

- Hiện tại một số hook của Admin đang tự map thông báo lỗi thủ công (vd: đăng nhập sai báo lỗi "Sai tài khoản hoặc bằng mật khẩu").
- **Giải pháp**: Xóa bỏ các map mã thủ công này và đưa nó xuống Global tại Axios Interceptor (như đã hướng dẫn từ Backend). Khi xảy ra lỗi (ví dụ 1017, trùng booking), Global Axios có thể tự kích hoạt `toast("Xe đã có khách đặt trước")`. App Admin lúc này chỉ việc catch Error mà không cần quan tâm thông báo chi tiết nữa.

### 3. Xác thực quyền và Routing

- Đảm bảo Admin App phân quyền đúng cho các pages. Component Login của Admin sau khi success sẽ điều hướng thẳng về Dashboard. Việc kiểm tra Token Admin / Check Role nên được quản lý qua Higher Order Components (HOC) / Protected Route chuẩn xác.
