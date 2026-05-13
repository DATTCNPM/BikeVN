// components/booking/BookingVehicleCard.tsx

import { CalendarDays, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  booking: any;
};

export default function BookingVehicleCard({ booking }: Props) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-border bg-card shadow-sm">
      <div className="grid lg:grid-cols-[320px_1fr]">
        <div className="h-full">
          <img
            src={booking.vehicle.image}
            alt={booking.vehicle.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between p-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Vehicle
            </p>

            <h2 className="mt-2 text-3xl font-bold">{booking.vehicle.name}</h2>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <CalendarDays className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Rental Time</p>

                <p className="font-semibold">{booking.start_time}</p>

                <p className="font-semibold">{booking.end_time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <MapPin className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Branches</p>

                <p className="font-semibold">{booking.pickup_branch}</p>

                <p className="font-semibold">{booking.return_branch}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
