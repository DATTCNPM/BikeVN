import axiosAdmin from "../axios/axiosAdmin";
import type {
  ConversationResponse,
  ChatMessageResponse,
  PaginationResponse,
} from "@repo/types";

export const chatAdminApi = {
  // Lấy lịch sử tin nhắn của phòng hội thoại
  async getMessageHistory(
    conversationId: string,
    params?: { page?: number; size?: number },
  ): Promise<PaginationResponse<ChatMessageResponse>> {
    return axiosAdmin.get<
      PaginationResponse<ChatMessageResponse>,
      PaginationResponse<ChatMessageResponse>
    >(`/chat/${conversationId}`, { params });
  },

  // Lấy danh sách phòng chat mà admin/employee này được quyền truy cập
  async getMyConversations(): Promise<ConversationResponse[]> {
    return axiosAdmin.get<ConversationResponse[], ConversationResponse[]>(
      "/chat/conversations",
    );
  },
};
