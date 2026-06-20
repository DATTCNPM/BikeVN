import type { PaymentParams } from "@repo/types";
export const paymentsKeys = {
  all: ["payments"] as const,

  list: (params?: PaymentParams) => ["payments", params] as const,

  detail: (id: string) => ["payment", id] as const,

  byBooking: (bookingId: string) => ["payments", "booking", bookingId] as const,
};
