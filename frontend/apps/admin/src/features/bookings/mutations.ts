import { useMutation } from "@tanstack/react-query";
import { bookingAdminApi } from "@repo/api";

export function useApproveBooking() {
  return useMutation({
    mutationFn: (bookingId: string) =>
      bookingAdminApi.approveBooking(bookingId),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn các mã lỗi liên quan đến trùng lịch xe, hết hạn phiên hoặc sai lệch trạng thái đơn đặt xe
    meta: {
      silentErrorCodes: [1014, 1015, 1017, 1020],
    },
  });
}

export function useRejectBooking() {
  return useMutation({
    mutationFn: (bookingId: string) => bookingAdminApi.rejectBooking(bookingId),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn các mã lỗi cơ bản khi từ chối đơn hàng
    meta: {
      silentErrorCodes: [1014, 1015],
    },
  });
}
