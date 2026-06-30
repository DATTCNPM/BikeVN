import { z } from "zod";

export const chatMessageResponseSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  content: z.string(),
  isRead: z.boolean(),
  createdAt: z.string(), // Mapping với LocalDateTime từ backend
});

export const conversationResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  branchId: z.string().nullable().optional(),
  lastMessageContent: z.string().nullable().optional(),
  lastMessageTime: z.string().nullable().optional(),
});

export const chatMessageRequestSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1, "Message cannot be empty"),
});

export const readReceiptEventSchema = z.object({
  conversationId: z.string(),
  readerId: z.string(),
  eventType: z.literal("READ_RECEIPT"),
});
