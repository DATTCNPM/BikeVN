import { z } from "zod";

export const userRoleSchema = z.enum(["user", "admin", "employee"]);

const optionalString = (schema: z.ZodString) => schema.or(z.literal(""));
const userBaseSchema = z.object({
  name: z.string().min(1, "User name cannot be empty"),
  email: z.string().email("Email is invalid"),
  phone: optionalString(z.string().min(10, "Phone number is invalid")),
  cccdNumber: optionalString(z.string().min(9, "CCCD number is invalid")),
});

export const userSchema = userBaseSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userCreationSchema = userBaseSchema.extend({
  passwordHash: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

export const employeeSchema = userSchema.extend({
  branchId: z.string().optional(),
});

export const updateEmployeeSchema = userBaseSchema.extend({
  branchId: z.string().optional(),
});

export const adminEmployeeCreationSchema = userCreationSchema.extend({
  branchId: z.string().min(1, "Branch cannot be empty"),
});
export const adminUserCreationSchema = userCreationSchema.extend({});
export const updateUserSchema = userBaseSchema.extend({});

export const updateProfileSchema = userBaseSchema;

export const userQuerySchema = z.object({
  keyword: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export const employeeQuerySchema = z.object({
  keyword: z.string().optional(),
  isActive: z.boolean().optional(),
  branchId: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});
