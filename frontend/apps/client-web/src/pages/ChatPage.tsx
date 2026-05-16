import { useEffect, useMemo, useState } from "react";

import ChatContent from "@/components/chat/content/ChatContent";
import ChatSidebar from "@/components/chat/sidebar/ChatSidebar";

import { useConversations, useMessages } from "@/hooks/useChat";

const currentUserId = 1;

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);

  // conversations query
  const { data: conversations = [], isLoading: conversationsLoading } =
    useConversations();

  // set default conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  // active conversation
  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === selectedConversationId,
      ),
    [conversations, selectedConversationId],
  );

  // messages query
  const { data: messages = [], isLoading: messagesLoading } = useMessages(
    selectedConversationId ?? 0,
  );

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-12 overflow-hidden bg-card">
      <ChatSidebar
        loading={conversationsLoading}
        conversations={conversations}
        selectedConversationId={selectedConversationId ?? 0}
        onSelectConversation={setSelectedConversationId}
      />

      <ChatContent
        loading={messagesLoading}
        conversation={activeConversation}
        messages={messages}
        currentUserId={currentUserId}
      />
    </div>
  );
}
