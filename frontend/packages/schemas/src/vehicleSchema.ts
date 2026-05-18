// schemas/vehicleSchema.ts

import { z } from "zod";

export const vehicleStatusSchema = z.enum([
  "available",
  "unavailable",
  "maintenance",
]);

export const fuelTypeSchema = z.enum([
  "gasoline",
  "diesel",
  "electric",
  "hybrid",
]);

export const vehicleSchema = z.object({
  name: z
    .string()
    .min(1, "Tên xe là bắt buộc")
    .max(100, "Tên xe tối đa 100 ký tự"),

  brand: z.string().min(1, "Hãng xe là bắt buộc"),

  model: z.string().min(1, "Model là bắt buộc"),

  license_plate: z.string().min(1, "Biển số là bắt buộc"),

  color: z.string().min(1, "Màu xe là bắt buộc"),

  year: z
    .number({
      error: "Năm sản xuất phải là số",
    })
    .min(1900, "Năm sản xuất không hợp lệ")
    .max(new Date().getFullYear() + 1),

  price_per_day: z
    .number({
      error: "Giá thuê phải là số",
    })
    .min(1, "Giá thuê phải lớn hơn 0"),

  status: vehicleStatusSchema,

  engine_capacity: z
    .number({
      error: "Dung tích động cơ phải là số",
    })
    .min(1, "Dung tích động cơ không hợp lệ"),

  fuel_type: fuelTypeSchema,

  mileage: z
    .number({
      error: "Số km phải là số",
    })
    .min(0),

  image_url: z
    .array(z.string().url("URL ảnh không hợp lệ"))
    .min(1, "Cần ít nhất 1 ảnh"),

  description: z.string().optional(),

  current_branch_id: z.string().min(1, "Chi nhánh là bắt buộc"),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
