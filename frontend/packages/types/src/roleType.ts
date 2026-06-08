import { z } from "zod";

import { roleSchema, roleCreationSchema } from "@repo/schemas";

export type Role = z.infer<typeof roleSchema>;

export type RoleRequest = z.infer<typeof roleCreationSchema>;
