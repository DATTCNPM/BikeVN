import { Card } from "@repo/ui/components/ui/card";
import { CalendarDays, MapPinned } from "lucide-react";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { useBranches } from "@repo/hooks";
import { formatDateTime } from "@repo/utils";
import type { Booking } from "@repo/types";
import { calculateTotalDays } from "@repo/utils";

type Props = {
  booking: Booking | null;
};

export default function PaymentBookingCard({ booking }: Props) {
  const { data: branches, isLoading } = useBranches();

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const getBranchName = (branchId: string | undefined) =>
    branches?.find((b) => b.id === branchId)?.name || "Unknown Branch";

  const totalDays = calculateTotalDays(booking?.startTime, booking?.endTime);

  return (
    <Card className="rounded-[2rem] border-border p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Booking
        </p>
        <h2 className="mt-1 text-xl font-bold">Booking Information</h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Rental Time */}
        <div className="rounded-2xl bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-primary">
            <CalendarDays className="size-4" />
            <p className="text-sm font-medium">Rental Time</p>
          </div>
          <div className="mt-3 space-y-1 text-sm font-medium">
            <p>Start: {formatDateTime(booking?.startTime || "")}</p>
            <p>End: {formatDateTime(booking?.endTime || "")}</p>
            <p className="text-muted-foreground text-xs mt-1">
              Total Duration:{" "}
              {totalDays !== null
                ? `${totalDays} ${totalDays > 1 ? "days" : "day"}`
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Branches */}
        <div className="rounded-2xl bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPinned className="size-4" />
            <p className="text-sm font-medium">Branches</p>
          </div>
          <div className="mt-3 space-y-1 text-sm font-medium">
            <p>Pickup: {getBranchName(booking?.pickupBranchId)}</p>
            <p>Return: {getBranchName(booking?.returnBranchId)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
