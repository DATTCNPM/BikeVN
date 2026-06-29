import { useEffect, useMemo, useState } from "react";
import ChatContent from "@/features/chat/components/content/ChatContent";
import ChatSidebar from "@/features/chat/components/sidebar/ChatSidebar";
import {
  useMyConversations,
  useMessageHistory,
} from "@/features/chat/useChatQueries";
import { useChatManager } from "@/features/chat/useChatManager";

const currentUserId = "1";

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const { data: conversations = [], isLoading: conversationsLoading } =
    useMyConversations();

  // Trên desktop (md trở lên), nếu chưa chọn phòng thì mặc định chọn phòng đầu tiên
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop && conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId],
  );

  const { data: messagesData, isLoading: messagesLoading } = useMessageHistory(
    selectedConversationId ?? "",
  );

  const { sendMessage } = useChatManager(selectedConversationId);
  const messageList = useMemo(() => messagesData?.data || [], [messagesData]);

  return (
    // Sử dụng h-[calc(100vh-theme(spacing.16)-padding)] để không bị lố chiều cao layout tổng
    <div className="flex h-[calc(100vh-8rem)] gap-6 overflow-hidden items-start antialiased">
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
        onBack={() => setSelectedConversationId(null)}
      />
    </div>
  );
}
