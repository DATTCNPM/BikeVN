import type { ConversationResponse } from "@repo/schemas";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { cn } from "@repo/ui/lib/utils";

type Props = {
  conversation: ConversationResponse;
  isActive: boolean;
  onClick: () => void;
};

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
}: Props) {
  // Đồng bộ hóa logic hiển thị thời gian linh hoạt
  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border border-transparent p-3 text-left transition-all block",
        "hover:bg-muted/60",
        isActive && "border-primary/10 bg-primary/10 hover:bg-primary/10",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <Avatar className="size-10 border">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
              {conversation.title.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-green-500" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-semibold text-sm text-foreground">
              {conversation.title}
            </h3>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">
              {formatTime(conversation.lastMessageTime)}
            </span>
          </div>

          <p className="mt-0.5 truncate text-xs text-muted-foreground line-clamp-1">
            {conversation.lastMessageContent || "Chưa có tin nhắn nào"}
          </p>
        </div>
      </div>
    </button>
  );
}
