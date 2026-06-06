import { z } from "zod";

export const userRoleSchema = z.enum(["user", "admin"]);

export const userSchema = z.object({
  id: z.string(),

  name: z.string(),

  email: z.string().email(),

  phone: z.string().optional(),

  cccdNumber: z.string().optional(),

  role: userRoleSchema.optional(),

  created_at: z.string().optional(),

  updated_at: z.string().optional(),
});
