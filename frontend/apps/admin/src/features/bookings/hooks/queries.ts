import { useQuery } from "@tanstack/react-query";
import { bookingAdminApi } from "../api/bookingAdminApi";
import { bookingsKeys } from "@repo/hooks";
import type { Booking, BookingFilter, PaginationResponse } from "@repo/types";

// Hook lấy toàn bộ Bookings (Dành cho Admin)
export function useBookings(
  page: number,
  size: number,
  options?: { enabled?: boolean }, // Chuyển thành Object
) {
  return useQuery<PaginationResponse<Booking>>({
    queryKey: bookingsKeys.list(page, size),
    queryFn: async () => bookingAdminApi.getAllBooking(page, size),
    enabled: options?.enabled ?? true, // Lấy giá trị từ object, mặc định là true
  });
}

// Hook lấy Bookings thuộc chi nhánh của nhân viên (Dành cho Employee) - MỚI
export function useBookingsByBranch(
  page: number,
  size: number,
  options?: { enabled?: boolean }, // Chuyển thành Object
) {
  return useQuery<PaginationResponse<Booking>>({
    queryKey: ["bookings", "branch", page, size],
    queryFn: async () => bookingAdminApi.getAllBookingByBranch(page, size),
    enabled: options?.enabled ?? true, // Lấy giá trị từ object, mặc định là true
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingsKeys.detail(id),
    queryFn: async () => bookingAdminApi.getBooking(id),
    enabled: !!id,
  });
}

export function useBookingFilters(params?: BookingFilter, enabled = true) {
  return useQuery<PaginationResponse<Booking>>({
    queryKey: bookingsKeys.filter(params),
    queryFn: async () => bookingAdminApi.getBookingFilters(params),
    enabled: !!params && enabled,
  });
}
