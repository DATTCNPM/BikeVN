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

  // Cơ chế cuộn xuống đáy an toàn khi nhận được mảng dữ liệu tin nhắn của phòng mới
  useEffect(() => {
    if (!loading && messages && messages.length > 0) {
      // Đợi 60ms cho luồng render của React ổn định layout phòng mới
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" }); // Dùng "auto" thay vì "smooth" để tránh bị giật lửng lơ khi chuyển phòng nhanh
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [messages, loading]);

  return (
    // Sử dụng h-full để lấp đầy không gian ChatPage cấp cho
    <ScrollArea className="h-full w-full bg-muted/30">
      {/* ✨ SỬA TẠI ĐÂY: Chỉ dùng flex flex-col gap-4 p-4 đơn giản nhất, KHÔNG justify-end, KHÔNG min-h-full */}
      <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
        {loading ? (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUserId}
            />
          ))
        )}

        {/* Thẻ neo đáy */}
        <div ref={bottomRef} className="h-1 shrink-0 clear-both" />
      </div>
    </ScrollArea>
  );
}
