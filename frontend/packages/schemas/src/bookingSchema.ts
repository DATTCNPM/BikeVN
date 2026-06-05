import { z } from "zod";

type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled";

export const bookingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  vehicleId: z.string(),
  pickupBranchId: z.string(),
  returnBranchId: z.string(),

  startTime: z.string().datetime(),
  endTime: z.string().datetime(),

  actualReturnTime: z.string().datetime().nullable().optional(),

  totalPrice: z.number().nullable().optional(),

  status: z.string().refine((v): v is BookingStatus => !!v),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const bookingCreationSchema = z.object({
  userId: z.string().min(1),
  vehicleId: z.string().min(1),
  pickupBranchId: z.string().min(1),
  returnBranchId: z.string().min(1),

  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export const bookingFormSchema = z.object({
  pickupBranchId: z.string().min(1, "Vui lòng chọn nơi nhận xe"),

  returnBranchId: z.string().min(1, "Vui lòng chọn nơi trả xe"),

  dateRange: z.object({
    from: z.date({
      message: "Vui lòng chọn ngày nhận xe",
    }),

    to: z.date({
      message: "Vui lòng chọn ngày trả xe",
    }),
  }),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
