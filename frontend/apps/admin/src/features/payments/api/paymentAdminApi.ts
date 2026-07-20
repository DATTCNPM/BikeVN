import type { Payment, PaymentFilterParams } from "@repo/schemas";
import type { PaginationResponse } from "@repo/types";
import { axiosAdmin } from "@/hooks/axiosAdmin";
import { createPaymentCommonApi } from "@repo/api";

export const paymentAdminApi = {
  ...createPaymentCommonApi(axiosAdmin),

  // API lấy toàn bộ payments (Dành cho Admin - có lọc nâng cao)
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

  // Admin kích hoạt hoàn tiền
  processRefund(id: string, adminId: string): Promise<Payment> {
    return axiosAdmin.post<Payment, Payment>(`/payments/${id}/refund`, null, {
      params: {
        adminId,
      },
    });
  },
};
