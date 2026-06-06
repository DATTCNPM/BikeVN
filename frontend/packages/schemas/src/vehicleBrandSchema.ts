import { z } from "zod";

export const vehicleBrandCreationSchema = z.object({
  name: z
    .string()
    .min(1, "Tên hãng xe không được để trống")
    .max(100, "Tên hãng xe quá dài"),

  country: z
    .string()
    .min(1, "Quốc gia không được để trống")
    .max(100, "Quốc gia quá dài"),
});

export const vehicleBrandUpdateSchema = vehicleBrandCreationSchema;

export const vehicleBrandSchema = vehicleBrandCreationSchema.extend({
  id: z.number(),
  createdAt: z.string().datetime(),
});
