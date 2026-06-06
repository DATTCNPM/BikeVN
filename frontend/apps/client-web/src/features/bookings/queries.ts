import { useQuery } from "@tanstack/react-query";

import { bookingApi } from "@repo/api";

import { bookingsKeys } from "@repo/hooks";

export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingsKeys.detail(id),
    queryFn: () => bookingApi.getBooking(id),
    enabled: !!id,
  });
}

export function useBookingsByUser(userId: string) {
  return useQuery({
    queryKey: bookingsKeys.byUser(userId),
    queryFn: () => bookingApi.getBookingsByUser(userId),
    enabled: !!userId,
  });
}
