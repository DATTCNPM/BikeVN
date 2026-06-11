import { Payment, PaginationResponse, PaymentParams } from "@repo/types";
import axiosAdmin from "../axios/axiosAdmin";
import { createPaymentCommonApi } from "../common/createPaymentCommonApi";

export const paymentAdminApi = {
  ...createPaymentCommonApi(axiosAdmin),
  async getAllPayments(
    params?: PaymentParams,
  ): Promise<PaginationResponse<Payment>> {
    return axiosAdmin.get<
      PaginationResponse<Payment>,
      PaginationResponse<Payment>
    >("/payments", {
      params,
    });
  },
  async confirmPayment(id: string, transactionCode: string): Promise<void> {
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
  ): Promise<Payment> {
    return axiosAdmin.post<Payment>(`/payments/${id}/approve-manually`, null, {
      params: {
        adminId,
        actualPaymentMethod,
      },
    });
  },
};
