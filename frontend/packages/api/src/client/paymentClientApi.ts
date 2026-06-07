import axiosClient from "../axios/axiosClient";

import type { Payment, PaymentCreationPayload } from "@repo/types";

export const paymentClientApi = {
  async createPayment(payload: PaymentCreationPayload) {
    return axiosClient.post<Payment>("/payments", payload);
  },
};
