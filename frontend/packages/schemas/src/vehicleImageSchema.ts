import { z } from "zod";

export const vehicleImageCreationSchema = z.object({
  imageUrl: z
    .array(z.instanceof(File))
    .min(1, "Please select at least one image"),
});

export const vehicleImageUpdateSchema = z.object({
  imageUrl: z.instanceof(File).optional(),

  altText: z.string().optional(),

  displayOrder: z.number().optional(),

  isPrimary: z.boolean().optional(),
});

export const vehicleImageSchema = vehicleImageCreationSchema
  .omit({
    imageUrl: true,
  })
  .extend({
    id: z.string(),
    vehicleId: z.string(),
    imageUrl: z.string(),
    altText: z.string().nullable(),
    displayOrder: z.number(),
    isPrimary: z.boolean(),
    createdAt: z.string(),
  });

export type VehicleImage = z.infer<typeof vehicleImageSchema>;

export type VehicleImageCreatePayload = z.infer<
  typeof vehicleImageCreationSchema
>;

export type VehicleImageUpdatePayload = z.infer<
  typeof vehicleImageUpdateSchema
>;
