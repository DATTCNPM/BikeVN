import type { z } from "zod";
import type {
  paymentSchema,
  paymentCreationSchema,
  paymentStatusSchema,
  paymentTypeSchema,
  paymentFilterParamsSchema,
  approvePaymentManualSchema,
  cancelPaymentSchema,
  processRefundSchema,
} from "@repo/schemas";

// 1. Các kiểu dữ liệu Enum & Literal định danh
export type PaymentType = z.infer<typeof paymentTypeSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentMethod = "vnpay" | "momo" | "cash" | string; // Dự phòng string vì BE nhận String tự do

// 2. Kiểu dữ liệu Core Model hiển thị dữ liệu
export type Payment = z.infer<typeof paymentSchema>;

// 3. Kiểu dữ liệu Request Payloads (Tận dụng Single Source of Truth từ Zod)
export type PaymentCreationPayload = z.infer<typeof paymentCreationSchema>;
export type ApprovePaymentPayload = z.infer<typeof approvePaymentManualSchema>;
export type CancelPaymentPayload = z.infer<typeof cancelPaymentSchema>;
export type ProcessRefundPayload = z.infer<typeof processRefundSchema>;

// 4. Kiểu dữ liệu Query Parameters dành cho API bộ lọc Admin
export type PaymentParams = z.infer<typeof paymentFilterParamsSchema>;
