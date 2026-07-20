import { useEffect } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { chatClientWebSocket } from "@repo/services";
import { chatKeys } from "./useChatQueries";
import type {
  ChatMessageResponse,
  ChatResponse,
  ReadReceiptEvent,
} from "@repo/schemas";

export function useChatManager(conversationId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    // 1. Kích hoạt kết nối tổng
    chatClientWebSocket.activate();

    // 2. Đăng ký lắng nghe phòng chat hiện tại
    chatClientWebSocket.subscribeToConversation(
      conversationId,

      // Callback 1: Xử lý khi có TIN NHẮN MỚI
      (newMessage: ChatMessageResponse) => {
        // Cập nhật vào cache dạng InfiniteData (phân trang)
        queryClient.setQueryData<
          InfiniteData<ChatResponse<ChatMessageResponse>>
        >(chatKeys.history(conversationId), (oldData) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0)
            return oldData;

          // Clone lại cấu trúc pages
          const updatedPages = [...oldData.pages];

          // Vì backend sắp xếp tin nhắn mới nhất nằm ở trang đầu tiên (pageIndex = 0)
          // Ta chèn tin nhắn mới nhận từ socket vào ĐẦU mảng content của trang đầu tiên này.
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

        // Đồng thời làm mới danh sách phòng chat bên ngoài sidebar để hiển thị nội dung tin nhắn mới nhất
        queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      },

      // Callback 2: Xử lý khi có SỰ KIỆN ĐÃ ĐỌC (Read Receipt)
      (readEvent: ReadReceiptEvent) => {
        queryClient.setQueryData<
          InfiniteData<ChatResponse<ChatMessageResponse>>
        >(chatKeys.history(conversationId), (oldData) => {
          if (!oldData) return oldData;

          // Duyệt qua tất cả các trang đã tải trong bộ nhớ cache để cập nhật trạng thái đã đọc
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

    // 3. Tự động đánh dấu đã đọc khi vừa vào phòng chat
    chatClientWebSocket.markAsRead(conversationId);

    // Cleanup khi đổi phòng hoặc thoát chat
    return () => {
      chatClientWebSocket.unsubscribeCurrentConversation();
    };
  }, [conversationId, queryClient]);

  // Hàm helper để gửi tin nhắn nhanh từ UI
  const sendMessage = (content: string) => {
    if (!conversationId) return;
    chatClientWebSocket.sendMessage({ conversationId, content });
  };

  return { sendMessage };
}
