import { useQueryClient } from "@tanstack/react-query";

import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";

import { toast } from "@repo/ui/components/ui/sonner";

import { paymentsKeys } from "@repo/hooks";
import type { Payment } from "@repo/types";

import {
  useApprovePaymentManually,
  useCancelPayment,
  useConfirmPayment,
} from "@/features/payments/mutations";

type Props = {
  payment: Payment | null;

  open: boolean;
  onOpenChange: (open: boolean) => void;

  mode: "confirm" | "approve-manually" | "cancel";
};

export default function PaymentStatusDialog({
  payment,
  open,
  onOpenChange,
  mode,
}: Props) {
  const queryClient = useQueryClient();

  const confirmMutation = useConfirmPayment();

  const approveMutation = useApprovePaymentManually();

  const cancelMutation = useCancelPayment();

  const loading =
    confirmMutation.isPending ||
    approveMutation.isPending ||
    cancelMutation.isPending;

  const handleConfirm = async () => {
    if (!payment) return;

    try {
      switch (mode) {
        case "confirm":
          await confirmMutation.mutateAsync({
            id: payment.id,
            transactionCode: payment.transactionCode ?? "",
          });

          toast.success("Confirm payment successfully");
          break;

        case "approve-manually":
          await approveMutation.mutateAsync({
            id: payment.id,
            adminId: "current-admin-id",
            actualPaymentMethod: "cash",
          });

          toast.success("Approve payment manually successfully");
          break;

        case "cancel":
          await cancelMutation.mutateAsync({
            id: payment.id,
          });

          toast.success("Cancel payment successfully");
          break;
      }

      await queryClient.invalidateQueries({
        queryKey: paymentsKeys.all,
      });

      onOpenChange(false);
    } catch {
      toast.error(
        mode === "cancel"
          ? "Failed to cancel payment"
          : "Failed to perform action",
      );
    }
  };

  const titleMap = {
    confirm: "Confirm Payment",
    "approve-manually": "Approve Payment Manually",
    cancel: "Cancel Payment",
  };

  const descriptionMap = {
    confirm: "Are you sure you want to confirm this transaction?",
    "approve-manually":
      "Are you sure you want to approve this payment manually?",
    cancel: "Are you sure you want to cancel this transaction?",
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
