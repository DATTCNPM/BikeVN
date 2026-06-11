import { Check, MoreHorizontal, X } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

type Props = {
  onApprove?: () => void;
  onReject?: () => void;
};

export default function BookingActionDropdown({ onApprove, onReject }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <MoreHorizontal className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-2xl">
        {onApprove && (
          <DropdownMenuItem onClick={onApprove}>
            <Check className="mr-2 size-4" />
            Duyệt đơn
          </DropdownMenuItem>
        )}

        {onReject && (
          <DropdownMenuItem
            onClick={onReject}
            className="text-destructive focus:text-destructive"
          >
            <X className="mr-2 size-4" />
            Từ chối đơn
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
