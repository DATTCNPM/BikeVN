import { Card } from "@/components/ui/card";
import { CalendarDays, MapPinned } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import type { Booking } from "@/lib/types";
import { useBranches } from "@/hooks/useBranch";

import { useEffect } from "react";

type Props = {
  booking: Booking;
};

export default function PaymentBookingCard({ booking }: Props) {
  const { data: branches, isLoading, error } = useBranches();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load branches. Please try again.");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const nameBranchesPickup =
    branches.find((branch) => branch.id === booking.pickup_branch_id)?.name ||
    "Unknown Branch";
  const nameBranchesReturn =
    branches.find((branch) => branch.id === booking.return_branch_id)?.name ||
    "Unknown Branch";
  return (
    <Card className="rounded-[2rem] border-border p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Booking
        </p>

        <h2 className="mt-2 text-2xl font-bold">Thông tin đặt xe</h2>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl bg-muted/50 p-5">
          <div className="flex items-center gap-2 text-primary">
            <CalendarDays className="size-5" />
            <p className="text-sm font-medium">Rental Time</p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="font-semibold">Start: {booking.start_date}</p>

            <p className="font-semibold">End: {booking.end_date}</p>

            <p className="text-muted-foreground">
              Total Days:{" "}
              {booking.start_date && booking.end_date
                ? Math.ceil(
                    (new Date(booking.end_date).getTime() -
                      new Date(booking.start_date).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )
                : "N/A"}{" "}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-muted/50 p-5">
          <div className="flex items-center gap-2 text-primary">
            <MapPinned className="size-5" />
            <p className="text-sm font-medium">Branches</p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="font-semibold">Pickup: {nameBranchesPickup}</p>

            <p className="font-semibold">Return: {nameBranchesReturn}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
