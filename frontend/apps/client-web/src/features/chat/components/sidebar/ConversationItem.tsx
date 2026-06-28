import type { ConversationResponse } from "@repo/types";
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
  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border p-4 text-left transition-all block",
        "hover:bg-accent/50",
        isActive && "border-primary/30 bg-primary/10 hover:bg-primary/10",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <Avatar className="size-12">
            <AvatarFallback className="bg-primary/15 text-primary font-semibold">
              {conversation.title.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Default Online Indicator */}
          <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-background bg-green-500" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-medium text-sm text-foreground">
              {conversation.title}
            </h3>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatTime(conversation.lastMessageTime)}
            </span>
          </div>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {conversation.lastMessageContent || "Chưa có tin nhắn nào"}
          </p>
        </div>
      </div>
    </button>
  );
}
