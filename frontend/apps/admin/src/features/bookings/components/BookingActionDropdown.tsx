import { MoreHorizontal, X, Undo2, CirclePlus } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

type Props = {
  onReject?: () => void | Promise<void>;
  onManagerVehicleReturn?: () => void | Promise<void>;
  onCreateReview?: () => void | Promise<void>;
  onCreateVehicleReturn?: () => void | Promise<void>;
};

export default function BookingActionDropdown({
  onReject,
  onManagerVehicleReturn,
  onCreateReview,
  onCreateVehicleReturn,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <MoreHorizontal className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-2xl">
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
            <Undo2 className="mr-2 size-4" />
            <span className="mr-2">Manage Vehicle Return</span>
          </DropdownMenuItem>
        )}

        {onCreateReview && (
          <DropdownMenuItem
            onClick={() => {
              void onCreateReview();
            }}
          >
            <CirclePlus className="mr-2 size-4" />
            <span className="mr-2">Create Review</span>
          </DropdownMenuItem>
        )}

        {onCreateVehicleReturn && (
          <DropdownMenuItem
            onClick={() => {
              void onCreateVehicleReturn();
            }}
          >
            <CirclePlus className="mr-2 size-4" />
            <span className="mr-2">Create Vehicle Return</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
