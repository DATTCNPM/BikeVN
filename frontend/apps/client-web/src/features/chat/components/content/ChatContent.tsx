import type { ConversationResponse, ChatMessageResponse } from "@repo/types";
import type { SendMessagePayload } from "@repo/types";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "../message/MessageList";

type Props = {
  loading: boolean;
  conversation?: ConversationResponse;
  messages: ChatMessageResponse[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
};

export default function ChatContent({
  loading,
  conversation,
  messages,
  currentUserId,
  onSendMessage,
}: Props) {
  const handleSend = (data: SendMessagePayload) => {
    // Kích hoạt gửi tin nhắn text thông qua kênh WebSocket trực tiếp
    onSendMessage(data.content ? data.content : "");
  };

  return (
    <section className="col-span-12 flex h-full flex-col overflow-hidden bg-background md:col-span-8 lg:col-span-9">
      <ChatHeader conversation={conversation} />

      <MessageList
        loading={loading}
        messages={messages}
        currentUserId={currentUserId}
      />

      <ChatInput onSend={handleSend} />
    </section>
  );
}
