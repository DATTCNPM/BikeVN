import { Search, Users } from "lucide-react";
import type { conversation } from "@repo/types";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Spinner } from "@repo/ui/components/ui/spinner";
import ConversationItem from "./ConversationItem";
type Props = {
  loading: boolean;
  conversations: conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
};
export default function ChatSidebar({
  loading,
  conversations,
  selectedConversationId,
  onSelectConversation,
}: Props) {
  return (
    <aside className="col-span-12 border-r bg-sidebar md:col-span-4 lg:col-span-3">
      {" "}
      <div className="flex items-center justify-between border-b px-5 py-4">
        {" "}
        <div>
          {" "}
          <h2 className="text-lg font-semibold">Tin nhắn</h2>{" "}
          <p className="text-sm text-muted-foreground">
            {" "}
            Danh sách chi nhánh hỗ trợ{" "}
          </p>{" "}
        </div>{" "}
        <Button size="icon" variant="ghost">
          {" "}
          <Users className="size-5" />{" "}
        </Button>{" "}
      </div>{" "}
      <div className="border-b p-4">
        {" "}
        <div className="relative">
          {" "}
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />{" "}
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            className="pl-9"
          />{" "}
        </div>{" "}
      </div>{" "}
      <ScrollArea className="h-[calc(100vh-14rem)]">
        {" "}
        <div className="space-y-2 p-3">
          {" "}
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Spinner />
              <p className="ml-2">Đang tải...</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === selectedConversationId}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))
          )}{" "}
        </div>{" "}
      </ScrollArea>{" "}
    </aside>
  );
}
