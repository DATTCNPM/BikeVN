import { z } from "zod";

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
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
});

// Định nghĩa schema cho việc tạo booking mới
export const bookingCreationSchema = z.object({
  userId: z.string().min(1),
  vehicleId: z.string().min(1),
  pickupBranchId: z.string().min(1),
  returnBranchId: z.string().min(1),

  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export const bookingUpdateSchema = z.object({
  pickupBranchId: z.string().min(1).optional(),
  returnBranchId: z.string().min(1).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  status: bookingStatusSchema.optional(),
});

// Định nghĩa schema cho booking hoàn chỉnh, bao gồm cả các trường tự động sinh ra
export const bookingSchema = bookingCreationSchema.extend({
  id: z.string(),
  actualReturnTime: z.string().datetime().nullable().optional(),
  totalPrice: z.number().nullable().optional(),
  status: bookingStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
});

// Tạo kiểu TypeScript từ schema
export const bookingFormSchema = z.object({
  returnBranchId: z.string().min(1),

  dateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine((data) => data.to > data.from, {
      message: "Ngày trả xe phải sau ngày nhận xe",
      path: ["to"],
    }),
});
