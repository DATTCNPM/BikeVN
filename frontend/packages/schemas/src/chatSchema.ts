import { z } from "zod";

export const conversationSchema = z.object({
  id: z.number(),
  branchName: z.string().min(1),
  lastMessage: z.string(),
  unreadCount: z.number().min(0),
  updatedAt: z.string(),
  online: z.boolean(),
});

export const messageSchema = z.object({
  id: z.number(),
  senderId: z.number(),
  content: z.string().optional(),
  image: z.string().optional(),
  createdAt: z.string(),
});

export const sendMessageSchema = z
  .object({
    content: z.string().trim().optional(),
    image: z.string().optional(),
  })
  .refine((data) => data.content || data.image, {
    message: "Message content or image is required",
  });

export type Conversation = z.infer<typeof conversationSchema>;

export type Message = z.infer<typeof messageSchema>;

export type SendMessagePayload = z.infer<typeof sendMessageSchema>;
