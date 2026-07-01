import { useQueryClient } from "@tanstack/react-query";

import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";

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

  const handleConfirm = async () => {
    if (!booking) return;

    try {
      if (mode === "approve") {
        await approveMutation.mutateAsync(booking.id);

        toast.success("Booking approved successfully");
      } else {
        await rejectMutation.mutateAsync(booking.id);

        toast.success("Booking rejected successfully");
      }

      await queryClient.invalidateQueries({
        queryKey: bookingsKeys.all,
      });

      onOpenChange(false);
    } catch {
      toast.error(
        mode === "approve"
          ? "Failed to approve booking"
          : "Failed to reject booking",
      );
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      loading={loading}
      onConfirm={handleConfirm}
      title={mode === "approve" ? "Confirm Booking" : "Reject Booking"}
      description={
        mode === "approve"
          ? "Are you sure you want to confirm this booking?"
          : "Are you sure you want to reject this booking?"
      }
      confirmText={mode === "approve" ? "Approve Booking" : "Reject Booking"}
    />
  );
}
