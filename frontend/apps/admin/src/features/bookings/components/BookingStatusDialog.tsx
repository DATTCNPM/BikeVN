import { useQueryClient } from "@tanstack/react-query";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

import { toast } from "@repo/ui/components/ui/sonner";

import { bookingsKeys } from "@repo/hooks";
import type { Booking } from "@repo/types";

import {
  useApproveBooking,
  useRejectBooking,
} from "@/features/bookings/mutations";

type Props = {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;

  mode: "approve" | "reject";
};

export default function BookingStatusDialog({
  booking,
  open,
  onOpenChange,
  mode,
}: Props) {
  const queryClient = useQueryClient();

  const approveMutation = useApproveBooking();
  const rejectMutation = useRejectBooking();

  const loading = approveMutation.isPending || rejectMutation.isPending;

  const handleConfirm = () => {
    if (!booking) return;

    const mutation = mode === "approve" ? approveMutation : rejectMutation;
    const successMsg =
      mode === "approve"
        ? "Booking approved successfully"
        : "Booking rejected successfully";
    const errorMsg =
      mode === "approve"
        ? "Failed to approve booking"
        : "Failed to reject booking";

    mutation
      .mutateAsync(booking.id)
      .then(() => {
        toast.success(successMsg);
        return queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
      })
      .then(() => {
        onOpenChange(false);
      })
      .catch(() => {
        toast.error(errorMsg);
      });
  };

  return (
    <UniversalDialog
      type="confirm"
      variant={mode === "approve" ? "default" : "destructive"}
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      loading={loading}
      onSubmit={handleConfirm}
      title={mode === "approve" ? "Confirm Booking" : "Reject Booking"}
      description={
        mode === "approve"
          ? "Are you sure you want to confirm this booking?"
          : "Are you sure you want to reject this booking?"
      }
      submitLabel={mode === "approve" ? "Approve Booking" : "Reject Booking"}
    />
  );
}
