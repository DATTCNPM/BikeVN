import { Users, Building2 } from "lucide-react";
import { useState } from "react";
import type { ConversationResponse } from "@repo/types";
import { Button } from "@repo/ui/components/ui/button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { ConversationItemSkeleton } from "@/features/chat/components/skeleton/ChatSkeleton";
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

  const [selectValue, setSelectValue] = useState<string | undefined>(undefined);

  const handleBranchChange = (branchId: string) => {
    if (!branchId) return;
    setSelectValue(branchId);
    getOrCreateConversation(branchId, {
      onSuccess: (data) => {
        const conversationId = data?.id;
        if (conversationId) {
          onSelectConversation(conversationId);
        }
        setSelectValue(undefined);
      },
      onError: () => {
        setSelectValue(undefined);
      },
    });
  };

  return (
    <aside
      className={`
        w-full md:w-[320px] lg:w-[360px] shrink-0 h-full flex flex-col
        bg-card border-r border-border/40 overflow-hidden
        ${selectedConversationId ? "hidden md:flex" : "flex"}
      `}
    >
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Chat
          </h2>
          <p className="text-xs text-muted-foreground">Conversations list</p>
        </div>
        <Button size="icon" variant="ghost" className="size-8 rounded-lg">
          <Users className="size-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="border-b border-border/40 p-3 bg-muted/20">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Building2 className="size-3.5 text-primary" /> Quick Connect to
          Branch
        </label>

        <Select
          disabled={branchesLoading || isCreatingChat}
          onValueChange={handleBranchChange}
          value={selectValue}
        >
          <SelectTrigger className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs font-medium shadow-sm transition-all">
            <SelectValue
              placeholder={
                isCreatingChat ? "Connecting..." : "Select a branch..."
              }
            />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-lg border border-border/60">
            {branches.map((branch) => (
              <SelectItem
                key={branch.id}
                value={branch.id}
                className="text-xs rounded-lg cursor-pointer"
              >
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-0.5 p-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <ConversationItemSkeleton key={i} />
            ))
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
