import { useEffect, useRef } from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { cn } from "@repo/ui/lib/utils";
import { ChatInputForm } from "./ChatInputForm";
import type { ChatMessageResponse } from "@repo/schemas";

interface ChatActiveWindowProps {
  activeConversation: { title: string };
  messages: ChatMessageResponse[];
  isLoading: boolean;
  currentAdminId: string;
  onSendMessage: (content: string) => void;
  // Nhận thêm props phục vụ phân trang
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function ChatActiveWindow({
  activeConversation,
  messages,
  isLoading,
  currentAdminId,
  onSendMessage,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: ChatActiveWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  // 1. Chỉ tự động cuộn xuống đáy (Smooth scroll) ở lượt tải đầu tiên hoặc khi có tin nhắn MỚI xuất hiện ở đáy
  useEffect(() => {
    if (!isLoading && messages.length > 0 && !isFetchingNextPage) {
      // Nếu chiều cao tổng của container thay đổi đột ngột lớn hơn trước nhiều (do fetch page lịch sử cũ)
      // thì KHÔNG cuộn xuống đáy để tránh mất dấu vị trí người dùng đang đọc.
      const container = scrollContainerRef.current;
      if (container) {
        const isNearBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          200;
        // Nếu người dùng đang ở gần đáy hoặc đây là lượt load phòng chat đầu tiên
        if (isNearBottom || previousScrollHeightRef.current === 0) {
          const timer = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 50);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [messages, isLoading, isFetchingNextPage]);

  // 2. Hàm lắng nghe sự kiện cuộn của ScrollArea để thực hiện Infinite Scroll ngược lên trên
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    // Lưu lại scrollHeight hiện tại để tính toán bù trừ giữ nguyên vị trí mắt đọc sau khi tải trang cũ xong
    previousScrollHeightRef.current = target.scrollHeight;

    // Khi cuộn sát lên đỉnh (scrollTop === 0 hoặc cách đỉnh nhỏ hơn 10px để nhạy hơn)
    if (target.scrollTop <= 10 && hasNextPage && !isFetchingNextPage) {
      // Lưu lại vị trí khoảng cách hiện tại so với đáy trước khi fetch dữ liệu mới
      const oldScrollHeight = target.scrollHeight;

      fetchNextPage();

      // Sau khi dữ liệu cũ chèn vào đỉnh, ta cần đẩy thanh cuộn xuống một chút
      // để tránh việc trình duyệt giữ nguyên scrollTop = 0 khiến nó liên tục kích hoạt fetch tiếp
      const observer = new MutationObserver(() => {
        if (target.scrollHeight !== oldScrollHeight) {
          target.scrollTop = target.scrollHeight - oldScrollHeight;
          observer.disconnect();
        }
      });
      observer.observe(target, { childList: true, subtree: true });
    }
  };

  // Logic kiểm tra hiển thị thời gian thông minh giữ nguyên...
  const shouldShowTimestamp = (currentIndex: number) => {
    if (currentIndex === messages.length - 1) return true;
    const currentMsg = messages[currentIndex];
    const nextMsg = messages[currentIndex + 1];
    if (String(currentMsg.senderId) !== String(nextMsg.senderId)) return true;
    const parseDate = (isoString: string | undefined | null) => {
      if (!isoString) return Date.now();
      const parsed = Date.parse(isoString);
      return isNaN(parsed) ? Date.now() : parsed;
    };
    return (
      Math.abs(parseDate(nextMsg.createdAt) - parseDate(currentMsg.createdAt)) /
        1000 /
        60 >
      3
    );
  };

  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <section className="col-span-12 md:col-span-8 lg:col-span-9 h-full bg-background relative">
      <div className="absolute inset-0 flex flex-col h-full w-full overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b px-6 flex-shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border">
              <AvatarFallback className="bg-primary/5 text-primary text-xs">
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-sm text-foreground">
                {activeConversation.title}
              </h2>
              <p className="text-[11px] text-green-500 flex items-center gap-1 font-medium">
                <span className="size-1.5 rounded-full bg-green-500 inline-block animate-pulse" />{" "}
                Support active
              </p>
            </div>
          </div>
        </header>

        {/* LƯU Ý: Gán ref và onScroll vào viewport của ScrollArea hoặc thẻ div wrapper */}
        <div
          className="flex-1 min-h-0 bg-muted/10 overflow-y-auto"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-1 p-4">
            {/* Vị trí chỉ báo đang tải thêm tin nhắn CŨ ở trên đỉnh đầu */}
            {isFetchingNextPage && (
              <div className="flex justify-center p-2">
                <Spinner className="size-4" />
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center p-8">
                <Spinner />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center p-8 text-xs text-muted-foreground">
                Start sending messages to initiate the conversation.
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = String(msg.senderId) === String(currentAdminId);
                const showTime = shouldShowTimestamp(index);

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col w-full transition-all",
                      isMe ? "items-end" : "items-start",
                      showTime ? "mb-3" : "mb-0",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words",
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-card border border-border/40 text-foreground rounded-bl-md",
                      )}
                    >
                      {msg.content}
                    </div>

                    {showTime && (
                      <div className="flex items-center gap-1.5 px-2 mt-1 text-[10px] text-muted-foreground select-none">
                        <span>{formatTime(msg.createdAt)}</span>
                        {isMe && <span>• {msg.isRead ? "Read" : "Sent"}</span>}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} className="h-1 shrink-0 clear-both" />
          </div>
        </div>

        <ChatInputForm
          activeTitle={activeConversation.title}
          onSend={onSendMessage}
        />
      </div>
    </section>
  );
}
