import { z } from "zod";

export const conversationSchema = z.object({
  id: z.string(),
  branchName: z.string().min(1),
  lastMessage: z.string(),
  unreadCount: z.number().min(0),
  updatedAt: z.string(),
  online: z.boolean(),
});

export const messageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  content: z.string().min(1).max(1000),
  image: z.file().nullable(),
  createdAt: z.string(),
});

export const sendMessageSchema = z
  .object({
    content: z.string().trim().max(1000).optional(),
    image: z.file().nullable(),
  })
  .refine((data) => data.content || data.image, {
    message: "Message content or image is required",
  });
export type SendMessagePayload = z.infer<typeof sendMessageSchema>;
