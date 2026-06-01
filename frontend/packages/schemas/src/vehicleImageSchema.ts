import { z } from "zod";

export const vehicleImageSchema = z.object({
  file: z.instanceof(File),

  altText: z.string().optional(),

  displayOrder: z.number().min(0).optional(),

  isPrimary: z.boolean().optional(),
});

export type VehicleImageFormData = z.infer<typeof vehicleImageSchema>;
