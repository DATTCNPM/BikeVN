import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "@repo/api";
import { bookingsKeys } from "@repo/hooks";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => bookingApi.createBooking(payload),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
    },
  });
}
