import type { PaymentFilterParams } from "@repo/schemas";
export const paymentsKeys = {
  all: ["payments"] as const,

  list: (params?: PaymentFilterParams) => ["payments", params] as const,

  detail: (id: string) => ["payment", id] as const,

  byBooking: (bookingId: string) => ["payments", "booking", bookingId] as const,
};
