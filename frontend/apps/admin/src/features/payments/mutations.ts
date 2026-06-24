import { useMutation } from "@tanstack/react-query";

import { paymentAdminApi } from "@repo/api";
import type { ApprovePaymentPayload, ProcessRefundPayload } from "@repo/types";

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

// THÊM MỚI: Hook xử lý hoàn tiền dành riêng cho Admin
export function useProcessRefund() {
  return useMutation({
    mutationFn: ({ id, adminId }: ProcessRefundPayload) =>
      paymentAdminApi.processRefund(id, adminId),
  });
}
