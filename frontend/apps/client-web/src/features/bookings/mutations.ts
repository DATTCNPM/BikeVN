import { useMutation } from "@tanstack/react-query";

import { bookingClientApi } from "@repo/api";

export function useCreateBooking() {
  return useMutation({
    mutationFn: bookingClientApi.createBooking,
  });
}

export function useCancelBooking() {
  return useMutation({
    mutationFn: bookingClientApi.cancelBooking,
  });
}
