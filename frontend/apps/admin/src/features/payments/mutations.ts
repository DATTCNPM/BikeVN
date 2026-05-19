import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@repo/api";
import { paymentsKeys } from "@repo/hooks";
import { type PaymentFormValues } from "./schemas";

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaymentFormValues) => paymentApi.createPayment(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<PaymentFormValues> }) => 
      paymentApi.updatePayment(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
      await queryClient.invalidateQueries({ queryKey: paymentsKeys.detail(variables.id) });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentApi.deletePayment(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
    },
  });
}
