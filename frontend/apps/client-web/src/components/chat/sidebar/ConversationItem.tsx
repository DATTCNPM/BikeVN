import type { Conversation } from "@/pages/ChatPage";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

type Props = {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
};

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border p-4 text-left transition-all",
        "hover:bg-accent",
        isActive && "border-primary/30 bg-primary/10",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="size-12">
            <AvatarFallback className="bg-primary/15 text-primary">
              CN
            </AvatarFallback>
          </Avatar>

          {conversation.online && (
            <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-background bg-green-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-medium">{conversation.branchName}</h3>

            <span className="text-xs text-muted-foreground">
              {conversation.updatedAt}
            </span>
          </div>

          <p className="mt-1 truncate text-sm text-muted-foreground">
            {conversation.lastMessage}
          </p>
        </div>

        {conversation.unreadCount > 0 && (
          <div className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {conversation.unreadCount}
          </div>
        )}
      </div>
    </button>
  );
}
