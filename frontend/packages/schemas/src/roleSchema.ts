import { z } from "zod";

export const permissionCreationSchema = z.object({
  name: z.string().min(1, "Tên quyền không được để trống"),

  description: z.string().optional(),
});

export const permissionSchema = permissionCreationSchema.extend({
  id: z.string().optional(),
});

export const roleCreationSchema = z.object({
  name: z.string().min(1, "Tên vai trò không được để trống"),

  description: z.string().optional(),

  permissions: z.array(z.string()).default([]),
});

export const roleSchema = roleCreationSchema.extend({
  id: z.string().optional(),
});
