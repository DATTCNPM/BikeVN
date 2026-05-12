import { useMemo, useState } from "react";

import ChatContent from "@/components/chat/content/ChatContent";
import ChatSidebar from "@/components/chat/sidebar/ChatSidebar";

export type Conversation = {
  id: number;
  branchName: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
  online: boolean;
};

export type Message = {
  id: number;
  senderId: number;
  content?: string;
  image?: string;
  createdAt: string;
};

const currentUserId = 1;

const conversations: Conversation[] = [
  {
    id: 1,
    branchName: "Chi nhánh Cà Mau",
    lastMessage: "Bên em đã tiếp nhận đơn hàng.",
    unreadCount: 2,
    updatedAt: "10:24",
    online: true,
  },
  {
    id: 2,
    branchName: "Chi nhánh Hồ Chí Minh",
    lastMessage: "Khi nào anh cần hỗ trợ thêm?",
    unreadCount: 0,
    updatedAt: "Hôm qua",
    online: false,
  },
];

const messagesData: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      senderId: 2,
      content: "Xin chào anh, em có thể hỗ trợ gì cho mình?",
      createdAt: "09:20",
    },
    {
      id: 2,
      senderId: 1,
      content: "Tôi muốn kiểm tra trạng thái đơn hàng.",
      createdAt: "09:22",
    },
    {
      id: 3,
      senderId: 1,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      createdAt: "09:23",
    },
    {
      id: 4,
      senderId: 2,
      content: "Đây là hình ảnh sản phẩm thực tế.",
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156",
      createdAt: "09:25",
    },
  ],
  2: [],
};

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState(1);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === selectedConversationId,
      ),
    [selectedConversationId],
  );

  const messages = messagesData[selectedConversationId] || [];

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-12 overflow-hidden bg-card ">
      <ChatSidebar
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />

      <ChatContent
        conversation={activeConversation}
        messages={messages}
        currentUserId={currentUserId}
      />
    </div>
  );
}
