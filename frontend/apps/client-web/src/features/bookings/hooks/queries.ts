import { useQuery } from "@tanstack/react-query";

import { bookingClientApi } from "../api/bookingClientApi";

import { bookingsKeys } from "@repo/hooks";

export function useBookingsByUser(userId: string) {
  return useQuery({
    queryKey: bookingsKeys.byUser(userId),
    queryFn: () => bookingClientApi.getBookingsByUser(userId),
    enabled: !!userId,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingsKeys.detail(id),
    queryFn: () => bookingClientApi.getBooking(id),
    enabled: !!id,
  });
}

export function useVehicleReturnByBookingId(bookingId: string, options?: any) {
  return useQuery({
    queryKey: bookingsKeys.vehicleReturn(bookingId),
    queryFn: () => bookingClientApi.getVehicleReturn(bookingId),
    enabled: !!bookingId && options?.enabled !== false, // <--- Thêm dòng này
    retry: false, // Không cần thử lại nếu không tìm thấy biên bản trả xe
  });
}
