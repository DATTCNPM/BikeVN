import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi, type CreatePaymentPayload } from "@repo/api";
import { paymentsKeys } from "@repo/hooks";

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CreatePaymentPayload;
    }) => paymentApi.updatePayment(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
      queryClient.invalidateQueries({
        queryKey: paymentsKeys.detail(variables.id),
      });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentApi.deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
    },
  });
}
