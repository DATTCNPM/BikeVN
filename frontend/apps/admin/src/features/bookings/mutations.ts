import { useMutation } from "@tanstack/react-query";

import { bookingAdminApi } from "@repo/api";

export function useApproveBooking() {
  return useMutation({
    mutationFn: (bookingId: string) =>
      bookingAdminApi.approveBooking(bookingId),
  });
}

export function useRejectBooking() {
  return useMutation({
    mutationFn: (bookingId: string) => bookingAdminApi.rejectBooking(bookingId),
  });
}
