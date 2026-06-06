import { z } from "zod";

import {
  paymentSchema,
  paymentCreationSchema,
  paymentConfirmSchema,
} from "@repo/schemas";

export type PaymentMethod = "vnpay" | "momo" | "card";

export type Payment = z.infer<typeof paymentSchema>;

export type PaymentCreationPayload = z.infer<typeof paymentCreationSchema>;

export type PaymentConfirmPayload = z.infer<typeof paymentConfirmSchema>;
