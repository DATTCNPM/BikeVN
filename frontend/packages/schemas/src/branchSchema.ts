import { z } from "zod";

export const branchStatusSchema = z.enum(["active", "inactive"]);

export const createBranchSchema = z.object({
  name: z.string().min(1, "Tên chi nhánh không được để trống"),

  address: z.string().min(1, "Địa chỉ không được để trống"),

  lat: z.number(),

  lng: z.number(),

  status: branchStatusSchema.default("active"),
});

export const updateBranchSchema = createBranchSchema.partial();

export const branchSchema = createBranchSchema.extend({
  id: z.string(),

  createdAt: z.string().datetime().optional(),
});
