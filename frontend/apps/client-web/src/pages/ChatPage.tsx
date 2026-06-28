import { useEffect, useMemo, useState } from "react";
import ChatContent from "@/features/chat/components/content/ChatContent";
import ChatSidebar from "@/features/chat/components/sidebar/ChatSidebar";
import {
  useMyConversations,
  useMessageHistory,
} from "@/features/chat/useChatQueries";
import { useChatManager } from "@/features/chat/useChatManager";

const currentUserId = "1"; // Thay bằng hook lấy userId từ AuthContext của bạn nếu có

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  // 1. Lấy danh sách cuộc hội thoại qua HTTP REST
  const { data: conversations = [], isLoading: conversationsLoading } =
    useMyConversations();

  // Tự động chọn cuộc hội thoại đầu tiên nếu chưa chọn
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  // Tìm thông tin cuộc hội thoại đang active
  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId],
  );

  // 2. Lấy lịch sử tin nhắn của cuộc hội thoại đang chọn
  const { data: messagesData, isLoading: messagesLoading } = useMessageHistory(
    selectedConversationId ?? "",
  );

  // 3. Kích hoạt kết nối Realtime WebSocket cho phòng chat này
  const { sendMessage } = useChatManager(selectedConversationId);

  // Vì Backend trả về đối tượng Pageable (Phân trang), danh sách mảng thực tế nằm trong thuộc tính .content
  const messageList = useMemo(() => messagesData?.data || [], [messagesData]);

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-12 overflow-hidden bg-card">
      <ChatSidebar
        loading={conversationsLoading}
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />

      <ChatContent
        loading={messagesLoading}
        conversation={activeConversation}
        messages={messageList}
        currentUserId={currentUserId}
        onSendMessage={sendMessage}
      />
    </div>
  );
}
