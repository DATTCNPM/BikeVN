import { useEffect, useRef } from "react";
import type { ChatMessageResponse } from "@repo/types";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { MessageItemSkeleton } from "@/features/chat/components/skeleton/ChatSkeleton";
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

  // 🌟 SẮP XẾP HOẶC ĐẢO NGƯỢC TIN NHẮN TẠI ĐÂY
  // Cách A: Nếu API trả về tin nhắn mới nhất lên đầu (mảng ngược), ta đảo lại cho đúng chuẩn chat:
  const orderedMessages = [...messages].reverse();

  // Cách B: Nếu muốn chắc chắn theo thời gian (giả sử có trường createdAt hoặc timestamp):
  // const orderedMessages = [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  useEffect(() => {
    if (!loading && orderedMessages && orderedMessages.length > 0) {
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [orderedMessages, loading]); // Đổi dependency thành orderedMessages

  return (
    <ScrollArea className="h-full w-full bg-muted/30">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
        {loading ? (
          <div className="space-y-4 p-4 h-full overflow-hidden flex flex-col justify-end">
            {/* Giả lập luồng hội thoại đan xen trái phải */}
            <MessageItemSkeleton isRight={false} />
            <MessageItemSkeleton isRight={true} />
            <MessageItemSkeleton isRight={false} />
            <MessageItemSkeleton isRight={true} />
          </div>
        ) : (
          // 🌟 Thay 'messages.map' bằng 'orderedMessages.map'
          orderedMessages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUserId}
            />
          ))
        )}

        <div ref={bottomRef} className="h-1 shrink-0 clear-both" />
      </div>
    </ScrollArea>
  );
}
