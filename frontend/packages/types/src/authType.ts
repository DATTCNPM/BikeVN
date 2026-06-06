import { z } from "zod";

import {
  loginSchema,
  registerSchema,
  userCreationSchema,
  adminUserCreationSchema,
  updateProfileSchema,
  updatePasswordSchema,
} from "@repo/schemas";

export type LoginPayload = z.infer<typeof loginSchema>;

export type RegisterPayload = z.infer<typeof registerSchema>;

export type UserCreationRequest = z.infer<typeof userCreationSchema>;

export type AdminUserCreationRequest = z.infer<typeof adminUserCreationSchema>;

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;

export type UpdatePasswordPayload = z.infer<typeof updatePasswordSchema>;
