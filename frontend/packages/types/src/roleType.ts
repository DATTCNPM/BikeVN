import { z } from "zod";

import {
  permissionSchema,
  permissionCreationSchema,
  roleSchema,
  roleCreationSchema,
} from "@repo/schemas";

export type Permission = z.infer<typeof permissionSchema>;

export type PermissionRequest = z.infer<typeof permissionCreationSchema>;

export type Role = z.infer<typeof roleSchema>;

export type RoleRequest = z.infer<typeof roleCreationSchema>;
