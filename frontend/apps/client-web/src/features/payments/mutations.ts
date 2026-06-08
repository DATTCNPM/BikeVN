import { useMutation } from "@tanstack/react-query";

import { paymentClientApi } from "@repo/api";

export function useCreatePayment() {
  return useMutation({
    mutationFn: paymentClientApi.createPayment,
  });
}
