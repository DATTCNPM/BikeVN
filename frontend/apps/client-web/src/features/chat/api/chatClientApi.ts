import axiosClient from "@/hooks/axiosClient";

import type {
  ConversationResponse,
  ChatMessageResponse,
  ChatResponse,
} from "@repo/schemas";

export const chatClientApi = {
  // Lấy hoặc tạo phòng chat với một Chi nhánh
  async getOrCreateBranchConversation(
    branchId: string,
  ): Promise<ConversationResponse> {
    return axiosClient.post<ConversationResponse, ConversationResponse>(
      `/chat/conversations/branch/${branchId}`,
    );
  },

  // Lấy lịch sử tin nhắn dạng phân trang
  async getMessageHistory(
    conversationId: string,
    params?: { page?: number; size?: number },
  ): Promise<ChatResponse<ChatMessageResponse>> {
    return axiosClient.get<
      ChatResponse<ChatMessageResponse>,
      ChatResponse<ChatMessageResponse>
    >(`/chat/${conversationId}`, { params });
  },

  // Lấy danh sách các cuộc hội thoại của User hiện tại
  async getMyConversations(): Promise<ConversationResponse[]> {
    return axiosClient.get<ConversationResponse[], ConversationResponse[]>(
      "/chat/conversations",
    );
  },
};
