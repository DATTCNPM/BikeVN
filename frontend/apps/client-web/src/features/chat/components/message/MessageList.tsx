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

  const orderedMessages = [...messages].reverse();

  useEffect(() => {
    if (!loading && orderedMessages && orderedMessages.length > 0) {
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [orderedMessages, loading]);

  // Hàm helper để check xem có cần show time/status dưới tin nhắn không
  const shouldShowTimestamp = (currentIndex: number) => {
    // Luôn hiện timestamp cho tin nhắn cuối cùng trong danh sách chat (tin nhắn mới nhất)
    if (currentIndex === orderedMessages.length - 1) return true;

    const currentMsg = orderedMessages[currentIndex];
    const nextMsg = orderedMessages[currentIndex + 1]; // Tin nhắn gửi ngay sau đó

    // Nếu tin nhắn tiếp theo là của người khác -> Hiện timestamp cho tin nhắn hiện tại
    if (currentMsg.senderId !== nextMsg.senderId) return true;

    // Xử lý parse date an toàn cho chuỗi định dạng "2026-06-30T13:15:14.262544"
    const parseDate = (isoString: string | undefined | null) => {
      if (!isoString) return Date.now();
      const parsed = Date.parse(isoString);
      return isNaN(parsed) ? Date.now() : parsed;
    };

    const currentIdxTime = parseDate(currentMsg.createdAt);
    const nextIdxTime = parseDate(nextMsg.createdAt);

    // Tính khoảng cách thời gian (phút) giữa 2 tin nhắn liên tiếp
    const timeDifferenceInMinutes =
      Math.abs(nextIdxTime - currentIdxTime) / 1000 / 60;

    // Nếu tin nhắn sau cách tin nhắn trước quá 3 phút -> Hiện timestamp
    return timeDifferenceInMinutes > 3;
  };

  console.log("orderedMessages", orderedMessages);

  return (
    <ScrollArea className="h-full w-full bg-muted/30">
      <div className="mx-auto flex max-w-4xl flex-col gap-1 p-4">
        {" "}
        {/* Giảm gap tổng thể từ gap-4 xuống gap-1 để gom cụm tin nhắn tốt hơn */}
        {loading ? (
          <div className="space-y-4 p-4 h-full overflow-hidden flex flex-col justify-end">
            <MessageItemSkeleton isRight={false} />
            <MessageItemSkeleton isRight={true} />
          </div>
        ) : (
          orderedMessages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUserId}
              showTimestamp={shouldShowTimestamp(index)} // 🌟 Truyền thêm prop này
            />
          ))
        )}
        <div ref={bottomRef} className="h-1 shrink-0 clear-both" />
      </div>
    </ScrollArea>
  );
}
