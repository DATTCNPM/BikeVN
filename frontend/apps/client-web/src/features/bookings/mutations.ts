import { useMutation } from "@tanstack/react-query";

import { bookingClientApi } from "@repo/api";

import type { BookingCreationPayload } from "@repo/types";

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (payload: BookingCreationPayload) => {
      console.log("Creating booking with payload:", payload);
      return bookingClientApi.createBooking(payload);
    },
  });
}

export function useCancelBooking() {
  return useMutation({
    mutationFn: async (bookingId: string) => {
      console.log("Canceling booking with ID:", bookingId);
      return bookingClientApi.cancelBooking(bookingId);
    },
  });
}
