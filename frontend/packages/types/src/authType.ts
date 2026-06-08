import { z } from "zod";

import {
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from "@repo/schemas";

export type LoginPayload = z.infer<typeof loginSchema>;

export type RegisterPayload = z.infer<typeof registerSchema>;

export type UpdatePasswordPayload = z.infer<typeof updatePasswordSchema>;
