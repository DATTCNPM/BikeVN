import { MoreVertical, Phone, Video } from "lucide-react";

import type { Conversation } from "@/pages/ChatPage";

import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

type Props = {
  conversation?: Conversation;
};

export default function ChatHeader({ conversation }: Props) {
  return (
    <header className="flex h-20 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-12">
          <AvatarFallback className="bg-primary/15 text-primary">
            CN
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold">{conversation?.branchName}</h2>

          <p className="text-sm text-muted-foreground">
            {conversation?.online ? "Đang hoạt động" : "Ngoại tuyến"}
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
            <DropdownMenuItem>Xem thông tin</DropdownMenuItem>

            <DropdownMenuItem>Đánh dấu đã đọc</DropdownMenuItem>

            <DropdownMenuItem className="text-destructive">
              Xóa cuộc trò chuyện
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
