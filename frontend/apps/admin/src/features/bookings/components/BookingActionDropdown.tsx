import { Check, MoreHorizontal, X } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

type Props = {
  onApprove?: () => void | Promise<void>;
  onReject?: () => void | Promise<void>;
  onManagerVehicleReturn?: () => void | Promise<void>;
};

export default function BookingActionDropdown({
  onApprove,
  onReject,
  onManagerVehicleReturn,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <MoreHorizontal className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-2xl">
        {onApprove && (
          <DropdownMenuItem
            onClick={() => {
              void onApprove();
            }}
          >
            <Check className="mr-2 size-4" />
            Confirm Booking
          </DropdownMenuItem>
        )}

        {onReject && (
          <DropdownMenuItem
            onClick={() => {
              void onReject();
            }}
            className="text-destructive focus:text-destructive"
          >
            <X className="mr-2 size-4" />
            Reject Booking
          </DropdownMenuItem>
        )}

        {onManagerVehicleReturn && (
          <DropdownMenuItem
            onClick={() => {
              void onManagerVehicleReturn();
            }}
          >
            <span className="mr-2">Manage Vehicle Return</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
