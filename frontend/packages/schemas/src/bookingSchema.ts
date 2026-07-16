import { z } from "zod";
import { paymentSchema } from "./paymentSchema";
// Định nghĩa các trạng thái của booking
export const bookingStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "completed",
  "cancelled",
]);

export const bookingFilterSchema = z.object({
  userId: z.string().optional(),
  vehicleId: z.string().optional(),
  status: bookingStatusSchema.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

// Định nghĩa schema cho việc tạo booking mới
export const bookingCreationSchema = z.object({
  userId: z.string().min(1),
  vehicleId: z.string().min(1),
  pickupBranchId: z.string().min(1),
  returnBranchId: z.string().min(1),

  startTime: z.string(),
  endTime: z.string(),
});

export const bookingUpdateSchema = z.object({
  pickupBranchId: z.string().min(1).optional(),
  returnBranchId: z.string().min(1).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: bookingStatusSchema.optional(),
});

// Định nghĩa schema cho booking hoàn chỉnh, bao gồm cả các trường tự động sinh ra
export const bookingSchema = bookingCreationSchema.extend({
  id: z.string(),
  actualReturnTime: z.string().nullable().optional(),
  totalPrice: z.number().nullable().optional(),
  status: bookingStatusSchema,
  payments: z.array(paymentSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  expiresAt: z.string(),
});

// Tạo kiểu TypeScript từ schema
export const bookingFormSchema = z.object({
  returnBranchId: z.string().min(1, "Return branch is required"),

  dateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine((data) => data.to > data.from, {
      message: "End date must be after start date",
      path: ["to"],
    }),
});
