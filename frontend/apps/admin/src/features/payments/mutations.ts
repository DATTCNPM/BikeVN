import { useMutation } from "@tanstack/react-query";

import { paymentAdminApi } from "@repo/api";

export function useConfirmPayment() {
  return useMutation({
    mutationFn: ({
      id,
      transactionCode,
    }: {
      id: string;
      transactionCode: string;
    }) => paymentAdminApi.confirmPayment(id, transactionCode),
  });
}
