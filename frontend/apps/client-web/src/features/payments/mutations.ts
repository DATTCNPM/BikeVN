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
    mutationFn: ({
      paymentId,
      returnUrl,
    }: {
      paymentId: string;
      returnUrl?: string;
    }) => paymentClientApi.getVNPayUrl(paymentId, returnUrl),
    onSuccess: (vnpayUrl) => {
      if (vnpayUrl && typeof vnpayUrl === "string") {
        window.location.href = vnpayUrl;
      }
    },
  });
}
