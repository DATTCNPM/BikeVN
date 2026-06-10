import axiosClient from "../axios/axiosClient";

import { createPaymentCommonApi } from "../common/createPaymentCommonApi";

import type { Payment, PaymentCreationPayload } from "@repo/types";

export const paymentClientApi = {
  ...createPaymentCommonApi(axiosClient),

  async createPayment(payload: PaymentCreationPayload) {
    return axiosClient.post<Payment, Payment, PaymentCreationPayload>(
      "/payments",
      payload,
    );
  },
};
