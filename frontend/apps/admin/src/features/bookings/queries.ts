import { useQuery } from "@tanstack/react-query";

import { bookingAdminApi } from "@repo/api";
import { bookingsKeys } from "@repo/hooks";

import type { Booking, BookingFilter, PaginationResponse } from "@repo/types";

export function useBookings(page: number, size: number) {
  return useQuery<PaginationResponse<Booking>>({
    queryKey: bookingsKeys.list(page, size),
    queryFn: async () => bookingAdminApi.getAllBooking(page, size),
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
