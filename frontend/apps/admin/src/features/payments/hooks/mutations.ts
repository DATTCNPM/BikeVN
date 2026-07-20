import { useMutation } from "@tanstack/react-query";
import { paymentAdminApi } from "../api/paymentAdminApi";
import type {
  ApprovePaymentPayload,
  CancelPaymentPayload,
  ProcessRefundPayload,
} from "@repo/schemas";

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

export function useCancelPayment() {
  return useMutation({
    mutationFn: ({ id, reason }: CancelPaymentPayload) =>
      paymentAdminApi.cancelPayment(id, reason),
  });
}

export function useAdminRetryPayment() {
  return useMutation({
    mutationFn: ({
      id,
      newPaymentMethod,
    }: {
      id: string;
      newPaymentMethod: string;
    }) => paymentAdminApi.retryPayment(id, newPaymentMethod),

    meta: {
      silentErrorCodes: [1014, 1021],
    },
  });
}
