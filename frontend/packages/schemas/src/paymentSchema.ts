import { z } from "zod";

// 1. Enums đồng bộ chính xác với Backend (PaymentType & PaymentStatus)
export const paymentTypeSchema = z.enum(["rental", "extra_fee", "unspecified"]);
export const paymentStatusSchema = z.enum([
  "pending",
  "completed",
  "failed",
  "processing_refund", // THÊM MỚI
  "refunded",
]);

// 2. Schema thực thể Thanh toán (Gộp đầy đủ từ Payment Entity & PaymentResponse)
export const paymentSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  branchId: z.string().nullish(),
  amount: z.coerce.number(),
  type: paymentTypeSchema,
  paymentMethod: z.string(),
  status: paymentStatusSchema,
  transactionCode: z.string().nullish(),
  idempotencyKey: z.string().uuid().nullish(),
  notes: z.string().nullish(),
  paidAt: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),

  // Các trường thông tin bổ sung từ PaymentResponse phục vụ hiển thị QR/Chuyển khoản
  bankName: z.string().nullish(),
  bankAccount: z.string().nullish(),
  accountName: z.string().nullish(),
  transferContent: z.string().nullish(),
  qrContent: z.string().nullish(),
});

// 3. Schemas cho các luồng Request Payloads (Khởi tạo, Duyệt tay, Hủy, Hoàn tiền)
export const paymentCreationSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  transactionCode: z.string().optional(),
  idempotencyKey: z.string().uuid("Idempotency Key must be a valid UUID"),
});

export const approvePaymentManualSchema = z.object({
  id: z.string().min(1),
  adminId: z.string().min(1),
  actualPaymentMethod: z.string().min(1),
});

export const cancelPaymentSchema = z.object({
  id: z.string().min(1),
  reason: z.string().optional(),
});

export const processRefundSchema = z.object({
  id: z.string().min(1),
  adminId: z.string().min(1),
});

// 4. Schema bộ lọc đồng bộ cấu trúc API `@GetMapping("/admin/filter")` của BE
export const paymentFilterParamsSchema = z.object({
  bookingId: z.string().optional(),
  transactionCode: z.string().optional(),
  branchId: z.string().optional(),
  status: paymentStatusSchema.optional(),
  notes: z.string().optional(),
  type: paymentTypeSchema.optional(),
  fromDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date format must be YYYY-MM-DD")
    .optional(),
  toDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date format must be YYYY-MM-DD")
    .optional(),
  page: z.coerce.number().int().positive().default(1).optional(),
  size: z.coerce.number().int().positive().default(10).optional(),
});

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
export type PaymentFilterParams = z.infer<typeof paymentFilterParamsSchema>;
