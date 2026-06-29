import { Users, Building2 } from "lucide-react";
import { useState } from "react";
import type { ConversationResponse } from "@repo/types";
import { Button } from "@repo/ui/components/ui/button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Spinner } from "@repo/ui/components/ui/spinner";
// 🌟 Thay đổi cách import nhóm Select của Shadcn UI
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import ConversationItem from "./ConversationItem";
import { useBranches } from "@repo/hooks";
import { useGetOrCreateConversation } from "@/features/chat/useChatQueries";

type Props = {
  loading: boolean;
  conversations: ConversationResponse[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
};

export default function ChatSidebar({
  loading,
  conversations,
  selectedConversationId,
  onSelectConversation,
}: Props) {
  const { data: branches = [], isLoading: branchesLoading } = useBranches();
  const { mutate: getOrCreateConversation, isPending: isCreatingChat } =
    useGetOrCreateConversation();

  const [selectValue, setSelectValue] = useState("placeholder");

  // 🌟 Hàm xử lý đổi mới: Nhận trực tiếp string value thay vì event target
  const handleBranchChange = (branchId: string) => {
    if (!branchId) return;

    getOrCreateConversation(branchId, {
      onSuccess: (data) => {
        const conversationId = data?.id;
        if (conversationId) onSelectConversation(conversationId);
      },
      onError: () => {
        // Nếu lỗi cũng trả về trạng thái cũ
        setSelectValue("placeholder");
      },
    });
  };

  return (
    <aside
      className={`
        w-full md:w-[340px] lg:w-[380px] shrink-0 h-full flex flex-col
        bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden
        ${selectedConversationId ? "hidden md:flex" : "flex"}
      `}
    >
      {/* Header Sidebar */}
      <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Chat</h2>
          <p className="text-xs text-muted-foreground">List of conversations</p>
        </div>
        <Button size="icon" variant="ghost" className="rounded-xl">
          <Users className="size-4.5 text-muted-foreground" />
        </Button>
      </div>

      {/* 🌟 Bộ chọn chi nhánh nâng cấp lên Shadcn UI */}
      <div className="border-b border-border/40 p-4 bg-muted/20">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Building2 className="size-3.5 text-primary" /> Quick Connect to
          Branch
        </label>

        <Select
          disabled={branchesLoading || isCreatingChat}
          onValueChange={handleBranchChange}
          value={selectValue}
        >
          <SelectTrigger className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs font-medium shadow-sm focus:ring-1 focus:ring-primary/40 transition-all">
            <SelectValue>
              {isCreatingChat ? "Creating..." : "Select a branch..."}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-lg border border-border/80">
            {branches.map((branch) => (
              <SelectItem
                key={branch.id}
                value={branch.id}
                className="text-xs rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary"
              >
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List danh sách */}
      <ScrollArea className="flex-1">
        <div className="space-y-1.5 p-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <Spinner className="size-5" />
              <p className="text-xs mt-2 opacity-80">
                Loading chat messages...
              </p>
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground p-6">
              No conversations found.
            </p>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === selectedConversationId}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
