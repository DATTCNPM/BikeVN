import { useQueryClient } from "@tanstack/react-query";
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import { toast } from "@repo/ui/components/ui/sonner";
import { paymentsKeys } from "@repo/hooks";
import type { Payment } from "@repo/types";
import {
  useApprovePaymentManually,
  useAdminCancelPayment,
} from "@/features/payments/mutations";
import { useProcessRefund } from "@/features/payments/mutations";
import { usePortalProfile } from "@/features/auth/usePortalProfile";

type Props = {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "approve" | "cancel" | "refund"; // Đổi confirm thành refund
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
  const refundMutation = useProcessRefund(); // Thêm mới mutation hoàn tiền

  // Giả định bạn có hook lấy thông tin admin hiện tại
  const { data: currentAdmin } = usePortalProfile();
  const adminId = currentAdmin?.id || "system-admin";

  const loading =
    approveMutation.isPending ||
    cancelMutation.isPending ||
    refundMutation.isPending;

  const handleConfirm = async () => {
    if (!payment) return;

    try {
      switch (mode) {
        case "approve":
          await approveMutation.mutateAsync({
            id: payment.id,
            adminId,
            actualPaymentMethod: "cash",
          });
          toast.success("Approved payment manually successfully");
          break;

        case "cancel":
          await cancelMutation.mutateAsync({
            id: payment.id,
            reason: "Admin canceled from dashboard",
          });
          toast.success("Canceled payment successfully");
          break;

        case "refund": // Thêm mới xử lý refund
          await refundMutation.mutateAsync({
            id: payment.id,
            adminId,
          });
          toast.success("Refund processed successfully");
          break;
      }

      await queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
      onOpenChange(false);
    } catch {
      toast.error("Failed to perform action");
    }
  };

  const titleMap = {
    "approve": "Approve Payment Manually",
    cancel: "Cancel Payment",
    refund: "Refund Transaction",
  };

  const descriptionMap = {
    "approve":
      "Are you sure you want to approve this payment manually?",
    cancel: "Are you sure you want to cancel this transaction?",
    refund:
      "Are you sure you want to process a refund for this transaction via VNPay?",
  };

  return (
    <ConfirmAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      loading={loading}
      onConfirm={handleConfirm}
      title={titleMap[mode]}
      description={descriptionMap[mode]}
      confirmText={titleMap[mode]}
    />
  );
}
