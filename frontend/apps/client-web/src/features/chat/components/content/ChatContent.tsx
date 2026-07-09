import { ChevronLeft, MessageSquareDot } from "lucide-react";
import type {
  ConversationResponse,
  ChatMessageResponse,
  SendMessagePayload,
} from "@repo/types";
import { Button } from "@repo/ui/components/ui/button";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "../message/MessageList";

type Props = {
  loading: boolean;
  conversation?: ConversationResponse;
  messages: ChatMessageResponse[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack: () => void;
};

export default function ChatContent({
  loading,
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
}: Props) {
  const handleSend = (data: SendMessagePayload) => {
    onSendMessage(data.content ? data.content : "");
  };

  if (!conversation) {
    return (
      <section className="hidden md:flex flex-1 h-full flex-col items-center justify-center bg-card/40 border border-dashed border-border/80 rounded-2xl p-8 text-center animate-fade-in">
        <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary animate-pulse">
          <MessageSquareDot className="size-10" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          You haven't selected a conversation yet
        </h3>
        <p className="text-xs text-muted-foreground max-w-[280px] mt-1 leading-relaxed">
          Please select a conversation from the list or choose a Branch on the
          left to start chatting.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`
        flex-1 h-full flex-col overflow-hidden bg-card border border-border/60 rounded-2xl shadow-sm
        ${conversation ? "flex" : "hidden md:flex"}
      `}
    >
      {/* Thanh Header của Box Chat */}
      <div className="flex items-center border-b border-border/40 pr-4 bg-card shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="ml-2 md:hidden shrink-0 rounded-xl"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <ChatHeader conversation={conversation} />
        </div>
      </div>

      {/* 🌟 SỬA: Danh sách tin nhắn - Sử dụng flex-1 min-h-0 để tận dụng tối đa chiều cao còn lại */}
      <div className="flex-1 min-h-0 bg-muted/5 relative">
        <MessageList
          loading={loading}
          messages={messages}
          currentUserId={currentUserId}
        />
      </div>

      {/* 🌟 SỬA: Ô nhập liệu - Xóa bỏ div bọc ngoài có padding thừa, chuyển padding vào trong ChatInput */}
      <div className="shrink-0 bg-card">
        <ChatInput onSend={handleSend} />
      </div>
    </section>
  );
}
