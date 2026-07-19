import {
  ChevronLeft,
  MessageSquareDot,
  Phone,
  Video,
  MoreVertical,
  ImagePlus,
  SendHorizonal,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ConversationResponse, ChatMessageResponse } from "@repo/types";
import { chatMessageRequestSchema } from "@repo/schemas";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import MessageList from "./MessageList";

type Props = {
  loading: boolean;
  conversation?: ConversationResponse;
  messages: ChatMessageResponse[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export default function ChatContent({
  loading,
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ content: string }>({
    resolver: zodResolver(chatMessageRequestSchema.pick({ content: true })),
    defaultValues: { content: "" },
  });

  const onSubmit = (data: { content: string }) => {
    if (!data.content.trim()) return;
    onSendMessage(data.content);
    reset();
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
          Please select a conversation from the list to start chatting.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`flex-1 h-full flex-col overflow-hidden bg-background border border-border/40 rounded-2xl shadow-sm ${conversation ? "flex" : "hidden md:flex"}`}
    >
      {/* --- CHAT HEADER --- */}
      <div className="flex items-center border-b border-border/40 pr-4 bg-card shrink-0 h-14 justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="ml-2 md:hidden shrink-0 rounded-xl size-8"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="flex items-center gap-3 px-4">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary/15 text-primary text-xs font-medium">
                {conversation?.title?.substring(0, 2).toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="font-semibold text-sm truncate max-w-[180px] sm:max-w-[300px]">
                {conversation?.title || "Chi nhánh"}
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Support Manager
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8">
            <Phone className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8">
            <Video className="size-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Information</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* --- MESSAGE LIST AREA --- */}
      <div className="flex-1 min-h-0 bg-muted/10 relative">
        <MessageList
          loading={loading}
          messages={messages}
          currentUserId={currentUserId}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>

      {/* --- CHAT INPUT FORM --- */}
      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="border-t bg-background px-4 py-3 flex-shrink-0"
      >
        <div className="mx-auto flex max-w-4xl items-center gap-2">
          <label className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-border/60 transition hover:bg-accent shrink-0">
            <ImagePlus className="size-4.5 text-muted-foreground" />
            <input type="file" accept="image/*" className="hidden" />
          </label>
          <div className="flex flex-1 flex-col relative">
            <Input
              {...register("content")}
              placeholder="Type a message..."
              className="h-10 rounded-xl text-sm"
              autoComplete="off"
            />
            {errors.content && (
              <span className="text-[10px] text-destructive pl-1 mt-0.5 absolute top-full left-0">
                {errors.content.message}
              </span>
            )}
          </div>
          <Button
            type="submit"
            size="icon"
            className="size-10 rounded-xl shrink-0"
          >
            <SendHorizonal className="size-4.5" />
          </Button>
        </div>
      </form>
    </section>
  );
}
