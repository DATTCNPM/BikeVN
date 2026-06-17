import { z } from "zod";
import { vehicleImageSchema } from "./vehicleImageSchema";

export const vehicleStatusSchema = z.enum([
  "available",
  "unavailable",
  "maintenance",
]);

export const vehicleTypeSchema = z.enum(["fuel", "electric"]);

export const vehicleCreationSchema = z.object({
  name: z.string().min(1, "Tên xe không được để trống"),

  brandId: z.number().int().min(1),

  modelId: z.number().int().min(1),

  licensePlate: z.string().min(1, "Biển số xe không được để trống"),

  color: z.string().min(1, "Màu sắc không được để trống"),

  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),

  pricePerDay: z.number().min(0, "Giá thuê phải lớn hơn hoặc bằng 0"),

  vehicleType: vehicleTypeSchema,

  mileage: z.number().min(0, "Số ODO phải lớn hơn hoặc bằng 0"),

  description: z.string().optional(),

  status: vehicleStatusSchema,

  currentBranchId: z.string().min(1, "Vui lòng chọn chi nhánh"),
});

export const vehicleUpdateSchema = vehicleCreationSchema.partial();

export const vehicleSchema = vehicleCreationSchema.extend({
  id: z.string(),

  createdAt: z.string().datetime(),

  updatedAt: z.string().datetime(),

  images: z.array(vehicleImageSchema).optional(),
});

export const vehicleQuerySchema = z.object({
  search: z.string().optional(),

  currentBranchId: z.string().optional(),

  vehicleType: vehicleTypeSchema.optional(),

  minPrice: z.number().optional(),

  maxPrice: z.number().optional(),

  page: z.number().optional(),

  pageSize: z.number().optional(),
});
