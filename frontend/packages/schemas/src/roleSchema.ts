import { z } from "zod";

export const roleCreationSchema = z.object({
  name: z.string().min(1, "Tên vai trò không được để trống"),

  description: z.string().optional(),

  permissions: z.array(z.string()),
});

export const roleSchema = roleCreationSchema.extend({
  id: z.string(),
});
