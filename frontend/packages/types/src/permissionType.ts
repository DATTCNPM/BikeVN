import { z } from "zod";

import { permissionSchema, permissionCreationSchema } from "@repo/schemas";

export type Permission = z.infer<typeof permissionSchema>;

export type PermissionRequest = z.infer<typeof permissionCreationSchema>;
