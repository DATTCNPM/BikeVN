import { z } from "zod";

export const permissionCreationSchema = z.object({
  name: z.string().min(1, "Tên quyền không được để trống"),

  description: z.string().optional(),
});

export const permissionSchema = permissionCreationSchema.extend({
  id: z.string().optional(),
});
