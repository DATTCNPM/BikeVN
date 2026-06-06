import { z } from "zod";

export const paymentStatusSchema = z.enum(["pending", "completed", "failed"]);

export const paymentSchema = z.object({
  id: z.string(),

  bookingId: z.string(),

  amount: z.coerce.number(),

  type: z.enum(["deposit", "rental"]),

  paymentMethod: z.string(),

  status: paymentStatusSchema,

  bankName: z.string().nullable().optional(),

  bankAccount: z.string().nullable().optional(),

  accountName: z.string().nullable().optional(),

  transferContent: z.string().nullable().optional(),

  qrContent: z.string().nullable().optional(),

  createdAt: z.string().datetime(),
});

export const paymentCreationSchema = z.object({
  bookingId: z.string().min(1),

  amount: z.coerce.number().positive(),

  paymentMethod: z.string().min(1),

  transactionCode: z.string().optional(),

  idempotencyKey: z.string().uuid(),
});

export const paymentConfirmSchema = z.object({
  transactionCode: z.string().min(1),
});
