import { z } from "zod";
import { vehicleImageSchema } from "./vehicleImageSchema";

export const vehicleStatusSchema = z.enum([
  "available",
  "unavailable",
  "maintenance",
]);

export const vehicleTypeSchema = z.enum(["fuel", "electric"]);

export const vehicleSchema = z.object({
  id: z.string(),

  name: z.string(),

  brandId: z.number(),

  modelId: z.number(),

  licensePlate: z.string(),

  color: z.string(),

  year: z.number(),

  pricePerDay: z.coerce.number(),

  vehicleType: vehicleTypeSchema,

  mileage: z.number(),

  description: z.string().nullable().optional(),

  status: vehicleStatusSchema,

  currentBranchId: z.string(),

  images: z.array(vehicleImageSchema).default([]),

  createdAt: z.string(),

  updatedAt: z.string(),

  brandName: z.string(),

  modelName: z.string(),

  currentBranchName: z.string(),

  country: z.string(),
});

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

export const vehicleCardData = z.object({
  id: z.string(),
  name: z.string(),
  pricePerDay: z.number(),
  image: z.string().nullable(),
  currentBranchName: z.string(),
  vehicleType: z.string(),
  brandName: z.string(),
  modelName: z.string(),
  country: z.string(),
  status: vehicleStatusSchema.optional(),
});

export const vehicleUpdateSchema = vehicleCreationSchema.partial();

export const vehicleQuerySchema = z.object({
  search: z.string().optional(),

  currentBranchName: z.string().optional(),

  vehicleType: vehicleTypeSchema.optional(),

  minPrice: z.number().optional(),

  maxPrice: z.number().optional(),

  status: vehicleStatusSchema.optional(),

  brandName: z.string().optional(),

  modelName: z.string().optional(),

  country: z.string().optional(),

  page: z.number().optional(),

  pageSize: z.number().optional(),
});
