import { useQuery } from "@tanstack/react-query";

import { paymentApi } from "@repo/api";
import { paymentsKeys } from "../queryKeys";

export function usePayments() {
  return useQuery({
    queryKey: paymentsKeys.all,
    queryFn: paymentApi.getPayments,
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: paymentsKeys.detail(id),
    queryFn: () => paymentApi.getPaymentById(id),
    enabled: !!id,
  });
}

export function usePaymentsByBooking(bookingId: string) {
  return useQuery({
    queryKey: paymentsKeys.byBooking(bookingId),
    queryFn: () => paymentApi.getPaymentsByBookingId(bookingId),
    enabled: !!bookingId,
  });
}
