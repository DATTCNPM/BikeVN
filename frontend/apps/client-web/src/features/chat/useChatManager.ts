import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { chatClientWebSocket } from "@repo/services";
import { chatKeys } from "./useChatQueries";
import type {
  ChatMessageResponse,
  PaginationResponse,
  ReadReceiptEvent,
} from "@repo/types";

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
        // Cập nhật trực tiếp vào danh sách lịch sử tin nhắn của React Query
        queryClient.setQueryData<PaginationResponse<ChatMessageResponse>>(
          chatKeys.history(conversationId),
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              // Vì backend trả về Pageable, tùy thuộc cấu trúc của bạn (ví dụ data.result hoặc mảng content)
              // Giả lập push tin nhắn mới vào đầu hoặc cuối mảng tùy theo Sort hướng hiển thị
              content: [newMessage, ...(oldData.data || [])],
            };
          },
        );

        // Đồng thời làm mới danh sách phòng chat bên ngoài sidebar để hiển thị lastMessageContent mới nhất
        queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      },

      // Callback 2: Xử lý khi có SỰ KIỆN ĐÃ ĐỌC (Read Receipt)
      (readEvent: ReadReceiptEvent) => {
        queryClient.setQueryData<PaginationResponse<ChatMessageResponse>>(
          chatKeys.history(conversationId),
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              // Cập nhật tất cả tin nhắn của người kia thành isRead = true
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
