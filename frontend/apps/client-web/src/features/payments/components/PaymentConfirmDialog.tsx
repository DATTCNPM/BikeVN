import { Loader2 } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/ui/alert-dialog";

import { useConfirmPayment } from "@/features/payments/mutations";
import { usePayment } from "@/features/payments/queries";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  transactionCode: string;
  onSuccess?: () => void;
};

export default function PaymentConfirmDialog({
  open,
  onOpenChange,
  bookingId,
  transactionCode,
  onSuccess,
}: Props) {
  const { mutate: confirmPayment, isPending } = useConfirmPayment();

  const { data: payment } = usePayment(bookingId);

  console.log("payment", payment);

  const handleConfirm = () => {
    confirmPayment(
      {
        id: payment?.id || "",
        transactionCode,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận thanh toán</AlertDialogTitle>

          <AlertDialogDescription>
            Vui lòng xác nhận rằng bạn đã hoàn tất thanh toán. Hệ thống sẽ ghi
            nhận giao dịch và chuyển sang bước tiếp theo.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Đang xác nhận...
              </>
            ) : (
              "Tôi đã thanh toán"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
