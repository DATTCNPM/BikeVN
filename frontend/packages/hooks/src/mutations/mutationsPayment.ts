import { useMutation } from "@tanstack/react-query";

import { paymentAdminApi } from "@repo/api";
import type { CancelPaymentPayload } from "@repo/types";
export function useCancelPayment() {
  return useMutation({
    mutationFn: ({ id, reason }: CancelPaymentPayload) =>
      paymentAdminApi.cancelPayment(id, reason),
  });
}
