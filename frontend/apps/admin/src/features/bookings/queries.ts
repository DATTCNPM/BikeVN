import { useQuery } from "@tanstack/react-query";

import { bookingAdminApi } from "@repo/api";
import { bookingsKeys } from "@repo/hooks";

export function useBookings() {
  return useQuery({
    queryKey: bookingsKeys.all,
    queryFn: () => bookingAdminApi.getAllBooking(),
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingsKeys.detail(id),
    queryFn: () => bookingAdminApi.getBooking(id),
    enabled: !!id,
  });
}
