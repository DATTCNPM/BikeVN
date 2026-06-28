// Ví dụ: apps/client/src/hooks/useChatWebSocket.ts
import { useEffect } from "react";
import { chatClientWebSocket } from "@repo/services";
import type { ChatMessageResponse } from "@repo/types";

export function useChatWebSocket(
  conversationId: string,
  onNewMessage: (msg: ChatMessageResponse) => void,
) {
  useEffect(() => {
    // 1. Kích hoạt kết nối tổng khi vào màn hình chat
    chatClientWebSocket.activate();

    // 2. Chờ một chút để socket CONNECTED rồi subscribe vào phòng
    // (Hoặc xử lý trong hàm subscribeToConversation của class như file trước tôi viết)
    chatClientWebSocket.subscribeToConversation(conversationId, onNewMessage);

    // 3. Cleanup: Hủy lắng nghe phòng này khi thoát khỏi box chat hoặc đổi phòng
    return () => {
      chatClientWebSocket.unsubscribeCurrentConversation();
    };
  }, [conversationId, onNewMessage]);

  return chatClientWebSocket;
}
