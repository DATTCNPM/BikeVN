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
    <header className="flex h-20 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-12">
          <AvatarFallback className="bg-primary/15 text-primary">
            {conversation?.title?.substring(0, 2).toUpperCase() || "CN"}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold">
            {conversation?.title || "Chi nhánh"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {/* Mặc định hiển thị Trạng thái phòng chat */}
            Hỗ trợ trực tuyến
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="size-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <Video className="size-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="size-5" />
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
