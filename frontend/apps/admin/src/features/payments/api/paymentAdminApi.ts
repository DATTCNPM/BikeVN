import type {
  Payment,
  PaginationResponse,
  PaymentFilterParams,
} from "@repo/types";
import { axiosAdmin } from "@repo/api";
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

  // API lấy payments của riêng chi nhánh (Dành cho Employee) - MỚI
  async getPaymentPerBranch(
    page: number,
    size: number,
  ): Promise<PaginationResponse<Payment>> {
    const data = await axiosAdmin.get<
      PaginationResponse<Payment>,
      PaginationResponse<Payment>
    >(`/payments/branch?page=${page}&size=${size}`);
    return data;
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
