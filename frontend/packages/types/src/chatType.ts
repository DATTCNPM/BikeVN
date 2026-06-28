import { z } from "zod";
import {
  chatMessageResponseSchema,
  conversationResponseSchema,
  chatMessageRequestSchema,
  readReceiptEventSchema,
} from "@repo/schemas";

export type ChatMessageResponse = z.infer<typeof chatMessageResponseSchema>;
export type ConversationResponse = z.infer<typeof conversationResponseSchema>;
export type ChatMessageRequest = z.infer<typeof chatMessageRequestSchema>;
export type ReadReceiptEvent = z.infer<typeof readReceiptEventSchema>;
