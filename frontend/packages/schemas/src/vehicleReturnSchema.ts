import { z } from "zod";

// --- THÊM MỚI: Schema cho PaymentResponse để khớp với Backend ---
export const paymentResponseSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  amount: z.number(),
  status: z.enum([
    "pending",
    "completed",
    "failed",
    "processing_refund",
    "refunded",
  ]),
  type: z.enum(["rental", "extra_fee", "unspecified"]),
  transferContent: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const vehicleConditionStatusSchema = z.enum([
  "excellent",
  "good",
  "fair",
  "damaged",
]);

// --- CẬP NHẬT: Thêm trường payment vào đây ---
export const vehicleReturnSchema = z.object({
  id: z.string(),

  bookingId: z.string(),

  returnBranchId: z.string(),

  conditionStatus: vehicleConditionStatusSchema,

  damageDescription: z.string().nullable().optional(),

  extraFee: z.coerce.number().min(0).default(0),

  images: z.array(z.string()).default([]),

  returnOdometerReading: z.number().int().nonnegative(),

  notes: z.string().nullable().optional(),

  employeeId: z.string(),

  // 🟢 BỔ SUNG: Cho phép có hoặc không có payment (vì nếu extraFee = 0, backend trả về null)
  payment: paymentResponseSchema.nullable().optional(),

  createdAt: z.string(),

  updatedAt: z.string(),
});

export const createVehicleReturnSchema = z.object({
  bookingId: z.string(),

  returnBranchId: z.string(),

  conditionStatus: vehicleConditionStatusSchema,

  damageDescription: z.string().optional(),

  extraFee: z.number().min(0),

  images: z.array(z.instanceof(File)),

  returnOdometerReading: z
    .number({
      message: "Please enter the current mileage",
    })
    .int()
    .nonnegative(),

  notes: z.string().optional(),

  employeeId: z.string(),
});

export const updateVehicleReturnSchema = createVehicleReturnSchema.partial();

export const vehicleReturnFilterParamsSchema = z.object({
  bookingId: z.string().optional(),
  returnBranchId: z.string().optional(),
  conditionStatus: vehicleConditionStatusSchema.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  size: z.coerce.number().int().min(1).optional(),
});
