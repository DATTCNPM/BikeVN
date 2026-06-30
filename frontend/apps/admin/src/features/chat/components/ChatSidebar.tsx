import { useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@repo/ui/components/ui/input";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { cn } from "@repo/ui/lib/utils";

interface AdminConversation {
  id: string;
  title: string;
  branchId?: string | null;
  lastMessageContent?: string | null;
  lastMessageTime?: string | null;
  unreadCount?: number;
}

interface ChatSidebarProps {
  conversations: AdminConversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
}

export function ChatSidebar({
  conversations,
  selectedId,
  onSelect,
  searchTerm,
  onSearchChange,
  isLoading,
}: ChatSidebarProps) {
  const filtered = useMemo(() => {
    return conversations.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [conversations, searchTerm]);

  return (
    <aside className="col-span-12 md:col-span-4 lg:col-span-3 border-r flex flex-col h-full bg-muted/10">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customer name, branch..."
            className="pl-9 h-10 rounded-xl"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <Spinner />
              <p className="text-xs mt-2">Loading conversations...</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground p-4">
              No chat rooms found.
            </p>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={cn(
                  "w-full rounded-2xl border p-3.5 text-left transition-all flex items-start gap-3",
                  "hover:bg-accent/50",
                  item.id === selectedId &&
                    "border-primary/30 bg-primary/10 hover:bg-primary/10",
                )}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="size-11 border">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                      {item.title.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {item.unreadCount && item.unreadCount > 0 ? (
                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {item.unreadCount}
                    </span>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      "truncate text-sm text-foreground",
                      item.unreadCount && item.unreadCount > 0
                        ? "font-bold"
                        : "font-medium",
                    )}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-1 truncate text-xs",
                      item.unreadCount && item.unreadCount > 0
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.lastMessageContent || "No conversation yet"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
