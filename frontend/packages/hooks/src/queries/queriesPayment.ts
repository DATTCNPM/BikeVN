import { useQuery } from "@tanstack/react-query";

import { paymentCommonApi } from "@repo/api";

import { paymentsKeys } from "../queryKeys";

export function usePayment(id: string) {
  return useQuery({
    queryKey: paymentsKeys.detail(id),

    queryFn: () => paymentCommonApi.getPayment(id),

    enabled: !!id,
  });
}
