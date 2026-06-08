import { useQuery } from "@tanstack/react-query";

import { paymentAdminApi } from "@repo/api";
import { paymentsKeys } from "@repo/hooks";

export function usePayments() {
  return useQuery({
    queryKey: paymentsKeys.all,
    queryFn: () => paymentAdminApi.getAllPayments(),
  });
}
