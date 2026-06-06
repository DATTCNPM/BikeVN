import { z } from "zod";

import { userSchema, userRoleSchema } from "@repo/schemas";

export type User = z.infer<typeof userSchema>;

export type UserRole = z.infer<typeof userRoleSchema>;
