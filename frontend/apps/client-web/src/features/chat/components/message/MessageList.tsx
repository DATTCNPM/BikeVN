import { useEffect, useRef } from "react";
import type { ChatMessageResponse } from "@repo/types";
import { cn } from "@repo/ui/lib/utils";
import { MessageItemSkeleton } from "@/features/chat/components/skeleton/ChatSkeleton";

type Props = {
  loading: boolean;
  messages: ChatMessageResponse[];
  currentUserId: string;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export default function MessageList({
  loading,
  messages,
  currentUserId,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  useEffect(() => {
    if (!loading && messages.length > 0 && !isFetchingNextPage) {
      const container = scrollContainerRef.current;
      if (container) {
        const isNearBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          200;
        if (isNearBottom || previousScrollHeightRef.current === 0) {
          const timer = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "auto" });
          }, 60);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [messages, loading, isFetchingNextPage]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    previousScrollHeightRef.current = target.scrollHeight;

    if (target.scrollTop <= 10 && hasNextPage && !isFetchingNextPage) {
      const oldScrollHeight = target.scrollHeight;
      fetchNextPage();

      const observer = new MutationObserver(() => {
        if (target.scrollHeight !== oldScrollHeight) {
          target.scrollTop = target.scrollHeight - oldScrollHeight;
          observer.disconnect();
        }
      });
      observer.observe(target, { childList: true, subtree: true });
    }
  };

  const shouldShowTimestamp = (currentIndex: number) => {
    if (currentIndex === messages.length - 1) return true;
    const currentMsg = messages[currentIndex];
    const nextMsg = messages[currentIndex + 1];
    if (currentMsg.senderId !== nextMsg.senderId) return true;

    const parseDate = (str: string | undefined | null) =>
      str ? Date.parse(str) : Date.now();
    return (
      Math.abs(parseDate(nextMsg.createdAt) - parseDate(currentMsg.createdAt)) /
        1000 /
        60 >
      3
    );
  };

  const formatTime = (isoString: string | undefined | null) => {
    const date = isoString ? new Date(isoString) : new Date();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="h-full w-full bg-muted/30 overflow-y-auto"
      ref={scrollContainerRef}
      onScroll={handleScroll}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-1 p-4">
        {isFetchingNextPage && (
          <div className="flex justify-center p-2 animate-fade-in">
            <span className="text-[11px] text-muted-foreground">
              Loading older messages...
            </span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4 p-4 h-full overflow-hidden flex flex-col justify-end">
            <MessageItemSkeleton isRight={false} />
            <MessageItemSkeleton isRight={true} />
          </div>
        ) : (
          messages.map((message, index) => {
            const isMe = message.senderId === currentUserId;
            const showTime = shouldShowTimestamp(index);

            return (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-0.5 w-full transition-all",
                  isMe ? "items-end" : "items-start",
                  showTime ? "mb-3" : "mb-0",
                )}
              >
                <div
                  className={cn(
                    "flex w-full",
                    isMe ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words transition-colors",
                      isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border/40 text-foreground",
                    )}
                  >
                    {message.content}
                  </div>
                </div>

                {showTime && (
                  <div className="flex items-center gap-1.5 px-2 mt-1 text-[10px] text-muted-foreground select-none animate-fade-in">
                    <span>{formatTime(message.createdAt)}</span>
                    {isMe && <span>• {message.isRead ? "Read" : "Sent"}</span>}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} className="h-1 shrink-0 clear-both" />
      </div>
    </div>
  );
}
