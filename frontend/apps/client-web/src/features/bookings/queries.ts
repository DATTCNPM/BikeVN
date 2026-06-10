import { useQuery } from "@tanstack/react-query";

import { bookingClientApi } from "@repo/api";

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
