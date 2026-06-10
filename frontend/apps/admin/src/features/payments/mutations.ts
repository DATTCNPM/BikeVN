import { useMutation } from "@tanstack/react-query";

import { paymentAdminApi } from "@repo/api";
import type { ApprovePaymentPayload } from "node_modules/@repo/types/src/paymentType";

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

export function useApprovePaymentManually() {
  return useMutation({
    mutationFn: ({ id, adminId, actualPaymentMethod }: ApprovePaymentPayload) =>
      paymentAdminApi.approvePaymentManually(id, adminId, actualPaymentMethod),
  });
}

export function useCancelPayment(id: string) {
  return useMutation({
    mutationFn: () => paymentAdminApi.cancelPayment(id),
  });
}
