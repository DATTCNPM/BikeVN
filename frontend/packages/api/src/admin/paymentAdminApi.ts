import { PaymentPage, PaymentStatus, Payment } from "@repo/types";
import axiosAdmin from "../axios/axiosAdmin";
import { createPaymentCommonApi } from "../common/createPaymentCommonApi";

export const paymentAdminApi = {
  ...createPaymentCommonApi(axiosAdmin),
  async getAllPayments(params?: {
    page?: number;
    size?: number;
    status?: PaymentStatus;
  }) {
    return axiosAdmin.get<PaymentPage>("/payments", {
      params,
    });
  },
  async confirmPayment(id: string, transactionCode: string) {
    await axiosAdmin.post(`/payments/${id}/confirm`, null, {
      params: {
        transactionCode,
      },
    });
  },
  async approvePaymentManually(
    id: string,
    adminId: string,
    actualPaymentMethod: string,
  ) {
    return axiosAdmin.post<Payment>(`/payments/${id}/approve-manually`, null, {
      params: {
        adminId,
        actualPaymentMethod,
      },
    });
  },
};
