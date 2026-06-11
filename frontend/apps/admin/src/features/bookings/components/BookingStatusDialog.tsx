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

        toast.success("Duyệt đơn thành công");
      } else {
        await rejectMutation.mutateAsync(booking.id);

        toast.success("Từ chối đơn thành công");
      }

      await queryClient.invalidateQueries({
        queryKey: bookingsKeys.all,
      });

      onOpenChange(false);
    } catch {
      toast.error(
        mode === "approve" ? "Duyệt đơn thất bại" : "Từ chối đơn thất bại",
      );
    }
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      loading={loading}
      onConfirm={handleConfirm}
      title={mode === "approve" ? "Duyệt đơn đặt xe" : "Từ chối đơn đặt xe"}
      description={
        mode === "approve"
          ? "Bạn có chắc muốn duyệt đơn đặt xe này không?"
          : "Bạn có chắc muốn từ chối đơn đặt xe này không?"
      }
      confirmText={mode === "approve" ? "Duyệt đơn" : "Từ chối đơn"}
    />
  );
}
