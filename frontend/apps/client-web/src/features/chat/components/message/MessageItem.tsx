import type { ChatMessageResponse } from "@repo/types";
import { Card } from "@repo/ui/components/ui/card";
import { cn } from "@repo/ui/lib/utils";

type Props = {
  message: ChatMessageResponse;
  isCurrentUser: boolean;
};

export default function MessageItem({ message, isCurrentUser }: Props) {
  // Hàm format nhanh thời gian từ chuỗi ISO của Backend
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isCurrentUser ? "items-end" : "items-start",
      )}
    >
      <div
        className={cn(
          "flex w-full",
          isCurrentUser ? "justify-end" : "justify-start",
        )}
      >
        <Card
          className={cn(
            "max-w-[75%] rounded-2xl shadow-none border-none h-auto block clear-both",
            isCurrentUser
              ? "rounded-br-md bg-primary text-secondary-foreground"
              : "rounded-bl-md bg-card text-foreground",
          )}
        >
          {message.content && (
            <div className="px-4 py-2">
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Thời gian + Trạng thái đã đọc */}
      <div className="flex items-center gap-1.5 px-2 text-[10px] text-muted-foreground">
        <span>{formatTime(message.createdAt)}</span>
        {isCurrentUser && <span>• {message.isRead ? "Read" : "Sent"}</span>}
      </div>
    </div>
  );
}
