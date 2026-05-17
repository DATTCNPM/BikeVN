import type { Message } from "@repo/schemas";

import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Spinner } from "@repo/ui/components/ui/spinner";

import MessageItem from "./MessageItem";

type Props = {
  loading: boolean;
  messages: Message[];
  currentUserId: number;
};

export default function MessageList({
  loading,
  messages,
  currentUserId,
}: Props) {
  return (
    <ScrollArea className="h-[calc(100vh-14rem)] w-full bg-muted/30">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
        {loading ? (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUserId}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
}
