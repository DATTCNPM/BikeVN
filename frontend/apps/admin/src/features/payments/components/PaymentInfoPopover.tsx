import { Calendar, Clock3, Receipt, ClipboardList } from "lucide-react";
import InfoPopover from "@/components/common/InfoPopover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { toast } from "@repo/ui/components/ui/sonner";
import type { Payment } from "@repo/types";

type Props = {
  payment: Payment;
};

export default function PaymentInfoPopover({ payment }: Props) {
  console.log(
    "🚀 ~ file: PaymentInfoPopover.tsx:22 ~ PaymentInfoPopover ~ payment:",
    payment,
  );

  const renderTransactionValue = (code: string | null | undefined) => {
    if (!code) return "-";

    // Cắt chuỗi hiển thị nếu dài hơn 8 ký tự (hoặc số lượng tùy bạn chọn)
    const displayCode = code.length > 8 ? `${code.substring(0, 6)}...` : code;

    const handleCopy = async (e: React.MouseEvent) => {
      e.stopPropagation(); // Tránh kích hoạt các event click của Popover cha
      await navigator.clipboard.writeText(code); // Vẫn copy chuỗi FULL gốc
      toast.success("Has been copied to clipboard: " + code);
    };

    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="group flex cursor-pointer items-center gap-1 font-mono text-xs select-all active:scale-95 transition-transform"
              onClick={handleCopy}
            >
              <span className="font-semibold underline decoration-dotted underline-offset-4 hover:text-primary decoration-zinc-400">
                {displayCode}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-muted-foreground">
                <ClipboardList className="size-3" />
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="font-mono text-xs max-w-xs break-all bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
          >
            <p className="font-sans text-[11px] text-muted-foreground mb-1">
              Click to copy full code:
            </p>
            {code}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <InfoPopover
      title="Payment Information"
      description="Transaction and bank details"
      items={[
        {
          icon: Receipt,
          label: "Transaction",
          value: renderTransactionValue(payment.transactionCode),
        },
        {
          icon: Calendar,
          label: "Created",
          value: new Date(payment.createdAt).toLocaleString("vi-VN"),
        },
        {
          icon: Clock3,
          label: "Updated",
          value: payment.updatedAt
            ? new Date(payment.updatedAt).toLocaleString("vi-VN")
            : "-",
        },
      ]}
    />
  );
}
