import { useQuery } from "@tanstack/react-query";
import { paymentAdminApi } from "../api/paymentAdminApi";
import { paymentsKeys } from "@repo/hooks";
import type {
  Payment,
  PaginationResponse,
  PaymentFilterParams,
} from "@repo/types";

// Hook lấy Payments hệ thống (Admin) - Đã thêm options kiểm soát enabled
export function usePayments(
  params?: PaymentFilterParams,
  options?: { enabled?: boolean },
) {
  return useQuery<PaginationResponse<Payment>>({
    queryKey: paymentsKeys.list(params),
    queryFn: () => paymentAdminApi.getAllPayments(params),
    enabled: options?.enabled ?? true,
  });
}

// Hook lấy Payments theo chi nhánh (Employee) - MỚI
export function usePaymentsByBranch(
  page: number,
  size: number,
  options?: { enabled?: boolean },
) {
  return useQuery<PaginationResponse<Payment>>({
    queryKey: ["payments", "branch", page, size],
    queryFn: () => paymentAdminApi.getPaymentPerBranch(page, size),
    enabled: options?.enabled ?? true,
  });
}
