import { useQuery } from "@tanstack/react-query";

import { paymentClientApi } from "@repo/api";
import { paymentsKeys } from "@repo/hooks";
export function usePayment(id: string) {
  return useQuery({
    queryKey: paymentsKeys.detail(id),

    queryFn: () => paymentClientApi.getPayment(id),

    enabled: !!id,
  });
}
