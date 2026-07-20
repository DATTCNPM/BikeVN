import { useEffect } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { chatAdminWebSocket } from "@repo/services";
import { chatAdminKeys } from "./useChatQueries";
import type {
  ChatMessageResponse,
  ChatResponse,
  ReadReceiptEvent,
} from "@repo/schemas";

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
        // Chuẩn hóa: Nếu newMessage chưa có createdAt, gán ngay thời gian hiện tại dưới dạng ISO String
        const normalizedMessage = {
          ...newMessage,
          createdAt: newMessage.createdAt || new Date().toISOString(),
        };

        queryClient.setQueryData<
          InfiniteData<ChatResponse<ChatMessageResponse>>
        >(chatAdminKeys.history(conversationId), (oldData) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0)
            return oldData;

          const updatedPages = [...oldData.pages];

          if (updatedPages[0]) {
            updatedPages[0] = {
              ...updatedPages[0],
              content: [normalizedMessage, ...(updatedPages[0].content || [])], // Dùng tin nhắn đã chuẩn hóa
            };
          }

          return {
            ...oldData,
            pages: updatedPages,
          };
        });

        queryClient.invalidateQueries({
          queryKey: chatAdminKeys.conversations(),
        });
      },

      // Callback 2: Khi Khách hàng hoặc Admin khác phát sự kiện ĐÃ ĐỌC
      (readEvent: ReadReceiptEvent) => {
        // Duyệt qua toàn bộ mảng pages của useInfiniteQuery để cập nhật trạng thái đã đọc
        queryClient.setQueryData<
          InfiniteData<ChatResponse<ChatMessageResponse>>
        >(chatAdminKeys.history(conversationId), (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            content:
              page.content?.map((msg) =>
                msg.senderId !== readEvent.readerId
                  ? { ...msg, isRead: true }
                  : msg,
              ) || [],
          }));

          return {
            ...oldData,
            pages: updatedPages,
          };
        });
      },
    );

    // 3. Tự động đánh dấu "Đã đọc"
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
