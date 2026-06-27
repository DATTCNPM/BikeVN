import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { authStorageService } from "@repo/services";

import { userApi } from "@repo/api";
// Giả định bạn có userKeys quản lý cache key giống authKeys, nếu không có bạn có thể thay bằng ["users"]
import { userKeys } from "./userKeys";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  return useMutation({
    // Nhận vào id của người dùng cần xóa
    mutationFn: async (id: string) => {
      return await userApi.deleteUser(id);
    },

    // Xử lý sau khi gọi API xóa thành công ở Server
    onSuccess: async () => {
      // Làm mới danh sách users để giao diện tự động load lại dữ liệu mới nhất
      await queryClient.invalidateQueries({
        queryKey: userKeys.lists(), // Hoặc sử dụng queryKey: ["users"] nếu chưa tạo file keys
      });

      toast.success("Xóa người dùng thành công");
      // Xóa token khỏi localStorage để đăng xuất người dùng
      authStorageService.clearToken();
      // Điều hướng về trang chủ hoặc trang đăng nhập sau khi xóa tài khoản
      navigate("/"); // Thay "/" bằng đường dẫn bạn muốn điều hướng sau khi xóa tài khoản
    },

    // Bắt lỗi nếu API gặp sự cố (ví dụ lỗi 403, 500 từ server)
    onError: (error: any) => {
      console.error("Delete user failed:", error);

      // Lấy message lỗi từ Server trả về thông qua Axios (nếu có)
      const serverMessage = error?.response?.data?.message;
      toast.error(
        serverMessage || "Xóa người dùng thất bại. Vui lòng thử lại!",
      );
    },
  });
};
