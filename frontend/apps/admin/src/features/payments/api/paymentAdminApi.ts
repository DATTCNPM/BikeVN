import type {
  Payment,
  PaginationResponse,
  PaymentFilterParams,
} from "@repo/types";
import { axiosAdmin } from "@repo/api";
import { createPaymentCommonApi } from "@repo/api";

export const paymentAdminApi = {
  ...createPaymentCommonApi(axiosAdmin),

  // SỬA: Đổi từ "/payments" thành "/payments/admin/filter" cho đúng với BE
  getAllPayments(
    params?: PaymentFilterParams,
  ): Promise<PaginationResponse<Payment>> {
    return axiosAdmin.get<
      PaginationResponse<Payment>,
      PaginationResponse<Payment>
    >("/payments/admin/filter", {
      params,
    });
  },

  approvePaymentManually(
    id: string,
    adminId: string,
    actualPaymentMethod: string,
  ): Promise<Payment> {
    return axiosAdmin.post<Payment, Payment>(
      `/payments/${id}/approve-manually`,
      null,
      {
        params: {
          adminId,
          actualPaymentMethod,
        },
      },
    );
  },

  // THÊM MỚI: Admin kích hoạt hoàn tiền
  processRefund(id: string, adminId: string): Promise<Payment> {
    return axiosAdmin.post<Payment, Payment>(`/payments/${id}/refund`, null, {
      params: {
        adminId,
      },
    });
  },
};
