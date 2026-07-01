// components/payment/PaymentBookingCard.tsx
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
      <div className="flex h-64 items-center justify-center">
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
        <h2 className="mt-2 text-2xl font-bold">Booking Information</h2>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {/* Khối thời gian thuê */}
        <div className="rounded-2xl bg-muted/50 p-5">
          <div className="flex items-center gap-2 text-primary">
            <CalendarDays className="size-5" />
            <p className="text-sm font-medium">Rental Time</p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="font-semibold">
              Start: {formatDateTime(booking?.startTime || "")}
            </p>
            <p className="font-semibold">
              End: {formatDateTime(booking?.endTime || "")}
            </p>
            <p className="text-muted-foreground">
              Total Days: {totalDays !== null ? `${totalDays} ngày` : "N/A"}
            </p>
          </div>
        </div>

        {/* Khối chi nhánh */}
        <div className="rounded-2xl bg-muted/50 p-5">
          <div className="flex items-center gap-2 text-primary">
            <MapPinned className="size-5" />
            <p className="text-sm font-medium">Branches</p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="font-semibold">
              Pickup: {getBranchName(booking?.pickupBranchId)}
            </p>
            <p className="font-semibold">
              Return: {getBranchName(booking?.returnBranchId)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
