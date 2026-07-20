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

export interface ChatResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}

export type ChatMessageResponse = z.infer<typeof chatMessageResponseSchema>;
export type ConversationResponse = z.infer<typeof conversationResponseSchema>;
export type ChatMessageRequest = z.infer<typeof chatMessageRequestSchema>;
export type ReadReceiptEvent = z.infer<typeof readReceiptEventSchema>;
