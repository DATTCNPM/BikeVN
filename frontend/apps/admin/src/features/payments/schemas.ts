import { z } from "zod";

export const paymentSchema = z.object({
  booking_id: z.string().min(1, "Booking ID là bắt buộc"),
  amount: z.number().min(0, "Số tiền không hợp lệ"),
  type: z.enum(["deposit", "rental"]),
  card_method: z.enum(["momo", "vnpay", "card"]),
  payment_method: z.enum(["momo", "vnpay", "card"]),
  status: z.enum(["pending", "completed", "failed", "refunded"]),
  transaction_code: z.string().optional().nullable(),
  paid_at: z.string().optional().nullable(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
