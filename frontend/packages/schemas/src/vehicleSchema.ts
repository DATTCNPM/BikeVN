import { z } from "zod";
import { vehicleImageSchema } from "./vehicleImageSchema";

export const vehicleStatusSchema = z.enum([
  "available",
  "unavailable",
  "maintenance",
  "rented",
]);

export const VEHICLE_STATUS_OPTIONS: {
  label: string;
  value: z.infer<typeof vehicleStatusSchema>;
}[] = [
  { label: "Available", value: "available" },
  { label: "Unavailable", value: "unavailable" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Rented", value: "rented" },
];

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
  name: z.string().min(1, "Vehicle name cannot be empty"),

  brandId: z.number().int().min(1),

  modelId: z.number().int().min(1),

  licensePlate: z.string().min(1, "License plate cannot be empty"),

  color: z.string().min(1, "Color cannot be empty"),

  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),

  pricePerDay: z.number().min(0, "Price per day must be a positive number"),

  vehicleType: vehicleTypeSchema,

  mileage: z.number().min(0, "Odometer reading must be a positive number"),

  description: z.string().optional(),

  status: vehicleStatusSchema,

  currentBranchId: z.string().min(1, "Please select a branch"),
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

export const vehicleUpdateSchema = vehicleCreationSchema.extend({
  // Nếu có trường nào ở Form sửa không cho sửa hoặc có cấu trúc khác thì override tại đây
});

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

  size: z.number().optional(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;
export type VehicleCardData = z.infer<typeof vehicleCardData>;

export type VehicleCreationRequest = z.infer<typeof vehicleCreationSchema>;

export type VehicleUpdateRequest = z.infer<typeof vehicleUpdateSchema>;

export type VehicleQueryParams = z.infer<typeof vehicleQuerySchema>;

export type VehicleType = z.infer<typeof vehicleTypeSchema>;

export type StatusVehicleEnum = z.infer<typeof vehicleStatusSchema>;
