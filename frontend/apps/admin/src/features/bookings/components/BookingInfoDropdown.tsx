import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

import { Button } from "@repo/ui/components/ui/button";

import { Info } from "lucide-react";

import type { Booking } from "@repo/types";

type Props = {
  booking: Booking;
};

export default function BookingInfoDropdown({ booking }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Info className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>Ngày thuê: {booking.startTime}</DropdownMenuItem>

        <DropdownMenuItem>Ngày trả: {booking.endTime}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
