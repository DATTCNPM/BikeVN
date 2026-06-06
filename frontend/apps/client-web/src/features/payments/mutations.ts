import { useMutation } from "@tanstack/react-query";

import { paymentClientApi } from "@repo/api";

export function useCreatePayment() {
  return useMutation({
    mutationFn: paymentClientApi.createPayment,
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: ({
      id,
      transactionCode,
    }: {
      id: string;
      transactionCode: string;
    }) => paymentClientApi.confirmPayment(id, transactionCode),
  });
}
