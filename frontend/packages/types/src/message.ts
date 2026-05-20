type message = {
  id: string;
  senderId: string;
  content?: string;
  image: File | null;
  createdAt: string;
};

type conversation = {
  id: string;
  branchName: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
  online: boolean;
};

export type SendMessagePayload = {
  content?: string;
  image: File | null;
};

export type { message, conversation };
