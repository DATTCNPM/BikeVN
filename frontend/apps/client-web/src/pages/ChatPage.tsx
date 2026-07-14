import { useEffect, useMemo, useState } from "react";
import ChatContent from "@/features/chat/components/content/ChatContent";
import ChatSidebar from "@/features/chat/components/sidebar/ChatSidebar";
import {
  useMyConversations,
  useMessageHistory,
} from "@/features/chat/hooks/useChatQueries";
import { useChatManager } from "@/features/chat/hooks/useChatManager";
import { useProfile } from "@/features/profile/hooks/useProfile";

export default function ChatPage() {
  const { data: profile } = useProfile();
  const currentUserId = profile?.id ?? "";
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
  const messageList = useMemo(
    () => messagesData?.content || [],
    [messagesData],
  );

  console.log("message data", messagesData);
  console.log(
    "🚀 ~ file: ChatPage.tsx:38 ~ ChatPage ~ messageList:",
    messageList,
  );

  return (
    // Sử dụng h-[calc(100vh-theme(spacing.16)-padding)] để không bị lố chiều cao layout tổng
    <div className="flex h-[calc(100vh-14rem)] gap-6 overflow-hidden items-start antialiased">
      <ChatSidebar
        loading={conversationsLoading}
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />

      <ChatContent
        key={selectedConversationId ?? "empty"}
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
