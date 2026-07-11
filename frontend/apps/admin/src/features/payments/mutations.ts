import { useMutation } from "@tanstack/react-query";
import { paymentAdminApi } from "@repo/api";
import type { ApprovePaymentPayload, ProcessRefundPayload } from "@repo/types";

export function useApprovePaymentManually() {
  return useMutation({
    mutationFn: ({ id, adminId, actualPaymentMethod }: ApprovePaymentPayload) =>
      paymentAdminApi.approvePaymentManually(id, adminId, actualPaymentMethod),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn lỗi liên quan đến trạng thái thanh toán sai lệch trên form phê duyệt
    meta: {
      silentErrorCodes: [1014, 1016, 1021, 1025],
    },
  });
}

export function useAdminCancelPayment() {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      paymentAdminApi.cancelPayment(id, reason),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn lỗi khi thực hiện hủy giao dịch
    meta: {
      silentErrorCodes: [1014, 1021],
    },
  });
}

export function useProcessRefund() {
  return useMutation({
    mutationFn: ({ id, adminId }: ProcessRefundPayload) =>
      paymentAdminApi.processRefund(id, adminId),

    // 🌟 KHAI BÁO TẠI ĐÂY: Ẩn lỗi khi thực hiện hoàn tiền giao dịch
    meta: {
      silentErrorCodes: [1014, 1021],
    },
  });
}
