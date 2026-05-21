import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "Tên vai trò không được để trống"),
  description: z.string().optional(),
  permissions: z.array(z.string()).default([]),
});

export const permissionSchema = z.object({
  name: z.string().min(1, "Tên quyền không được để trống"),
  description: z.string().optional(),
});

export type RoleSchema = z.infer<typeof roleSchema>;
export type PermissionSchema = z.infer<typeof permissionSchema>;
