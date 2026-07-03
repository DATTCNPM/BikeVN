import { z } from "zod";

export const vehicleBrandCreationSchema = z.object({
  name: z
    .string()
    .min(1, "Brand name cannot be empty")
    .max(100, "Brand name is too long"),

  country: z
    .string()
    .min(1, "Country cannot be empty")
    .max(100, "Country name is too long"),
});

export const vehicleBrandUpdateSchema = vehicleBrandCreationSchema;

export const vehicleBrandSchema = vehicleBrandCreationSchema.extend({
  id: z.number(),
  createdAt: z.string(),
});

export const VehicleBrandQueryParamsSchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  page: z.number().default(1),
  size: z.number().default(10),
});
