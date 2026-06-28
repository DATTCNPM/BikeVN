import { useMutation } from "@tanstack/react-query";
import { paymentClientApi } from "@repo/api";

export function useCreatePayment() {
  return useMutation({
    mutationFn: paymentClientApi.createPayment,
  });
}

export function useClientCancelPayment() {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      paymentClientApi.cancelPayment(id, reason),
  });
}

export function useGetVNPayUrl() {
  return useMutation({
    mutationFn: (paymentId: string) => paymentClientApi.getVNPayUrl(paymentId),
    onSuccess: (vnpayUrl) => {
      // SỬA: vnpayUrl bây giờ là một chuỗi string thuần túy chứa link redirect
      if (vnpayUrl && typeof vnpayUrl === "string") {
        window.location.href = vnpayUrl; // Chuyển hướng thẳng sang cổng VNPay
      }
    },
  });
}
