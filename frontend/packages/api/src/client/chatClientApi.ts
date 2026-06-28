import axiosClient from "../axios/axiosClient";
import type {
  ConversationResponse,
  ChatMessageResponse,
  PaginationResponse,
} from "@repo/types";

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
  ): Promise<PaginationResponse<ChatMessageResponse>> {
    return axiosClient.get<
      PaginationResponse<ChatMessageResponse>,
      PaginationResponse<ChatMessageResponse>
    >(`/chat/${conversationId}`, { params });
  },

  // Lấy danh sách các cuộc hội thoại của User hiện tại
  async getMyConversations(): Promise<ConversationResponse[]> {
    return axiosClient.get<ConversationResponse[], ConversationResponse[]>(
      "/chat/conversations",
    );
  },
};
