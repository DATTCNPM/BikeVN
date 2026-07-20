import { CalendarDays, Clock3 } from "lucide-react";

import InfoPopover from "@/components/common/InfoPopover";

import type { Booking } from "@repo/schemas";
import { formatTime } from "@repo/utils";

type Props = {
  booking: Booking;
};

export default function BookingInfoPopover({ booking }: Props) {
  return (
    <InfoPopover
      title="Booking Information"
      description="Rental period details"
      items={[
        {
          icon: CalendarDays,
          label: "Rental Date",
          value: formatTime(booking.startTime),
        },
        {
          icon: Clock3,
          label: "Return Date",
          value: formatTime(booking.endTime),
        },
      ]}
    />
  );
}
