import type { AxiosInstance } from "axios";

import type { Payment } from "@repo/types";

export const createPaymentCommonApi = (axiosInstance: AxiosInstance) => ({
  async getPayment(id: string) {
    const data = await axiosInstance.get<Payment, Payment>(`/payments/${id}`);

    if (!data) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Thanh toán không tồn tại",
          },
        },
      };
    }

    return data;
  },
  async cancelPayment(id: string, reason?: string) {
    return axiosInstance.post<Payment>(`/payments/${id}/cancel`, null, {
      params: {
        reason,
      },
    });
  },
});
