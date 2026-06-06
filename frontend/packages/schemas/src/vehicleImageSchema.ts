import { z } from "zod";

export const vehicleImageCreationSchema = z.object({
  file: z.instanceof(File),

  altText: z.string().optional(),

  displayOrder: z.number().min(0).optional(),

  isPrimary: z.boolean().optional(),
});

export const vehicleImageUpdateSchema = vehicleImageCreationSchema.partial();

export const vehicleImageSchema = vehicleImageCreationSchema
  .omit({
    file: true,
  })
  .extend({
    id: z.string(),
    vehicleId: z.string(),
    imageUrl: z.string(),
    displayOrder: z.number(),
    isPrimary: z.boolean(),
    createdAt: z.string().datetime(),
  });
