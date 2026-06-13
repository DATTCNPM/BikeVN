import { z } from "zod";

import {
  userSchema,
  userRoleSchema,
  updateProfileSchema,
  adminUserCreationSchema,
  userCreationSchema,
  updateUserSchema,
  adminEmployeeCreationSchema,
  employeeSchema,
} from "@repo/schemas";

export type User = z.infer<typeof userSchema>;

export type UserRole = z.infer<typeof userRoleSchema>;

export type UserCreationRequest = z.infer<typeof userCreationSchema>;

export type AdminUserCreationPayload = z.infer<typeof adminUserCreationSchema>;

export type UpdateUserPayload = z.infer<typeof updateUserSchema>;

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;

export type Employee = z.infer<typeof employeeSchema>;

export type AdminEmployeeCreationPayload = z.infer<
  typeof adminEmployeeCreationSchema
>;
