import { useState } from "react";

import type { Conversation, Message } from "@repo/schemas";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "../message/MessageList";

type Props = {
  loading: boolean;
  conversation?: Conversation;
  messages: Message[];
  currentUserId: number;
};

export default function ChatContent({
  loading,
  conversation,
  messages,
  currentUserId,
}: Props) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSendMessage = () => {
    if (!message.trim() && !selectedImage) return;

    console.log({
      message,
      image: selectedImage,
    });

    setMessage("");
    setSelectedImage(null);
  };

  return (
    <section className="col-span-12 flex h-full overflow-hidden flex-col bg-background md:col-span-8 lg:col-span-9">
      <ChatHeader conversation={conversation} />

      <MessageList
        loading={loading}
        messages={messages}
        currentUserId={currentUserId}
      />

      <ChatInput
        message={message}
        onChange={setMessage}
        onSend={handleSendMessage}
        onSelectImage={setSelectedImage}
      />
    </section>
  );
}
