import { useMutation } from "@tanstack/react-query";
import { bookingClientApi } from "../api/bookingClientApi";
import type { BookingCreationPayload } from "@repo/schemas";

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (payload: BookingCreationPayload) => {
      console.log("Creating booking with payload:", payload);
      return bookingClientApi.createBooking(payload);
    },
    // 🌟 BỔ SUNG TẠI ĐÂY: Chặn Toast lỗi nghiệp vụ trùng lịch đặt xe
    meta: {
      silentErrorCodes: [1017, 1018, 1020],
    },
  });
}

export function useCancelBooking() {
  return useMutation({
    mutationFn: async (bookingId: string) => {
      console.log("Canceling booking with ID:", bookingId);
      return bookingClientApi.cancelBooking(bookingId);
    },
    // Nếu hủy đặt xe có mã lỗi nghiệp vụ nào riêng, bạn cũng truyền vào mảng này
    meta: {
      silentErrorCodes: [],
    },
  });
}
