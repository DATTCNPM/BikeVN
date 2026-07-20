import axiosClient from "@/hooks/axiosClient";
import { createPaymentCommonApi } from "@repo/api";
import type { Payment, PaymentCreationPayload } from "@repo/schemas";

export const paymentClientApi = {
  ...createPaymentCommonApi(axiosClient),

  async createPayment(payload: PaymentCreationPayload): Promise<Payment> {
    // Interceptor trả về thẳng data.result (là object Payment) khi code === 1000
    return axiosClient.post<any, Payment>("/payments", payload);
  },

  // SỬA: Interceptor đã lột vỏ ApiResponse và trả về thẳng data.result (chuỗi URL string)
  async getVNPayUrl(paymentId: string, returnUrl?: string): Promise<string> {
    return axiosClient.get<any, string>(`/payments/${paymentId}/vnpay-url`, {
      params: { returnUrl },
    });
  },

  // SỬA: Tương tự, hàm check return sẽ nhận về chuỗi trạng thái từ data.result ("SUCCESS" hoặc "FAILED")
  async handleVNPayReturn(
    queryParams: Record<string, string | string[]>,
  ): Promise<string> {
    return axiosClient.get<any, string>("/payments/vnpay-return", {
      params: queryParams,
    });
  },
};
