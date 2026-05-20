import { z } from "zod";

export const bookingSchema = z
  .object({
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
  })
  .refine((data) => data.dateRange.to > data.dateRange.from, {
    message: "Ngày trả phải sau ngày nhận",
    path: ["dateRange"],
  });

export type BookingSchema = z.infer<typeof bookingSchema>;
