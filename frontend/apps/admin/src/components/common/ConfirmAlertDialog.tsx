// components/common/ConfirmAlertDialog.tsx

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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: string;

  onConfirm: () => Promise<void> | void;

  loading?: boolean;

  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmAlertDialog({
  open,
  onOpenChange,
  title = "Bạn có chắc chắn?",
  description = "Hành động này không thể hoàn tác.",
  onConfirm,
  loading,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">{cancelText}</Button>
          </AlertDialogCancel>

          <AlertDialogAction
            asChild
            variant="destructive"
            onClick={() => void onConfirm()}
            disabled={loading}
          >
            <p>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}

              {confirmText}
            </p>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
