import { z } from "zod";

export const vehicleModelCreationSchema = z.object({
  brandId: z.number({
    message: "Vui lòng chọn thương hiệu xe",
  }),

  name: z.string().min(1, "Tên dòng xe không được để trống"),

  engineCapacity: z.number().min(50, "Dung tích động cơ không hợp lệ"),

  yearFrom: z.number().optional(),

  yearTo: z.number().optional(),
});

export const vehicleModelUpdateSchema = vehicleModelCreationSchema;

export const vehicleModelSchema = vehicleModelCreationSchema.extend({
  id: z.number(),
  createdAt: z.string().datetime(),
});
