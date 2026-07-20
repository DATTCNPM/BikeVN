import { z } from "zod";

export const vehicleModelCreationSchema = z.object({
  brandId: z.number({
    message: "Please select a vehicle brand",
  }),

  name: z.string().min(1, "Model name cannot be empty"),

  engineCapacity: z.number().min(50, "Engine capacity is invalid"),

  yearFrom: z.number().optional(),

  yearTo: z.number().optional(),
});

export const vehicleModelUpdateSchema = vehicleModelCreationSchema;

export const vehicleModelSchema = vehicleModelCreationSchema.extend({
  id: z.number(),
  createdAt: z.string(),
});

export const VehicleModelQueryParamsSchema = z.object({
  brandId: z.number().optional(),
  name: z.string().optional(),
  minEngineCapacity: z.number().optional(),
  maxEngineCapacity: z.number().optional(),
  productionYear: z.number().optional(),
  page: z.number().default(1),
  size: z.number().default(10),
});

export type VehicleModel = z.infer<typeof vehicleModelSchema>;

export type VehicleModelCreationRequest = z.infer<
  typeof vehicleModelCreationSchema
>;

export type VehicleModelUpdateRequest = z.infer<
  typeof vehicleModelUpdateSchema
>;

export type VehicleModelQueryParams = z.infer<
  typeof VehicleModelQueryParamsSchema
>;
