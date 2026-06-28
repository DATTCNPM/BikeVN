import { useEffect, useRef } from "react";
import type { ChatMessageResponse } from "@repo/types";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Spinner } from "@repo/ui/components/ui/spinner";
import MessageItem from "./MessageItem";

type Props = {
  loading: boolean;
  messages: ChatMessageResponse[];
  currentUserId: string;
};

export default function MessageList({
  loading,
  messages,
  currentUserId,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống đáy khi có tin nhắn mới đổ về
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Đảo ngược mảng hiển thị nếu backend trả về sort DESC, hoặc giữ nguyên nếu backend là ASC
  const sortedMessages = [...messages].reverse();

  return (
    <ScrollArea className="h-[calc(100vh-14rem)] w-full bg-muted/30">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
        {loading ? (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        ) : (
          sortedMessages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
