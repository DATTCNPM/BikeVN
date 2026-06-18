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
          <AlertDialogTitle>Confirm Payment</AlertDialogTitle>

          <AlertDialogDescription>
            Please confirm that you have completed the payment. The system will
            record the transaction and proceed to the next step.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

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
                Confirming...
              </>
            ) : (
              "I have paid"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
