import { useMutation } from "@tanstack/react-query";
import { bookingAdminApi } from "../api/bookingAdminApi";

export function useRejectBooking() {
  return useMutation({
    mutationFn: (bookingId: string) => bookingAdminApi.rejectBooking(bookingId),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn các mã lỗi cơ bản khi từ chối đơn hàng
    meta: {
      silentErrorCodes: [1014, 1015],
    },
  });
}
