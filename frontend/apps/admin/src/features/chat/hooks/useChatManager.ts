import { useEffect } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
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
        // Cập nhật vào cấu trúc InfiniteData của useInfiniteQuery
        queryClient.setQueryData<
          InfiniteData<ChatResponse<ChatMessageResponse>>
        >(chatAdminKeys.history(conversationId), (oldData) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0)
            return oldData;

          const updatedPages = [...oldData.pages];

          // Nhét tin nhắn realtime mới nhận vào ĐẦU mảng content của trang mới nhất (Trang 0)
          if (updatedPages[0]) {
            updatedPages[0] = {
              ...updatedPages[0],
              content: [newMessage, ...(updatedPages[0].content || [])],
            };
          }

          return {
            ...oldData,
            pages: updatedPages,
          };
        });

        // Làm mới danh sách phòng chat bên ngoài sidebar để cập nhật tin nhắn cuối cùng (lastMessage)
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
