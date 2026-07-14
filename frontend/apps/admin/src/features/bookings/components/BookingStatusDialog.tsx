import { useQueryClient } from "@tanstack/react-query";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

import { toast } from "@repo/ui/components/ui/sonner";

import { bookingsKeys } from "@repo/hooks";
import type { Booking } from "@repo/types";

import {
  useApproveBooking,
  useRejectBooking,
} from "@/features/bookings/hooks/mutations";

import { isApiError } from "@repo/api";
import { useState } from "react";

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

  const [errorReason, setErrorReason] = useState<string | null>(null);

  const loading = approveMutation.isPending || rejectMutation.isPending;

  // 🌟 Hàm Wrapper để reset lỗi một cách an toàn khi đóng/mở Dialog
  const handleOpenChange = (isOpen: boolean) => {
    setErrorReason(null);
    onOpenChange(isOpen);
  };

  const handleConfirm = () => {
    if (!booking) return;
    setErrorReason(null); // Reset trạng thái lỗi trước khi chạy tiếp

    const mutation = mode === "approve" ? approveMutation : rejectMutation;
    const successMsg =
      mode === "approve"
        ? "Booking approved successfully"
        : "Booking rejected successfully";

    // 🌟 Chuyển đổi sang sử dụng .mutate với cấu trúc callback chuẩn
    mutation.mutate(booking.id, {
      onSuccess: () => {
        toast.success(successMsg);
        void queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
        handleOpenChange(false);
      },
      onError: (error: unknown) => {
        if (isApiError(error)) {
          // Lấy thông điệp lỗi nghiệp vụ được trả về từ phía Backend
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
      variant={mode === "approve" ? "default" : "destructive"}
      trigger={null}
      open={open}
      onOpenChange={handleOpenChange} // 🌟 Thay sang hàm wrapper an toàn
      loading={loading}
      onSubmit={handleConfirm}
      title={mode === "approve" ? "Confirm Booking" : "Reject Booking"}
      description={
        mode === "approve"
          ? "Are you sure you want to confirm this booking?"
          : "Are you sure you want to reject this booking?"
      }
      submitLabel={mode === "approve" ? "Approve Booking" : "Reject Booking"}
      error={errorReason} // 🌟 Truyền errorReason vào để UniversalDialog tự render UI banner lỗi
    />
  );
}
