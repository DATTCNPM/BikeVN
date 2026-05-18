export type PaymentMethod = "momo" | "vnpay" | "card";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type Payment = {
  id: string;
  booking_id: string;
  amount: number;
  type: "deposit" | "rental";
  card_method: PaymentMethod;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_code?: string | null;
  paid_at?: string | null;
  created_at: string;
};
