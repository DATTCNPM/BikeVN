import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  CircleCheckBig,
  Clock3,
  CircleX,
  Bike,
} from "lucide-react";

import { Card } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import type { Booking } from "@repo/types";
import { Button } from "@repo/ui/components/ui/button";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { toast } from "sonner";
import { useEffect } from "react";
import { useBookings } from "@/features/bookings/queries";
import { useVehicles } from "@repo/hooks";

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

export default function MyBookingSection() {
  const navigate = useNavigate();
  const { data: bookings, isLoading, error } = useBookings();
  const {
    data: vehicles,
    isLoading: vehicleLoading,
    error: vehicleError,
  } = useVehicles();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load bookings. Please try again.");
    }

    if (vehicleError) {
      toast.error("Failed to load vehicles. Please try again.");
    }
  }, [error, vehicleError]);
  if (isLoading || vehicleLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }
  console.log("bookings", bookings);
  console.log("vehicles", vehicles);

  const bookingData = bookings?.map((b) => {
    const vehicle = vehicles?.find((v) => v.id === b.vehicle_id);
    return {
      ...b,
      vehicleName: vehicle ? vehicle.name : "Unknown Vehicle",
      vehicleImage: "",
      // ? vehicle.image_url[0]
      // : "https://via.placeholder.com/300x200?text=No+Image",
    };
  });

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Booking History
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight">
            My Bookings
          </h2>
        </div>

        <Badge variant="secondary" className="rounded-full px-4 py-1">
          {bookings?.length || 0} bookings
        </Badge>
      </div>

      <div className="grid gap-5">
        {bookingData?.map((booking) => {
          const status = statusConfig[booking.status];

          const StatusIcon = status.icon;

          return (
            <Card
              key={booking.id}
              onClick={() => navigate(`/booking-result/${booking.id}`)}
              className="group cursor-pointer overflow-hidden rounded-[2rem] border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="relative h-56 overflow-hidden lg:h-auto lg:w-[280px]">
                  <img
                    src={booking.vehicleImage}
                    alt={booking.vehicleName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur">
                    <Bike className="size-4" />
                    {booking.vehicleName}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Booking ID
                      </p>

                      <h3 className="mt-1 text-2xl font-bold tracking-tight">
                        #{booking.id}
                      </h3>

                      <div className="mt-4 flex items-center gap-3 text-muted-foreground">
                        <CalendarDays className="size-5 text-primary" />

                        <p className="font-medium">
                          {booking.start_date} → {booking.end_date}
                        </p>
                      </div>
                    </div>

                    <Badge
                      className={`flex h-10 items-center gap-2 rounded-full border px-4 text-sm ${status.className}`}
                    >
                      <StatusIcon className="size-4" />
                      {status.label}
                    </Badge>
                  </div>

                  <div className="mt-8 flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Price
                      </p>

                      <p className="mt-1 text-3xl font-black tracking-tight text-primary">
                        {booking.total_price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      className="h-10 rounded-full"
                      onClick={() => navigate(`/booking-result/${booking.id}`)}
                    >
                      View Detail
                      <ChevronRight className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
