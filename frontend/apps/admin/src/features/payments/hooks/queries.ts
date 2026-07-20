import { useQuery } from "@tanstack/react-query";
import { paymentAdminApi } from "../api/paymentAdminApi";
import { paymentsKeys } from "@repo/hooks";
import type { Payment, PaymentFilterParams } from "@repo/schemas";

import type { PaginationResponse } from "@repo/types";

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
