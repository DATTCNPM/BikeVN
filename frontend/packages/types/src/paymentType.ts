import { z } from "zod";

import {
  paymentSchema,
  paymentCreationSchema,
  paymentConfirmSchema,
  paymentStatusSchema,
  paymentTypeSchema,
} from "@repo/schemas";

export type PaymentType = z.infer<typeof paymentTypeSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentMethod = "vnpay" | "momo" | "card";

export type Payment = z.infer<typeof paymentSchema>;

export type PaymentCreationPayload = z.infer<typeof paymentCreationSchema>;

export type PaymentConfirmPayload = z.infer<typeof paymentConfirmSchema>;

export type ApprovePaymentPayload = {
  id: string;
  adminId: string;
  actualPaymentMethod: string;
};

export type CancelPaymentPayload = {
  id: string;
  reason?: string;
};

export type PaymentParams = {
  page?: number;
  size?: number;
  status?: PaymentStatus;
};
