import { useEffect, useRef } from "react"; // 🌟 1. THÊM useEffect và useRef
import { User } from "lucide-react";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Card } from "@repo/ui/components/ui/card";
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
  // 🌟 2. TẠO THẺ NEO ĐÁY
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🌟 3. LOGIC TỰ ĐỘNG CUỘN XUỐNG ĐÁY
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      // Đợi layout ổn định một chút rồi cuộn xuống
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading]);

  return (
    <section className="col-span-12 md:col-span-8 lg:col-span-9 h-full bg-background relative">
      <div className="absolute inset-0 flex flex-col h-full w-full overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border">
              <AvatarFallback className="bg-primary/5 text-primary text-xs">
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-sm">
                {activeConversation.title}
              </h2>
              <p className="text-[11px] text-green-500 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-green-500 inline-block" />{" "}
                Connecting to support
              </p>
            </div>
          </div>
        </header>

        <ScrollArea className="flex-1 min-h-0 bg-muted/20">
          <div className="flex flex-col gap-3 p-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Spinner />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center p-8 text-xs text-muted-foreground">
                Start sending messages to initiate the conversation.
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = String(msg.senderId) === String(currentAdminId);
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex w-full mb-2",
                      isMe ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "flex w-full",
                        isMe ? "justify-end" : "justify-start",
                      )}
                    >
                      <div className="flex flex-col items-end">
                        <Card
                          className={cn(
                            "rounded-2xl px-4 py-2.5 text-sm shadow-none border-none leading-relaxed whitespace-pre-wrap break-all",
                            isMe
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-muted text-foreground rounded-bl-none",
                          )}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap break-all">
                            {msg.content}
                          </p>
                        </Card>
                        <div className="flex gap-1 mt-1">
                          <span className="text-[10px] text-muted-foreground px-1 block">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-[10px] text-muted-foreground px-1 block">
                            {isMe ? (msg.isRead ? "Read" : "Sent") : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* 🌟 4. CHÈN THẺ NEO RỖNG VÀO ĐÂY ĐỂ ĐÁNH DẤU ĐÁY KHUNG CHAT */}
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
