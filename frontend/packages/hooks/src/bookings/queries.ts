import { useQuery } from "@tanstack/react-query";

import { bookingApi } from "@repo/api";
import { bookingsKeys } from "../queryKeys";

export function useBookings() {
  return useQuery({
    queryKey: bookingsKeys.all,
    queryFn: bookingApi.getBookings,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingsKeys.detail(id),
    queryFn: () => bookingApi.getBookingById(id),
    enabled: !!id,
  });
}
