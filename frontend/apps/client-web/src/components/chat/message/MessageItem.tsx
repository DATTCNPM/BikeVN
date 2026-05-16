import type { Message } from "@/pages/ChatPage";

import { Card } from "@repo/ui/components/card";

import { cn } from "@repo/ui/lib/utils";

type Props = {
  message: Message;
  isCurrentUser: boolean;
};

export default function MessageItem({ message, isCurrentUser }: Props) {
  return (
    <div
      className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}
    >
      <Card
        className={cn(
          "max-w-[75%] overflow-hidden rounded-3xl shadow-none",
          message.image ? "p-0" : "",
          isCurrentUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card",
        )}
      >
        {message.image && (
          <div className="overflow-hidden">
            <img
              src={message.image}
              alt="message-image"
              className="max-h-[320px] w-full object-cover"
            />
          </div>
        )}

        {message.content && (
          <div className={cn("px-4 pt-3", message.image ? "pb-0" : "pb-3")}>
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        )}

        <div
          className={cn(
            "px-4 pb-3 text-right text-[11px]",
            isCurrentUser
              ? "text-primary-foreground/70"
              : "text-muted-foreground",
            !message.content && "pt-2",
          )}
        >
          {message.createdAt}
        </div>
      </Card>
    </div>
  );
}
