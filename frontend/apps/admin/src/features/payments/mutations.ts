import { useMutation } from "@tanstack/react-query";
import { paymentAdminApi } from "@repo/api";
import type { ApprovePaymentPayload, ProcessRefundPayload } from "@repo/types";

export function useApprovePaymentManually() {
  return useMutation({
    mutationFn: ({ id, adminId, actualPaymentMethod }: ApprovePaymentPayload) =>
      paymentAdminApi.approvePaymentManually(id, adminId, actualPaymentMethod),
  });
}

// SỬA: Chỉ giữ lại 1 hàm huỷ duy nhất cho phía Admin, hỗ trợ truyền lý do đầy đủ
export function useAdminCancelPayment() {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      paymentAdminApi.cancelPayment(id, reason),
  });
}

export function useProcessRefund() {
  return useMutation({
    mutationFn: ({ id, adminId }: ProcessRefundPayload) =>
      paymentAdminApi.processRefund(id, adminId),
  });
}
