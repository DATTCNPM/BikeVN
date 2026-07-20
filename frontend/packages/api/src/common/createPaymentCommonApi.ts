import type { AxiosInstance } from "axios";
import type { Payment } from "@repo/schemas";

export const createPaymentCommonApi = (axiosInstance: AxiosInstance) => ({
  async cancelPayment(id: string, reason?: string) {
    return axiosInstance.post<Payment>(`/payments/${id}/cancel`, null, {
      params: {
        reason,
      },
    });
  },
  async retryPayment(id: string, newPaymentMethod: string) {
    return axiosInstance.patch<Payment>(`/payments/${id}/retry`, {
      newPaymentMethod,
    });
  },
});
