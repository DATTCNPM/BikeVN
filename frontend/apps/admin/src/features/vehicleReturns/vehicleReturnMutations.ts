import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleReturnAdminApi } from "@repo/api";
import type { CreateVehicleReturnRequest } from "@repo/types";
import { vehicleReturnQueryKeys } from "./vehicleReturnQueryKeys";

export const useCreateVehicleReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 🟢 FIX 1: Dùng arrow function để tránh lỗi mất scope "this"
    mutationFn: (payload: CreateVehicleReturnRequest) =>
      vehicleReturnAdminApi.createVehicleReturn(payload),

    onSuccess: (data) => {
      // 🟢 FIX 2: Ép kiểu hoặc truy cập an toàn tùy thuộc vào cấu trúc trả về từ API của bạn
      // Nếu file API bọc qua axios thông thường, data nhận được có thể nằm trong một trường cụ thể.
      // Dựa vào thông báo lỗi, ta lấy chính xác object vehicleReturn:
      const newReturn = data?.vehicleReturn;

      if (newReturn && "bookingId" in newReturn) {
        // Cập nhật ngay lập tức dữ liệu chi tiết cho Booking hiện tại mà không cần gọi lại API
        queryClient.setQueryData(
          vehicleReturnQueryKeys.detail(newReturn.bookingId as string),
          newReturn,
        );
      }

      // 🟢 FIX 3: Thêm toán tử `void` trước các hàm invalidateQueries
      // để báo cho linter biết ta cố tình không cần await các Promise này chạy xong.
      void queryClient.invalidateQueries({
        queryKey: vehicleReturnQueryKeys.lists(),
      });
      void queryClient.invalidateQueries({
        queryKey: vehicleReturnQueryKeys.branchLists(),
      });
      void queryClient.invalidateQueries({
        queryKey: vehicleReturnQueryKeys.filters(),
      });
    },
  });
};
