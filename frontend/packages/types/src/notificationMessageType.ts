import { z } from "zod";
import { NotificationMessageSchema } from "@repo/schemas";
export type NotificationMessage = z.infer<typeof NotificationMessageSchema>;
