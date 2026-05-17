import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingApi, type CreateBookingPayload } from "@repo/api";
import { bookingsKeys } from "@repo/hooks";

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateBookingPayload }) =>
      bookingApi.updateBooking(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
      queryClient.invalidateQueries({
        queryKey: bookingsKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingApi.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
    },
  });
}
