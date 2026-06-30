import { z } from "zod";

export const typeOptions = ["system", "order", "payment", "promotion"] as const;
export const notificationSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title is too long"),

  description: z
    .string()
    .min(5, "Description is too short")
    .max(500, "Description is too long"),

  type: z.enum(typeOptions),

  href: z.string().optional(),
});

export type NotificationFormValues = z.infer<typeof notificationSchema>;
