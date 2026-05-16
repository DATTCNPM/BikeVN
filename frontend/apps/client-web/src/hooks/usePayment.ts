import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  paymentApi,
  type CreatePaymentPayload,
  type UpdatePaymentPayload,
} from "@repo/api";

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: paymentApi.getPayments,
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => paymentApi.getPaymentById(id),

    enabled: !!id,
  });
}

export function usePaymentsByBooking(bookingId: string) {
  return useQuery({
    queryKey: ["payments", "booking", bookingId],
    queryFn: () => paymentApi.getPaymentsByBookingId(bookingId),

    enabled: !!bookingId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) =>
      paymentApi.createPayment(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["payments", "booking", variables.booking_id],
      });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePaymentPayload;
    }) => paymentApi.updatePayment(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["payment", variables.id],
      });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentApi.deletePayment(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
    },
  });
}
