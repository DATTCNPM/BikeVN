import { z } from "zod";

export const roleCreationSchema = z.object({
  name: z.string().min(1, "Role name cannot be empty"),

  description: z.string().optional(),

  permissions: z.array(z.string()),
});

export const roleSchema = roleCreationSchema.extend({
  id: z.string(),
});

export type RoleType = z.infer<typeof roleSchema>;

export type RoleRequest = z.infer<typeof roleCreationSchema>;
