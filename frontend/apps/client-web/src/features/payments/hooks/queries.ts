import { useQuery } from "@tanstack/react-query";
import { paymentClientApi } from "../api/paymentClientApi";

export function useVerifyVNPayCallback(
  queryParams: Record<string, string>,
  paymentId: string,
) {
  return useQuery({
    queryKey: ["vnpay-callback", paymentId],
    queryFn: () => paymentClientApi.handleVNPayReturn(queryParams),
    enabled: !!paymentId && Object.keys(queryParams).length > 0,
    retry: false,
    staleTime: Infinity,
  });
}
