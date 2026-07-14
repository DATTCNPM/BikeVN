import { useQueryClient } from "@tanstack/react-query";
import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
import { toast } from "@repo/ui/components/ui/sonner";
import { paymentsKeys } from "@repo/hooks";
import type { Payment } from "@repo/types";
import { useState } from "react"; // 🌟 Xóa bỏ useEffect
import {
  useApprovePaymentManually,
  useAdminCancelPayment,
  useProcessRefund,
  useAdminRetryPayment, // 🌟 Giả định có hook này
} from "@/features/payments/hooks/mutations";
import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";
import { isApiError } from "@repo/api";

type Props = {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "approve" | "cancel" | "refund" | "retry";
};

export default function PaymentStatusDialog({
  payment,
  open,
  onOpenChange,
  mode,
}: Props) {
  const queryClient = useQueryClient();
  const approveMutation = useApprovePaymentManually();
  const cancelMutation = useAdminCancelPayment();
  const refundMutation = useProcessRefund();
  const retryMutation = useAdminRetryPayment(); // 🌟 Giả định có hook này
  const [errorReason, setErrorReason] = useState<string | null>(null);

  const { data: currentAdmin } = usePortalProfile();
  const adminId = currentAdmin?.id || "system-admin";

  const loading =
    approveMutation.isPending ||
    cancelMutation.isPending ||
    refundMutation.isPending ||
    retryMutation.isPending;

  // 🌟 Hàm Wrapper thay thế để đảm bảo reset lỗi mỗi khi trạng thái Open thay đổi từ bên trong Dialog
  const handleOpenChange = (isOpen: boolean) => {
    setErrorReason(null);
    onOpenChange(isOpen);
  };

  const handleConfirm = () => {
    if (!payment) return;
    setErrorReason(null); // 🌟 Đảm bảo xóa lỗi cũ khi bắt đầu một submit mới

    const handleSuccess = (successMessage: string) => {
      toast.success(successMessage);
      void queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
      handleOpenChange(false);
    };

    const handleError = (error: unknown) => {
      if (isApiError(error)) {
        setErrorReason(error.message || "An error occurred on the server");
      } else {
        setErrorReason("Failed to perform action. Please try again later.");
      }
    };

    switch (mode) {
      case "approve":
        approveMutation.mutate(
          { id: payment.id, adminId, actualPaymentMethod: "cash" },
          {
            onSuccess: () =>
              handleSuccess("Approved payment manually successfully"),
            onError: handleError,
          },
        );
        break;

      case "cancel":
        cancelMutation.mutate(
          { id: payment.id, reason: "Admin canceled from dashboard" },
          {
            onSuccess: () => handleSuccess("Canceled payment successfully"),
            onError: handleError,
          },
        );
        break;

      case "refund":
        refundMutation.mutate(
          { id: payment.id, adminId },
          {
            onSuccess: () => handleSuccess("Refund processed successfully"),
            onError: handleError,
          },
        );
        break;

      case "retry":
        // Handle retry logic here
        retryMutation.mutate(
          { id: payment.id, newPaymentMethod: "cash" }, // Example payload
          {
            onSuccess: () => handleSuccess("Payment retried successfully"),
            onError: handleError,
          },
        );
        break;
      default:
        break;
    }
  };

  const titleMap = {
    approve: "Approve Payment Manually",
    cancel: "Cancel Payment",
    refund: "Refund Transaction",
    retry: "Retry Payment",
  };

  const descriptionMap = {
    approve: "Are you sure you want to approve this payment manually?",
    cancel: "Are you sure you want to cancel this transaction?",
    refund:
      "Are you sure you want to process a refund for this transaction via VNPay?",
    retry: "Are you sure you want to retry this payment?",
  };

  return (
    <UniversalDialog
      type="confirm"
      trigger={null}
      variant={mode === "cancel" ? "destructive" : "default"}
      open={open}
      onOpenChange={handleOpenChange} // 🌟 Thay đổi sang wrapper function
      loading={loading}
      onSubmit={handleConfirm}
      title={titleMap[mode]}
      description={descriptionMap[mode]}
      submitLabel={titleMap[mode]}
      error={errorReason}
    />
  );
}
