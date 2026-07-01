import { Check, CreditCard, MoreHorizontal, X } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

type Props = {
  onRefund?: () => void;
  onApproveManually?: () => void;
  onCancel?: () => void;
};

export default function PaymentActionDropdown({
  onRefund,
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
        {onRefund && (
          <DropdownMenuItem onClick={onRefund}>
            <Check className="mr-2 size-4" />
            Refund Payment
          </DropdownMenuItem>
        )}

        {onApproveManually && (
          <DropdownMenuItem onClick={onApproveManually}>
            <CreditCard className="mr-2 size-4" />
            Approve Manually
          </DropdownMenuItem>
        )}

        {onCancel && (
          <DropdownMenuItem
            onClick={onCancel}
            className="text-destructive focus:text-destructive"
          >
            <X className="mr-2 size-4" />
            Cancel Payment
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
