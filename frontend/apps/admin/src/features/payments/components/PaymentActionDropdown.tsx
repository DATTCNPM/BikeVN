import { Check, CreditCard, MoreHorizontal, X } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

type Props = {
  onConfirm?: () => void;
  onApproveManually?: () => void;
  onCancel?: () => void;
};

export default function PaymentActionDropdown({
  onConfirm,
  onApproveManually,
  onCancel,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <MoreHorizontal className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 rounded-2xl">
        {onConfirm && (
          <DropdownMenuItem onClick={onConfirm}>
            <Check className="mr-2 size-4" />
            Xác nhận thanh toán
          </DropdownMenuItem>
        )}

        {onApproveManually && (
          <DropdownMenuItem onClick={onApproveManually}>
            <CreditCard className="mr-2 size-4" />
            Duyệt thủ công
          </DropdownMenuItem>
        )}

        {onCancel && (
          <DropdownMenuItem
            onClick={onCancel}
            className="text-destructive focus:text-destructive"
          >
            <X className="mr-2 size-4" />
            Hủy thanh toán
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
