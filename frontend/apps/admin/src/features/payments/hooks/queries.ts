import { useQuery } from "@tanstack/react-query";

import { paymentAdminApi } from "../api/paymentAdminApi";
import { paymentsKeys } from "@repo/hooks";

import type {
  Payment,
  PaginationResponse,
  PaymentFilterParams,
} from "@repo/types";

export function usePayments(params?: PaymentFilterParams) {
  return useQuery<PaginationResponse<Payment>>({
    queryKey: paymentsKeys.list(params),
    queryFn: () => paymentAdminApi.getAllPayments(params),
  });
}
