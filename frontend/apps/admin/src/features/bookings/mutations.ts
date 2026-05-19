import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "@repo/api";
import { bookingsKeys } from "@repo/hooks";
import { type BookingAdminFormValues } from "./schemas";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingAdminFormValues) => bookingApi.createBooking(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<BookingAdminFormValues> }) => 
      bookingApi.updateBooking(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
      await queryClient.invalidateQueries({ queryKey: bookingsKeys.detail(variables.id) });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingApi.deleteBooking(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
    },
  });
}
