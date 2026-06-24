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

// THÊM MỚI: Hook lấy link VNPay để redirect người dùng đi thanh toán
export function useGetVNPayUrl() {
  return useMutation({
    mutationFn: (paymentId: string) => paymentClientApi.getVNPayUrl(paymentId),
    onSuccess: (vnpayUrl) => {
      if (vnpayUrl) {
        window.location.href = vnpayUrl; // Chuyển hướng thẳng sang cổng VNPay
      }
    },
  });
}
