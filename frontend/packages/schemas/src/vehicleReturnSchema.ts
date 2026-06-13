import { z } from "zod";

export const vehicleConditionStatusSchema = z.enum([
  "excellent",
  "good",
  "fair",
  "damaged",
]);

export const vehicleReturnSchema = z.object({
  id: z.string().uuid(),

  bookingId: z.string().uuid(),

  returnBranchId: z.string().uuid(),

  conditionStatus: vehicleConditionStatusSchema,

  damageDescription: z.string().nullable().optional(),

  extraFee: z.coerce.number().nullable().optional(),

  images: z.array(z.string()).default([]),

  returnOdometerReading: z.number().int().nonnegative(),

  notes: z.string().nullable().optional(),

  employeeId: z.string().uuid(),

  createdAt: z.string().datetime(),

  updatedAt: z.string().datetime(),
});

export const createVehicleReturnSchema = z.object({
  bookingId: z.string().uuid({
    message: "Booking không hợp lệ",
  }),

  returnBranchId: z.string().uuid({
    message: "Chi nhánh trả xe không hợp lệ",
  }),

  conditionStatus: vehicleConditionStatusSchema,

  damageDescription: z.string().optional(),

  extraFee: z.coerce.number().min(0).optional(),

  images: z.array(z.instanceof(File)).optional(),

  returnOdometerReading: z
    .number({
      message: "Vui lòng nhập số km hiện tại",
    })
    .int()
    .nonnegative(),

  notes: z.string().optional(),

  employeeId: z.string().uuid({
    message: "Nhân viên không hợp lệ",
  }),
});

export const updateVehicleReturnSchema = createVehicleReturnSchema.partial();
