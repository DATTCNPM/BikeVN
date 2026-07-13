import { useEffect, useRef } from "react";
import { User } from "lucide-react";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { cn } from "@repo/ui/lib/utils";
import { ChatInputForm } from "./ChatInputForm";
import type { ChatMessageResponse } from "@repo/types";

interface ChatActiveWindowProps {
  activeConversation: { title: string };
  messages: ChatMessageResponse[];
  isLoading: boolean;
  currentAdminId: string;
  onSendMessage: (content: string) => void;
}

export function ChatActiveWindow({
  activeConversation,
  messages,
  isLoading,
  currentAdminId,
  onSendMessage,
}: ChatActiveWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Đảm bảo mảng messages xếp đúng thứ tự thời gian tăng dần từ trên xuống đáy
  const orderedMessages = messages;

  useEffect(() => {
    if (!isLoading && orderedMessages.length > 0) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [orderedMessages, isLoading]);

  // Logic kiểm tra ẩn/hiện thời gian thông minh (Trong vòng 3 phút)
  const shouldShowTimestamp = (currentIndex: number) => {
    if (currentIndex === orderedMessages.length - 1) return true;

    const currentMsg = orderedMessages[currentIndex];
    const nextMsg = orderedMessages[currentIndex + 1];

    if (String(currentMsg.senderId) !== String(nextMsg.senderId)) return true;

    const parseDate = (isoString: string | undefined | null) => {
      if (!isoString) return Date.now();
      const parsed = Date.parse(isoString);
      return isNaN(parsed) ? Date.now() : parsed;
    };

    const currentIdxTime = parseDate(currentMsg.createdAt);
    const nextIdxTime = parseDate(nextMsg.createdAt);

    const timeDifferenceInMinutes =
      Math.abs(nextIdxTime - currentIdxTime) / 1000 / 60;

    return timeDifferenceInMinutes > 3;
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

        {/* Thay đổi nền nhẹ sang bg-muted/10 và giảm gap tổng thể xuống gap-1 */}
        <ScrollArea className="flex-1 min-h-0 bg-muted/10">
          <div className="mx-auto flex max-w-4xl flex-col gap-1 p-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Spinner />
              </div>
            ) : orderedMessages.length === 0 ? (
              <div className="text-center p-8 text-xs text-muted-foreground">
                Start sending messages to initiate the conversation.
              </div>
            ) : (
              orderedMessages.map((msg, index) => {
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
        </ScrollArea>

        <ChatInputForm
          activeTitle={activeConversation.title}
          onSend={onSendMessage}
        />
      </div>
    </section>
  );
}
