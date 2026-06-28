import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { chatAdminWebSocket } from "@repo/services"; // Instance WebSocket của Admin
import { chatAdminKeys } from "./useChatQueries";
import type {
  ChatMessageResponse,
  PaginationResponse,
  ReadReceiptEvent,
} from "@repo/types";

export function useAdminChatManager(conversationId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    // 1. Kích hoạt kết nối tổng của Portal
    chatAdminWebSocket.activate();

    // 2. Đăng ký lắng nghe kênh phòng chat hội thoại cụ thể
    chatAdminWebSocket.subscribeToConversation(
      conversationId,
      // Callback 1: Khi nhận được TIN NHẮN MỚI của Khách hàng gửi lên hoặc từ Admin khác cùng phản hồi
      (newMessage: ChatMessageResponse) => {
        queryClient.setQueryData<PaginationResponse<ChatMessageResponse>>(
          chatAdminKeys.history(conversationId),
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              content: [newMessage, ...(oldData.data || [])],
            };
          },
        );

        // Đẩy phòng chat này lên đầu danh sách hoặc cập nhật nội dung tin nhắn mới nhất ngoài Sidebar
        queryClient.invalidateQueries({
          queryKey: chatAdminKeys.conversations(),
        });
      },

      // Callback 2: Khi Khách hàng hoặc Admin khác bấm xem và phát sự kiện ĐÃ ĐỌC (Read Receipt)
      (readEvent: ReadReceiptEvent) => {
        queryClient.setQueryData<PaginationResponse<ChatMessageResponse>>(
          chatAdminKeys.history(conversationId),
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              // Cập nhật các tin nhắn mà đối phương vừa đọc thành isRead = true
              content: oldData.data?.map((msg) =>
                msg.senderId !== readEvent.readerId
                  ? { ...msg, isRead: true }
                  : msg,
              ),
            };
          },
        );
      },
    );

    // 3. Tự động đánh dấu "Đã đọc" cho toàn bộ tin nhắn trong phòng này khi Admin mở box chat lên
    chatAdminWebSocket.markAsRead(conversationId);

    // Cleanup: Huỷ lắng nghe phòng này khi Admin chuyển sang chat với khách hàng khác
    return () => {
      chatAdminWebSocket.unsubscribeCurrentConversation();
    };
  }, [conversationId, queryClient]);

  // Hàm hỗ trợ Admin gửi tin nhắn nhanh xuống Khách hàng
  const sendAdminMessage = (content: string) => {
    if (!conversationId) return;
    chatAdminWebSocket.sendMessage({ conversationId, content });
  };

  return { sendAdminMessage };
}
