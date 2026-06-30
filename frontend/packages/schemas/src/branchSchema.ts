import { z } from "zod";

export const branchStatusSchema = z.enum(["active", "inactive"]);

export const createBranchSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),

  address: z.string().min(5, "Address must be at least 5 characters long"),

  lat: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),

  lng: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  status: z.enum(["active", "inactive"]),
});

export const updateBranchSchema = createBranchSchema.partial();

export const branchSchema = createBranchSchema.extend({
  id: z.string(),

  createdAt: z.string().optional(),
});
