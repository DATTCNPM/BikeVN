import type { Message } from "@/pages/ChatPage";

import { ScrollArea } from "@repo/ui/components/scroll-area";

import MessageItem from "./MessageItem";

type Props = {
  messages: Message[];
  currentUserId: number;
};

export default function MessageList({ messages, currentUserId }: Props) {
  return (
    <ScrollArea className="h-[calc(100vh-14rem)] w-full bg-muted/30">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isCurrentUser={message.senderId === currentUserId}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
