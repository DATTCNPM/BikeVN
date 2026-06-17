import { useQuery } from "@tanstack/react-query";

import { bookingAdminApi } from "@repo/api";
import { bookingsKeys } from "@repo/hooks";

export function useBookings(page: number, size: number) {
  return useQuery({
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
