import { z } from "zod";

export const typeOptions = ["system", "order", "payment", "promotion"] as const;
export const notificationSchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(100, "Tiêu đề quá dài"),

  description: z
    .string()
    .min(5, "Nội dung quá ngắn")
    .max(500, "Nội dung quá dài"),

  type: z.enum(typeOptions),

  href: z.string().optional(),
});

export type NotificationFormValues = z.infer<typeof notificationSchema>;
