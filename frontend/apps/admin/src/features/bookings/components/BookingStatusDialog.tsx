import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
import { toast } from "@repo/ui/components/ui/sonner";
import { bookingsKeys } from "@repo/hooks";
import type { Booking } from "@repo/schemas";
import { isApiError } from "@repo/api";

import { useRejectBooking } from "@/features/bookings/hooks/mutations";

type Props = {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function BookingRejectDialog({
  booking,
  open,
  onOpenChange,
}: Props) {
  const queryClient = useQueryClient();
  const rejectMutation = useRejectBooking();
  const [errorReason, setErrorReason] = useState<string | null>(null);

  const loading = rejectMutation.isPending;

  const handleOpenChange = (isOpen: boolean) => {
    setErrorReason(null);
    onOpenChange(isOpen);
  };

  const handleConfirm = () => {
    if (!booking) return;
    setErrorReason(null);

    rejectMutation.mutate(booking.id, {
      onSuccess: () => {
        toast.success("Booking rejected successfully");
        void queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
        handleOpenChange(false);
      },
      onError: (error: unknown) => {
        if (isApiError(error)) {
          setErrorReason(error.message || "An error occurred on the server");
        } else {
          setErrorReason("Failed to perform action. Please try again later.");
        }
      },
    });
  };

  return (
    <UniversalDialog
      type="confirm"
      variant="destructive"
      trigger={null}
      open={open}
      onOpenChange={handleOpenChange}
      loading={loading}
      onSubmit={handleConfirm}
      title="Reject Booking"
      description="Are you sure you want to reject this booking?"
      submitLabel="Reject Booking"
      error={errorReason}
    />
  );
}
