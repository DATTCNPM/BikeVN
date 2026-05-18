import type { SendMessagePayload } from "@repo/schemas";
import type { conversation, message } from "@repo/types";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "../message/MessageList";

import { useSendMessage } from "@/features/chat/mutations";

type Props = {
  loading: boolean;
  conversation?: conversation;
  messages: message[];
  currentUserId: string;
};

export default function ChatContent({
  loading,
  conversation,
  messages,
  currentUserId,
}: Props) {
  const { mutate: sendMessage } = useSendMessage(conversation?.id || "");
  const handleSend = (data: SendMessagePayload) => {
    sendMessage(data);
  };

  return (
    <section className="col-span-12 flex h-full overflow-hidden flex-col bg-background md:col-span-8 lg:col-span-9">
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
