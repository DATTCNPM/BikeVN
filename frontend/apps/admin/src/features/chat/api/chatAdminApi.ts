import { axiosAdmin } from "@/hooks/axiosAdmin";
import type {
  ConversationResponse,
  ChatMessageResponse,
  ChatResponse,
} from "@repo/types";

export const chatAdminApi = {
  // Lấy lịch sử tin nhắn của phòng hội thoại
  getMessageHistory(
    conversationId: string,
    params?: { page?: number; size?: number },
  ): Promise<ChatResponse<ChatMessageResponse>> {
    return axiosAdmin.get<
      ChatResponse<ChatMessageResponse>,
      ChatResponse<ChatMessageResponse>
    >(`/chat/${conversationId}`, { params });
  },

  // Lấy danh sách phòng chat mà admin/employee này được quyền truy cập
  getMyConversations(): Promise<ConversationResponse[]> {
    return axiosAdmin.get<ConversationResponse[], ConversationResponse[]>(
      "/chat/conversations",
    );
  },
};
