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

  // Hàm helper format thời gian hiển thị gọn gàng trên danh sách Sidebar
  const formatLastMessageTime = (isoString: string | null | undefined) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const now = new Date();

      // Nếu là trong ngày hôm nay, chỉ hiển thị Giờ:Phút
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      // Nếu khác ngày, hiển thị Ngày/Tháng
      return date.toLocaleDateString([], { month: "numeric", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <aside className="col-span-12 md:col-span-4 lg:col-span-3 border-r flex flex-col h-full bg-card">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customer name, branch..."
            className="pl-9 h-10 rounded-xl bg-muted/40"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {" "}
          {/* Tối ưu khoảng cách item phòng chat */}
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
            filtered.map((item) => {
              const hasUnread = item.unreadCount && item.unreadCount > 0;
              const isSelected = item.id === selectedId;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    "w-full rounded-xl p-3 text-left transition-all flex items-start gap-3 border border-transparent",
                    "hover:bg-muted/60",
                    isSelected &&
                      "bg-primary/10 border-primary/10 hover:bg-primary/10",
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="size-10 border">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {item.title.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {hasUnread ? (
                      <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-scale-in">
                        {item.unreadCount}
                      </span>
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3
                        className={cn(
                          "truncate text-sm text-foreground",
                          hasUnread ? "font-semibold" : "font-medium",
                        )}
                      >
                        {item.title}
                      </h3>

                      {/* Hiện thời gian tin nhắn cuối cùng một cách tinh tế */}
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatLastMessageTime(item.lastMessageTime)}
                      </span>
                    </div>

                    <p
                      className={cn(
                        "mt-0.5 truncate text-xs line-clamp-1",
                        hasUnread
                          ? "text-foreground font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.lastMessageContent || "No conversation yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
