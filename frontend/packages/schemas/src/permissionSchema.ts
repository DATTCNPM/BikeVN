import { z } from "zod";

export const permissionCreationSchema = z.object({
  name: z.string().min(1, "Permission name cannot be empty"),

  description: z.string().optional(),
});

export const permissionSchema = permissionCreationSchema.extend({
  id: z.string(),
});

export type PermissionType = z.infer<typeof permissionSchema>;

export type PermissionRequest = z.infer<typeof permissionCreationSchema>;
