import { useEffect, useMemo, useState } from "react";
import ChatContent from "@/features/chat/components/message/ChatContent";
import ChatSidebar from "@/features/chat/components/sidebar/ChatSidebar";
import {
  useMyConversations,
  useMessageHistory,
} from "@/features/chat/hooks/useChatQueries";
import { useChatManager } from "@/features/chat/hooks/useChatManager";
import { useProfile } from "@/features/auth/hooks/useProfile";

export default function ChatPage() {
  const { data: profile } = useProfile();
  const currentUserId = profile?.id ?? "";
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const { data: conversations = [], isLoading: conversationsLoading } =
    useMyConversations();

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

  // 1. Nhận thêm các thuộc tính quản lý phân trang từ hook infinite query
  const {
    data: infiniteMessagesData,
    isLoading: messagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessageHistory(selectedConversationId ?? "");

  const { sendMessage } = useChatManager(selectedConversationId);

  // 2. Gộp phẳng tất cả tin nhắn từ các trang lại và đảo ngược một lần duy nhất
  const messageList = useMemo(() => {
    if (!infiniteMessagesData?.pages) return [];
    const allMessages = infiniteMessagesData.pages.flatMap(
      (page) => page.content || [],
    );
    return [...allMessages].reverse();
  }, [infiniteMessagesData]);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 overflow-hidden items-start antialiased">
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
        // 3. Truyền tiếp xuống ChatContent
        fetchNextPage={fetchNextPage}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
