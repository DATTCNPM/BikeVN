import { useQuery } from "@tanstack/react-query";

import { paymentAdminApi } from "@repo/api";
import { paymentsKeys } from "@repo/hooks";

import type { Payment, PaginationResponse, PaymentParams } from "@repo/types";

export function usePayments(params?: PaymentParams) {
  return useQuery<PaginationResponse<Payment>>({
    queryKey: paymentsKeys.list(params),
    queryFn: () => paymentAdminApi.getAllPayments(params),
  });
}

export function usePayment(id: string) {
  return useQuery<Payment>({
    queryKey: paymentsKeys.detail(id),

    queryFn: () => paymentAdminApi.getPayment(id),

    enabled: !!id,
  });
}
