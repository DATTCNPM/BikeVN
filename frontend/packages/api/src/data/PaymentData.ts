import type { Payment } from "@repo/types";

export const payments: Payment[] = [
  {
    id: "1",
    booking_id: "booking-1",
    amount: 100,
    type: "deposit",
    card_method: "momo",
    payment_method: "momo",
    status: "completed",
    transaction_code: "TXN123456",
    paid_at: "2024-01-01T10:00:00Z",
    created_at: "2024-01-01T09:00:00Z",
  },
  {
    id: "2",
    booking_id: "booking-2",
    amount: 200,
    type: "rental",
    card_method: "vnpay",
    payment_method: "vnpay",
    status: "pending",
    transaction_code: null,
    paid_at: null,
    created_at: "2024-01-02T09:00:00Z",
  },
];
