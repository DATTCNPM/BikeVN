import { conversations, messages } from "./data/ChatData";

import type { Conversation, Message, SendMessagePayload } from "@repo/schemas";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const chatApi = {
  async getConversations(): Promise<Conversation[]> {
    await delay(500);

    return conversations;
  },

  async getMessages(conversationId: number): Promise<Message[]> {
    await delay(500);

    return messages[conversationId] || [];
  },

  async sendMessage(
    conversationId: number,
    payload: SendMessagePayload,
  ): Promise<Message> {
    await delay(500);

    const newMessage: Message = {
      id: Date.now(),
      senderId: 1,
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
