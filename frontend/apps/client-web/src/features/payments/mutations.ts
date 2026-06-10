import { useMutation } from "@tanstack/react-query";

import { paymentClientApi } from "@repo/api";

export function useCreatePayment() {
  return useMutation({
    mutationFn: paymentClientApi.createPayment,
  });
}

export function useCancelPayment(id: string) {
  return useMutation({
    mutationFn: () => paymentClientApi.cancelPayment(id),
  });
}
