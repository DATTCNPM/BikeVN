import { useNavigate } from "react-router-dom";
import {
  Bike,
  CalendarDays,
  ChevronRight,
  Clock3,
  CircleCheckBig,
  CircleX,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { useBookingsByUser } from "@/features/bookings/queries";
import { useProfile } from "@/features/profile/useProfile";
import { formatDateTime } from "@repo/utils";
import type { Booking } from "@repo/types";
import imageMock from "@/assets/images/motorbike1.png";

const statusConfig: Record<Booking["status"], any> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20",
    icon: Clock3,
  },
  approved: {
    label: "Approved",
    className: "bg-green-500/15 text-green-600 border-green-500/20",
    icon: CircleCheckBig,
  },
  completed: {
    label: "Completed",
    className: "bg-primary/15 text-primary border-primary/20",
    icon: CircleCheckBig,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/15 text-red-500 border-red-500/20",
    icon: CircleX,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground border-border",
    icon: CircleX,
  },
};

type BookingWithVehicle = Booking & {
  vehicleName?: string;
  vehicleImage?: string;
};

export default function MyBookingPage() {
  const navigate = useNavigate();
  const { data: user } = useProfile();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookingsByUser(
    user?.id || "",
  );

  if (bookingsLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        You have no bookings yet. Start exploring and book your first ride!
      </p>
    );
  }

  console.log(
    "🚀 ~ file: MyBookingPage.tsx:66 ~ MyBookingPage ~ bookings:",
    bookings,
  );

  return (
    <div className="space-y-5">
      {(bookings as BookingWithVehicle[]).map((booking) => {
        const status = statusConfig[booking.status] || statusConfig.pending;
        const StatusIcon = status.icon;

        return (
          <Card
            key={booking.id}
            onClick={() => navigate(`/booking-result/${booking.id}`)}
            className="group cursor-pointer overflow-hidden rounded-2xl border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-40 sm:h-auto sm:w-[200px] shrink-0 overflow-hidden">
                <img
                  src={booking.vehicleImage || imageMock}
                  alt={booking.vehicleName || "Vehicle"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur">
                  <Bike className="size-3.5" />
                  {booking.vehicleName || "Vehicle"}
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Booking ID: #{booking.id}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="size-4 text-primary" />
                      <span>
                        {formatDateTime(booking.startTime)} →{" "}
                        {formatDateTime(booking.endTime)}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={`flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs self-start ${status.className}`}
                  >
                    <StatusIcon className="size-3.5" />
                    {status.label}
                  </Badge>
                </div>

                <div className="mt-4 flex items-end justify-between pt-2 border-t border-dashed">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Price</p>
                    <p className="text-xl font-bold text-primary">
                      {booking.totalPrice?.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-1"
                  >
                    Details <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
