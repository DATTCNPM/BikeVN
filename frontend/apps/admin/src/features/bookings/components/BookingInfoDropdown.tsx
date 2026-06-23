import { CalendarDays, Clock3 } from "lucide-react";

import InfoPopover from "@/components/common/InfoPopover";

import type { Booking } from "@repo/types";
import { formatDateTime } from "@repo/utils";

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
          value: formatDateTime(booking.startTime),
        },
        {
          icon: Clock3,
          label: "Return Date",
          value: formatDateTime(booking.endTime),
        },
      ]}
    />
  );
}
