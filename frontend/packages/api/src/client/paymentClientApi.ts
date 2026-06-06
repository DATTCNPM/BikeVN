import axiosClient from "../axios/axiosClient";

import type { ApiResponse, Payment, PaymentCreationPayload } from "@repo/types";

export const paymentClientApi = {
  async createPayment(payload: PaymentCreationPayload): Promise<Payment> {
    const data = await axiosClient.post<any, ApiResponse<Payment>>(
      "/payments",
      payload,
    );

    return data.result!;
  },

  async confirmPayment(id: string, transactionCode: string): Promise<void> {
    await axiosClient.post(`/payments/${id}/confirm`, null, {
      params: {
        transactionCode,
      },
    });
  },
};
