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

          toast.success("Xác nhận thanh toán thành công");
          break;

        case "approve-manually":
          await approveMutation.mutateAsync({
            id: payment.id,
            adminId: "current-admin-id",
            actualPaymentMethod: "cash",
          });

          toast.success("Duyệt thanh toán thành công");
          break;

        case "cancel":
          await cancelMutation.mutateAsync({
            id: payment.id,
          });

          toast.success("Hủy thanh toán thành công");
          break;
      }

      await queryClient.invalidateQueries({
        queryKey: paymentsKeys.all,
      });

      onOpenChange(false);
    } catch {
      toast.error(
        mode === "cancel" ? "Hủy thanh toán thất bại" : "Thao tác thất bại",
      );
    }
  };

  const titleMap = {
    confirm: "Xác nhận thanh toán",
    "approve-manually": "Duyệt thanh toán thủ công",
    cancel: "Hủy thanh toán",
  };

  const descriptionMap = {
    confirm: "Bạn có chắc muốn xác nhận giao dịch này không?",
    "approve-manually": "Bạn có chắc muốn duyệt thanh toán thủ công không?",
    cancel: "Bạn có chắc muốn hủy giao dịch này không?",
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
