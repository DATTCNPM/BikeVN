import type { Conversation, Message } from "@repo/schemas";

export const conversations: Conversation[] = [
  {
    id: 1,
    branchName: "Chi nhánh Cà Mau",
    lastMessage: "Xe đã sẵn sàng",
    unreadCount: 2,
    updatedAt: "2026-05-16T10:30:00Z",
    online: true,
  },
  {
    id: 2,
    branchName: "Chi nhánh Hồ Chí Minh",
    lastMessage: "Cảm ơn bạn đã liên hệ",
    unreadCount: 0,
    updatedAt: "2026-05-15T15:00:00Z",
    online: false,
  },
];

export const messages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      senderId: 1,
      content: "Xin chào",
      createdAt: "2026-05-16T10:00:00Z",
    },

    {
      id: 2,
      senderId: 2,
      content: "Xe đã sẵn sàng",
      createdAt: "2026-05-16T10:30:00Z",
    },

    {
      id: 3,
      senderId: 1,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      createdAt: "2026-05-16T10:32:00Z",
    },

    {
      id: 4,
      senderId: 2,
      content: "Đây là hình ảnh xe thực tế",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
      createdAt: "2026-05-16T10:35:00Z",
    },
  ],

  2: [
    {
      id: 5,
      senderId: 2,
      content: "Cảm ơn bạn đã liên hệ",
      createdAt: "2026-05-15T15:00:00Z",
    },

    {
      id: 6,
      senderId: 1,
      image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
      createdAt: "2026-05-15T15:10:00Z",
    },
  ],
};
