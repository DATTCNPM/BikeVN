import { conversations, messages } from "./data/ChatData";

import type { conversation, message, SendMessagePayload } from "@repo/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const chatApi = {
  async getConversations(): Promise<conversation[]> {
    await delay(500);

    return conversations;
  },

  async getMessages(conversationId: string): Promise<message[]> {
    await delay(500);

    return messages[conversationId] || [];
  },

  async sendMessage(
    conversationId: string,
    payload: SendMessagePayload,
  ): Promise<message> {
    await delay(500);

    const newMessage: message = {
      id: Date.now().toString(),
      senderId: "currentUserId", // Thay bằng ID người dùng hiện tại
      content: payload.content,
      image: payload.image,
      createdAt: new Date().toISOString(),
    };

    if (!messages[conversationId]) {
      messages[conversationId] = [];
    }

    messages[conversationId].push(newMessage);

    return newMessage;
  },
};
