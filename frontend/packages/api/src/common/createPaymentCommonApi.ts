import type { AxiosInstance } from "axios";
import type { Payment } from "@repo/types";

export const createPaymentCommonApi = (axiosInstance: AxiosInstance) => ({
  async cancelPayment(id: string, reason?: string) {
    return axiosInstance.post<Payment>(`/payments/${id}/cancel`, null, {
      params: {
        reason,
      },
    });
  },
});
