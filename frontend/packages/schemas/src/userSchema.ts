import { z } from "zod";

export const userRoleSchema = z.enum(["user", "admin", "employee"]);

const optionalString = (schema: z.ZodString) => schema.or(z.literal(""));
const userBaseSchema = z.object({
  name: z.string().min(1, "USER_INVALID"),
  email: z.string().email("Email không hợp lệ"),
  phone: optionalString(z.string().min(10, "Số điện thoại không hợp lệ")),
  cccdNumber: optionalString(z.string().min(9, "Số CCCD không hợp lệ")),
});

export const userSchema = userBaseSchema.extend({
  id: z.string(),
  role: userRoleSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userCreationSchema = userBaseSchema.extend({
  passwordHash: z.string().min(6),
});

export const employeeSchema = userSchema.extend({
  branchId: z.string(),
});

export const adminEmployeeCreationSchema = userCreationSchema.extend({
  role: z.literal("employee"),
  branchId: z.string().min(1, "Chi nhánh không được để trống"),
});
export const adminUserCreationSchema = userCreationSchema.extend({
  role: userRoleSchema,
});
export const updateUserSchema = userBaseSchema.extend({
  role: userRoleSchema,
});

export const updateProfileSchema = userBaseSchema;
