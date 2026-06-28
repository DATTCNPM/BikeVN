import { useQuery } from "@tanstack/react-query";
import { chatAdminApi } from "@repo/api"; // API sử dụng axiosAdmin đã tạo ở bước trước

// Key quản lý Cache của React Query cho Admin
export const chatAdminKeys = {
  all: ["chat-admin"] as const,
  conversations: () => [...chatAdminKeys.all, "conversations"] as const,
  history: (conversationId: string) =>
    [...chatAdminKeys.all, "history", conversationId] as const,
};

// 1. Hook lấy danh sách phòng chat mà Admin/Employee này có quyền truy cập
export function useAdminConversations() {
  return useQuery({
    queryKey: chatAdminKeys.conversations(),
    queryFn: () => chatAdminApi.getMyConversations(),
    staleTime: 1000 * 60 * 3, // Cache trong 3 phút
  });
}

// 2. Hook lấy lịch sử tin nhắn của một phòng cụ thể (Phân trang)
export function useAdminMessageHistory(
  conversationId: string,
  page = 0,
  size = 20,
) {
  return useQuery({
    queryKey: chatAdminKeys.history(conversationId),
    queryFn: () =>
      chatAdminApi.getMessageHistory(conversationId, { page, size }),
    enabled: !!conversationId,
    staleTime: Infinity, // Tránh refetch lịch sử cũ liên tục vì đã có WebSocket lo cập nhật realtime
  });
}
