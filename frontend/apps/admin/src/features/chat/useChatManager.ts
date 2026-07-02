import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { chatAdminWebSocket } from "@repo/services";
import { chatAdminKeys } from "./useChatQueries";
import type {
  ChatMessageResponse,
  ChatResponse,
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
      // Callback 1: Khi nhận được TIN NHẮN MỚI
      (newMessage: ChatMessageResponse) => {
        queryClient.setQueryData<ChatResponse<ChatMessageResponse>>(
          chatAdminKeys.history(conversationId),
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              // SỬA THÀNH: Nhét tin nhắn mới vào ĐẦU MẢNG cache giống client
              content: [newMessage, ...(oldData.content || [])],
            };
          },
        );

        queryClient.invalidateQueries({
          queryKey: chatAdminKeys.conversations(),
        });
      },

      // Callback 2: Khi Khách hàng hoặc Admin khác phát sự kiện ĐÃ ĐỌC
      (readEvent: ReadReceiptEvent) => {
        queryClient.setQueryData<ChatResponse<ChatMessageResponse>>(
          chatAdminKeys.history(conversationId),
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              content: oldData.content?.map((msg) =>
                // Nếu người đọc (readerId) chính là khách hàng,
                // chuyển toàn bộ tin nhắn của Admin (senderId !== customer) thành true
                msg.senderId !== readEvent.readerId
                  ? { ...msg, isRead: true }
                  : msg,
              ),
            };
          },
        );
      },
    );

    // 3. Tự động đánh dấu "Đã đọc"
    // Nếu socket đã connected thì gửi luôn, nếu chưa thì trong ChatWebSocketService
    // hàm subscribeToConversation sẽ đợi onConnect rồi mới thực thi ngầm.
    if (conversationId) {
      chatAdminWebSocket.markAsRead(conversationId);
    }

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
