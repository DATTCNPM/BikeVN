import { MoreVertical, Phone, Video } from "lucide-react";
import type { ConversationResponse } from "@repo/types";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

type Props = {
  conversation?: ConversationResponse;
};

export default function ChatHeader({ conversation }: Props) {
  return (
    // 🌟 SỬA: Giảm chiều cao h-20 -> h-14, giảm padding px-6 -> px-4
    <header className="flex h-14 items-center justify-between px-4">
      <div className="flex items-center gap-3">
        {/* 🌟 SỬA: Giảm size avatar từ size-12 -> size-10 cho cân đối với header mới */}
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary/15 text-primary text-xs font-medium">
            {conversation?.title?.substring(0, 2).toUpperCase() || "CN"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <h2 className="font-semibold text-sm truncate max-w-[180px] sm:max-w-[300px]">
            {conversation?.title || "Chi nhánh"}
          </h2>
          <p className="text-[11px] text-muted-foreground leading-none mt-0.5">
            Support Manager
          </p>
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
            <DropdownMenuItem>Mark as Read</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
