import type { ChatMessageResponse } from "@repo/types";
import { cn } from "@repo/ui/lib/utils";

type Props = {
  message: ChatMessageResponse;
  isCurrentUser: boolean;
  showTimestamp: boolean;
};

export default function MessageItem({
  message,
  isCurrentUser,
  showTimestamp,
}: Props) {
  const formatTime = (isoString: string | undefined | null) => {
    try {
      const date = isoString ? new Date(isoString) : new Date();
      if (isNaN(date.getTime())) {
        return new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 w-full transition-all",
        isCurrentUser ? "items-end" : "items-start",
        showTimestamp ? "mb-3" : "mb-0",
      )}
    >
      <div
        className={cn(
          "flex w-full",
          isCurrentUser ? "justify-end" : "justify-start",
        )}
      >
        <div
          className={cn(
            "max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words transition-colors",
            isCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border/40 text-foreground",
          )}
        >
          {message.content}
        </div>
      </div>

      {showTimestamp && (
        <div className="flex items-center gap-1.5 px-2 mt-1 text-[10px] text-muted-foreground select-none animate-fade-in">
          <span>{formatTime(message.createdAt)}</span>
          {isCurrentUser && <span>• {message.isRead ? "Read" : "Sent"}</span>}
        </div>
      )}
    </div>
  );
}
