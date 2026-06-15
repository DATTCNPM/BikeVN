import { useMutation } from "@tanstack/react-query";

import { paymentClientApi } from "@repo/api";

export function useCreatePayment() {
  return useMutation({
    mutationFn: paymentClientApi.createPayment,
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: async ({ id, transactionCode }: { id: string; transactionCode: string }) => {
      return paymentClientApi.confirmPayment(id, transactionCode);
    },
  });
}

export function useCancelPayment(id: string) {
  return useMutation({
    mutationFn: () => paymentClientApi.cancelPayment(id),
  });
}
