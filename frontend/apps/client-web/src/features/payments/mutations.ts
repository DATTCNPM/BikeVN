import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@repo/api";
import { paymentsKeys } from "@repo/hooks";

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => paymentApi.createPayment(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
      if (variables?.booking_id) {
        queryClient.invalidateQueries({
          queryKey: paymentsKeys.byBooking(variables.booking_id),
        });
      }
    },
  });
}
