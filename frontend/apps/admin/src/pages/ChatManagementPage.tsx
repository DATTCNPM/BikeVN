import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";

import {
  useAdminConversations,
  useAdminMessageHistory,
} from "@/features/chat/hooks/useChatQueries";
import { useAdminChatManager } from "@/features/chat/hooks/useChatManager";

import { Badge } from "@repo/ui/components/ui/badge";
import { ChatSidebar } from "@/features/chat/components/ChatSidebar";
import { ChatActiveWindow } from "@/features/chat/components/ChatActiveWindow";
import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";
interface AdminConversation {
  id: string;
  title: string;
  branchId?: string | null;
  lastMessageContent?: string | null;
  lastMessageTime?: string | null;
  unreadCount?: number;
}

export default function ChatManagementPage() {
  const { data: profile } = usePortalProfile();
  const currentAdminId = profile?.id ?? "";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: rawConversations, isLoading: convLoading } =
    useAdminConversations();

  // 1. Gọi hook phân trang mới (Bỏ qua dependency `page` vì useInfiniteQuery tự quản lý)
  const {
    data: infiniteMessagesData,
    isLoading: msgLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAdminMessageHistory(selectedId ?? "");

  const { sendAdminMessage } = useAdminChatManager(selectedId);

  const conversations = useMemo<AdminConversation[]>(() => {
    return (rawConversations || []) as AdminConversation[];
  }, [rawConversations]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedId);
  }, [conversations, selectedId]);

  // 2. Gộp phẳng mảng tin nhắn từ tất cả các trang đã tải, sau đó đảo ngược để hiển thị dòng thời gian tăng dần
  const messages = useMemo(() => {
    if (!infiniteMessagesData?.pages) return [];

    // Gộp content của toàn bộ các page đã fetch được thành 1 mảng duy nhất
    const allMessages = infiniteMessagesData.pages.flatMap(
      (page) => page.content || [],
    );

    // Đảo ngược mảng để tin nhắn cũ ở trên, tin nhắn mới ở dưới cùng
    return [...allMessages].reverse();
  }, [infiniteMessagesData]);

  const totalUnread = useMemo(() => {
    return conversations.reduce(
      (acc, curr) => acc + (curr.unreadCount || 0),
      0,
    );
  }, [conversations]);

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-6rem)]">
      {/* Topbar Statistics */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold">Workspace support customer</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Respond to customer inquiries and rental requests in real-time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="rounded-xl px-3 py-1 text-xs">
            Total rooms: {conversations.length}
          </Badge>
          {totalUnread > 0 && (
            <Badge className="rounded-xl px-3 py-1 bg-destructive text-destructive-foreground animate-pulse">
              {totalUnread} new calls waiting for response
            </Badge>
          )}
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-12 border bg-card rounded-3xl overflow-hidden shadow-sm flex-1 max-h-full min-h-0">
        <ChatSidebar
          conversations={conversations}
          selectedId={selectedId}
          onSelect={setSelectedId}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isLoading={convLoading}
        />

        {selectedId && activeConversation ? (
          <ChatActiveWindow
            activeConversation={activeConversation}
            messages={messages}
            isLoading={msgLoading}
            currentAdminId={currentAdminId}
            onSendMessage={sendAdminMessage}
            // 3. Truyền thêm các hàm kiểm tra/gọi phân trang vào component con
            fetchNextPage={fetchNextPage}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        ) : (
          /* ... Phần giao diện trống giữ nguyên ... */
          <section className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col h-full bg-background justify-center items-center text-muted-foreground bg-muted/5 gap-2 p-4">
            <MessageCircle className="size-12 text-muted-foreground/40 stroke-[1.5]" />
            <h3 className="font-medium text-sm text-foreground">
              No conversation selected
            </h3>
          </section>
        )}
      </div>
    </div>
  );
}
